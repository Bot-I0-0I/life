import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { Coins, Package, Plus, ShoppingCart, Trash2, Shield, Flame, Sparkles, Filter, Gem, RefreshCw, Star } from 'lucide-react';
import { toast } from 'sonner';

export function StoreView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const shopItems = useLiveQuery(() => db.shopItems.toArray());
  const inventory = useLiveQuery(() => db.inventory.toArray());

  const [newItemName, setNewItemName] = useState('');
  const [newItemCost, setNewItemCost] = useState('');
  const [newItemAttr, setNewItemAttr] = useState('STR');
  const [newItemBoost, setNewItemBoost] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'cognitive' | 'custom'>('all');

  // Forge mini-game state
  const [isForging, setIsForging] = useState(false);
  const [forgeResult, setForgeResult] = useState<string | null>(null);

  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  const handleBuy = async (item: any) => {
    if (!userStats || userStats.credits < item.cost) {
      toast.error("INSUFFICIENT FUNDS IN TREASURY PROTOCOL.");
      return;
    }

    await db.userStats.update(1, { credits: userStats.credits - item.cost });
    await db.shopItems.update(item.id, { purchased: true });
    await db.inventory.add({
      name: item.name,
      type: 'item',
      attributeBoosts: item.attributeBoosts,
      equipped: false
    });
    
    // Log expense to ledger
    await db.ledger.add({
      date: new Date().toISOString().split('T')[0],
      amount: item.cost,
      type: 'expense',
      category: 'Shop Purchase',
      description: `Purchased item: ${item.name}`
    } as any);

    toast.success(`PURCHASED ${item.name.toUpperCase()} // MOVED TO INVENTORY`);
  };

  const handleEquip = async (id: number, currentEquipped: boolean) => {
    await db.inventory.update(id, { equipped: !currentEquipped });
    toast.success(currentEquipped ? "ITEM UNEQUIPPED" : "ITEM EQUIPPED // PASIVE BUFF ACTIVE");
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemCost || !newItemBoost) return;

    await db.shopItems.add({
      name: newItemName,
      cost: parseInt(newItemCost, 10),
      attributeBoosts: { [newItemAttr]: parseInt(newItemBoost, 10) },
      purchased: false
    });

    setNewItemName('');
    setNewItemCost('');
    setNewItemBoost('');
    setIsAdding(false);
    toast.success("CUSTOM UPGRADE REGISTERED TO COMMODITY INDEX.");
  };

  const handleDeleteShopItem = async (id: number) => {
    await db.shopItems.delete(id);
    toast.info("ITEM EXPUNGED FROM COMMODITY INDEX.");
  };

  const handleDeleteInventoryItem = async (id: number) => {
    await db.inventory.delete(id);
    toast.info("ITEM REMOVED FROM INVENTORY SLOTS.");
  };

  // Seed default items if shop is empty
  const handleSeedShop = async () => {
    const defaultShop = [
      { name: 'Elite Mithril Dumbbell Set', cost: 1200, attributeBoosts: { STR: 12 }, purchased: false },
      { name: 'S-Class Neuro-Link Visor', cost: 2500, attributeBoosts: { INT: 15 }, purchased: false },
      { name: 'Circadian Regeneration Mattress', cost: 3200, attributeBoosts: { VIT: 20 }, purchased: false },
      { name: 'Wireless Mechanical Keyboard', cost: 800, attributeBoosts: { AGI: 5 }, purchased: false },
      { name: 'Chrono-Holo Tactical Planner', cost: 1500, attributeBoosts: { SEN: 10 }, purchased: false },
      { name: 'Desi Ghee Anabolic Recovery Kit', cost: 1000, attributeBoosts: { STR: 6, VIT: 6 }, purchased: false },
    ];
    await db.shopItems.bulkAdd(defaultShop);
    toast.success("SHOP STOCK COMPILATION RESTORED.");
  };

  // Forge Lottery Game (Spend 150 G to forge a randomized Item/Boost)
  const handleForgeItem = async () => {
    if (!userStats || userStats.credits < 150) {
      toast.error("MINIMUM 150 G CREDITS REQUIRED TO OPERATE THE METABOLIC FORGE.");
      return;
    }

    setIsForging(true);
    setForgeResult(null);

    // Deduct credits
    await db.userStats.update(1, { credits: userStats.credits - 150 });

    const forgeOutcomes = [
      { name: "Common Iron Grip-Trainer", boosts: { STR: 2 }, rarity: "Common", desc: "A sturdy hand-gripper." },
      { name: "S-Class Focus Stimulant", boosts: { INT: 10 }, rarity: "Epic", desc: "Quantum focus mental matrix enhancer." },
      { name: "Shadow Assassin Kinetic Insoles", boosts: { AGI: 8 }, rarity: "Rare", desc: "Adds lightweight recoil compensation." },
      { name: "Monarch Platinum Coffee Filter", boosts: { SEN: 6 }, rarity: "Rare", desc: "Profoundly triggers neurotransmitter receptors." },
      { name: "Mithril Solder Plate Vest", boosts: { VIT: 12 }, rarity: "Legendary", desc: "High-density weight load system." },
      { name: "Ruptured Bio-Nanite Tube (Dud)", boosts: { STR: 0 }, rarity: "Scrap", desc: "Corroded mechanical junk." },
      { name: "S-Class Energy Reactor Core", boosts: { VIT: 15, STR: 15 }, rarity: "Legendary", desc: "Total core metabolic overload module!" }
    ];

    setTimeout(async () => {
      // Pick random outcome
      const outcome = forgeOutcomes[Math.floor(Math.random() * forgeOutcomes.length)];
      
      if (outcome.boosts.STR > 0 || outcome.boosts.VIT > 0 || outcome.boosts.INT > 0 || outcome.boosts.AGI > 0 || outcome.boosts.SEN > 0) {
        await db.inventory.add({
          name: `[${outcome.rarity.toUpperCase()}] ${outcome.name}`,
          type: 'item',
          attributeBoosts: outcome.boosts,
          equipped: false
        });
        setForgeResult(`SUCCESS! FORGED: ${outcome.name} (${outcome.rarity})`);
        toast.success(`FORGED: ${outcome.name}! CHECK INVENTORY.`);
      } else {
        setForgeResult(`REVOLUTION FAILED: Item decayed into scrap metal. (150 G Consumed)`);
        toast.error("FORGE FAILURE // DEBRIS DETECTED.");
      }
      setIsForging(false);
    }, 1800);
  };

  if (!userStats || !shopItems || !inventory) return <div className="font-mono text-xs opacity-75">Loading Commodities...</div>;

  // Filter items
  const availableItems = shopItems.filter(i => !i.purchased);
  const filteredItems = availableItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'physical') {
      return item.attributeBoosts.STR || item.attributeBoosts.VIT;
    }
    if (activeFilter === 'cognitive') {
      return item.attributeBoosts.INT || item.attributeBoosts.SEN || item.attributeBoosts.AGI;
    }
    if (activeFilter === 'custom') {
      return !['Elite Mithril Dumbbell Set', 'S-Class Neuro-Link Visor', 'Circadian Regeneration Mattress', 'Wireless Mechanical Keyboard', 'Chrono-Holo Tactical Planner', 'Desi Ghee Anabolic Recovery Kit', 'Herman Miller Chair', 'Mechanical Keyboard', 'Noise Cancelling Headphones', 'Premium Gym Pass'].includes(item.name);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-10">
      <header className="hidden md:flex border-b border-[#262626] pb-6 justify-between items-end">
        <div>
          <h2 className="text-3xl font-mono font-bold tracking-tight text-white uppercase" style={{ color: themeColor }}>SYSTEM STORE & FORGE</h2>
          <p className="text-[#A3A3A3] text-sm mt-1 font-mono uppercase tracking-widest">Trade Credits for physical upgrades or forge custom artifacts.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">AVAILABLE CREDIT BALANCE</div>
          <div className="text-3xl font-mono text-[#FFD700] flex items-center justify-end font-bold">
            <Coins className="w-6 h-6 mr-2" />
            {userStats.credits} <span className="text-xs text-[#FFD700]/70 ml-1">G</span>
          </div>
        </div>
      </header>

      {/* Grid: Store Front & Forge Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Reward Shop */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#262626] pb-4">
            <h3 className="text-lg font-mono text-white flex items-center font-bold tracking-widest uppercase">
              <ShoppingCart className="w-5 h-5 mr-2" style={{ color: themeColor }} />
              REWARD SHOP INDEX
            </h3>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="text-[10px] font-mono border px-3 py-1.5 rounded-sm transition-colors flex items-center tracking-widest uppercase"
                style={{ color: themeColor, borderColor: `${themeColor}80`, backgroundColor: `${themeColor}10` }}
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> ADD CUSTOM
              </button>
              {availableItems.length === 0 && (
                <button
                  onClick={handleSeedShop}
                  className="text-[10px] font-mono border border-dashed border-[#555] text-indigo-400 bg-indigo-500/5 px-3 py-1.5 rounded-sm hover:bg-indigo-500/10 transition-all flex items-center uppercase tracking-widest"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> RESTOCK DEFAULTS
                </button>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2 bg-[#0A0A0A] p-1 border border-[#262626] rounded-sm max-w-md">
            {(['all', 'physical', 'cognitive', 'custom'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "flex-1 text-[9px] font-mono py-1.5 rounded-sm transition-all uppercase tracking-widest",
                  activeFilter === f ? "bg-[#1A1A1A] text-white font-bold" : "text-[#A3A3A3] hover:text-white"
                )}
                style={activeFilter === f ? { color: themeColor } : {}}
              >
                {f}
              </button>
            ))}
          </div>

          {isAdding && (
            <form onSubmit={handleAddItem} className="bg-[#0A0A0A] border rounded-sm p-4 space-y-4 mb-4 relative overflow-hidden" style={{ borderColor: `${themeColor}50` }}>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: themeColor }}></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">ITEM NAME</label>
                  <input 
                    type="text" 
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:ring-1 transition-colors uppercase placeholder:text-[#555]"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    placeholder="E.G. RESTAURANT CHEAT MEAL"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">COST (CREDITS)</label>
                  <input 
                    type="number" 
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:ring-1 transition-colors uppercase"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    placeholder="500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">ATTRIBUTE BUFFER</label>
                  <select 
                    value={newItemAttr}
                    onChange={(e) => setNewItemAttr(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:ring-1 transition-colors uppercase"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  >
                    <option value="STR">STR (STRENGTH)</option>
                    <option value="VIT">VIT (VITALITY)</option>
                    <option value="AGI">AGI (AGILITY)</option>
                    <option value="INT">INT (INTELLECT)</option>
                    <option value="SEN">SEN (SENSORY)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BOOST MAGNITUDE</label>
                  <input 
                    type="number" 
                    value={newItemBoost}
                    onChange={(e) => setNewItemBoost(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:ring-1 transition-colors uppercase"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    placeholder="10"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-[10px] font-mono text-[#A3A3A3] hover:text-white transition-colors tracking-widest uppercase"
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  className="border px-4 py-2 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase transition-colors"
                  style={{ color: themeColor, borderColor: `${themeColor}80`, backgroundColor: `${themeColor}30` }}
                >
                  COMPILE UPGRADE
                </button>
              </div>
            </form>
          )}

          {/* Shop items list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 flex flex-col justify-between h-[130px] hover:border-[#444] transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#262626] group-hover:border-[#777] transition-colors"></div>
                
                <div>
                  <h4 className="font-mono text-xs text-white truncate tracking-wider uppercase font-bold">{item.name}</h4>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(item.attributeBoosts).map(([attr, val]) => (
                      <span key={attr} className="text-[9px] font-mono text-[#A3A3A3] bg-[#0A0A0A] px-2 py-0.5 rounded-sm border border-[#262626] tracking-widest uppercase font-bold">
                        +{val as number} {attr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <button 
                    onClick={() => handleDeleteShopItem(item.id!)}
                    className="text-[#A3A3A3] hover:text-red-500 p-1.5 rounded-sm transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Exterminate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleBuy(item)}
                    disabled={userStats.credits < item.cost}
                    className="bg-[#262626] hover:bg-[#333] disabled:opacity-30 text-white px-3 py-1.5 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5"
                  >
                    <Coins className="w-3.5 h-3.5 text-[#FFD700]" />
                    {item.cost} G
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-2 text-center py-12 border border-dashed border-[#262626] rounded-sm text-[#A3A3A3] font-mono text-xs tracking-widest uppercase">
                COMMODITY STOCK COMPILATION DEPLETED FOR THIS FILTER.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metabolic Forge & Inventory */}
        <div className="space-y-6">
          {/* Metabolic Forge Mini-game */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-indigo-400 tracking-widest uppercase font-bold flex items-center gap-1">
                <Gem className="w-3.5 h-3.5 animate-bounce" /> METABOLIC FORGE
              </span>
              <span className="text-[8px] font-mono text-[#555] uppercase">COST: 150 G</span>
            </div>
            <p className="text-[10px] font-mono text-[#A3A3A3] leading-relaxed uppercase">
              Spend 150 Credits to engage a high-temperature molecular forge. Chance to receive common, rare, or legendary static equipment buffers.
            </p>

            {forgeResult && (
              <div className="bg-[#141414] border border-[#262626] p-2.5 rounded-sm text-center">
                <span className="text-[10px] font-mono text-green-400 font-bold uppercase tracking-wider block">
                  {forgeResult}
                </span>
              </div>
            )}

            <button
              onClick={handleForgeItem}
              disabled={isForging || userStats.credits < 150}
              className="w-full py-2.5 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 border"
              style={{
                color: themeColor,
                borderColor: `${themeColor}80`,
                backgroundColor: isForging ? 'transparent' : `${themeColor}10`
              }}
            >
              <RefreshCw className={cn("w-4 h-4", isForging && "animate-spin")} />
              {isForging ? "REVOLUTIONIZING METALS..." : "ENGAGE FORGE"}
            </button>
          </div>

          {/* Inventory Manager */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono text-white flex items-center font-bold tracking-widest uppercase">
              <Package className="w-4 h-4 mr-2" style={{ color: themeColor }} />
              ACTIVE SLOTS ({inventory.length})
            </h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {inventory.map(item => (
                <div key={item.id} className={cn(
                  "bg-[#141414] border rounded-sm p-3 flex justify-between items-center gap-3 transition-all relative overflow-hidden group"
                )} style={item.equipped ? { borderColor: `${themeColor}50`, backgroundColor: `${themeColor}05` } : { borderColor: '#262626' }}>
                  {item.equipped && <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: themeColor }}></div>}
                  
                  <div className="min-w-0 pl-1.5">
                    <h4 className="font-mono text-[11px] text-white truncate uppercase tracking-wider font-bold">
                      {item.name}
                    </h4>
                    <div className="flex gap-1.5 mt-1">
                      {Object.entries(item.attributeBoosts).map(([attr, val]) => (
                        <span key={attr} className="text-[8px] font-mono text-[#A3A3A3] bg-[#0A0A0A] px-1 rounded-sm border border-[#202020] font-bold">
                          +{val as number} {attr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteInventoryItem(item.id!)}
                      className="text-[#A3A3A3] hover:text-red-500 p-1 rounded-sm transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      title="Decompile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleEquip(item.id!, item.equipped)}
                      className={cn(
                        "px-2.5 py-1 rounded-sm font-mono text-[9px] font-bold tracking-widest uppercase transition-colors border",
                        !item.equipped && "bg-[#262626] text-white border-transparent hover:bg-[#333]"
                      )}
                      style={item.equipped ? { color: themeColor, borderColor: `${themeColor}50`, backgroundColor: `${themeColor}20` } : {}}
                    >
                      {item.equipped ? 'EQUIPPED' : 'EQUIP'}
                    </button>
                  </div>
                </div>
              ))}
              {inventory.length === 0 && (
                <div className="text-center py-10 border border-dashed border-[#262626] rounded-sm text-[#A3A3A3] font-mono text-[10px] tracking-widest uppercase">
                  ACTIVE INVENTORY SLOTS VACANT.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
