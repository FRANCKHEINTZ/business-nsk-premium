"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, RotateCcw, TrendingUp, ShoppingCart, Target, 
  Zap, Crown, Check, CloudUpload, Info, Lock, LogIn, LayoutGrid, Award, Trash
} from 'lucide-react';

/**
 * SUIVI DE RÉSEAU ADR BA & MEMBRES - VERSION V122 (DESIGN MODÈLE PHOTO)
 * - FIX : Layout identique à la capture d'écran (Badges, Cartes de rythme).
 * - FIX : Ajout de la colonne "DÉPENSES (PTS)" dans le tableau.
 * - FIX : Bouton "RETOUR MES APPS" pour le tableau de bord.
 * - SYNC : Système de notifications et synchronisation Cloud Master.
 */

const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const COEFF = 1.225; // Basé sur 50 SV = 61.25€
const MIN_SV = 50;
const MAX_PTS_M = 75;
const MAX_PTS_A = 900;
const MOIS = 15;

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [frequency, setFrequency] = useState('mensuel'); 
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [results, setResults] = useState([]);
  const [totals, setTotals] = useState({ pts: 0, euro: 0 });
  const [notification, setNotification] = useState(null);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => { 
    setMounted(true); 
    const savedEmail = localStorage.getItem('nsk_email');
    if (savedEmail) {
        setIsAuthenticated(true);
        setUserEmail(savedEmail);
    } else {
        setIsAuthenticated(true); // Bypass pour vos tests
        setUserEmail("analyse-technique@nsk.com");
    }

    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        if (createClient) setSupabase(createClient(S_URL, S_KEY));
      } catch (e) { console.warn("Supabase local mode"); }
    };
    initSupabase();
  }, []);
 
  const handleGoDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.replace(window.location.origin);
    }
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Logique de calcul ADR fidèle au modèle
  useEffect(() => {
    if (!mounted) return;
    let balance = 0;
    const newResults = [];
    let lastIdxWithData = -1;
    inputsOrder.forEach((v, i) => { if (parseFloat(v) > 0) lastIdxWithData = i; });

    for (let i = 0; i < MOIS; i++) {
      const monthNum = i + 1;
      const valOrder = parseFloat(inputsOrder[i]) || 0;
      const sv = valOrder / COEFF;
      
      const availableBefore = balance;
      let used = parseFloat(inputsUsed[i]) || 0;
      if (used > availableBefore) used = availableBefore;
      
      // Soustraire les dépenses avant d'ajouter les gains
      balance -= used;

      let earned = 0;
      let rate = 0;
      if (valOrder > 0) {
        rate = (frequency === 'bimestriel') ? 0.10 : (monthNum >= 13 ? 0.30 : 0.20);
        if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
      }

      balance += earned;
      if (balance > MAX_PTS_A) balance = MAX_PTS_A;
      if (balance < 0) balance = 0;

      newResults.push({ 
        monthNum, valOrder, sv, earned, rate, balance, used,
        showRow: i <= lastIdxWithData || i === 0 
      });
    }
    setResults(newResults);
    setTotals({ pts: balance, euro: balance * COEFF });
  }, [inputsOrder, inputsUsed, frequency, mounted]);

  const saveToSupabase = async () => {
    if (!supabase || !userEmail) return;
    try {
      await supabase.from('simulations').insert([{
        Email: userEmail,
        type_outil: "SUIVI RÉSEAU V122",
        rythme: frequency,
        cagnotte: totals.pts,
        timestamp: new Date().toISOString()
      }]);
      notify("PLAN RÉSEAU SAUVEGARDÉ !");
    } catch (err) {
      notify("ERREUR SYNC CLOUD");
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-10 text-slate-900 bg-[#f8fafc] min-h-screen italic font-black uppercase font-sans selection:bg-blue-100 antialiased">
      
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] p-4 px-8 rounded-2xl bg-[#3b82f6] text-white shadow-2xl font-black text-xs tracking-widest animate-in fade-in slide-in-from-top-4">
            {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-4">
            <button onClick={handleGoDashboard} className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-all active:scale-95 uppercase italic group">
                <LayoutGrid size={18} className="group-hover:rotate-90 transition-transform duration-500" /> RETOUR MES APPS
            </button>
            <div className="flex gap-4">
                <button onClick={saveToSupabase} className="p-4 px-6 rounded-2xl bg-[#3b82f6] text-white shadow-lg active:scale-95 flex items-center gap-2 text-[10px]">
                    <CloudUpload size={16}/> SAUVEGARDER
                </button>
                <button onClick={() => { setInputsOrder(Array(MOIS).fill('')); setInputsUsed(Array(MOIS).fill('')); }} className="p-4 bg-white text-slate-300 hover:text-red-500 rounded-2xl border border-slate-100 flex items-center gap-2 text-[10px]">
                    <RotateCcw size={16}/> RESET
                </button>
            </div>
        </div>

        {/* HEADER & BADGES (FIDÈLE À LA PHOTO) */}
        <header className="bg-white rounded-[4rem] p-12 shadow-sm border border-slate-50 text-center space-y-10">
            <h1 className="text-4xl md:text-6xl tracking-tight leading-none uppercase italic font-black text-slate-950">
              RENTABILITÉ ADR BA & MEMBRES
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-blue-50 px-6 py-2 rounded-full border border-blue-100 text-[#3b82f6] text-[9px] font-black italic">SEUIL : 50 SV MIN (~61,25 €)</div>
                <div className="bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 text-emerald-500 text-[9px] font-black italic uppercase">MAX MENSUEL : 75 PTS</div>
                <div className="bg-slate-950 px-6 py-2 rounded-full text-white text-[9px] font-black italic uppercase">PLAFOND ANNUEL : 900 PTS</div>
            </div>
        </header>

        {/* RYTHME SÉLECTEUR (DESIGN MODÈLE PHOTO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 font-black italic">
            <button onClick={() => setFrequency('mensuel')} className={`p-8 rounded-[3rem] border-4 transition-all text-left relative overflow-hidden ${frequency === 'mensuel' ? 'border-blue-500 bg-white shadow-2xl scale-[1.02]' : 'opacity-40 grayscale border-transparent bg-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl tracking-tight uppercase font-black italic">RYTHME MENSUEL</h3>
                  <span className="bg-blue-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black italic">20% ➔ 30%</span>
                </div>
                <p className="text-[10px] text-slate-400 normal-case font-bold leading-relaxed italic pr-12">Accumulation maximale : 20% la première année, puis 30% dès le 13ème mois de fidélité.</p>
                {frequency === 'mensuel' && <Check className="absolute bottom-6 right-8 text-blue-500" size={28} strokeWidth={4} />}
            </button>
            
            <button onClick={() => setFrequency('bimestriel')} className={`p-8 rounded-[3rem] border-4 transition-all text-left relative overflow-hidden ${frequency === 'bimestriel' ? 'border-slate-400 bg-white shadow-2xl scale-[1.02]' : 'opacity-40 grayscale border-transparent bg-slate-100'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl tracking-tight uppercase font-black italic">RYTHME BIMESTRIEL</h3>
                  <span className="bg-slate-400 text-white px-4 py-1.5 rounded-xl text-[10px] font-black italic">10%</span>
                </div>
                <p className="text-[10px] text-slate-400 normal-case font-bold leading-relaxed italic pr-12">Rythme espacé : taux fixe de 10% de retour produit sur toutes vos commandes validées.</p>
                {frequency === 'bimestriel' && <Check className="absolute bottom-6 right-8 text-slate-400" size={28} strokeWidth={4} />}
            </button>
        </div>

        {/* INDICATEURS (FIDÈLE À LA PHOTO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-black italic uppercase">
            <div className="bg-slate-950 text-white rounded-[4rem] p-14 shadow-2xl relative overflow-hidden border-b-[12px] border-blue-600 group">
                <span className="text-[9px] opacity-40 tracking-[0.4em] font-black uppercase italic leading-none">CAGNOTTE POINTS BRAND AFFILIATE</span>
                <div className="text-8xl mt-6 tracking-tighter leading-none font-black italic text-white flex items-baseline gap-4">
                  {totals.pts.toFixed(2)} 
                  <span className="text-2xl opacity-20 font-sans uppercase not-italic">PTS</span>
                </div>
                <ShoppingCart className="absolute -right-8 -bottom-8 opacity-[0.05] group-hover:scale-110 transition-all duration-1000" size={180} />
            </div>
            
            <div className="bg-white rounded-[4rem] p-14 shadow-xl border-2 border-slate-50 relative overflow-hidden">
                <span className="text-[9px] text-slate-300 tracking-[0.4em] font-black uppercase italic leading-none">VALEUR SHOPPING ESTIMÉE (HT)</span>
                <div className="text-7xl mt-6 text-[#38bdf8] tracking-tighter leading-none font-black italic flex items-baseline gap-4">
                  {totals.euro.toFixed(2)} €
                </div>
            </div>
        </div>

        {/* TABLEAU DE CALCUL (FIDÈLE À LA PHOTO) */}
        <div className="bg-white rounded-[4.5rem] shadow-sm overflow-hidden border-2 border-slate-50 font-black italic uppercase">
            <div className="overflow-x-auto">
                <table className="w-full text-left italic font-black uppercase">
                    <thead className="bg-slate-50/50 text-[9px] text-slate-300 tracking-[0.3em] font-black uppercase italic">
                        <tr>
                          <th className="p-10 text-center w-24">MOIS</th>
                          <th className="p-10">COMMANDE (€)</th>
                          <th className="p-10 text-center">TAUX (%)</th>
                          <th className="p-10 text-center text-blue-500">POINTS GAGNÉS</th>
                          <th className="p-10 text-center text-orange-500">DÉPENSES (PTS)</th>
                          <th className="p-10 text-right">SOLDE CUMULÉ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50 italic font-black">
                        {results.map((row, i) => (
                          <tr key={i} className={`transition-all duration-300 hover:bg-[#f8fafc]`}>
                            <td className="p-8 text-5xl text-slate-100 text-center font-black leading-none italic">{row.monthNum}</td>
                            <td className="p-8">
                                <div className={`flex items-center gap-4 p-5 rounded-[1.8rem] border-2 transition-all ${row.valOrder > 0 ? 'border-blue-500 bg-white shadow-lg' : 'border-slate-100 bg-[#f8fafc]'}`}>
                                    <input 
                                      type="text" value={inputsOrder[i]} 
                                      onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value; setInputsOrder(n); }} 
                                      placeholder="0.00" className="w-full bg-transparent outline-none text-2xl font-black italic" 
                                    />
                                    <span className="text-slate-200 text-xl font-black italic">€</span>
                                </div>
                            </td>
                            <td className="p-8 text-center">
                                {row.valOrder > 0 && <span className="text-slate-300 text-xs font-black">{(row.rate * 100)}%</span>}
                            </td>
                            <td className="p-8 text-center text-blue-500 text-3xl font-black italic leading-none">
                              {row.earned > 0 ? `+${row.earned.toFixed(1)}` : '—'}
                            </td>
                            <td className="p-8 text-center">
                                <input 
                                  type="text" value={inputsUsed[i]} 
                                  onChange={(e) => { const n = [...inputsUsed]; n[i] = e.target.value; setInputsUsed(n); }} 
                                  placeholder="0" className="w-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center text-orange-400 text-xl font-black italic outline-none focus:border-orange-200" 
                                />
                            </td>
                            <td className="p-8 text-right text-3xl font-black tracking-tighter text-slate-950 italic leading-none">
                              {row.balance.toFixed(1)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      
      <footer className="mt-20 py-16 opacity-20 text-center border-t border-slate-200 mx-20 font-black italic uppercase">
         <p className="text-[10px] tracking-[0.8em]">BUSINESS NSK PREMIUM • RENTABILITÉ RÉSEAU V122</p>
      </footer>
    </div>
  );
}