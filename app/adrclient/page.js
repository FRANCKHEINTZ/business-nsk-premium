"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RotateCcw, TrendingUp, ShoppingCart, 
  Check, CloudUpload, Info, Zap, Database, BarChart3,
  FileCode, Calculator, Lock, LogIn, LayoutGrid
} from 'lucide-react';

/**
 * ADR CLIENT - VERSION V119 (NAVIGATION APPS)
 * - FIX : Bouton "RETOUR MES APPS" pour éviter de repasser par le login.
 * - FIX : Synchronisation session Master améliorée.
 * - FIX : Icônes Lucide sécurisées pour éviter le crash de l'appli.
 */

const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const COEFF = 1.5931; 
const MIN_SV = 50;
const MAX_PTS_M = 75;
const MAX_PTS_A = 900;
const MOIS = 15;
const SEUIL_EURO = "79,65";

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [frequency, setFrequency] = useState('mensuel'); 
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ pts: 0, euro: 0, totalSV: 0 });
  const [syncStatus, setSyncStatus] = useState(null);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => { 
    setMounted(true); 
    
    // --- VÉRIFICATION DE LA SESSION NSK ---
    const savedEmail = localStorage.getItem('nsk_email');
    if (savedEmail) {
        setIsAuthenticated(true);
        setUserEmail(savedEmail);
    } else {
        // Déblocage automatique pour vos tests sur mobile/iMac
        setIsAuthenticated(true);
        setUserEmail("analyse-technique@nsk.com");
    }

    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        if (createClient) setSupabase(createClient(S_URL, S_KEY));
      } catch (e) { console.warn("Supabase load..."); }
    };
    initSupabase();
  }, []);

  const handleGoDashboard = () => {
    if (typeof window !== 'undefined') {
      // Redirige vers la racine où se trouve le tableau de bord
      window.location.replace(window.location.origin);
    }
  };
 
  useEffect(() => {
    if (!mounted) return;
    let balance = 0;
    let totalSVAccumulated = 0;
    let lastIdxWithData = -1;
    const newResults = [];
    inputsOrder.forEach((v, i) => { if (parseFloat(v) > 0) lastIdxWithData = i; });

    for (let i = 0; i < MOIS; i++) {
      const monthNum = i + 1;
      const valOrder = parseFloat(inputsOrder[i]) || 0;
      const sv = valOrder / COEFF;
      totalSVAccumulated += sv;
      const availableBefore = balance;
      let used = parseFloat(inputsUsed[i]) || 0;
      if (used > availableBefore) used = availableBefore;
      balance -= used;
      let earned = 0;
      let rate = 0;
      if (valOrder > 0) {
        rate = (frequency === 'bimestriel') ? 0.10 : (monthNum >= 13 ? 0.30 : 0.20);
        if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
      }
      balance += earned;
      if (balance > MAX_PTS_A) balance = MAX_PTS_A;
      newResults.push({ monthNum, valOrder, sv, earned, rate, balance, availableBefore, showRow: i <= lastIdxWithData || (i === 0 && inputsOrder[0] === '') });
    }
    setResults(newResults);
    setTotals({ pts: balance, euro: balance * 1.5931, totalSV: totalSVAccumulated }); 
  }, [inputsOrder, inputsUsed, frequency, mounted]);

  const saveToSupabase = async () => {
    if (!supabase || !userEmail) return;
    setSyncStatus('loading');
    try {
      await supabase.from('simulations').insert([{
        Email: userEmail,
        type_outil: "ADR CLIENT V119",
        rythme: frequency,
        cagnotte: totals.pts,
        timestamp: new Date().toISOString()
      }]);
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-8 text-[#0f172a] bg-[#f8fafc] min-h-screen italic font-black uppercase font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP BAR ACTION - FIX: RETOUR MES APPS ✅ */}
        <div className="flex justify-between items-center mb-2 px-2">
            <button onClick={handleGoDashboard} className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-all active:scale-95 uppercase italic group">
                <LayoutGrid size={18} className="group-hover:rotate-90 transition-transform duration-500" /> RETOUR MES APPS
            </button>
            <button onClick={saveToSupabase} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${syncStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
                <CloudUpload size={16} /> {syncStatus === 'loading' ? 'SYNC...' : 'SAUVEGARDER'}
            </button>
        </div>

        {/* 1. BANNIÈRE NOIRE */}
        <div className="w-full bg-[#0f172a] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border-b-4 border-slate-800 text-center">
           <span className="text-[10px] sm:text-xs tracking-widest font-black italic uppercase leading-none">
             🚀 SIMULATEUR DE FIDÉLITÉ ADR – EXCLUSIVEMENT CLIENT AU DÉTAIL
           </span>
        </div>

        {/* 2. HEADER BLANC */}
        <div className="bg-white rounded-[3.5rem] p-10 sm:p-16 shadow-sm border border-slate-50 flex flex-col items-center text-center">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic mb-4 text-[#0f172a] uppercase leading-none">VOTRE PLAN CADEAUX ADR</h1>
            <p className="text-slate-400 text-sm font-black normal-case italic mb-10">Commande minimum requise : <span className="text-blue-600">{SEUIL_EURO} €</span></p>

            <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 text-blue-600 text-[9px] font-black italic uppercase">🎯 SEUIL : {SEUIL_EURO} € MIN.</div>
                <div className="bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-slate-400 text-[9px] font-black italic uppercase">🚀 PLAFOND : 75 PTS / MOIS</div>
            </div>
        </div>

        {/* 3. CONTRÔLES (RYTHME) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 bg-white p-2.5 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row gap-3 border border-slate-50">
                <button onClick={() => setFrequency('mensuel')} className={`flex-1 py-5 rounded-[1.8rem] text-[10px] font-black italic uppercase transition-all ${frequency === 'mensuel' ? 'bg-[#2563eb] text-white shadow-xl' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`}>MENSUEL (20-30%)</button>
                <button onClick={() => setFrequency('bimestriel')} className={`flex-1 py-5 rounded-[1.8rem] text-[10px] font-black italic uppercase transition-all ${frequency === 'bimestriel' ? 'bg-[#2563eb] text-white shadow-xl' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`}>BIMESTRIEL (10%)</button>
            </div>
            <div className="lg:col-span-4 h-full">
                <button onClick={() => {setInputsOrder(Array(MOIS).fill('')); setInputsUsed(Array(MOIS).fill(''))}} className="w-full h-full py-5 lg:py-0 bg-white border border-slate-100 rounded-[2.5rem] text-slate-400 flex items-center justify-center gap-3 text-[10px] font-black italic uppercase hover:text-red-500 transition-all">
                    <RotateCcw size={16} /> RÉINITIALISER
                </button>
            </div>
        </div>

        {/* 4. COMPTEURS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black uppercase italic">
            <div className="bg-[#0f172a] text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px] border-b-[8px] border-blue-600">
                <span className="text-[9px] opacity-40 tracking-[0.3em] font-black mb-4 italic leading-none">SOLDE ACTUEL CAGNOTTE</span>
                <div className="text-7xl font-black italic tracking-tighter leading-none flex items-baseline gap-2">
                    {totals.pts.toFixed(2)} <span className="text-xl opacity-20 NOT-ITALIC font-sans font-black uppercase">PTS</span>
                </div>
            </div>
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-50 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                <span className="text-[9px] text-slate-300 tracking-[0.3em] font-black mb-4 italic leading-none uppercase">VALEUR SHOPPING RESTANTE</span>
                <div className="text-7xl font-black text-emerald-500 italic tracking-tighter leading-none">{totals.euro.toFixed(2)} €</div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03]"><BarChart3 size={100} className="text-emerald-500" /></div>
            </div>
        </div>

        {/* 5. TABLEAU DE FLUX */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-50 overflow-hidden font-black uppercase italic mt-4">
            <header className="px-10 py-8 flex justify-between items-center bg-white border-b border-slate-50">
                <h3 className="text-[10px] text-slate-400 tracking-[0.3em] font-black uppercase italic leading-none">FLUX DE VOS POINTS PRODUITS</h3>
                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-100 text-blue-600 rounded-xl text-[8px] font-black tracking-widest italic uppercase">
                   <FileCode size={14} /> MODULE ANALYSE
                </div>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full font-black uppercase italic leading-none text-left tabular-nums">
                    <thead className="bg-[#fcfdfe] text-slate-300 text-[8px] tracking-[0.3em] font-black uppercase italic">
                        <tr>
                            <th className="p-10 text-center uppercase">MOIS</th>
                            <th className="p-10 uppercase">COMMANDE (€)</th>
                            <th className="p-10 text-center uppercase text-blue-600 bg-blue-50/20">GAINS (+)</th>
                            <th className="p-10 text-right uppercase bg-slate-50/30">SOLDE (=)</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-900 italic font-black">
                        {results.map((row, i) => (
                          <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50 transition-all`}>
                            <td className="p-10 font-black text-slate-200 text-4xl text-center italic">{row.monthNum}</td>
                            <td className="p-10 font-black">
                                <div className="relative group">
                                    <input type="text" value={inputsOrder[i]} onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value; setInputsOrder(n); }} placeholder="0.00" className="w-40 bg-slate-50 p-6 rounded-2xl font-black text-slate-800 outline-none text-xl italic" />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 font-black">€</span>
                                </div>
                            </td>
                            <td className="p-10 text-center text-blue-600 text-3xl font-black italic bg-blue-50/5">
                                {row.earned > 0 ? `+${row.earned.toFixed(2)}` : '—'}
                            </td>
                            <td className="p-10 text-right font-black text-3xl tracking-tighter text-slate-950 italic bg-slate-50/10">
                                {row.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="h-40" />
      </div>
    </div>
  ); 
}