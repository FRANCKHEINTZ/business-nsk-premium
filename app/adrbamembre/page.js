"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  RotateCcw, ShoppingCart, CloudUpload, LayoutGrid, Check, 
  Trash2, Zap, Printer, Euro, Briefcase, Info, TrendingUp, ShoppingBag
} from 'lucide-react';

/**
 * PLANIFICATEUR DE RENTABILITÉ ADR - VERSION V122 PREMIUM
 * - DESIGN : Fidèle au modèle photo (Badges, Cartes, Tableau)
 * - CALCULS : Méthode stratégique REPORT N+1 (Gain mois N disponible mois N+1)
 * - INTÉGRATION : Redirection Lemon Squeezy & Sauvegarde Supabase
 * - MISE À JOUR : Correction du lien "RETOUR MES APPS" et affichage progressif
 */

const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const COEFF = 1.225; 
const MIN_SV = 50;
const MAX_PTS_M = 75;
const MAX_PTS_A = 900;
const MOIS = 15;

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [frequency, setFrequency] = useState('mensuel'); 
  const [inputsOrder, setInputsOrder] = useState(Array(MOIS).fill(''));
  const [inputsUsed, setInputsUsed] = useState(Array(MOIS).fill(''));
  const [notification, setNotification] = useState(null);
  const [supabase, setSupabase] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  // Initialisation Supabase et Configuration Lemon Squeezy
  useEffect(() => { 
    setMounted(true); 
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('nsk_email') : null;
    setUserEmail(savedEmail || "analyse-technique@nsk.com");

    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        if (createClient) setSupabase(createClient(S_URL, S_KEY));
      } catch (e) { console.warn("Mode local actif"); }
    };

    // Chargement dynamique du script Lemon Squeezy pour l'overlay
    const script = document.createElement('script');
    script.src = "https://app.lemonsqueezy.com/js/lemon.js";
    script.async = true;
    script.onload = () => {
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy();
      }
    };
    document.body.appendChild(script);

    initSupabase();
  }, []);
 
  // Redirection corrigée vers le portail des applications
  const handleGoDashboard = () => {
    if (typeof window !== 'undefined') {
      window.location.replace(window.location.origin);
    }
  };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Redirection Lemon Squeezy intégrée
  const openLemonCheckout = () => {
    if (window.LemonSqueezy) {
      window.LemonSqueezy.Url.Open('https://nsk-premium.lemonsqueezy.com/checkout');
    } else {
      window.open('https://nsk-premium.lemonsqueezy.com/checkout', '_blank');
    }
  };

  // Détection du dernier mois saisi pour l'affichage progressif
  const lastIdxWithData = useMemo(() => {
    let lastIdx = -1;
    inputsOrder.forEach((v, i) => { if (v !== '' || inputsUsed[i] !== '') lastIdx = i; });
    return lastIdx;
  }, [inputsOrder, inputsUsed]);

  // --- MOTEUR DE CALCUL STRATÉGIQUE V122 AVEC REPORT N+1 ---
  const simulation = useMemo(() => {
    let runningWallet = 0; // Réserve de points réelle (ce qui est acquis)
    const results = [];
    
    for (let i = 0; i < MOIS; i++) {
      const monthNum = i + 1;
      const isRepos = frequency === 'bimestriel' && monthNum % 2 === 0;
      
      // 1. DISPONIBLE AU DÉBUT : Ce qui a été reporté du mois dernier
      const startingPoints = runningWallet;
      
      // 2. GESTION DES DÉPENSES : Limitées à ce qui est déjà disponible
      let requestedSpend = parseFloat(inputsUsed[i]) || 0;
      let actualSpend = Math.min(requestedSpend, startingPoints);
      
      // 3. SOLDE AFFICHÉ SUR LA LIGNE : Disponible - Dépense (Le gain actuel n'arrive qu'au mois N+1)
      const visibleBalance = startingPoints - actualSpend;

      // 4. CALCUL DU GAIN GÉNÉRÉ PAR LA COMMANDE ACTUELLE
      const valOrder = parseFloat(inputsOrder[i]) || 0;
      const sv = valOrder / COEFF;
      let earnedThisMonth = 0;
      let rate = 0;
      if (valOrder > 0 && !isRepos) {
        rate = (frequency === 'mensuel') ? (monthNum >= 13 ? 0.30 : 0.20) : 0.10;
        if (sv >= MIN_SV - 0.005) {
          earnedThisMonth = Math.min(sv * rate, MAX_PTS_M);
        }
      }

      // 5. REPORT POUR LE MOIS SUIVANT : On prépare le stock pour la prochaine itération
      runningWallet = visibleBalance + earnedThisMonth;
      if (runningWallet > MAX_PTS_A) runningWallet = MAX_PTS_A;
      if (runningWallet < 0) runningWallet = 0;

      // Un mois est visible s'il y a des données ou s'il suit immédiatement une saisie (pour voir le report)
      const isVisible = i <= lastIdxWithData + 1;

      results.push({ 
        monthNum, valOrder, sv, earned: earnedThisMonth, rate, 
        balance: visibleBalance, 
        used: actualSpend, isRepos, isVisible,
        nextMonthStock: runningWallet
      });
    }
    return results;
  }, [inputsOrder, inputsUsed, frequency, lastIdxWithData]);

  const totals = useMemo(() => {
    // La cagnotte affiche ce qui est réellement disponible à la fin de la saisie
    const currentUsable = lastIdxWithData >= 0 ? simulation[lastIdxWithData].balance : 0;
    return { pts: currentUsable, euro: currentUsable * COEFF };
  }, [simulation, lastIdxWithData]);

  // Sauvegarde Cloud avec redirection automatique Lemon Squeezy
  const saveToSupabase = async () => {
    // On vérifie le stock projeté pour déclencher le checkout si besoin
    const projectedPts = lastIdxWithData >= 0 ? simulation[lastIdxWithData].nextMonthStock : 0;
    if (projectedPts > 0 && !supabase) {
        openLemonCheckout();
        return;
    }

    if (!supabase || !userEmail) return;
    try {
      await supabase.from('simulations').insert([{
        Email: userEmail,
        type_outil: "ADR SIMULATOR V122",
        rythme: frequency,
        cagnotte: projectedPts,
        timestamp: new Date().toISOString()
      }]);
      notify("PLAN RÉSEAU SAUVEGARDÉ !");
    } catch (err) {
      notify("ERREUR SYNC CLOUD");
      openLemonCheckout();
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-4 md:p-10 text-slate-900 bg-[#f8fafc] min-h-screen font-sans selection:bg-blue-100 antialiased">
      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] p-4 px-8 rounded-2xl bg-blue-600 text-white shadow-2xl font-black text-[10px] tracking-widest animate-in fade-in slide-in-from-top-4 uppercase text-center">
            {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 no-print">
            <button onClick={handleGoDashboard} className="flex items-center gap-2 text-[10px] font-black text-blue-500 hover:text-blue-700 transition-all uppercase italic group">
                <LayoutGrid size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                RETOUR MES APPS
            </button>
            <div className="flex gap-4 text-center">
                <button onClick={saveToSupabase} className="p-4 px-8 rounded-2xl bg-[#3b82f6] text-white shadow-lg shadow-blue-100 active:scale-95 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <CloudUpload size={16} strokeWidth={3}/> SAUVEGARDER
                </button>
                <button onClick={() => { setInputsOrder(Array(MOIS).fill('')); setInputsUsed(Array(MOIS).fill('')); }} className="p-4 px-6 bg-white text-slate-300 hover:text-red-500 rounded-2xl border border-slate-100 flex items-center gap-2 text-[10px] font-black transition-colors uppercase">
                    <RotateCcw size={16} strokeWidth={3}/> RÉINITIALISER
                </button>
            </div>
        </div>

        {/* HEADER & BADGES */}
        <header className="bg-white rounded-[4rem] p-16 shadow-sm border border-slate-50 text-center space-y-12">
            <h1 className="text-5xl md:text-7xl tracking-tighter leading-none uppercase italic font-black text-slate-950 text-center">
              RENTABILITÉ ADR BA & MEMBRES
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-center text-center">
                <div className="bg-[#eff6ff] px-8 py-3 rounded-full border border-blue-100 text-[#3b82f6] text-[10px] font-black italic shadow-sm uppercase tracking-wider">SEUIL : 50 SV MIN (~61,25 €)</div>
                <div className="bg-[#ecfdf5] px-8 py-3 rounded-full border border-emerald-100 text-[#10b981] text-[10px] font-black italic shadow-sm uppercase tracking-wider">MAX MENSUEL : 75 PTS</div>
                <div className="bg-[#0f172a] px-8 py-3 rounded-full text-white text-[10px] font-black italic shadow-sm uppercase tracking-[0.1em]">PLAFOND ANNUEL : 900 PTS</div>
            </div>
        </header>

        {/* SÉLECTEUR DE RYTHME */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 text-center">
            <button onClick={() => setFrequency('mensuel')} className={`p-10 rounded-[3.5rem] border-4 transition-all text-left relative overflow-hidden h-full ${frequency === 'mensuel' ? 'border-blue-500 bg-white shadow-2xl scale-[1.01]' : 'opacity-40 grayscale border-transparent bg-slate-100 hover:opacity-100 hover:grayscale-0'}`}>
                <div className="flex justify-between items-center mb-6 text-left">
                  <h3 className="text-2xl tracking-tight uppercase font-black italic text-slate-950 text-left">RYTHME MENSUEL</h3>
                  <span className="bg-[#3b82f6] text-white px-5 py-2 rounded-xl text-[10px] font-black italic">20% ➔ 30%</span>
                </div>
                <p className="text-[11px] text-slate-400 normal-case font-bold leading-relaxed italic pr-16 text-left">Accumulation maximale : 20% la première année, puis 30% de retour produit dès le 13ème mois de fidélité.</p>
                {frequency === 'mensuel' && <Check className="absolute bottom-8 right-10 text-blue-500" size={32} strokeWidth={4} />}
            </button>
            
            <button onClick={() => setFrequency('bimestriel')} className={`p-10 rounded-[3.5rem] border-4 transition-all text-left relative overflow-hidden h-full ${frequency === 'bimestriel' ? 'border-slate-300 bg-white shadow-2xl scale-[1.01]' : 'opacity-40 grayscale border-transparent bg-slate-100 hover:opacity-100 hover:grayscale-0'}`}>
                <div className="flex justify-between items-center mb-6 text-left">
                  <h3 className="text-2xl tracking-tight uppercase font-black italic text-slate-400 text-left">RYTHME BIMESTRIEL</h3>
                  <span className="bg-slate-300 text-white px-5 py-2 rounded-xl text-[10px] font-black italic text-center">10%</span>
                </div>
                <p className="text-[11px] text-slate-400 normal-case font-bold leading-relaxed italic pr-16 text-left">Rythme espacé : taux fixe de 10% de retour produit sur toutes vos commandes validées mensuellement.</p>
                {frequency === 'bimestriel' && <Check className="absolute bottom-8 right-10 text-slate-300" size={32} strokeWidth={4} />}
            </button>
        </div>

        {/* INDICATEURS DE RÉSULTATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center text-center">
            <div className="bg-[#020617] text-white rounded-[4rem] p-16 shadow-2xl relative overflow-hidden border-b-[14px] border-blue-600 group text-left text-left">
                <span className="text-[10px] opacity-40 tracking-[0.4em] font-black uppercase italic leading-none text-left">POINTS RÉELLEMENT DISPONIBLES</span>
                <div className="text-8xl md:text-9xl mt-8 tracking-tighter leading-none font-black italic text-white flex items-baseline gap-4 text-left">
                  {totals.pts.toFixed(2)} 
                  <span className="text-2xl opacity-20 font-sans uppercase not-italic text-left">PTS</span>
                </div>
                <ShoppingCart className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:scale-110 transition-all duration-1000" size={200} />
            </div>
            
            <div className="bg-white rounded-[4rem] p-16 shadow-xl border-2 border-slate-50 relative overflow-hidden text-left text-left text-left">
                <span className="text-[10px] text-slate-300 tracking-[0.4em] font-black uppercase italic leading-none text-left text-left">VALEUR SHOPPING RÉELLE (HT)</span>
                <div className="text-7xl md:text-9xl mt-8 text-[#38bdf8] tracking-tighter leading-none font-black italic flex items-baseline gap-4 text-left text-left">
                  {totals.euro.toFixed(2)} €
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-slate-900">
                    <TrendingUp size={150} />
                </div>
            </div>
        </div>

        {/* TABLEAU DE PLANIFICATION */}
        <div className="bg-white rounded-[4rem] md:rounded-[5rem] shadow-sm overflow-hidden border-2 border-slate-50 font-black italic uppercase text-center text-center">
            <div className="overflow-x-auto text-center">
                <table className="w-full text-left italic font-black uppercase text-center text-center">
                    <thead className="bg-slate-50/50 text-[10px] text-slate-300 tracking-[0.3em] font-black uppercase italic border-b border-slate-100 text-center text-center text-center text-center">
                        <tr>
                          <th className="p-10 text-center w-24">MOIS</th>
                          <th className="p-10 text-center text-center">COMMANDE (€)</th>
                          <th className="p-10 text-center text-center text-center text-center">TAUX (%)</th>
                          <th className="p-10 text-center text-[#3b82f6] text-center text-center">POINTS GAGNÉS</th>
                          <th className="p-10 text-center text-[#f97316] text-center text-center">DÉPENSES (PTS)</th>
                          <th className="p-10 text-right text-right text-right">SOLDE DISPONIBLE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50 text-center text-center">
                        {simulation.map((row, i) => (
                          <tr key={i} className={`transition-all duration-300 hover:bg-[#f8fafc] ${row.isRepos ? 'opacity-20 pointer-events-none' : ''}`}>
                            <td className="p-8 text-6xl text-slate-100 text-center font-black leading-none italic text-center">{row.monthNum}</td>
                            <td className="p-8 text-center text-center">
                                <div className={`flex items-center gap-4 p-5 rounded-[2.2rem] border-2 transition-all mx-auto max-w-[240px] ${inputsOrder[i] !== '' ? (row.sv >= MIN_SV - 0.005 ? 'border-blue-600 bg-white shadow-xl' : 'border-red-400 bg-white') : 'border-slate-100 bg-[#f8fafc]'}`}>
                                    <input 
                                      type="number" value={inputsOrder[i]} 
                                      onChange={(e) => { const n = [...inputsOrder]; n[i] = e.target.value; setInputsOrder(n); }} 
                                      placeholder="0.00" className="w-full bg-transparent outline-none text-2xl font-black italic text-center text-slate-800 text-center text-center" 
                                    />
                                    <span className="text-slate-200 text-xl font-black italic text-center text-center">€</span>
                                </div>
                            </td>
                            <td className="p-8 text-center text-center text-center">
                                {(row.isVisible && row.valOrder > 0) ? (
                                    <span className="text-slate-300 text-[10px] font-black italic text-center text-center">{(row.rate * 100).toFixed(0)}%</span>
                                ) : null}
                            </td>
                            <td className="p-8 text-center text-blue-500 text-4xl font-black italic leading-none text-center text-center">
                              {row.isVisible ? (row.earned > 0 ? `+${row.earned.toFixed(1)}` : '—') : null}
                            </td>
                            <td className="p-8 text-center text-center text-center">
                                <input 
                                  type="number" value={inputsUsed[i]} 
                                  onChange={(e) => { const n = [...inputsUsed]; n[i] = e.target.value; setInputsUsed(n); }} 
                                  placeholder="0" className="w-24 p-5 bg-[#f8fafc] border border-slate-100 rounded-[1.8rem] text-center text-orange-400 text-2xl font-black italic outline-none focus:border-orange-200 mx-auto text-center text-center" 
                                />
                            </td>
                            <td className="p-8 text-right text-4xl font-black tracking-tighter text-slate-950 italic leading-none text-right text-right">
                              {row.isVisible ? row.balance.toFixed(1) : (i === 0 ? "0.0" : null)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
      
      <footer className="mt-20 py-16 opacity-20 text-center border-t border-slate-200 mx-6 md:mx-32 font-black italic uppercase text-center text-center">
         <p className="text-[12px] tracking-[1em] text-center text-center">BUSINESS NSK PREMIUM • PLANIFICATEUR ADR V122</p>
      </footer>
    </div>
  );
}