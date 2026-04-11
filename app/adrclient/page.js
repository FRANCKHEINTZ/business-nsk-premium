"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, TrendingUp, ShoppingCart } from 'lucide-react';

// --- CONFIGURATION TECHNIQUE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";
const COEFF = 1.5931; 
const MIN_SV = 50;
const MIN_EURO = 79.65;
const MAX_PTS_M = 75;
const MAX_PTS_A = 900;
const MOIS = 15;

export default function ADRClientPage() {
  const [authorized, setAuthorized] = useState(false);
  const [frequency, setFrequency] = useState('mensuel');
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ pts: 0, euro: 0 });

  // --- SÉCURITÉ & REDIRECTION ---
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const supabase = createClient(S_URL, S_KEY);
        const { data: { session } } = await supabase.auth.getSession();
        const isDev = window.location.hostname.includes('localhost') || 
                      window.location.hostname.includes('goog') ||
                      window.location.protocol === 'blob:';

        if (!session && !isDev) {
          window.location.href = window.location.origin;
        } else {
          setAuthorized(true);
        }
      } catch (e) { console.warn("Security check"); }
    };
    checkAuth();
  }, []);

  // --- CALCULS (LOGIQUE IDENTIQUE AU HTML) ---
  useEffect(() => {
    if (!authorized) return;
    let balance = 0;
    let lastIdxWithData = -1;
    const newResults = [];

    inputsOrder.forEach((v, i) => { if (parseFloat(v) > 0) lastIdxWithData = i; });

    for (let i = 0; i < MOIS; i++) {
      const monthNum = i + 1;
      const isOff = frequency === 'bimestriel' && monthNum % 2 === 0;
      const valOrder = parseFloat(inputsOrder[i]) || 0;
      const sv = valOrder / COEFF;
      
      const availableBefore = balance;
      let used = parseFloat(inputsUsed[i]) || 0;
      if (used > availableBefore) used = availableBefore;
      balance -= used;

      let earned = 0;
      let rate = 0;

      if (!isOff && valOrder > 0) {
        if (frequency === 'bimestriel') {
          rate = 0.1;
          if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
        } else if (sv >= MIN_SV) {
          rate = monthNum >= 13 ? 0.3 : 0.2;
          earned = Math.min(sv * rate, MAX_PTS_M);
        }
      }

      balance += earned;
      if (balance > MAX_PTS_A) balance = MAX_PTS_A;
      if (balance < 0) balance = 0;

      newResults.push({
        monthNum, isOff, valOrder, sv, earned, rate, balance, availableBefore,
        showRow: i <= lastIdxWithData || (i === 0 && inputsOrder[0] === '')
      });
    }
    setResults(newResults);
    setTotals({ pts: balance, euro: balance * COEFF });
  }, [inputsOrder, inputsUsed, frequency, authorized]);

  if (!authorized) return null;

  return (
    <div className="p-4 md:p-8 text-slate-900 bg-[#fcfcfd] min-h-screen italic" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation */}
        <button onClick={() => window.location.href = window.location.origin} className="no-print flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={14} /> Retour au Portail
        </button>

        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-center shadow-lg text-[10px] font-black uppercase tracking-widest italic">
            🚀 Simulateur de Fidélité ADR - Exclusivement Client au Détail
        </div>

        <header className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">VOTRE PLAN CADEAUX ADR</h1>
            <p className="text-slate-500 text-sm font-medium italic">
                Commande minimum requise : <span className="text-blue-600 font-extrabold">79,65 €</span> (soit 50 points SV)
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-blue-100 shadow-sm">🎯 Seuil : 79,65 € (50 SV) min.</div>
                <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-slate-100">🚀 Plafond : 75 Pts / mois</div>
                <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-slate-100">💰 Max : 900 Pts / an</div>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
            <div className="md:col-span-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex">
                <button onClick={() => setFrequency('mensuel')} className={`flex-1 py-4 rounded-xl font-black text-[10px] transition-all uppercase ${frequency === 'mensuel' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Mensuel (20-30%)</button>
                <button onClick={() => setFrequency('bimestriel')} className={`flex-1 py-4 rounded-xl font-black text-[10px] transition-all uppercase ${frequency === 'bimestriel' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>Bimestriel (10%)</button>
            </div>
            <button onClick={() => { setInputsOrder(Array(MOIS).fill('')); setInputsUsed(Array(MOIS).fill('')); }} className="bg-white border border-slate-100 py-4 rounded-2xl text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                <RotateCcw size={14} strokeWidth={3} /> Réinitialiser
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border-b-8 border-blue-600">
                <span className="text-[10px] uppercase font-black opacity-50 tracking-widest italic text-blue-400">Solde Actuel Cagnotte</span>
                <div className="text-6xl font-black mt-2 tracking-tighter">{totals.pts.toFixed(2)} <span className="text-lg opacity-30">PTS</span></div>
                <ShoppingCart className="absolute -right-8 -bottom-8 opacity-10" size={200} />
            </div>
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 relative overflow-hidden border-b-8 border-emerald-500">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Valeur Shopping Restante</span>
                <div className="text-5xl font-black mt-2 text-emerald-600 tracking-tighter">{totals.euro.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                <div className="text-[10px] font-black text-slate-400 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100 uppercase italic">Equivalent : {totals.pts.toFixed(2)} Pts</div>
                <TrendingUp className="absolute top-10 right-10 text-emerald-50 opacity-50" size={80} />
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 no-print">
                <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-500">Flux de vos points produits</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                        <tr className="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="p-6 w-16 text-center italic">Mois</th>
                            <th className="p-6">Ma Commande (€)</th>
                            <th className="p-6 text-center text-blue-600 bg-blue-50/30">Points Gagnés (+)</th>
                            <th className="p-6 text-center text-orange-600 bg-orange-50/30">Dépenses (-)</th>
                            <th className="p-6 text-center text-slate-900 bg-slate-100/50">Solde Restant (=)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, i) => (
                          <tr key={i} className={`border-b border-slate-50 transition-all ${row.isOff && row.valOrder === 0 ? 'opacity-40 grayscale pointer-events-none' : ''} ${row.monthNum === 13 && frequency === 'mensuel' ? 'bg-amber-50/20' : ''}`}>
                            <td className="p-6 font-black text-slate-200 text-2xl text-center italic">{row.monthNum}</td>
                            <td className="p-6">
                                <div className="flex flex-col gap-2">
                                    <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all ${inputsOrder[i] !== '' ? (row.sv >= MIN_SV ? 'border-blue-600 bg-white shadow-md' : 'border-red-400 bg-white shadow-sm') : 'border-slate-100 bg-slate-50 focus-within:border-blue-400'}`}>
                                        <input type="text" value={inputsOrder[i]} onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value.replace(',','.'); setInputsOrder(n); }} placeholder="0.00" className="w-full bg-transparent font-black text-slate-800 outline-none text-xl" />
                                        <span className="text-slate-300 font-black">€</span>
                                    </div>
                                    <div className="flex justify-between px-1 h-3">
                                        <span className="text-[9px] font-black text-blue-500 italic uppercase">{row.valOrder > 0 ? `${row.sv.toFixed(2)} SV` : ''}</span>
                                        <span className="text-[8px] font-black text-red-500 uppercase">{(row.valOrder > 0 && row.sv < MIN_SV) ? `MINIMUM ${MIN_EURO} € REQUIS` : ''}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6 bg-blue-50/10 text-center">
                                <div className="flex flex-col items-center justify-center h-[90px]">
                                    {row.earned > 0 ? (
                                      <>
                                        <span className="text-2xl font-black text-blue-600">+{row.earned.toFixed(2)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase mt-1 block shadow-sm ${row.rate === 0.3 ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-600'}`}>{(row.rate*100).toFixed(0)}% RETOUR</span>
                                      </>
                                    ) : <span className="text-2xl font-black text-slate-100">—</span>}
                                </div>
                            </td>
                            <td className="p-6 bg-orange-50/10 text-center">
                                <div className="flex flex-col items-center justify-center h-[90px]">
                                    {row.availableBefore > 0 && row.showRow ? (
                                      <div className="flex flex-col items-center gap-1">
                                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-orange-100 bg-white focus-within:border-orange-400 transition-all shadow-sm">
                                              <input type="text" value={inputsUsed[i]} onChange={(e) => { const n = [...inputsUsed]; n[i] = e.target.value.replace(',','.'); setInputsUsed(n); }} placeholder="0.0" className="w-14 bg-transparent font-black text-orange-600 outline-none text-lg text-center" />
                                              <span className="text-orange-300 font-black text-[10px] uppercase">Pts</span>
                                          </div>
                                          <span className="text-[8px] font-black text-orange-400 uppercase italic">Libre : {row.availableBefore.toFixed(1)}</span>
                                      </div>
                                    ) : <span className="text-slate-100 text-2xl font-black">—</span>}
                                </div>
                            </td>
                            <td className="p-6 bg-slate-50/30 text-center">
                                <div className="flex flex-col items-center justify-center h-[90px]">
                                    {row.showRow ? (
                                      <div className={`flex flex-col items-center px-4 py-2 rounded-xl font-black transition-all ${row.balance > 0 ? 'bg-slate-900 text-white shadow-lg border-b-4 border-emerald-500' : 'text-slate-400 border border-slate-100 bg-white'}`}>
                                          <div className="text-2xl leading-none">{row.balance.toFixed(2)}</div>
                                          <div className="text-[8px] uppercase opacity-40 mt-1 font-bold tracking-widest italic text-center">Solde</div>
                                      </div>
                                    ) : <span className="text-slate-100 text-2xl font-black">—</span>}
                                </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <button onClick={() => window.print()} className="no-print w-full py-8 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all shadow-2xl text-[10px] uppercase tracking-[0.4em] italic active:scale-95">
            Imprimer mon plan de fidélité personnalisé
        </button>
      </div>
    </div>
  );
}