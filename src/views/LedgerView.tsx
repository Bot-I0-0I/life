import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, Plus, Trash2, PieChart as PieChartIcon, 
  BarChart3, PiggyBank, Calculator, Award, ArrowLeftRight, Download, Search, 
  Filter, ShieldCheck, Sparkles, DollarSign, TrendingUp, AlertTriangle, Layers, FileText, CheckCircle
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from 'recharts';

export function LedgerView() {
  const ledger = useLiveQuery(() => db.ledger.orderBy('date').reverse().toArray());
  const userStats = useLiveQuery(() => db.userStats.get(1));

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'vaults' | 'projections'>('overview');

  // Quick Log Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Food/Drink');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Ledger Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'income' | 'expense'>('ALL');
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('bar');

  // Monthly Budget Caps per Category State
  const [categoryCaps, setCategoryCaps] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('system_treasury_category_caps');
    return saved ? JSON.parse(saved) : {
      'Food/Drink': 500,
      'Bills': 1000,
      'Shop Purchase': 400,
      'Entertainment': 200,
      'Other': 300
    };
  });

  const saveCategoryCaps = (updatedCaps: Record<string, number>) => {
    setCategoryCaps(updatedCaps);
    localStorage.setItem('system_treasury_category_caps', JSON.stringify(updatedCaps));
  };

  const [editingCapCategory, setEditingCapCategory] = useState<string | null>(null);
  const [editingCapValue, setEditingCapValue] = useState('');

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
    if (isNaN(val) || val <= 0) return;

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
    setShowLogModal(false);
  };

  const deleteEntry = async (entry: any) => {
    if (!userStats) return;
    await db.ledger.delete(entry.id);
    
    // Reverse credit change
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
      
      const updated = vaults.map(v => v.id === selectedVaultId ? { ...v, saved: v.saved + amountVal } : v);
      saveVaultsToStorage(updated);

      const newCredits = userStats.credits - amountVal;
      await db.userStats.update(1, { credits: newCredits });

      await db.ledger.add({
        amount: amountVal,
        description: `VAULT DEPOSIT: ${targetVault.name}`,
        type: 'expense',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'Shop Purchase'
      } as any);

    } else {
      if (targetVault.saved < amountVal) {
        alert("INSUFFICIENT FUNDS IN TARGET VAULT!");
        return;
      }

      const updated = vaults.map(v => v.id === selectedVaultId ? { ...v, saved: v.saved - amountVal } : v);
      saveVaultsToStorage(updated);

      const newCredits = userStats.credits + amountVal;
      await db.userStats.update(1, { credits: newCredits });

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

  // Export Ledger to CSV File
  const exportLedgerToCSV = () => {
    if (!ledger || ledger.length === 0) {
      alert("No transaction entries available to export.");
      return;
    }

    const headers = ["ID", "Date", "Type", "Category", "Description", "Amount ($)"];
    const rows = ledger.map(l => [
      l.id,
      l.date,
      l.type.toUpperCase(),
      `"${l.category || 'Unassigned'}"`,
      `"${l.description.replace(/"/g, '""')}"`,
      l.type === 'income' ? l.amount : -l.amount
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `treasury_statement_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Totals
  const totalIncome = ledger ? ledger.filter(l => l.type === 'income').reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const totalExpense = ledger ? ledger.filter(l => l.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0) : 0;
  const balance = totalIncome - totalExpense;

  // Chart Data Computation
  const chartData = useMemo(() => {
    if (!ledger) return { pie: [], bar: [], line: [] };

    // Expenses by Category
    const expenses = ledger.filter(l => l.type === 'expense');
    const expensesByCategory = expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 7-Day Income vs Expense
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

    // 30-Day Cumulative Balance
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const d = subDays(new Date(), 29 - i);
      return format(d, 'yyyy-MM-dd');
    });

    let currentBalance = 0;
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

  // Projections
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

  // Advanced Stats
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

    const needsAmount = ledger.filter(l => l.type === 'expense' && ['Bills', 'Food/Drink'].includes(l.category || '')).reduce((sum, l) => sum + l.amount, 0);
    const wantsAmount = ledger.filter(l => l.type === 'expense' && ['Entertainment', 'Shop Purchase', 'Other'].includes(l.category || '')).reduce((sum, l) => sum + l.amount, 0);
    const totalAllocated = needsAmount + wantsAmount + (balance > 0 ? balance : 0);
    const needsPercent = totalAllocated > 0 ? (needsAmount / totalAllocated) * 100 : 0;
    const wantsPercent = totalAllocated > 0 ? (wantsAmount / totalAllocated) * 100 : 0;
    const savingsPercent = totalAllocated > 0 ? ((balance > 0 ? balance : 0) / totalAllocated) * 100 : 0;

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

  // Filtered Ledger Stream
  const filteredLedger = useMemo(() => {
    if (!ledger) return [];
    return ledger.filter(entry => {
      const matchesSearch = entry.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (entry.category && entry.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategoryFilter === 'ALL' || entry.category === selectedCategoryFilter;
      const matchesType = selectedTypeFilter === 'ALL' || entry.type === selectedTypeFilter;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [ledger, searchQuery, selectedCategoryFilter, selectedTypeFilter]);

  // Current Month Category Expense Totals
  const categorySpentTotals = useMemo(() => {
    if (!ledger) return {};
    const currentMonth = format(new Date(), 'yyyy-MM');
    const monthExpenses = ledger.filter(l => l.type === 'expense' && l.date.startsWith(currentMonth));
    return monthExpenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [ledger]);

  if (!ledger || !userStats) return <div className="p-6 font-mono text-[#A3A3A3] uppercase">Loading Treasury...</div>;

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  let financialRank = 'C-CLASS';
  let financialRankColor = 'text-yellow-400 font-bold';
  
  if (totalIncome > 0) {
    if (savingsRate >= 50) {
      financialRank = 'S-CLASS';
      financialRankColor = 'text-cyan-400 font-black';
    } else if (savingsRate >= 30) {
      financialRank = 'A-CLASS';
      financialRankColor = 'text-emerald-400 font-bold';
    } else if (savingsRate >= 15) {
      financialRank = 'B-CLASS';
      financialRankColor = 'text-blue-400 font-bold';
    } else if (savingsRate > 0) {
      financialRank = 'C-CLASS';
      financialRankColor = 'text-yellow-400 font-bold';
    } else {
      financialRank = 'F-CLASS';
      financialRankColor = 'text-red-500 font-bold';
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <header className="border-b border-[#262626] pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-white uppercase" style={{ color: themeColor }}>
              TREASURY & WEALTH HUD
            </h2>
            <span className={cn("px-2 py-0.5 border text-[10px] font-mono font-bold uppercase rounded-sm", financialRankColor)}>
              GRADE: {financialRank}
            </span>
          </div>
          <p className="text-[#A3A3A3] text-xs mt-1 font-mono uppercase tracking-widest">
            Capital Allocation, Financial Runway & Asset Management Engine
          </p>
        </div>

        {/* Quick Action Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs font-bold uppercase rounded-sm flex items-center gap-2 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> LOG TRANSACTION
          </button>
          <button
            onClick={exportLedgerToCSV}
            className="px-3 py-2 bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-white font-mono text-xs font-bold uppercase rounded-sm flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" /> EXPORT STATEMENT (.CSV)
          </button>
        </div>
      </header>

      {/* Top Net Position & Key Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#262626]"></div>
          <div className="text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase flex justify-between">
            <span>NET TREASURY BALANCE</span>
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className={cn("text-2xl font-mono font-bold", balance >= 0 ? "text-white" : "text-red-500")}>
            ${balance.toFixed(2)}
          </div>
          <div className="text-[9px] font-mono text-[#737373] mt-1 uppercase">
            Available liquid liquidity
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#262626]"></div>
          <div className="text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase flex justify-between">
            <span>TOTAL INFLOW</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono text-emerald-400 font-bold">
            ${totalIncome.toFixed(2)}
          </div>
          <div className="text-[9px] font-mono text-emerald-500/80 mt-1 uppercase">
            Cumulative earned revenue
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#262626]"></div>
          <div className="text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase flex justify-between">
            <span>TOTAL OUTFLOW</span>
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-mono text-red-400 font-bold">
            ${totalExpense.toFixed(2)}
          </div>
          <div className="text-[9px] font-mono text-red-500/80 mt-1 uppercase">
            Cumulative expenditures
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#262626]"></div>
          <div className="text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase flex justify-between">
            <span>SAVINGS RATE & RUNWAY</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-mono text-amber-400 font-bold">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-[9px] font-mono text-[#737373] mt-1 uppercase flex justify-between">
            <span>RUNWAY:</span>
            <span style={{ color: advancedStats.runwayColor }} className="font-bold">
              {advancedStats.runwayMonths === 999 ? '∞' : `${advancedStats.runwayMonths.toFixed(1)} MO`}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Executive Sub-Tab Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#0A0A0A] p-1 border border-[#262626] rounded-sm gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "py-2.5 text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-target min-h-[44px]",
            activeTab === 'overview' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'overview' ? { color: themeColor } : {}}
        >
          <BarChart3 className="w-4 h-4 flex-shrink-0" /> OVERVIEW & FLOW
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={cn(
            "py-2.5 text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-target min-h-[44px]",
            activeTab === 'ledger' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'ledger' ? { color: themeColor } : {}}
        >
          <FileText className="w-4 h-4 flex-shrink-0" /> LEDGER & BUDGETS
        </button>
        <button
          onClick={() => setActiveTab('vaults')}
          className={cn(
            "py-2.5 text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-target min-h-[44px]",
            activeTab === 'vaults' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'vaults' ? { color: themeColor } : {}}
        >
          <PiggyBank className="w-4 h-4 flex-shrink-0" /> SAVINGS VAULTS
        </button>
        <button
          onClick={() => setActiveTab('projections')}
          className={cn(
            "py-2.5 text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 touch-target min-h-[44px]",
            activeTab === 'projections' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'projections' ? { color: themeColor } : {}}
        >
          <Calculator className="w-4 h-4 flex-shrink-0" /> INTELLIGENCE & APY
        </button>
      </div>

      {/* SUB-TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Main Visual Flow Analytics Chart */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-sm md:text-base font-mono text-white flex items-center font-bold tracking-widest uppercase">
                  {chartType === 'pie' ? <PieChartIcon className="w-4 h-4 mr-2 text-cyan-400" /> : <BarChart3 className="w-4 h-4 mr-2 text-cyan-400" />}
                  FINANCIAL CASH FLOW ANALYTICS
                </h3>
                <p className="text-[10px] font-mono text-[#A3A3A3] uppercase">
                  {chartType === 'bar' ? '7-Day Cash Flow comparison' : chartType === 'line' ? '30-Day Cumulative Net Balance Trend' : 'Expense Category Distribution'}
                </p>
              </div>

              <div className="flex bg-[#141414] border border-[#262626] rounded-sm p-1">
                <button
                  onClick={() => setChartType('bar')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase font-bold", chartType === 'bar' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  7-DAY FLOW
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase font-bold", chartType === 'line' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  30-DAY BALANCE
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={cn("px-3 py-1 text-xs font-mono rounded-sm transition-colors tracking-widest uppercase font-bold", chartType === 'pie' ? "bg-[#262626] text-white" : "text-[#A3A3A3] hover:text-white")}
                >
                  CATEGORIES
                </button>
              </div>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData.pie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.pie.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px', color: '#A3A3A3' }} />
                  </PieChart>
                ) : chartType === 'bar' ? (
                  <BarChart data={chartData.bar} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                      cursor={{ fill: '#262626', opacity: 0.4 }}
                    />
                    <Legend wrapperStyle={{ fontFamily: 'monospace', fontSize: '10px' }} />
                    <Bar dataKey="Income" fill="#10B981" radius={[2, 2, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Expense" fill="#EF4444" radius={[2, 2, 0, 0]} maxBarSize={36} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData.line} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <RechartsTooltip 
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="Balance" stroke={themeColor} strokeWidth={2.5} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stream & Category Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Activity Stream */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> RECENT TRANSACTIONS
                </h3>
                <button
                  onClick={() => setActiveTab('ledger')}
                  className="text-xs font-mono text-cyan-400 hover:underline uppercase"
                >
                  VIEW FULL LEDGER →
                </button>
              </div>

              <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm divide-y divide-[#262626]">
                {ledger.slice(0, 6).map(entry => (
                  <div key={entry.id} className="p-3 sm:p-4 flex items-center justify-between hover:bg-[#141414] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center border flex-shrink-0",
                        entry.type === 'income' ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400" : "bg-red-950/40 border-red-900/50 text-red-400"
                      )}>
                        {entry.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-mono text-white text-xs font-bold uppercase truncate max-w-[180px] sm:max-w-xs">{entry.description}</h4>
                        <div className="text-[10px] font-mono text-[#A3A3A3] mt-0.5 flex items-center gap-2">
                          <span>{entry.date}</span>
                          <span>•</span>
                          <span className="text-cyan-300">{entry.category || 'Other'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={cn("font-mono font-bold text-xs sm:text-sm", entry.type === 'income' ? "text-emerald-400" : "text-white")}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </span>
                      <button onClick={() => deleteEntry(entry)} className="text-[#737373] hover:text-red-400 transition-colors p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {ledger.length === 0 && (
                  <div className="p-8 text-center text-[#737373] font-mono text-xs uppercase">
                    No recent transactions recorded. Click "Log Transaction" above to begin.
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Category Spending Breakdown */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-amber-400" /> SPENDING BY CATEGORY
              </h3>

              <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3">
                {expenseCategories.map(cat => {
                  const spent = categorySpentTotals[cat] || 0;
                  const cap = categoryCaps[cat] || 500;
                  const pct = Math.min(100, (spent / cap) * 100);

                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono uppercase">
                        <span className="text-white font-medium">{cat}</span>
                        <span className={cn("font-bold", spent > cap ? "text-red-400" : "text-[#A3A3A3]")}>
                          ${spent.toFixed(0)} / ${cap}
                        </span>
                      </div>
                      <div className="w-full bg-[#141414] h-1.5 rounded-sm overflow-hidden border border-[#262626]">
                        <div
                          className={cn("h-full transition-all", spent > cap ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-cyan-500")}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: DETAILED LEDGER & CATEGORY BUDGET CAPS */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Monthly Budget Caps Manager Bar */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <div>
                <h3 className="text-sm font-mono text-white font-bold uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> MONTHLY CATEGORY BUDGET CAPS
                </h3>
                <p className="text-[10px] font-mono text-[#A3A3A3] uppercase">
                  Set expense budget limits for the current month. Exceeding limits triggers warning indicators.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {expenseCategories.map(cat => {
                const spent = categorySpentTotals[cat] || 0;
                const cap = categoryCaps[cat] || 500;
                const isOver = spent > cap;

                return (
                  <div key={cat} className="bg-[#141414] border border-[#262626] rounded-sm p-3 space-y-2 relative">
                    <div className="text-[10px] font-mono text-[#A3A3A3] font-bold uppercase truncate">{cat}</div>
                    <div className="flex justify-between items-baseline font-mono text-xs">
                      <span className={cn("font-bold", isOver ? "text-red-400" : "text-white")}>
                        ${spent.toFixed(0)}
                      </span>
                      <span className="text-[#A3A3A3] text-[10px]">/ ${cap}</span>
                    </div>

                    <div className="w-full bg-[#0A0A0A] h-1.5 rounded-sm overflow-hidden">
                      <div
                        className={cn("h-full", isOver ? "bg-red-500" : "bg-cyan-500")}
                        style={{ width: `${Math.min(100, (spent / cap) * 100)}%` }}
                      />
                    </div>

                    {editingCapCategory === cat ? (
                      <div className="flex gap-1 pt-1">
                        <input
                          type="number"
                          value={editingCapValue}
                          onChange={(e) => setEditingCapValue(e.target.value)}
                          placeholder="Cap $"
                          className="w-full bg-[#0A0A0A] border border-[#262626] text-white font-mono text-[10px] px-1.5 py-0.5 rounded-sm focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const val = parseFloat(editingCapValue);
                            if (!isNaN(val) && val >= 0) {
                              saveCategoryCaps({ ...categoryCaps, [cat]: val });
                            }
                            setEditingCapCategory(null);
                          }}
                          className="px-1.5 bg-emerald-600 text-black font-mono text-[9px] font-bold rounded-sm uppercase"
                        >
                          SAVE
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCapCategory(cat);
                          setEditingCapValue(cap.toString());
                        }}
                        className="text-[9px] font-mono text-cyan-400 hover:underline uppercase block text-right"
                      >
                        SET CAP
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Search, Category Filter, Type Filter Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transaction description or category..."
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm pl-9 pr-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
            >
              <option value="ALL">CATEGORY: ALL</option>
              {Array.from(new Set([...incomeCategories, ...expenseCategories])).map(c => (
                <option key={c} value={c}>{c.toUpperCase()}</option>
              ))}
            </select>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
              className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
            >
              <option value="ALL">TYPE: ALL</option>
              <option value="income">INCOME ONLY</option>
              <option value="expense">EXPENSE ONLY</option>
            </select>
          </div>

          {/* Full Transaction Table */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm overflow-hidden">
            <div className="p-3 bg-[#141414] border-b border-[#262626] text-xs font-mono text-[#A3A3A3] font-bold uppercase flex justify-between items-center">
              <span>RECORDED TRANSACTIONS ({filteredLedger.length})</span>
              <span>SHOWING ALL AUDITED LOGS</span>
            </div>

            {filteredLedger.length > 0 ? (
              <div className="divide-y divide-[#262626]">
                {filteredLedger.map(entry => (
                  <div key={entry.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#141414] transition-colors gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-sm flex items-center justify-center border flex-shrink-0",
                        entry.type === 'income' ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400" : "bg-red-950/40 border-red-900/50 text-red-400"
                      )}>
                        {entry.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      </div>

                      <div>
                        <h4 className="font-mono text-white text-xs font-bold uppercase">{entry.description}</h4>
                        <div className="text-[10px] font-mono text-[#A3A3A3] mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{entry.date}</span>
                          <span>•</span>
                          <span className="px-1.5 py-0.5 bg-[#141414] border border-[#262626] rounded-sm text-cyan-300 font-bold uppercase">
                            {entry.category || 'Other'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className={cn("font-mono font-bold text-sm", entry.type === 'income' ? "text-emerald-400" : "text-white")}>
                        {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                      </span>
                      <button onClick={() => deleteEntry(entry)} className="text-[#737373] hover:text-red-400 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-[#737373] font-mono text-xs uppercase">
                No transactions match your search or filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: WEALTH VAULTS & RESERVOIRS */}
      {activeTab === 'vaults' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Vaults List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-cyan-400" /> ACTIVE SAVINGS RESERVOIRS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vaults.map(vault => {
                  const pct = Math.min(100, (vault.saved / vault.target) * 100);

                  return (
                    <div key={vault.id} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-mono text-white text-xs font-bold uppercase">{vault.name}</h4>
                          <span className="text-[10px] font-mono text-cyan-400">{pct.toFixed(0)}% FUNDED</span>
                        </div>
                        <button
                          onClick={() => handleDeleteVault(vault.id)}
                          className="text-[#737373] hover:text-red-400 transition-colors p-1"
                          title="Delete Reservoir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-[#A3A3A3] uppercase">SAVED:</span>
                        <span className="text-emerald-400 font-bold">${vault.saved} / ${vault.target}</span>
                      </div>

                      <div className="w-full bg-[#141414] h-2 rounded-sm overflow-hidden border border-[#262626]">
                        <div
                          className="h-full bg-cyan-500 transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: themeColor }}
                        />
                      </div>
                    </div>
                  );
                })}

                {vaults.length === 0 && (
                  <div className="col-span-2 bg-[#0A0A0A] border border-[#262626] p-8 text-center text-[#737373] font-mono text-xs uppercase">
                    No active reservoirs created yet. Create one using the form on the right.
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Create Vault & Credit Regulator Transfer */}
            <div className="space-y-6">
              {/* Establish Vault */}
              <form onSubmit={handleCreateVault} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3">
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-emerald-400" /> INITIALIZE RESERVOIR
                </h4>
                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">VAULT NAME</label>
                  <input
                    type="text"
                    value={newVaultName}
                    onChange={(e) => setNewVaultName(e.target.value)}
                    placeholder="E.G., EMERGENCY FUND"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs uppercase focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">TARGET AMOUNT ($)</label>
                  <input
                    type="number"
                    value={newVaultTarget}
                    onChange={(e) => setNewVaultTarget(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-sm transition-colors"
                >
                  CREATE VAULT
                </button>
              </form>

              {/* Credit Regulator Transfer */}
              <form onSubmit={handleVaultTransfer} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3">
                <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" /> CREDIT REGULATOR TRANSFER
                </h4>

                <div className="flex bg-[#141414] border border-[#262626] rounded-sm p-0.5">
                  <button
                    type="button"
                    onClick={() => setTransferType('deposit')}
                    className={cn(
                      "flex-1 py-1 text-[10px] font-mono rounded-sm font-bold uppercase",
                      transferType === 'deposit' ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "text-[#A3A3A3]"
                    )}
                  >
                    DEPOSIT
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferType('withdraw')}
                    className={cn(
                      "flex-1 py-1 text-[10px] font-mono rounded-sm font-bold uppercase",
                      transferType === 'withdraw' ? "bg-purple-950 text-purple-400 border border-purple-800" : "text-[#A3A3A3]"
                    )}
                  >
                    WITHDRAW
                  </button>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">SELECT RESERVOIR</label>
                  <select
                    value={selectedVaultId}
                    onChange={(e) => setSelectedVaultId(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs uppercase focus:outline-none"
                  >
                    <option value="">-- CHOOSE VAULT --</option>
                    {vaults.map(v => (
                      <option key={v.id} value={v.id}>{v.name} (BAL: ${v.saved})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">AMOUNT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white font-mono text-xs font-bold uppercase rounded-sm transition-colors"
                >
                  EXECUTE TRANSFER
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: FINANCIAL INTELLIGENCE & PROJECTIONS */}
      {activeTab === 'projections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 50/30/20 Rule Analysis */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 space-y-4">
              <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-cyan-400" /> 50/30/20 BUDGETING RULE ANALYSIS
              </h3>
              <p className="text-[10px] font-mono text-[#A3A3A3] uppercase">
                Evaluates your expenditure balance across Needs (50%), Wants (30%), and Savings Surplus (20%).
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                    <span>NEEDS (BILLS, FOOD) ({advancedStats.needsPercent.toFixed(0)}%)</span>
                    <span>TARGET: 50%</span>
                  </div>
                  <div className="w-full bg-[#141414] h-2 rounded-sm overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, advancedStats.needsPercent)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                    <span>WANTS (SHOPPING, ENTERTAINMENT) ({advancedStats.wantsPercent.toFixed(0)}%)</span>
                    <span>TARGET: 30%</span>
                  </div>
                  <div className="w-full bg-[#141414] h-2 rounded-sm overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, advancedStats.wantsPercent)}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-[#A3A3A3] mb-1">
                    <span>SURPLUS (SAVINGS/INVEST) ({advancedStats.savingsPercent.toFixed(0)}%)</span>
                    <span>TARGET: 20%</span>
                  </div>
                  <div className="w-full bg-[#141414] h-2 rounded-sm overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, advancedStats.savingsPercent)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Runway & Burn Rate */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> EMERGENCY FINANCIAL RUNWAY
                </h3>
                <p className="text-[10px] font-mono text-[#A3A3A3] uppercase mt-1 leading-relaxed">
                  Based on your calculated monthly burn rate of <span className="text-white font-bold">${advancedStats.monthlyBurn.toFixed(0)}/mo</span>, your net balance of <span className="text-white font-bold">${balance.toFixed(2)}</span> covers:
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono text-[#A3A3A3] uppercase">RESERVE CAPACITY</span>
                  <span className="text-xl font-mono font-bold" style={{ color: advancedStats.runwayColor }}>
                    {advancedStats.runwayMonths === 999 ? 'INFINITY' : `${advancedStats.runwayMonths.toFixed(1)} MONTHS`}
                  </span>
                </div>

                <div className="w-full bg-[#141414] h-2.5 rounded-sm overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${Math.min(100, advancedStats.runwayMonths * 10)}%`, backgroundColor: advancedStats.runwayColor }}></div>
                </div>

                <p className="text-[10px] font-mono text-[#A3A3A3] uppercase pt-1">
                  {advancedStats.runwayMonths >= 6 
                    ? '✅ SECURE: Emergency runway absorbs systemic disruptions.' 
                    : advancedStats.runwayMonths >= 3 
                      ? '⚠️ MODERATE: Establish additional reserves to hit 6 months.' 
                      : '🚨 CRITICAL: Runway is low! Reduce outflow immediately.'}
                </p>
              </div>
            </div>
          </div>

          {/* Compound Wealth Growth Projection */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 space-y-4">
            <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" /> COMPOUND WEALTH GROWTH CALCULATOR
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">MONTHLY DEPOSIT ($)</label>
                <input
                  type="number"
                  value={projectedMonthlySave}
                  onChange={(e) => setProjectedMonthlySave(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">ESTIMATED APY %</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#262626] pt-4">
              <div className="bg-[#141414] p-3 border border-[#262626] rounded-sm text-center">
                <span className="block text-[10px] font-mono text-[#A3A3A3] uppercase">1 YEAR VALUE</span>
                <span className="text-lg font-mono font-bold text-white">${projectedValues.year1.toFixed(0)}</span>
              </div>
              <div className="bg-[#141414] p-3 border border-[#262626] rounded-sm text-center">
                <span className="block text-[10px] font-mono text-[#A3A3A3] uppercase">3 YEAR VALUE</span>
                <span className="text-lg font-mono font-bold text-emerald-400">${projectedValues.year3.toFixed(0)}</span>
              </div>
              <div className="bg-[#141414] p-3 border border-[#262626] rounded-sm text-center">
                <span className="block text-[10px] font-mono text-[#A3A3A3] uppercase">5 YEAR VALUE</span>
                <span className="text-lg font-mono font-bold text-cyan-400">${projectedValues.year5.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK LOG TRANSACTION MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <h3 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> LOG NEW TRANSACTION
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-[#A3A3A3] hover:text-white font-mono text-xs">✕</button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="flex bg-[#141414] border border-[#262626] rounded-sm p-1">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-mono rounded-sm font-bold uppercase transition-all",
                    type === 'expense' ? "bg-red-950/60 text-red-400 border border-red-900/50" : "text-[#A3A3A3]"
                  )}
                >
                  EXPENSE
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-mono rounded-sm font-bold uppercase transition-all",
                    type === 'income' ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/50" : "text-[#A3A3A3]"
                  )}
                >
                  INCOME
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
                >
                  {(type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">AMOUNT ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">DESCRIPTION</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.G., SYSTEM UPGRADE OR GROCERIES"
                  required
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-mono text-xs font-bold uppercase rounded-sm transition-colors"
              >
                RECORD TRANSACTION
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
