import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Trash2, PieChart as PieChartIcon, BarChart3, PiggyBank, Calculator, Award, ArrowLeftRight } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

export function LedgerView() {
  const ledger = useLiveQuery(() => db.ledger.orderBy('date').reverse().toArray());
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food/Drink');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');

  // Treasury Vaults state (synchronized to local storage)
  const [vaults, setVaults] = useState<any[]>(() => {
    const saved = localStorage.getItem('system_treasury_vaults');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'EMERGENCY VAULT', target: 1000, saved: 150 },
      { id: 'v2', name: 'CYBERWARE UPGRADE', target: 500, saved: 50 }
    ];
  });

  const saveVaultsToStorage = (updatedVaults: any[]) => {
    setVaults(updatedVaults);
    localStorage.setItem('system_treasury_vaults', JSON.stringify(updatedVaults));
  };

  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [selectedVaultId, setSelectedVaultId] = useState('');
  const [transferType, setTransferType] = useState<'deposit' | 'withdraw'>('deposit');

  // Financial projection state
  const [projectedMonthlySave, setProjectedMonthlySave] = useState('200');
  const [interestRate, setInterestRate] = useState('6');

  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  const incomeCategories = ['Quest Reward', 'Salary', 'Investment', 'Other'];
  const expenseCategories = ['Shop Purchase', 'Food/Drink', 'Bills', 'Entertainment', 'Other'];

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(newType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !userStats) return;

    const val = parseFloat(amount);
    await db.ledger.add({
      amount: val,
      description,
      type,
      date,
      category
    } as any);

    // Update user credits
    const newCredits = type === 'income' ? userStats.credits + val : userStats.credits - val;
    await db.userStats.update(1, { credits: newCredits });

    setAmount('');
    setDescription('');
  };

  const deleteEntry = async (entry: any) => {
    if (!userStats) return;
    await db.ledger.delete(entry.id);
    
    // Reverse the credit change
    const newCredits = entry.type === 'income' ? userStats.credits - entry.amount : userStats.credits + entry.amount;
    await db.userStats.update(1, { credits: newCredits });
  };

  const handleCreateVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultName || !newVaultTarget) return;
    const newVault = {
      id: `vault_${Date.now()}`,
      name: newVaultName.toUpperCase(),
      target: parseFloat(newVaultTarget),
      saved: 0
    };
    const updated = [...vaults, newVault];
    saveVaultsToStorage(updated);
    setNewVaultName('');
    setNewVaultTarget('');
  };

  const handleDeleteVault = (id: string) => {
    const updated = vaults.filter(v => v.id !== id);
    saveVaultsToStorage(updated);
  };

  const handleVaultTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVaultId || !transferAmount || !userStats) return;
    const amountVal = parseFloat(transferAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    const targetVault = vaults.find(v => v.id === selectedVaultId);
    if (!targetVault) return;

    if (transferType === 'deposit') {
      if (userStats.credits < amountVal) {
        alert("INSUFFICIENT SYSTEM CREDITS IN TREASURY!");
        return;
      }
      
      // Update Vault
      const updated = vaults.map(v => {
        if (v.id === selectedVaultId) {
          return { ...v, saved: v.saved + amountVal };
        }
        return v;
      });
      saveVaultsToStorage(updated);

      // Deduct from User credits in DB
      const newCredits = userStats.credits - amountVal;
      await db.userStats.update(1, { credits: newCredits });

      // Log Expense
      await db.ledger.add({
        amount: amountVal,
        description: `VAULT DEPOSIT: ${targetVault.name}`,
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'Shop Purchase'
      } as any);

    } else {
      if (targetVault.saved < amountVal) {
        alert("INSUFFICIENT FUNDS IN THE TARGET VAULT!");
        return;
      }

      // Update Vault
      const updated = vaults.map(v => {
        if (v.id === selectedVaultId) {
          return { ...v, saved: v.saved - amountVal };
        }
        return v;
      });
      saveVaultsToStorage(updated);

      // Add to User credits in DB
      const newCredits = userStats.credits + amountVal;
      await db.userStats.update(1, { credits: newCredits });

      // Log Income
      await db.ledger.add({
        amount: amountVal,
        description: `VAULT WITHDRAWAL: ${targetVault.name}`,
        type: 'income',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'Other'
      } as any);
    }

    setTransferAmount('');
    alert("VAULT OPERATION SUCCESSFULLY EXECUTED!");
  };

  const chartData = useMemo(() => {
    if (!ledger) return { pie: [], bar: [] };

    // Pie Chart Data (Expenses by Category)
    const expenses = ledger.filter(l => l.type === 'expense');
    const expensesByCategory = expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Bar Chart Data (Last 7 Days Income vs Expense)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return format(d, 'yyyy-MM-dd');
    });

    const barData = last7Days.map(day => {
      const dayEntries = ledger.filter(l => l.date === day);
      const income = dayEntries.filter(l => l.type === 'income').reduce((sum, l) => sum + l.amount, 0);
      const expense = dayEntries.filter(l => l.type === 'expense').reduce((sum, l) => sum + l.amount, 0);
      return {
        date: format(new Date(day), 'MMM dd'),
        Income: income,
        Expense: expense
      };
    });

    // Line Chart Data (Cumulative Balance over last 30 days)
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(new Date(), 29 - i);
      return format(d, 'yyyy-MM-dd');
    });

    let currentBalance = 0;
    // Calculate initial balance before the 30 days window
    const before30Days = ledger.filter(l => l.date < last30Days[0]);
    currentBalance = before30Days.reduce((acc, l) => acc + (l.type === 'income' ? l.amount : -l.amount), 0);

    const lineData = last30Days.map(day => {
      const dayEntries = ledger.filter(l => l.date === day);
      const dayNet = dayEntries.reduce((sum, l) => sum + (l.type === 'income' ? l.amount : -l.amount), 0);
      currentBalance += dayNet;
      return {
        date: format(new Date(day), 'MMM dd'),
        Balance: currentBalance
      };
    });

    return { pie: pieData, bar: barData, line: lineData };
  }, [ledger]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff6b6b'];

  // Projection values calculation - must be declared before early return
  const projectedValues = useMemo(() => {
    const monthly = parseFloat(projectedMonthlySave) || 0;
    const rate = (parseFloat(interestRate) || 0) / 100 / 12;
    
    const calculateFV = (months: number) => {
      if (rate === 0) return monthly * months;
      return monthly * ((Math.pow(1 + rate, months) - 1) / rate);
    };

    return {
      year1: calculateFV(12),
      year3: calculateFV(36),
      year5: calculateFV(60)
    };
  }, [projectedMonthlySave, interestRate]);

  // Safe intermediate computations before early return
  const totalIncome = ledger ? ledger.filter(l => l.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const totalExpense = ledger ? ledger.filter(l => l.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const balance = totalIncome - totalExpense;

  // Advanced dynamic financial metrics - must be declared before early return
  const advancedStats = useMemo(() => {
    if (!ledger || ledger.length === 0) {
      return {
        needsPercent: 0,
        wantsPercent: 0,
        savingsPercent: 0,
        monthlyBurn: 0,
        runwayMonths: 0,
        runwayColor: '#10B981'
      };
    }

    const needsAmount = ledger.filter(l => l.type === 'expense' && ['Bills', 'Food/Drink'].includes(l.category)).reduce((sum, l) => sum + l.amount, 0);
    const wantsAmount = ledger.filter(l => l.type === 'expense' && ['Entertainment', 'Shop Purchase', 'Other'].includes(l.category)).reduce((sum, l) => sum + l.amount, 0);
    const totalAllocated = needsAmount + wantsAmount + (balance > 0 ? balance : 0);
    const needsPercent = totalAllocated > 0 ? (needsAmount / totalAllocated) * 100 : 0;
    const wantsPercent = totalAllocated > 0 ? (wantsAmount / totalAllocated) * 100 : 0;
    const savingsPercent = totalAllocated > 0 ? ((balance > 0 ? balance : 0) / totalAllocated) * 100 : 0;

    // Days difference calculation
    const dates = ledger.map(l => new Date(l.date).getTime());
    const minDate = dates.length > 0 ? Math.min(...dates) : Date.now();
    const daysDiff = Math.max(1, Math.ceil((Date.now() - minDate) / (1000 * 60 * 60 * 24)));
    const dailyBurn = totalExpense / daysDiff;
    const monthlyBurn = dailyBurn > 0 ? dailyBurn * 30 : 0;
    const runwayMonths = monthlyBurn > 0 ? (balance > 0 ? balance / monthlyBurn : 0) : 999;

    let runwayColor = '#10B981';
    if (runwayMonths >= 6) runwayColor = '#10B981';
    else if (runwayMonths >= 3) runwayColor = '#F59E0B';
    else runwayColor = '#EF4444';

    return {
      needsPercent,
      wantsPercent,
      savingsPercent,
      monthlyBurn,
      runwayMonths,
      runwayColor
    };
  }, [ledger, balance, totalExpense]);

  if (!ledger || !userStats) return <div className="opacity-80">Loading Treasury...</div>;

  // Financial Rank and description calculation based on savings rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  let financialRank = 'C-CLASS';
  let financialRankColor = 'text-yellow-400 font-bold';
  let financialDesc = 'Vessel survives on tight margins. Optimize outflow.';
  
  if (totalIncome > 0) {
    if (savingsRate >= 50) {
      financialRank = 'S-CLASS';
      financialRankColor = 'text-[#00F0FF] font-black drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]';
      financialDesc = 'Elite wealth preservation. Ultimate surplus efficiency!';
    } else if (savingsRate >= 30) {
      financialRank = 'A-CLASS';
      financialRankColor = 'text-green-400 font-bold';
      financialDesc = 'Strong savings margin. Core assets expanding rapidly.';
    } else if (savingsRate >= 15) {
      financialRank = 'B-CLASS';
      financialRankColor = 'text-blue-400 font-bold';
      financialDesc = 'Stable treasury growth. Balanced ledger.';
    } else if (savingsRate > 0) {
      financialRank = 'C-CLASS';
      financialRankColor = 'text-yellow-400 font-bold';
      financialDesc = 'Vessel survives on tight margins. Optimize outflow.';
    } else {
      financialRank = 'F-CLASS (DEFICIT)';
      financialRankColor = 'text-red-500 font-bold animate-pulse';
      financialDesc = 'Outflow exceeds influx! Core system depletion warning!';
    }
  } else if (totalExpense > 0) {
    financialRank = 'F-CLASS (DEFICIT)';
    financialRankColor = 'text-red-500 font-bold animate-pulse';
    financialDesc = 'Active depletion without cash inflow!';
  } else {
    financialRank = 'UNRANKED';
    financialRankColor = 'text-[#A3A3A3]';
    financialDesc = 'No financial log recorded for the active period.';
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <header className="hidden md:block border-b border-[#262626] pb-4 md:pb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-white uppercase" style={{ color: themeColor }}>TREASURY</h2>
        <p className="text-[#A3A3A3] text-xs md:text-sm mt-1 font-mono uppercase tracking-widest">Financial Ledger & Resource Allocation</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#262626]"></div>
          <div className="text-[10px] md:text-xs font-mono text-[#A3A3A3] mb-1 md:mb-2 tracking-widest uppercase">NET BALANCE</div>
          <div className={cn("text-2xl md:text-4xl font-mono", balance >= 0 ? "text-white" : "text-red-500")}>
            ${balance.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#262626]"></div>
          <div className="text-[10px] md:text-xs font-mono text-[#A3A3A3] mb-1 md:mb-2 flex items-center tracking-widest uppercase">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 mr-1 text-green-500" /> TOTAL INFLOW
          </div>
          <div className="text-xl md:text-2xl font-mono text-green-500">
            ${totalIncome.toFixed(2)}
          </div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#262626]"></div>
          <div className="text-[10px] md:text-xs font-mono text-[#A3A3A3] mb-1 md:mb-2 flex items-center tracking-widest uppercase">
            <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 mr-1 text-red-500" /> TOTAL OUTFLOW
          </div>
          <div className="text-xl md:text-2xl font-mono text-red-500">
            ${totalExpense.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Section */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-sm md:text-base font-mono text-white flex items-center font-bold tracking-widest uppercase">
                {chartType === 'pie' ? <PieChartIcon className="w-4 h-4 mr-2" style={{ color: themeColor }} /> : <BarChart3 className="w-4 h-4 mr-2" style={{ color: themeColor }} />}
                {chartType === 'pie' ? 'EXPENSES BY CATEGORY' : chartType === 'bar' ? '7-DAY CASH FLOW' : '30-DAY BALANCE'}
              </h3>
              <div className="flex flex-wrap bg-[#141414] border border-[#262626] rounded-sm p-1">
                <button
                  onClick={() => setChartType('pie')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase", chartType === 'pie' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  PIE
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase", chartType === 'bar' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  BAR
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase", chartType === 'line' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  LINE
                </button>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData.pie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.pie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#A3A3A3' }} />
                  </PieChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={chartData.bar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                      cursor={{ fill: '#262626', opacity: 0.4 }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                    <Bar dataKey="Income" fill="#22c55e" radius={[2, 2, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Expense" fill="#ef4444" radius={[2, 2, 0, 0]} maxBarSize={40} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData.line} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="Balance" stroke={themeColor} strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Advanced Financial Functions */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden mt-6">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h3 className="text-sm md:text-base font-mono text-white flex items-center font-bold tracking-widest uppercase mb-4">
              <PiggyBank className="w-4 h-4 mr-2" style={{ color: themeColor }} />
              TREASURY ADVANCED COGNITIVE SUITE
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 50/30/20 Budgeting Rule Analyzer */}
              <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest flex justify-between">
                  <span>50/30/20 RULE ANALYSIS</span>
                  <span className="text-[#A3A3A3]">SYSTEM TARGET</span>
                </h4>
                <p className="text-[9px] font-mono text-[#A3A3A3] uppercase">
                  Breaks down current expenditures into Needs, Wants, and Surplus:
                </p>
                <div className="space-y-2 pt-2">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                      <span>NEEDS (BILLS, FOOD) ({advancedStats.needsPercent.toFixed(0)}%)</span>
                      <span>TARGET: 50%</span>
                    </div>
                    <div className="w-full bg-[#262626] h-1.5 rounded-sm overflow-hidden">
                      <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${Math.min(100, advancedStats.needsPercent)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                      <span>WANTS (SHOPPING, FUN) ({advancedStats.wantsPercent.toFixed(0)}%)</span>
                      <span>TARGET: 30%</span>
                    </div>
                    <div className="w-full bg-[#262626] h-1.5 rounded-sm overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, advancedStats.wantsPercent)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                      <span>SURPLUS (SAVINGS/INVEST) ({advancedStats.savingsPercent.toFixed(0)}%)</span>
                      <span>TARGET: 20%</span>
                    </div>
                    <div className="w-full bg-[#262626] h-1.5 rounded-sm overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${Math.min(100, advancedStats.savingsPercent)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Reserve & Runway */}
              <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">
                    EMERGENCY FINANCIAL RUNWAY
                  </h4>
                  <p className="text-[9px] font-mono text-[#A3A3A3] uppercase mt-1 leading-relaxed">
                    Based on your average burn rate of <span className="text-white font-bold">${advancedStats.monthlyBurn.toFixed(0)}/mo</span>, here is how long your current balance of <span className="text-white font-bold">${balance.toFixed(2)}</span> will sustain you:
                  </p>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-mono uppercase text-[#A3A3A3]">ESTIMATED RUNWAY</span>
                    <span className="text-lg font-mono font-bold" style={{ color: advancedStats.runwayColor }}>
                      {advancedStats.runwayMonths === 999 ? 'INFINITY' : `${advancedStats.runwayMonths.toFixed(1)} MONTHS`}
                    </span>
                  </div>
                  <div className="w-full bg-[#262626] h-2 rounded-sm overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${Math.min(100, advancedStats.runwayMonths * 10)}%`, backgroundColor: advancedStats.runwayColor }}></div>
                  </div>
                  <span className="block text-[8px] font-mono text-[#A3A3A3] uppercase mt-1.5 tracking-wider">
                    {advancedStats.runwayMonths >= 6 
                      ? 'SECURE: Runway is sufficient to absorb heavy systemic disruptions.' 
                      : advancedStats.runwayMonths >= 3 
                        ? 'MODERATE WARNING: Establish more emergency reserves immediately.' 
                        : 'DANGER: System runway critical! Minimize outflow immediately!'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-mono text-white flex items-center mt-8 font-bold tracking-widest uppercase">
            <Wallet className="w-5 h-5 mr-2" style={{ color: themeColor }} />
            TRANSACTION LOG
          </h3>
          
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            {ledger.length > 0 ? (
              <div className="divide-y divide-[#262626]">
                {ledger.map(entry => (
                  <div key={entry.id} className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#141414] transition-colors gap-3 sm:gap-0">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={cn(
                        "w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center border flex-shrink-0",
                        entry.type === 'income' ? "bg-green-950/30 border-green-900/50 text-green-500" : "bg-red-950/30 border-red-900/50 text-red-500"
                      )}>
                        {entry.type === 'income' ? <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /> : <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-mono text-white text-xs md:text-sm truncate uppercase tracking-wider">{entry.description}</h4>
                        <div className="text-[10px] md:text-xs font-mono text-[#A3A3A3] mt-1 flex flex-wrap items-center gap-1 md:gap-2 tracking-widest uppercase">
                          <span>{entry.date}</span>
                          {entry.category && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="bg-[#141414] border border-[#262626] px-1.5 py-0.5 rounded-sm uppercase truncate max-w-[100px] sm:max-w-none">{entry.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-11 sm:pl-0">
                      <span className={cn(
                        "font-mono font-bold text-sm md:text-base",
                        entry.type === 'income' ? "text-green-500" : "text-white"
                      )}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </span>
                      <button onClick={() => deleteEntry(entry)} className="text-[#A3A3A3] hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#A3A3A3] font-mono text-xs tracking-widest uppercase">
                NO TRANSACTIONS RECORDED.
              </div>
            )}
          </div>
        </div>

        <div className="order-first lg:order-last mb-6 lg:mb-0 space-y-6 sticky top-8 overflow-y-auto max-h-[calc(100vh-8rem)] pr-1">
          {/* LOG TRANSACTION */}
          <form onSubmit={handleAddEntry} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h4 className="text-sm font-mono text-white mb-4 font-bold tracking-widest uppercase">LOG TRANSACTION</h4>
            <div className="space-y-4">
              <div className="flex bg-[#141414] border border-[#262626] rounded-sm p-1">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-mono rounded-sm transition-colors font-bold tracking-widest uppercase",
                    type === 'expense' ? "bg-red-950/50 text-red-400 border border-red-900/50" : "text-[#A3A3A3] hover:text-white"
                  )}
                >
                  EXPENSE
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-mono rounded-sm transition-colors font-bold tracking-widest uppercase",
                    type === 'income' ? "bg-green-950/50 text-green-400 border border-green-900/50" : "text-[#A3A3A3] hover:text-white"
                  )}
                >
                  INCOME
                </button>
              </div>

              <div>
                <label className="block text-[10px] md:text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CATEGORY</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 md:px-4 py-3 text-white font-mono text-xs md:text-xs focus:outline-none focus:ring-1 transition-colors uppercase"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] md:text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">AMOUNT ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 md:px-4 py-3 text-white font-mono text-xs md:text-xs focus:outline-none focus:ring-1 transition-colors"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-[10px] md:text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DESCRIPTION</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 md:px-4 py-3 text-white font-mono text-xs md:text-xs focus:outline-none focus:ring-1 transition-colors uppercase placeholder:text-[#555]"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  placeholder="E.G., GROCERIES"
                />
              </div>

              <div>
                <label className="block text-[10px] md:text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DATE</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 md:px-4 py-3 text-white font-mono text-xs md:text-xs focus:outline-none focus:ring-1 transition-colors uppercase"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                />
              </div>
              
              <button type="submit" className="w-full border px-4 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center mt-4" style={{ color: themeColor, borderColor: `${themeColor}80`, backgroundColor: `${themeColor}10` }}>
                <Plus className="w-4 h-4 mr-2" /> ADD RECORD
              </button>
            </div>
          </form>

          {/* VESSEL FINANCIAL GRADE */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h4 className="text-xs font-mono text-white mb-3 font-bold tracking-widest uppercase flex items-center">
              <Award className="w-4 h-4 mr-2" style={{ color: themeColor }} /> VESSEL GRADE
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider">SAVINGS EFFICIENCY</span>
                <span className={`text-sm font-mono uppercase ${financialRankColor}`}>{financialRank}</span>
              </div>
              <div className="w-full bg-[#141414] h-2 rounded-sm overflow-hidden border border-[#262626]">
                <div 
                  className="h-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, savingsRate))}%`,
                    backgroundColor: savingsRate > 0 ? (savingsRate >= 30 ? '#22c55e' : '#eab308') : '#ef4444' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#A3A3A3] uppercase">
                <span>SAVINGS RATE: {savingsRate.toFixed(1)}%</span>
                <span>TARGET: 30%+</span>
              </div>
              <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wide leading-relaxed border-t border-[#262626] pt-2">
                {financialDesc}
              </p>
            </div>
          </div>

          {/* SAVINGS RESERVOIRS */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h4 className="text-xs font-mono text-white mb-4 font-bold tracking-widest uppercase flex items-center">
              <PiggyBank className="w-4 h-4 mr-2" style={{ color: themeColor }} /> SAVINGS RESERVOIRS
            </h4>
            
            {vaults.length > 0 ? (
              <div className="space-y-4 mb-4">
                {vaults.map(vault => {
                  const pct = Math.min(100, (vault.saved / vault.target) * 100);
                  return (
                    <div key={vault.id} className="space-y-1 group">
                      <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-white font-medium">{vault.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#A3A3A3]">${vault.saved} / ${vault.target}</span>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteVault(vault.id)}
                            className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                            title="Delete Reservoir"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-[#141414] h-1.5 rounded-sm overflow-hidden border border-[#262626]">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-300" 
                          style={{ width: `${pct}%`, backgroundColor: themeColor }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[9px] font-mono text-[#737373] uppercase mb-4">NO ACTIVE RESERVOIRS ESTABLISHED.</p>
            )}

            {/* Create Vault Inline Form */}
            <form onSubmit={handleCreateVault} className="border-t border-[#262626] pt-4 space-y-3">
              <span className="block text-[9px] font-mono text-[#A3A3A3] tracking-widest uppercase font-bold">ESTABLISH RESERVOIR</span>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  placeholder="NAME"
                  className="bg-[#141414] border border-[#262626] rounded-sm px-2 py-1.5 text-[10px] font-mono text-white placeholder:text-[#555] uppercase focus:outline-none"
                />
                <input 
                  type="number" 
                  value={newVaultTarget}
                  onChange={(e) => setNewVaultTarget(e.target.value)}
                  placeholder="TARGET $"
                  className="bg-[#141414] border border-[#262626] rounded-sm px-2 py-1.5 text-[10px] font-mono text-white placeholder:text-[#555] focus:outline-none"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#141414] border border-[#262626] hover:bg-[#1C1C1C] text-white py-1.5 rounded-sm font-mono text-[9px] tracking-widest uppercase transition-colors"
              >
                + INITIALIZE VAULT
              </button>
            </form>
          </div>

          {/* CREDIT REGULATOR */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h4 className="text-xs font-mono text-white mb-4 font-bold tracking-widest uppercase flex items-center">
              <ArrowLeftRight className="w-4 h-4 mr-2" style={{ color: themeColor }} /> CREDIT REGULATOR
            </h4>
            <form onSubmit={handleVaultTransfer} className="space-y-3">
              <div className="flex bg-[#141414] border border-[#262626] rounded-sm p-0.5">
                <button
                  type="button"
                  onClick={() => setTransferType('deposit')}
                  className={cn(
                    "flex-1 py-1 text-[9px] font-mono rounded-sm transition-colors font-bold tracking-widest uppercase",
                    transferType === 'deposit' ? "bg-blue-950/50 text-blue-400 border border-blue-900/50" : "text-[#A3A3A3] hover:text-white"
                  )}
                >
                  DEPOSIT
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('withdraw')}
                  className={cn(
                    "flex-1 py-1 text-[9px] font-mono rounded-sm transition-colors font-bold tracking-widest uppercase",
                    transferType === 'withdraw' ? "bg-purple-950/50 text-purple-400 border border-purple-900/50" : "text-[#A3A3A3] hover:text-white"
                  )}
                >
                  WITHDRAW
                </button>
              </div>

              <div>
                <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 uppercase tracking-widest">TARGET RESERVOIR</label>
                <select 
                  value={selectedVaultId}
                  onChange={(e) => setSelectedVaultId(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2 py-2 text-white font-mono text-[10px] uppercase focus:outline-none"
                >
                  <option value="">-- SELECT RESERVOIR --</option>
                  {vaults.map(v => (
                    <option key={v.id} value={v.id}>{v.name} (BAL: ${v.saved})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 uppercase tracking-widest">AMOUNT ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2 py-2 text-white font-mono text-[10px] focus:outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-neutral-900 border border-[#262626] hover:bg-neutral-800 text-white py-2 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase transition-all"
              >
                EXECUTE TRANSFER
              </button>
            </form>
          </div>

          {/* GROWTH PROJECTION */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <h4 className="text-xs font-mono text-white mb-4 font-bold tracking-widest uppercase flex items-center">
              <Calculator className="w-4 h-4 mr-2" style={{ color: themeColor }} /> GROWTH PROJECTION
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 uppercase tracking-widest">MONTHLY DEPOSIT ($)</label>
                  <input 
                    type="number" 
                    value={projectedMonthlySave}
                    onChange={(e) => setProjectedMonthlySave(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2 py-1.5 text-white font-mono text-[10px] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 uppercase tracking-widest">APY %</label>
                  <input 
                    type="number" 
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2 py-1.5 text-white font-mono text-[10px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2 border-t border-[#262626] pt-3">
                <span className="block text-[8px] font-mono text-[#A3A3A3] uppercase tracking-widest">ESTIMATED FUTURE VALUE</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#141414] p-2 border border-[#262626] rounded-sm text-center">
                    <span className="block text-[8px] font-mono text-[#737373] uppercase">1 YEAR</span>
                    <span className="text-[10px] font-mono font-bold text-white">${projectedValues.year1.toFixed(0)}</span>
                  </div>
                  <div className="bg-[#141414] p-2 border border-[#262626] rounded-sm text-center">
                    <span className="block text-[8px] font-mono text-[#737373] uppercase">3 YEAR</span>
                    <span className="text-[10px] font-mono font-bold text-green-400">${projectedValues.year3.toFixed(0)}</span>
                  </div>
                  <div className="bg-[#141414] p-2 border border-[#262626] rounded-sm text-center">
                    <span className="block text-[8px] font-mono text-[#737373] uppercase">5 YEAR</span>
                    <span className="text-[10px] font-mono font-bold text-[#00F0FF]">${projectedValues.year5.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
