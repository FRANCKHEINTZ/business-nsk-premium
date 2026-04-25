"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, ShoppingBag, Target, Calculator, TrendingUp, Zap, 
  ShoppingCart, ArrowRight, Sparkles, RefreshCcw, Info, Lock, Unlock,
  ChevronRight, Wallet, Coins, Rocket
} from 'lucide-react';

// --- CONFIGURATION SUPABASE ---
const SUPABASE_URL = 'https://rbmzmduojlxdzfgmolly.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E';

// --- COMPOSANT D'INPUT HYBRIDE (Clavier + Curseur) ---
const InputControl = ({ label, value, onChange, min, max, step = 1, suffix = "", color = "blue", disabled = false, isLarge = false }) => {
  const colorMap = {
    blue: { accent: "accent-blue-600", text: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100" },
    orange: { accent: "accent-orange-500", text: "text-orange-600", bg: "bg-orange-50/50", border: "border-orange-100" },
    indigo: { accent: "accent-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50/50", border: "border-indigo-100" },
    emerald: { accent: "accent-emerald-600", text: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100" }
  };

  const theme = colorMap[color];

  return (
    <div className={`space-y-4 mb-8 transition-all duration-300 ${disabled ? 'opacity-30 grayscale pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center">
        <label className="text-[12px] font-black text-slate-500 uppercase tracking-[0.1em] italic leading-none">{label}</label>
        <div className={`flex items-center gap-3 ${theme.bg} ${isLarge ? 'px-6 py-3' : 'px-4 py-2'} rounded-2xl border ${theme.border} shadow-sm`}>
          <input 
            type="number" 
            value={value || ""} 
            placeholder="0"
            onChange={(e) => onChange(Number(e.target.value))}
            className={`bg-transparent text-right font-black outline-none italic ${theme.text} ${isLarge ? 'w-40 text-3xl' : 'w-24 text-xl'}`}
          />
          <span className={`font-black text-slate-400 italic ${isLarge ? 'text-sm' : 'text-[11px]'}`}>{suffix}</span>
        </div>
      </div>
      <div className="px-1">
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value || 0} 
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer transition-all ${theme.accent} hover:scale-[1.01]`}
        />
      </div>
    </div>
  );
};

export default function SimulateurObjectif() {
  // --- États Supabase & Auth ---
  const [mounted, setMounted] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // --- Constantes Fixes ---
  const VALEUR_PIVOT_5PCT = 0.0457818; 

  // --- États du Simulateur ---
  const [targetIncome, setTargetIncome] = useState("");
  const [basketSv, setBasketSv] = useState(0);
  const [l1Clients, setL1Clients] = useState(0);
  const [l2Clients, setL2Clients] = useState(0);
  const [buildGsv, setBuildGsv] = useState(0); 
  const [l1Partners, setL1Partners] = useState(0);
  const [g1Volume, setG1Volume] = useState(0);
  const [depthVolume, setDepthVolume] = useState(0);

  // --- Initialisation ---
  useEffect(() => {
    setMounted(true);
    const email = localStorage.getItem('nsk_email');
    if (email) setUserEmail(email);

    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const client = createClient(SUPABASE_URL, SUPABASE_KEY);
        setSupabase(client);
        
        // Log de l'entrée dans l'application si l'utilisateur est identifié
        if (email && client) {
          await client.from('leads').update({ 
            last_app: 'Simulateur Objectif',
            updated_at: new Date().toISOString() 
          }).eq('Email', email);
        }
      } catch (e) { console.warn("Supabase Sync Offline"); }
    };
    initSupabase();
  }, []);

  // --- Logique de Calcul ---
  const getBuildingRate = (gsv) => {
    if (gsv >= 10000) return 0.25;
    if (gsv >= 5000) return 0.20;
    if (gsv >= 3000) return 0.15;
    if (gsv >= 2000) return 0.10;
    return 0;
  };

  const getRankInfo = (lts) => {
    const config = [
      { name: "Brand Representative", color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200" },
      { name: "Gold", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
      { name: "Lapis", color: "text-blue-800", bg: "bg-blue-50", border: "border-blue-200" },
      { name: "Ruby", color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" },
      { name: "Emerald", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
      { name: "Diamond", color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
      { name: "Blue Diamond", color: "text-sky-500", bg: "bg-sky-50", border: "border-sky-200" }
    ];
    return config[Math.min(lts, 6)];
  };

  const results = useMemo(() => {
    const l1Sv = l1Clients * (basketSv || 75);
    const l2Sv = l2Clients * (basketSv || 75);
    const totalGsv = Math.max(l1Sv + l2Sv, buildGsv);

    const sellL1 = l1Sv * VALEUR_PIVOT_5PCT;
    const sellL2 = l1Sv >= 500 ? l2Sv * VALEUR_PIVOT_5PCT : 0;

    const buildRate = getBuildingRate(totalGsv);
    const buildBonus = totalGsv * (VALEUR_PIVOT_5PCT * (buildRate / 0.05));

    const isLeadQualified = totalGsv >= 3000;
    const leadG1Bonus = isLeadQualified ? g1Volume * (VALEUR_PIVOT_5PCT * (0.10 / 0.05)) : 0;
    const leadDepthBonus = isLeadQualified ? depthVolume * VALEUR_PIVOT_5PCT : 0;

    const grandTotal = sellL1 + sellL2 + buildBonus + leadG1Bonus + leadDepthBonus;

    return {
      totalGsv, sellL1, sellL2, buildBonus, leadG1Bonus, leadDepthBonus,
      grandTotal, buildRate: Math.round(buildRate * 100), isLeadQualified
    };
  }, [basketSv, l1Clients, l2Clients, buildGsv, g1Volume, depthVolume]);

  const autoPlanify = () => {
    const goal = Number(targetIncome) || 0;
    if (goal === 0) return;
    setBasketSv(75);
    if (goal <= 350) {
      setL1Clients(Math.ceil(goal / 18)); setL2Clients(Math.ceil(goal / 35));
      setBuildGsv(2000); setL1Partners(0); setG1Volume(0); setDepthVolume(0);
    } else if (goal <= 800) {
      setL1Clients(12); setL2Clients(15); setBuildGsv(3000); setL1Partners(1);
      setG1Volume(2000); setDepthVolume(0);
    } else if (goal <= 1500) {
      setL1Clients(18); setL2Clients(25); setBuildGsv(5000); setL1Partners(3);
      setG1Volume(4000); setDepthVolume(2000);
    } else {
      setL1Clients(25); setL2Clients(40); setBuildGsv(10000); setL1Partners(6);
      setG1Volume(12000); setDepthVolume(25000);
    }
  };

  const resetAll = () => {
    setTargetIncome(""); setL1Clients(0); setL2Clients(0); setBuildGsv(0);
    setL1Partners(0); setG1Volume(0); setDepthVolume(0); setBasketSv(0);
  };

  const progress = Number(targetIncome) > 0 ? Math.min(100, (results.grandTotal / Number(targetIncome)) * 100) : 0;
  const currentRank = getRankInfo(l1Partners);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans text-slate-800 italic selection:bg-blue-100 antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between mb-16">
          <div className="flex-1 space-y-8 w-full">
            <div className="flex justify-between items-center">
              <div className="border-l-[10px] border-blue-600 pl-8">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ArrowRight size={14} className="rotate-180" /> Retour au Portail
                </button>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
                  Simulateur <br/> d'Objectif
                </h1>
                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic leading-none">Intelligence Performance 2026</p>
              </div>
              
              <button 
                onClick={resetAll}
                className="flex items-center gap-3 px-6 py-4 bg-red-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-200 hover:bg-red-700 group"
              >
                <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700"/> Reset
              </button>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 flex flex-wrap items-center gap-10">
              <div className="flex-1 min-w-[280px]">
                <label className="text-[12px] font-black uppercase text-slate-400 mb-4 block italic tracking-widest leading-none">Quel est votre but financier mensuel ?</label>
                <div className="flex items-baseline gap-6 border-b-4 border-slate-50 pb-4 focus-within:border-blue-600 transition-all">
                  <input 
                    type="number" value={targetIncome} placeholder="0"
                    onChange={(e) => setTargetIncome(e.target.value)}
                    className="text-7xl font-black bg-transparent outline-none w-full italic placeholder:text-slate-100 tabular-nums"
                  />
                  <span className="text-4xl font-black text-slate-200 italic">€</span>
                </div>
              </div>
              <button 
                onClick={autoPlanify}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-8 rounded-[2rem] font-black uppercase text-[13px] tracking-[0.2em] shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-4 group"
              >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform"/> Décliner le plan
              </button>
            </div>
          </div>

          {/* ROUE DE PROGRESSION MAJESTUEUSE */}
          <div className="bg-white p-12 rounded-[5rem] shadow-2xl shadow-slate-200/80 border border-slate-100 relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-[5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <svg height="320" width="320" className="transform -rotate-90">
              <circle stroke="#F1F5F9" fill="transparent" strokeWidth="24" r="135" cx="160" cy="160" />
              <circle
                stroke={progress >= 100 ? "#10b981" : "#2563EB"}
                fill="transparent" strokeWidth="24"
                strokeDasharray={`${2 * Math.PI * 135}`}
                style={{ strokeDashoffset: (2 * Math.PI * 135) - (progress / 100) * (2 * Math.PI * 135), transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                strokeLinecap="round" r="135" cx="160" cy="160"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center rotate-0">
               <div className="p-3 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                <Wallet size={20} className="text-blue-500" />
               </div>
               <span className="text-[14px] font-black text-slate-300 uppercase italic tracking-[0.3em] mb-1">Gain Estimé</span>
               <span className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{results.grandTotal.toFixed(0)}€</span>
               <span className={`text-[15px] font-black mt-4 px-6 py-1.5 rounded-full border-2 ${progress >= 100 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                 {progress.toFixed(0)}% du but
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-40">
          
          {/* COLONNE GAUCHE - PARAMÈTRES */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SELL CARD */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
               <div className="flex items-center gap-5 mb-12">
                 <div className="p-4 bg-orange-50 rounded-3xl text-orange-500 shadow-inner"><ShoppingCart size={28}/></div>
                 <div>
                   <h3 className="font-black uppercase text-xl tracking-tight text-slate-800 leading-none">Sell</h3>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Ventes directes & Clientèle</p>
                 </div>
               </div>
               
               <InputControl label="Panier Moyen Client" value={basketSv} onChange={setBasketSv} min={0} max={300} suffix="SV" color="orange" isLarge={true} />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 pt-6 border-t border-slate-50">
                 <InputControl label="Clients Ligne 1" value={l1Clients} onChange={setL1Clients} min={0} max={50} suffix="Personnes" color="orange" />
                 <InputControl label="Clients Ligne 2" value={l2Clients} onChange={setL2Clients} min={0} max={100} suffix="Personnes" color="orange" />
               </div>
            </div>

            {/* BUILD CARD */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
               <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-50 rounded-3xl text-indigo-500 shadow-inner"><Zap size={28}/></div>
                    <div>
                      <h3 className="font-black uppercase text-xl tracking-tight text-slate-800 leading-none">Build</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Volume Global de Groupe</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-3xl font-black text-slate-800 tabular-nums leading-none mb-2">{results.totalGsv.toFixed(0)} SV</span>
                    <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-xl italic border border-indigo-100 shadow-sm">Taux : {results.buildRate}%</span>
                  </div>
               </div>
               <InputControl label="Volume Total du Groupe" value={buildGsv} onChange={setBuildGsv} min={0} max={40000} step={250} suffix="SV" color="indigo" isLarge={true} />
            </div>

            {/* LEAD CARD */}
            <div className={`p-10 rounded-[3.5rem] shadow-xl border-2 transition-all duration-1000 relative overflow-hidden ${results.isLeadQualified ? `${currentRank.bg} ${currentRank.border}` : 'bg-slate-100 border-slate-200 grayscale opacity-80'}`}>
               <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-50"></div>
               <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-3xl shadow-inner ${results.isLeadQualified ? 'bg-white text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Users size={28}/>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`font-black uppercase text-xl tracking-tight leading-none ${results.isLeadQualified ? 'text-slate-800' : 'text-slate-50'}`}>Lead</h3>
                        {!results.isLeadQualified && (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/80 rounded-2xl border border-amber-200 shadow-sm animate-pulse backdrop-blur-sm">
                                <Lock size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black text-amber-700 uppercase italic">3000 SV Build Requis</span>
                            </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">Structure Organisationnelle</p>
                    </div>
                  </div>
                  <div className={`px-8 py-3 rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl transition-all ${results.isLeadQualified ? `bg-white ${currentRank.color}` : 'bg-slate-200 text-slate-400'}`}>
                    {currentRank.name}
                  </div>
               </div>

               <InputControl 
                 label="Nombre de Lead Teams" 
                 value={l1Partners} 
                 onChange={setL1Partners} 
                 min={0} 
                 max={6} 
                 suffix="LT Maximale" 
                 color={!results.isLeadQualified ? "blue" : l1Partners === 0 ? "blue" : "emerald"} 
               />
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 mt-12 pt-10 border-t border-slate-200/50">
                  <InputControl 
                    label="Volume G1 (10%)" 
                    value={g1Volume} 
                    onChange={setG1Volume} 
                    min={0} max={100000} step={1000} 
                    suffix="SV" 
                    color="emerald" 
                    disabled={!results.isLeadQualified}
                    isLarge={true}
                  />
                  <InputControl 
                    label="Volume Profondeur (5%)" 
                    value={depthVolume} 
                    onChange={setDepthVolume} 
                    min={0} max={500000} step={5000} 
                    suffix="SV" 
                    color="emerald" 
                    disabled={!results.isLeadQualified}
                    isLarge={true}
                  />
               </div>
            </div>
          </div>

          {/* COLONNE DROITE - SYNTHÈSE STICKY */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[4rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 sticky top-12 space-y-12 overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-[60px] -z-10 group-hover:bg-blue-100 transition-colors"></div>
               
               <div className="flex items-center gap-4">
                 <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                 <h3 className="font-black uppercase text-[13px] tracking-[0.3em] text-slate-400 italic">Synthèse</h3>
               </div>

               <div className="space-y-8">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-6 group/item">
                     <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                       <span className="text-sm font-black text-slate-500 uppercase italic tracking-widest">Sell</span>
                     </div>
                     <p className="text-3xl font-black text-orange-500 tabular-nums">{(results.sellL1 + results.sellL2).toFixed(2)}€</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-6 group/item">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-sm font-black text-slate-500 uppercase italic tracking-widest">Build ({results.buildRate}%)</span>
                     </div>
                     <p className="text-3xl font-black text-indigo-600 tabular-nums">{results.buildBonus.toFixed(2)}€</p>
                  </div>
                  
                  <div className={`space-y-8 ${!results.isLeadQualified ? 'opacity-30' : ''}`}>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-6 group/item">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-black text-slate-500 uppercase italic tracking-widest">Lead G1 (10%)</span>
                       </div>
                       <p className={`text-2xl font-black tabular-nums ${results.isLeadQualified ? 'text-emerald-600' : 'text-slate-300'}`}>
                          {results.leadG1Bonus.toFixed(2)}€
                       </p>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-6 group/item">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                          <span className="text-sm font-black text-slate-500 uppercase italic tracking-widest">Lead Prof. (5%)</span>
                       </div>
                       <p className={`text-2xl font-black tabular-nums ${results.isLeadQualified ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {results.leadDepthBonus.toFixed(2)}€
                       </p>
                    </div>
                  </div>
               </div>

               <div className="pt-6">
                  <div className={`p-8 rounded-[3rem] border-2 transition-all duration-500 ${progress >= 100 ? 'bg-emerald-50 border-emerald-100 shadow-emerald-100/50 shadow-xl' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                     <div className="flex items-center gap-3 mb-4 text-slate-400">
                       <div className={`p-2 rounded-xl bg-white shadow-sm ${progress >= 100 ? 'text-emerald-500' : 'text-slate-300'}`}>
                        <TrendingUp size={20}/>
                       </div>
                       <span className="text-[12px] font-black uppercase italic tracking-widest">Analyse Stratégique</span>
                     </div>
                     <p className="text-[13px] font-bold text-slate-600 leading-relaxed italic">
                        {!results.isLeadQualified && results.totalGsv > 0 && (l1Partners > 0 || g1Volume > 0)
                          ? `Il manque ${(3000 - results.totalGsv).toFixed(0)} SV dans votre BUILD pour déverrouiller vos commissions LEAD.`
                          : progress >= 100 
                            ? "Structure validée. Votre objectif de revenu est atteint avec brio !" 
                            : targetIncome > 0 
                                ? `Encore un petit effort : il manque environ ${(targetIncome - results.grandTotal).toFixed(0)}€ pour atteindre votre but.`
                                : "Définissez un objectif pour commencer votre simulation."}
                     </p>
                  </div>
               </div>

               <div className="text-center pt-4 opacity-30 grayscale pointer-events-none group-hover:opacity-60 transition-opacity">
                 <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins size={12}/>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Commission 5% = {VALEUR_PIVOT_5PCT}€</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}