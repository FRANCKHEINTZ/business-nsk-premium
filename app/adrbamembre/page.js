"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw, TrendingUp, ShoppingCart, Target, Zap, Crown, Check, CloudUpload, Info } from 'lucide-react';

/**
 * ADR BA & MEMBRES - VERSION EXPERT RESPONSIVE & SYNC SUPABASE
 * DESIGN : FULL BLUE EDITION (bg-blue-600)
 * FIX : Plafond annuel de 900 points (12 x 75 pts)
 * FIX : Rythme Mensuel (20/30%) et Bimestriel (10%)
 * FEATURE : Rattachement Supabase pour sauvegarde des simulations
 */

const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const COEFF = 1.225; // Ratio BA/Membre spécifique
const MIN_SV = 50;
const MAX_PTS_M = 75;
const MAX_PTS_A = 900; // MAXIMUM ANNUEL
const MOIS = 15;

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [frequency, setFrequency] = useState('mensuel'); 
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ pts: 0, euro: 0 });
  const [syncStatus, setSyncStatus] = useState(null);
  const [supabase, setSupabase] = useState(null);

  // --- BLOC RESTAURÉ (Lignes 32 à 45 de ta capture d'écran) ---
  useEffect(() => { 
    setMounted(true); 
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const client = createClient(S_URL, S_KEY);
        setSupabase(client);
      } catch (e) {
        console.warn("Initialisation Supabase différée ou mode local.");
      }
    };
    initSupabase();
  }, []);
 
  // --- LOGIQUE DE CALCUL STRATÉGIQUE ADR BA/MEMBRES ---
  useEffect(() => {
    if (!mounted) return;
    let balance = 0;
    let lastIdxWithData = -1;
    const newResults = [];

    inputsOrder.forEach((v, i) => { if (parseFloat(v) > 0) lastIdxWithData = i; });

    for (let i = 0; i < MOIS; i++) {
      const monthNum = i + 1;
      const isOff = frequency === 'bimestriel' && monthNum % 2 === 0;
      const valOrder = isOff ? '' : (parseFloat(inputsOrder[i]) || 0);
      const sv = valOrder / COEFF;
      
      const availableBefore = balance;
      let used = parseFloat(inputsUsed[i]) || 0;
      if (used > availableBefore) used = availableBefore;
      balance -= used;

      let earned = 0;
      let rate = 0;

      if (!isOff && valOrder > 0) {
        if (frequency === 'bimestriel') {
          rate = 0.10; 
          if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
        } else {
          rate = monthNum >= 13 ? 0.30 : 0.20;
          if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
        }
      }

      balance += earned;
      // Blocage au plafond annuel de 900 points
      if (balance > MAX_PTS_A) balance = MAX_PTS_A;
      if (balance < 0) balance = 0;

      newResults.push({
        monthNum, isOff, valOrder, sv, earned, rate, balance, availableBefore,
        showRow: i <= lastIdxWithData || (i === 0 && inputsOrder[0] === '')
      });
    }
    setResults(newResults);
    setTotals({ pts: balance, euro: balance * COEFF });
  }, [inputsOrder, inputsUsed, frequency, mounted]);

  // --- FONCTION DE SAUVEGARDE SUR SUPABASE ---
  const saveToSupabase = async () => {
    if (!supabase) return;
    setSyncStatus('loading');
    
    const dataToSave = {
      type_outil: "ADR BA MEMBRE",
      rythme: frequency,
      cagnotte_points: totals.pts,
      valeur_shopping: totals.euro,
      timestamp: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('simulations').insert([dataToSave]);
      if (error) throw error;
      setSyncStatus('success');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch (err) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-6 md:p-12 text-slate-900 bg-slate-50 min-h-screen italic font-black uppercase font-sans">
      <div className="max-w-7xl mx-auto space-y-10 font-black">
        
        {/* NAVIGATION HAUTE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button onClick={() => window.location.href = window.location.origin} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all font-black">
                <ArrowLeft size={16} /> Retour Portail
            </button>
            <div className="flex gap-4">
                <button 
                  onClick={saveToSupabase} 
                  disabled={syncStatus === 'loading'}
                  className={`p-4 rounded-2xl border flex items-center gap-2 text-[10px] font-black italic transition-all ${syncStatus === 'success' ? 'bg-emerald-500 text-white border-emerald-600' : syncStatus === 'error' ? 'bg-red-500 text-white border-red-600' : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700'}`}
                >
                    <CloudUpload size={16}/> {syncStatus === 'loading' ? 'Synchro...' : syncStatus === 'success' ? 'Sauvegardé !' : 'Sauvegarder Plan'}
                </button>
                <button onClick={() => { setInputsOrder(Array(MOIS).fill('')); setInputsUsed(Array(MOIS).fill('')); }} className="p-4 bg-white text-slate-400 hover:text-red-500 rounded-2xl border border-slate-100 flex items-center gap-2 text-[10px] font-black italic">
                    <RotateCcw size={16}/> Reset
                </button>
            </div>
        </div>

        {/* HEADER BRAND AFFILIATE */}
        <header className="bg-white rounded-[4rem] p-12 shadow-sm border border-slate-200 text-center font-black">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">RENTABILITÉ ADR BA & MEMBRES</h1>
            <div className="flex justify-center flex-wrap gap-4 mt-8">
                <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-[10px] font-black border border-blue-100 uppercase italic leading-none">Seuil : 50 SV min (~61.25 €)</div>
                <div className="bg-emerald-50 text-emerald-600 px-5 py-2 rounded-full text-[10px] font-black border border-emerald-100 uppercase italic leading-none">Max Mensuel : 75 pts</div>
                <div className="bg-slate-950 text-white px-5 py-2 rounded-full text-[10px] font-black border border-slate-800 uppercase italic leading-none">Plafond Annuel : 900 pts</div>
            </div>
        </header>

        {/* SÉLECTEUR DE RYTHME STRATÉGIQUE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black">
            <button 
                onClick={() => setFrequency('mensuel')}
                className={`p-10 rounded-[3rem] border-4 transition-all text-left relative overflow-hidden ${frequency === 'mensuel' ? 'border-blue-600 bg-white shadow-2xl scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-40 hover:opacity-100'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black italic uppercase">Rythme Mensuel</h3>
                    <div className="bg-blue-600 text-white px-5 py-2 rounded-xl text-lg font-black uppercase leading-none">20% ➔ 30%</div>
                </div>
                <p className="text-xs text-slate-500 font-black normal-case italic leading-relaxed">Accumulation maximale : 20% la première année, puis 30% dès le 13ème mois de fidélité. Idéal pour optimiser les retours gratuits.</p>
                {frequency === 'mensuel' && <Check className="absolute bottom-6 right-6 text-blue-600 font-black" size={32} strokeWidth={4} />}
            </button>

            <button 
                onClick={() => setFrequency('bimestriel')}
                className={`p-10 rounded-[3rem] border-4 transition-all text-left relative overflow-hidden ${frequency === 'bimestriel' ? 'border-slate-900 bg-white shadow-2xl scale-[1.02]' : 'border-slate-100 bg-slate-50 opacity-40 hover:opacity-100'}`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black italic uppercase">Rythme Bimestriel</h3>
                    <div className="bg-slate-900 text-white px-5 py-2 rounded-xl text-lg font-black uppercase leading-none">10%</div>
                </div>
                <p className="text-xs text-slate-500 font-black normal-case italic leading-relaxed">Rythme espacé : taux fixe de 10% de retour produit sur toutes vos commandes validées, sans progression de palier.</p>
                {frequency === 'bimestriel' && <Check className="absolute bottom-6 right-6 text-slate-900 font-black" size={32} strokeWidth={4} />}
            </button>
        </div>

        {/* INDICATEURS DE SOLDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-black">
            <div className="bg-slate-950 text-white rounded-[4rem] p-14 shadow-2xl border-b-[12px] border-blue-600 relative overflow-hidden font-black uppercase">
                <span className="text-[10px] uppercase font-black opacity-50 tracking-widest text-blue-400 italic">Cagnotte Points Brand Affiliate</span>
                <div className="text-7xl font-black mt-4 tracking-tighter italic">{totals.pts.toFixed(2)} <span className="text-2xl opacity-30">PTS</span></div>
                <ShoppingCart className="absolute -right-12 -bottom-12 opacity-5" size={250} />
                {totals.pts >= MAX_PTS_A && (
                    <div className="absolute top-6 right-6 bg-blue-600/20 text-blue-400 border border-blue-400/30 px-3 py-1 rounded-full text-[8px] font-black italic">PLAFOND ATTEINT</div>
                )}
            </div>
            <div className="bg-white rounded-[4rem] p-14 shadow-xl border border-slate-200 border-b-[12px] border-emerald-500 font-black uppercase">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Valeur Shopping Estimée (HT)</span>
                <div className="text-6xl font-black mt-4 text-emerald-600 tracking-tighter italic">{totals.euro.toFixed(2)} €</div>
                <TrendingUp className="absolute top-10 right-10 text-emerald-50" size={100} />
            </div>
        </div>

        {/* MATRICE DE SIMULATION LARGE */}
        <div className="bg-white rounded-[4rem] shadow-xl border border-slate-100 overflow-hidden font-black">
            <div className="overflow-x-auto font-black italic">
                <table className="w-full text-left font-black uppercase italic">
                    <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest font-black italic">
                        <tr>
                            <th className="p-10 w-24 text-center italic">Mois</th>
                            <th className="p-10">Commande (€)</th>
                            <th className="p-10 text-center text-blue-600">Taux (%)</th>
                            <th className="p-10 text-center text-blue-600 font-black">Points Gagnés</th>
                            <th className="p-10 text-center text-orange-600 font-black">Dépenses (Pts)</th>
                            <th className="p-10 text-right text-slate-900 font-black">Solde Cumulé</th>
                        </tr>
                    </thead>
                    <tbody className="font-black italic">
                        {results.map((row, i) => (
                          <tr key={i} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${row.isOff ? 'bg-slate-100 opacity-40 grayscale pointer-events-none' : ''}`}>
                            <td className="p-8 font-black text-slate-200 text-4xl text-center italic leading-none">{row.monthNum}</td>
                            <td className="p-8 font-black">
                                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all ${row.valOrder > 0 ? 'border-blue-600 bg-white font-black' : 'border-slate-100 bg-slate-50 font-black'}`}>
                                    <input type="text" value={inputsOrder[i]} onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value; setInputsOrder(n); }} placeholder="0.00" className="w-full bg-transparent font-black text-slate-800 outline-none text-2xl" />
                                    <span className="text-slate-300">€</span>
                                </div>
                            </td>
                            <td className="p-8 text-center font-black">
                                {row.valOrder > 0 && <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${row.rate === 0.3 ? 'bg-amber-500 text-white shadow-lg' : 'bg-blue-100 text-blue-600'}`}>{(row.rate * 100)}%</span>}
                            </td>
                            <td className="p-8 text-center font-black">
                                {row.earned > 0 && <span className="text-3xl font-black text-blue-600">+{row.earned.toFixed(2)}</span>}
                            </td>
                            <td className="p-8 text-center font-black">
                                <input type="text" value={inputsUsed[i]} onChange={(e) => { const n = [...inputsUsed]; n[i] = e.target.value; setInputsUsed(n); }} placeholder="0" className="w-24 p-3 bg-slate-50 rounded-xl border border-slate-200 font-black text-center" />
                            </td>
                            <td className="p-8 text-right font-black">
                                <span className={`text-2xl font-black italic ${row.balance > 0 ? 'text-slate-950 font-black' : 'text-slate-200 font-black'}`}>
                                    {row.balance.toFixed(2)}
                                    {row.balance >= MAX_PTS_A && i < MOIS-1 && <span className="block text-[8px] text-blue-600 font-black">MAX ATTEINT</span>}
                                </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3rem] flex items-start gap-6 font-black uppercase">
            <Info size={32} className="text-blue-600 mt-1" />
            <div className="space-y-2">
                <h4 className="text-lg font-black text-blue-900 italic uppercase leading-none">Rappel Stratégique Masters</h4>
                <p className="text-xs text-blue-700 font-bold normal-case leading-relaxed italic opacity-80">
                    Les points ADR expirent s'ils ne sont pas utilisés dans les 12 mois suivant leur obtention. Le simulateur prend en compte le plafond contractuel de **900 points annuels**. Veillez à planifier vos dépenses de points pour maximiser vos stocks sans frais.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}