"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShieldCheck, Crown, Target, Zap } from 'lucide-react';

// --- CONFIGURATION TECHNIQUE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";
const COEFF = 1.225;
const MIN_SV = 50;
const MAX_PTS_MOIS = 75;
const MAX_PTS_AN = 900;
const NB_MOIS = 15;

export default function App() {
  const [authorized, setAuthorized] = useState(false);
  const [frequency, setFrequency] = useState('mensuel');
  const [data, setData] = useState({ 
    inputs: Array(NB_MOIS).fill(''), 
    spent: Array(NB_MOIS).fill('') 
  });
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ solde: 0, euro: 0 });

  // --- SÉCURITÉ ---
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
      } catch (e) { console.warn("Sécurité active"); }
    };
    checkAuth();
  }, []);

  // --- CALCULS ---
  useEffect(() => {
    if (!authorized) return;
    let currentSolde = 0;
    let lastValidSolde = 0;
    let moisVides = 0;
    const newResults = [];

    for (let i = 0; i < NB_MOIS; i++) {
      const moisNum = i + 1;
      // En bimestriel, les mois pairs (2, 4, 6...) sont des mois de repos
      const isRepos = frequency === 'bimestriel' && moisNum % 2 === 0;
      
      const valPrice = isRepos ? '' : data.inputs[i];
      const price = parseFloat(valPrice) || 0;
      const sv = price / COEFF;
      const spentRequested = isRepos ? 0 : parseFloat(data.spent[i]) || 0;

      if (!isRepos) {
        if (sv < MIN_SV - 0.005) moisVides++;
        else moisVides = 0;
      }
      
      if (moisVides >= 2) currentSolde = 0;

      const soldeStart = currentSolde;
      const depenseReelle = Math.min(spentRequested, soldeStart);
      const bonusEuro = depenseReelle * COEFF;
      const soldePostDepense = soldeStart - depenseReelle;

      // Calcul du taux : 20%/30% pour mensuel, 10% fixe pour bimestriel
      const taux = frequency === 'mensuel' ? (moisNum >= 13 ? 0.3 : 0.2) : 0.1;
      let gain = (!isRepos && sv >= MIN_SV - 0.005) ? Math.min(sv * taux, MAX_PTS_MOIS) : 0;

      currentSolde = soldePostDepense + gain;
      if (currentSolde > MAX_PTS_AN) currentSolde = MAX_PTS_AN;
      if (valPrice !== '' || data.spent[i] !== '') lastValidSolde = currentSolde;

      newResults.push({ moisNum, isRepos, price, sv, gain, taux, depenseReelle, bonusEuro, soldeStart, currentSolde, valPrice, valSpent: data.spent[i] });
    }
    setResults(newResults);
    setSummary({ solde: lastValidSolde, euro: lastValidSolde * COEFF });
  }, [data, frequency, authorized]);

  const handleUpdate = (index, field, value) => {
    const newData = { ...data };
    newData[field][index] = value.replace(',', '.');
    setData(newData);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') window.location.href = window.location.origin;
  };

  if (!authorized) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white italic font-black uppercase tracking-widest text-[10px]">Vérification de l'accès...</div>;

  return (
    <div className="p-4 md:p-10 text-[#0f172a] bg-[#f8fafc] min-h-screen italic font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button onClick={handleGoBack} className="no-print flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all mb-4">
            <ArrowLeft size={14} /> Retour au Portail
        </button>

        {/* HEADER SECTION */}
        <header className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 text-center space-y-6">
            <div className="flex justify-center">
                <span className="bg-[#2563eb] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
                    Espace Brand Affiliate & Membres
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#0f172a] uppercase tracking-tighter italic">
                Planificateur de Rentabilité ADR
            </h1>
            <p className="text-slate-500 text-sm font-bold opacity-80">
                Mesurez l'accumulation de vos avantages produits avec précision.
            </p>
            
            {/* BADGES EN COULEUR */}
            <div className="flex flex-wrap justify-center gap-4 pt-2">
                <div className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full border-2 border-blue-100 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-2">
                    <Target size={14}/> Seuil : 50 SV min (~61.25 €)
                </div>
                <div className="bg-amber-50 text-amber-700 px-5 py-2 rounded-full border-2 border-amber-100 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-2">
                    <Zap size={14}/> Max : 75 pts/mois
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full border-2 border-emerald-100 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-2">
                    <Crown size={14}/> Plafond : 900 pts/an
                </div>
            </div>
        </header>

        {/* CHOIX DU RYTHME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
            <button 
                onClick={() => setFrequency('mensuel')}
                className={`p-10 rounded-[3rem] border-2 transition-all text-left relative overflow-hidden ${frequency === 'mensuel' ? 'border-[#2563eb] bg-white shadow-xl shadow-blue-50 ring-4 ring-blue-50' : 'border-slate-100 bg-slate-50 opacity-60'}`}
            >
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Rythme Mensuel</h3>
                    <div className={`${frequency === 'mensuel' ? 'bg-[#2563eb]' : 'bg-slate-400'} text-white px-5 py-2 rounded-xl font-black text-lg`}>20% ➔ 30%</div>
                </div>
                <p className="text-sm text-slate-500 mt-6 leading-snug font-medium">
                    Gagnez 20% pendant 12 mois, puis profitez de <span className="text-[#2563eb] font-bold underline decoration-2 underline-offset-4">30% à vie</span> dès le 13ème mois.
                </p>
            </button>

            <button 
                onClick={() => setFrequency('bimestriel')}
                className={`p-10 rounded-[3rem] border-2 transition-all text-left relative overflow-hidden ${frequency === 'bimestriel' ? 'border-[#0f172a] bg-white shadow-xl ring-4 ring-slate-100' : 'border-slate-100 bg-slate-50 opacity-60'}`}
            >
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Rythme Bimestriel</h3>
                    <div className={`${frequency === 'bimestriel' ? 'bg-[#0f172a]' : 'bg-slate-400'} text-white px-5 py-2 rounded-xl font-black text-lg`}>10%</div>
                </div>
                <p className="text-sm text-slate-500 mt-6 leading-snug font-medium">
                    Un rythme espacé avec un gain constant de 10% en points cadeaux.
                </p>
            </button>
        </div>

        {/* INDICATEURS CAGNOTTE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#0f172a] text-white rounded-[3rem] p-12 shadow-2xl flex items-center justify-between border-b-[10px] border-[#2563eb] relative overflow-hidden">
                <div className="relative z-10">
                    <span className="text-[10px] uppercase font-black text-[#2563eb] tracking-[0.3em]">Cagnotte de points restante</span>
                    <div className="text-7xl font-black mt-2 tracking-tighter">
                        {summary.solde.toFixed(2)} <span className="text-xl opacity-30 font-bold ml-2">Pts</span>
                    </div>
                </div>
                <div className="text-right border-l border-white/10 pl-12 relative z-10">
                    <span className="text-[10px] uppercase font-black text-[#10b981] tracking-[0.2em]">Valeur estimée en euros</span>
                    <div className="text-4xl font-black text-[#10b981] mt-2 tracking-tight">
                        ≈ {summary.euro.toFixed(2)} €
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setData({ inputs: Array(NB_MOIS).fill(''), spent: Array(NB_MOIS).fill('') })} 
                className="bg-white border border-slate-100 rounded-[3rem] p-12 flex flex-col items-center justify-center group hover:bg-red-50 transition-all shadow-sm no-print"
            >
                <div className="p-4 rounded-full bg-red-50 group-hover:bg-red-100 transition-colors">
                    <Trash2 size={42} className="text-red-500" />
                </div>
                <span className="text-[11px] font-black uppercase mt-5 tracking-[0.2em] text-red-500">Réinitialiser</span>
            </button>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="p-8 w-24 text-center italic">Mois</th>
                            <th className="p-8">Commande Payée (€)</th>
                            <th className="p-8 text-center text-blue-600 bg-blue-50/20 text-[10px] uppercase tracking-widest">Retour Points</th>
                            <th className="p-8 text-center text-emerald-600 bg-emerald-50/20 text-[10px] uppercase tracking-widest">Dépense (Pts)</th>
                            <th className="p-8 text-right bg-[#0f172a] text-white text-[10px] uppercase tracking-widest">Stock Disponible</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                        {results.map((row, i) => (
                          <tr key={i} className={`border-b border-slate-50 transition-all ${row.isRepos ? 'opacity-30 bg-slate-50 grayscale pointer-events-none' : 'hover:bg-slate-50/30'} ${row.moisNum >= 13 && frequency === 'mensuel' ? 'bg-amber-50/5' : ''}`}>
                            <td className="p-6 font-black text-slate-200 text-3xl text-center italic">{row.moisNum}</td>
                            <td className="p-6">
                                {!row.isRepos ? (
                                    <div className="space-y-1">
                                        <div className={`flex items-center gap-2 px-5 py-4 rounded-2xl border-2 transition-all ${row.valPrice !== '' ? (row.sv >= MIN_SV - 0.01 ? 'border-[#2563eb] bg-white shadow-md' : 'border-red-400 bg-white') : 'border-slate-100 bg-slate-50'}`}>
                                            <input type="text" value={row.valPrice} onChange={(e) => handleUpdate(i, 'inputs', e.target.value)} placeholder="0.00" className="w-full bg-transparent font-black text-[#0f172a] outline-none text-2xl" />
                                            <span className="text-slate-300 font-black italic">€</span>
                                        </div>
                                        <div className="mt-1 flex justify-between px-1">
                                            <span className="text-[10px] text-blue-600 font-black uppercase italic">{row.valPrice !== '' ? `${row.sv.toFixed(2)} SV` : ''}</span>
                                            <span className={`text-[9px] font-black uppercase ${row.sv < MIN_SV - 0.01 ? 'text-red-500' : 'text-[#10b981]'}`}>{row.valPrice !== '' ? (row.sv < MIN_SV - 0.01 ? 'Seuil insuffisant' : 'ADR Validé') : ''}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-4 text-slate-400 text-center font-black uppercase text-[10px] tracking-widest">Repos Bimestriel</div>
                                )}
                            </td>
                            <td className="p-6 text-center bg-blue-50/5">
                                {row.gain > 0 ? (
                                  <div className="flex flex-col items-center">
                                    <span className="text-3xl font-black text-[#2563eb]">+{row.gain.toFixed(2)}</span>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase mt-1 ${row.taux === 0.3 ? 'bg-amber-500 text-white shadow-md' : 'bg-blue-100 text-[#2563eb]'}`}>{(row.taux*100)}%</span>
                                  </div>
                                ) : <span className="text-slate-100 text-2xl font-black">—</span>}
                            </td>
                            <td className="p-6 text-center bg-emerald-50/5">
                                {!row.isRepos && (
                                    <div className={`flex items-center px-4 py-3 rounded-2xl border-2 transition-all ${row.valSpent !== '' ? 'border-[#10b981] bg-white shadow-sm' : 'border-slate-100 bg-slate-50'}`}>
                                        <input type="text" value={row.valSpent} onChange={(e) => handleUpdate(i, 'spent', e.target.value)} placeholder="0" className="w-full bg-transparent font-black text-center text-xl" />
                                    </div>
                                )}
                            </td>
                            <td className="p-6 text-right bg-slate-50/30">
                                <div className={`inline-flex flex-col items-end px-6 py-3 rounded-2xl font-black transition-all ${row.soldeStart > 0 || row.currentSolde > 0 ? 'bg-[#0f172a] text-white shadow-2xl scale-105' : 'bg-slate-100 text-slate-300'}`}>
                                    <div className="text-2xl italic tracking-tighter">{row.soldeStart.toFixed(2)}</div>
                                    <div className="text-[9px] uppercase tracking-widest opacity-50 italic">Points stock</div>
                                </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <button onClick={() => window.print()} className="no-print w-full py-10 bg-[#0f172a] text-white font-black rounded-[3rem] hover:bg-slate-800 transition-all shadow-2xl text-[11px] uppercase tracking-[0.5em] italic">
            Imprimer mon plan de rentabilité stratégique
        </button>
      </div>
    </div>
  );
}