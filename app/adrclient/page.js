"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RotateCcw, TrendingUp, ShoppingCart, 
  Check, CloudUpload, Info, Zap, Database, BarChart4,
  FileCode, Calculator
} from 'lucide-react';

/**
 * ADR CLIENT - VERSION MASTER FINALE V59
 * VISUEL : Reproduction exacte de la capture 08.40.08
 * LOGIQUE : COEFF 1.5931 | SEUIL 79,65 €
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
  const [frequency, setFrequency] = useState('mensuel'); 
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ pts: 0, euro: 0, totalSV: 0 });
  const [syncStatus, setSyncStatus] = useState(null);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => { 
    setMounted(true); 
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const client = createClient(S_URL, S_KEY);
        setSupabase(client);
      } catch (e) {
        console.warn("Mode local activé.");
      }
    };
    initSupabase();
  }, []);
 
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
        if (frequency === 'bimestriel') {
          rate = 0.10; 
          if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
        } else {
          rate = monthNum >= 13 ? 0.30 : 0.20;
          if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
        }
      }

      balance += earned;
      if (balance > MAX_PTS_A) balance = MAX_PTS_A;
      if (balance < 0) balance = 0;

      newResults.push({
        monthNum, valOrder, sv, earned, rate, balance, availableBefore,
        showRow: i <= lastIdxWithData || (i === 0 && inputsOrder[0] === '')
      });
    }
    setResults(newResults);
    setTotals({ pts: balance, euro: balance * 1, totalSV: totalSVAccumulated }); 
  }, [inputsOrder, inputsUsed, frequency, mounted]);

  const handleReset = () => {
    setInputsOrder(Array(MOIS).fill(''));
    setInputsUsed(Array(MOIS).fill(''));
    setFrequency('mensuel');
  };

  const saveToSupabase = async () => {
    if (!supabase) return;
    setSyncStatus('loading');
    try {
      await supabase.from('simulations').insert([{
        type: "ADR_CLIENT_V59",
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
        
        {/* TOP BAR ACTION */}
        <div className="flex justify-between items-center mb-2 px-2">
            <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all active:scale-95 uppercase italic">
                <ArrowLeft size={16} /> RETOUR PORTAIL
            </button>
            <button onClick={saveToSupabase} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black transition-all ${syncStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-100'}`}>
                <CloudUpload size={16} /> {syncStatus === 'loading' ? 'SAUVEGARDE...' : 'SYNC SUPABASE'}
            </button>
        </div>

        {/* 1. BANNIÈRE NOIRE (SIMULATEUR) */}
        <div className="w-full bg-[#0f172a] text-white py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-sm border-b-4 border-slate-800">
           <span className="text-[10px] sm:text-xs tracking-[0.15em] font-black italic uppercase leading-none">
             🚀 SIMULATEUR DE FIDÉLITÉ ADR – EXCLUSIVEMENT CLIENT AU DÉTAIL
           </span>
        </div>

        {/* 2. HEADER BLANC (TITRE ET BADGES) */}
        <div className="bg-white rounded-[3.5rem] p-10 sm:p-16 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-center text-center">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter italic mb-4 text-[#0f172a] uppercase leading-none">VOTRE PLAN CADEAUX ADR</h1>
            <p className="text-slate-400 text-sm sm:text-base font-black normal-case italic mb-10">
                Commande minimum requise : <span className="text-blue-600 font-black tracking-tight">{SEUIL_EURO} €</span> (soit 50 points SV)
            </p>

            <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 text-blue-600">
                    <span className="text-[9px] font-black tracking-widest uppercase italic">🎯 SEUIL : {SEUIL_EURO} € (50 SV) MIN.</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-slate-400">
                    <span className="text-[9px] font-black tracking-widest uppercase italic">🚀 PLAFOND : 75 PTS / MOIS</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 text-slate-400">
                    <span className="text-[9px] font-black tracking-widest uppercase italic">💰 MAX : 900 PTS / AN</span>
                </div>
            </div>
        </div>

        {/* 3. CONTRÔLES (BOUTONS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-8 bg-white p-2.5 rounded-[2.5rem] shadow-sm flex flex-col sm:flex-row gap-3 border border-slate-50">
                <button 
                  onClick={() => setFrequency('mensuel')}
                  className={`flex-1 py-5 rounded-[1.8rem] text-[10px] font-black italic transition-all uppercase ${frequency === 'mensuel' ? 'bg-[#2563eb] text-white shadow-xl shadow-blue-100' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`}
                >
                    MENSUEL (20-30%)
                </button>
                <button 
                  onClick={() => setFrequency('bimestriel')}
                  className={`flex-1 py-5 rounded-[1.8rem] text-[10px] font-black italic transition-all uppercase ${frequency === 'bimestriel' ? 'bg-[#2563eb] text-white shadow-xl shadow-blue-100' : 'text-slate-400 bg-transparent hover:bg-slate-50'}`}
                >
                    BIMESTRIEL (10%)
                </button>
            </div>
            <div className="lg:col-span-4 h-full">
                <button 
                  onClick={handleReset}
                  className="w-full h-full py-5 lg:py-0 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm text-slate-400 flex items-center justify-center gap-3 text-[10px] font-black italic uppercase hover:text-red-500 transition-all"
                >
                    <RotateCcw size={16} /> RÉINITIALISER
                </button>
            </div>
        </div>

        {/* 4. COMPTEURS (LES DEUX BLOCS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black uppercase italic">
            {/* BLOC NOIR */}
            <div className="bg-[#0f172a] text-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[220px] border-b-[8px] border-blue-600">
                <span className="text-[9px] opacity-40 tracking-[0.3em] font-black mb-4 uppercase italic">SOLDE ACTUEL CAGNOTTE</span>
                <div className="text-7xl font-black italic tracking-tighter leading-none flex items-baseline gap-2">
                    {totals.pts.toFixed(2)} <span className="text-xl opacity-20 uppercase font-black">PTS</span>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5" />
            </div>
            {/* BLOC BLANC */}
            <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-50 relative overflow-hidden flex flex-col justify-center min-h-[220px]">
                <span className="text-[9px] text-slate-300 tracking-[0.3em] font-black mb-4 uppercase italic leading-none">VALEUR SHOPPING RESTANTE</span>
                <div className="text-7xl font-black text-emerald-500 italic tracking-tighter leading-none">{totals.euro.toFixed(2)} €</div>
                <div className="mt-6 flex items-center gap-3">
                    <div className="bg-slate-50 text-slate-300 px-5 py-2 rounded-full text-[8px] font-black tracking-widest uppercase italic">EQUIVALENT : {totals.pts.toFixed(0)} PTS</div>
                </div>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03]">
                  <BarChart4 size={100} className="text-emerald-500" />
                </div>
            </div>
        </div>

        {/* 5. TABLEAU DE FLUX */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-50 overflow-hidden font-black uppercase italic mt-4">
            <header className="px-10 py-8 flex justify-between items-center bg-white border-b border-slate-50">
                <h3 className="text-[10px] text-slate-400 tracking-[0.3em] font-black uppercase italic leading-none">FLUX DE VOS POINTS PRODUITS</h3>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-blue-100 text-blue-600 rounded-xl text-[8px] font-black tracking-widest italic hover:bg-blue-50 transition-all">
                   <FileCode size={14} /> EXTRAIRE CODE HTML
                </button>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full font-black uppercase italic leading-none text-left tabular-nums">
                    <thead className="bg-[#fcfdfe] text-slate-300 text-[8px] tracking-[0.3em] font-black uppercase italic">
                        <tr>
                            <th className="p-10 text-center uppercase">MOIS</th>
                            <th className="p-10 uppercase">MA COMMANDE (€)</th>
                            <th className="p-10 text-center uppercase text-blue-600 bg-blue-50/20">POINTS GAGNÉS (+)</th>
                            <th className="p-10 text-center uppercase text-orange-400 bg-orange-50/10">DÉPENSES (-)</th>
                            <th className="p-10 text-right uppercase bg-slate-50/30">SOLDE RESTANT (=)</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-900 italic font-black">
                        {results.map((row, i) => (
                          <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50 transition-all`}>
                            <td className="p-10 font-black text-slate-200 text-4xl text-center italic">{row.monthNum}</td>
                            <td className="p-10">
                                <div className="relative group">
                                    <input 
                                      type="text" 
                                      value={inputsOrder[i]} 
                                      onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value; setInputsOrder(n); }} 
                                      placeholder="0.00" 
                                      className="w-40 bg-slate-50 p-6 rounded-2xl font-black text-slate-800 outline-none text-xl text-left border border-transparent focus:border-blue-100 uppercase italic font-black transition-all" 
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 font-black text-sm uppercase">€</span>
                                </div>
                            </td>
                            <td className="p-10 text-center text-blue-600 text-3xl font-black italic bg-blue-50/5">
                                {row.earned > 0 ? `+${row.earned.toFixed(2)}` : '—'}
                            </td>
                            <td className="p-10 text-center">
                                <div className="relative inline-block">
                                    <input 
                                      type="text" 
                                      value={inputsUsed[i]} 
                                      onChange={(e) => { const n = [...inputsUsed]; n[i] = e.target.value; setInputsUsed(n); }} 
                                      placeholder="0" 
                                      className="w-24 p-5 bg-slate-50 rounded-2xl border border-slate-100 font-black text-center text-orange-400 outline-none focus:border-orange-200 uppercase font-black italic text-xl transition-all" 
                                    />
                                </div>
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