"use client";

import React, { useState, useMemo } from 'react';
import { 
  Zap, LayoutDashboard, Target, TrendingUp, RefreshCw, 
  Package, Layers, Star, Lock, Unlock, ShieldCheck,
  Users, LayoutGrid, CheckCircle2, Info
} from 'lucide-react';

/**
 * --- CONFIGURATION MASTER 2026 ---
 * Valeur Pivot (5%) : 0,0457818 € (Basé sur 1 SV * 0.915636 * 5%)
 * Seuil Lead : 3 000 GSV
 * Seuil L2 : 500 L1 SV
 */
const VALEUR_PIVOT_5PCT = 0.0457818; 
const LEAD_THRESHOLD = 3000;
const L2_UNLOCK_THRESHOLD = 500;

const PRODUCTS = [
  { id: 1, name: "Beauty Focus (ADR)", clientHT: 52.32, baHT: 40.25, sv: 36.19 },
  { id: 2, name: "Collagène (ADR)", clientHT: 76.71, baHT: 58.99, sv: 50.80 },
  { id: 3, name: "LifePak", clientHT: 102.96, baHT: 79.04, sv: 67.45 },
  { id: 4, name: "JVI", clientHT: 103.27, baHT: 79.49, sv: 66.50 }, 
  { id: 5, name: "Beauty Duo (ADR)", clientHT: 123.79, baHT: 95.22, sv: 76.48 }, 
  { id: 6, name: "LifePak Marine Omega (ADR)", clientHT: 130.22, baHT: 100.05, sv: 67.45 }, 
  { id: 7, name: "Pack Essentiel (ADR)", clientHT: 211.81, baHT: 162.84, sv: 126.70 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [quantities, setQuantities] = useState({});
  const [n2Sv, setN2Sv] = useState(0);
  const [buildGsv, setBuildGsv] = useState(0);
  const [g1Sv, setG1Sv] = useState(0); 
  const [teamSv, setTeamSv] = useState(0);

  // NAVIGATION AVEC REMONTÉE AUTO
  const switchTab = (tab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const resetAll = () => {
    if (typeof window !== 'undefined' && !window.confirm("Remettre toutes les données à zéro ?")) return;
    setQuantities({});
    setN2Sv(0);
    setBuildGsv(0);
    setG1Sv(0);
    setTeamSv(0);
    switchTab('simulator');
  };

  const stats = useMemo(() => {
    let totalMargin = 0; 
    let l1Sv = 0;

    PRODUCTS.forEach(p => {
      const q = quantities[p.id] || 0;
      totalMargin += (p.clientHT - p.baHT) * q;
      l1Sv += p.sv * q;
    });

    const isL2Unlocked = l1Sv >= L2_UNLOCK_THRESHOLD;
    const bonusL1 = l1Sv * VALEUR_PIVOT_5PCT;
    const bonusL2 = isL2Unlocked ? (n2Sv * VALEUR_PIVOT_5PCT) : 0;

    const totalGsv = Math.max(l1Sv + n2Sv, buildGsv);
    
    const getBuildRate = (gsv) => {
      if (gsv >= 10000) return 0.25;
      if (gsv >= 5000) return 0.20;
      if (gsv >= 3000) return 0.15;
      if (gsv >= 2000) return 0.10;
      return 0;
    };

    const buildRate = getBuildRate(totalGsv);
    const bonusBuild = totalGsv * (VALEUR_PIVOT_5PCT * (buildRate / 0.05));
    const isLeadQualified = totalGsv >= LEAD_THRESHOLD;
    
    const bonusLead10 = isLeadQualified ? (g1Sv * VALEUR_PIVOT_5PCT * 2) : 0; 
    const bonusLead05 = isLeadQualified ? (teamSv * VALEUR_PIVOT_5PCT) : 0; 

    const grandTotal = totalMargin + bonusL1 + bonusL2 + bonusBuild + bonusLead10 + bonusLead05;

    return {
      totalMargin, l1Sv, n2Sv, g1Sv, teamSv, totalGsv, buildRate, 
      bonusL1, bonusL2, bonusBuild, bonusLead10, bonusLead05, grandTotal,
      isL2Unlocked, isLeadQualified
    };
  }, [quantities, n2Sv, buildGsv, g1Sv, teamSv]);

  const formatEuro = (val) => val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 italic font-black uppercase p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* BOUTON RETOUR MES APPS */}
        <div className="mb-8 flex justify-start">
            <button onClick={() => typeof window !== 'undefined' && window.history.back()} className="flex items-center gap-3 text-indigo-600 hover:opacity-70 transition-all group">
                <LayoutGrid className="w-6 h-6" />
                <span className="text-lg md:text-xl font-black italic uppercase tracking-wider">Retour Mes Apps</span>
            </button>
        </div>

        {/* HEADER RÉCAPITULATIF */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl rotate-3">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl tracking-tighter leading-none italic font-black text-slate-950 uppercase">
                    PRYSM io <span className="text-indigo-600">Master</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-[0.4em] mt-2 italic font-black uppercase">Performance Strategist 2026 v5.3</p>
              </div>
            </div>

            <nav className="flex p-1.5 bg-white rounded-[2.5rem] shadow-sm border border-white w-fit gap-2 overflow-x-auto">
              <button onClick={() => switchTab('simulator')} className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[13px] transition-all whitespace-nowrap ${activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <LayoutDashboard className="w-5 h-5" /> Simulateur
              </button>
              <button onClick={() => switchTab('roadmap')} className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[13px] transition-all whitespace-nowrap ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Target className="w-5 h-5" /> Roadmap
              </button>
              <button onClick={() => switchTab('impact')} className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[13px] transition-all whitespace-nowrap ${activeTab === 'impact' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
                <TrendingUp className="w-5 h-5" /> Impact
              </button>
              <button onClick={resetAll} className="flex items-center gap-3 px-8 py-4 rounded-[1.5rem] text-[13px] text-red-500 font-black hover:bg-red-50 whitespace-nowrap">
                <RefreshCw className="w-5 h-5" /> Reset
              </button>
            </nav>
          </div>

          <div className="relative min-w-[320px] md:min-w-[420px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 blur-[60px] opacity-20 scale-110"></div>
            <div className="relative bg-slate-950 p-8 rounded-[4rem] shadow-2xl border border-slate-800 text-center">
              <p className="text-[9px] text-indigo-400 tracking-[0.6em] mb-4 opacity-70 italic font-black uppercase">Net Mensuel Global Estimé</p>
              <p className="text-5xl md:text-6xl lg:text-7xl text-white tracking-tighter tabular-nums font-black">
                {stats.grandTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </p>
              <div className="mt-6 flex items-center justify-center gap-3 bg-white/5 py-2 px-6 rounded-full mx-auto w-fit italic">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-white/70 tracking-widest font-black uppercase">Calcul Master Approuvé</span>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in duration-500">
            
            <div className="xl:col-span-8 space-y-10">
              <div className="bg-white rounded-[3.5rem] shadow-sm border border-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4">
                  <h2 className="text-[11px] tracking-[0.3em] flex items-center gap-4 font-black italic uppercase">
                    <Package className="w-5 h-5 text-indigo-600" /> 1. Ligne Directe (L1)
                  </h2>
                  <div className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[13px] shadow-lg italic font-black uppercase">{stats.l1Sv.toFixed(0)} SV</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-widest min-w-[550px]">
                    <thead className="bg-slate-50 text-slate-400 font-black italic uppercase">
                      <tr>
                        <th className="px-10 py-8">Désignation</th>
                        <th className="px-6 py-8 text-center w-24">SV</th>
                        <th className="px-6 py-8 text-center w-32">Qté</th>
                        <th className="px-10 py-8 text-right w-44">Marge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-black italic uppercase">
                      {PRODUCTS.map(p => (
                        <tr key={p.id} className="hover:bg-indigo-50/10 transition-all">
                          <td className="px-10 py-8">
                            <p className="text-slate-900 md:text-xl font-black">{p.name}</p>
                            <p className="text-[9px] text-slate-400 mt-1">BA HT: {formatEuro(p.baHT)}</p>
                          </td>
                          <td className="px-6 py-8 text-center text-indigo-600 text-lg align-middle">{p.sv}</td>
                          <td className="px-6 py-8 text-center align-middle">
                            <input 
                              type="number" value={quantities[p.id] || ""} 
                              onChange={(e) => setQuantities({...quantities, [p.id]: parseInt(e.target.value) || 0})}
                              className="w-20 md:w-28 bg-slate-100 rounded-xl px-4 py-3 text-center font-black text-lg focus:bg-white border-2 border-transparent focus:border-indigo-600 outline-none transition-all" 
                              placeholder="0"
                            />
                          </td>
                          <td className="px-10 py-8 text-right text-emerald-600 text-lg md:text-xl align-middle">
                            {((p.clientHT - p.baHT) * (quantities[p.id] || 0)).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-indigo-50/50 p-10 flex justify-between items-center border-t border-indigo-100">
                    <span className="text-indigo-900/40 text-[10px] tracking-widest uppercase italic">Total Marges Ventes Directes</span>
                    <span className="text-indigo-600 text-3xl md:text-4xl tracking-tighter italic font-black uppercase">{formatEuro(stats.totalMargin)}</span>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[4.5rem] p-10 md:p-14 shadow-2xl border border-slate-800 text-white space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center font-black italic uppercase">
                    <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 flex items-center gap-4"><Users className="w-5 h-5" /> 2. Ligne Partenaires (L2)</h2>
                    <span className="text-3xl text-white font-black">{n2Sv.toFixed(0)} SV</span>
                  </div>
                  <input type="range" min="0" max="10000" step="100" value={n2Sv} onChange={(e) => setN2Sv(parseInt(e.target.value))} className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                </div>

                <div className="space-y-6 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center font-black italic uppercase">
                    <div className="flex items-center gap-4 uppercase">
                       <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">3. Volume Groupe (GSV)</h2>
                       {!stats.isL2Unlocked ? <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1"><Lock size={10}/> 500 L1 REQUIS</div> : <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1"><Unlock size={10}/> ACTIF</div>}
                    </div>
                    <span className="text-3xl text-white font-black">{stats.totalGsv.toFixed(0)} SV</span>
                  </div>
                  <input type="range" min="0" max="25000" step="250" value={buildGsv} onChange={(e) => setBuildGsv(parseInt(e.target.value))} className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                </div>

                <div id="lead-section-1" className={`space-y-6 pt-8 border-t border-white/5 transition-opacity ${!stats.isLeadQualified ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex justify-between items-center font-black italic uppercase">
                    <div className="flex items-center gap-4 uppercase">
                       <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">4. Volume G1 BR (10%)</h2>
                       {!stats.isLeadQualified ? <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1"><Lock size={10}/> 3000 GSV REQUIS</div> : <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase flex items-center gap-1"><Unlock size={10}/> DÉBLOQUÉ</div>}
                    </div>
                    <span className="text-3xl text-white font-black">{g1Sv.toFixed(0)} SV</span>
                  </div>
                  <input 
                    type="range" min="0" max="100000" step="500" value={g1Sv} 
                    disabled={!stats.isLeadQualified}
                    onChange={(e) => setG1Sv(parseInt(e.target.value))} 
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500" 
                  />
                </div>

                <div id="lead-section-2" className={`space-y-6 pt-8 border-t border-white/5 transition-opacity ${!stats.isLeadQualified ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex justify-between items-center font-black italic uppercase">
                    <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">5. Volume Profondeur (5%)</h2>
                    <span className="text-3xl text-white font-black">{teamSv.toFixed(0)} SV</span>
                  </div>
                  <input 
                    type="range" min="0" max="500000" step="1000" value={teamSv} 
                    disabled={!stats.isLeadQualified}
                    onChange={(e) => setTeamSv(parseInt(e.target.value))} 
                    className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-500" 
                  />
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 space-y-10 font-black italic uppercase">
              <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white sticky top-8 italic uppercase font-black">
                <h2 className="text-xl mb-12 flex items-center gap-4 border-b border-slate-100 pb-10 tracking-[0.1em] text-slate-950 underline decoration-indigo-200 decoration-[4px] underline-offset-[12px] font-black italic"><Star className="w-8 h-8 text-indigo-600" /> Détail Gains</h2>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] uppercase italic">Profit Commercial</span>
                    <div className="flex justify-between items-center px-4 py-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 font-black italic uppercase">
                        <span className="text-[10px]">Marges Ventes</span>
                        <span className="text-2xl text-indigo-600 font-black">{stats.totalMargin.toFixed(2)} €</span>
                    </div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-slate-100 font-black italic uppercase">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] uppercase">Commissions Master 2026</span>
                    <div className="flex justify-between items-center font-black"><p className="text-xs">Bonus L1 (5%)</p><span className="text-xl text-slate-950 font-black">{stats.bonusL1.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isL2Unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Bonus L2 (5%)</p><span className="text-xl text-slate-950 font-black">{stats.bonusL2.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.buildRate > 0 ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Build ({(stats.buildRate * 100).toFixed(0)}%)</p><span className="text-xl text-indigo-600 font-black">{stats.bonusBuild.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isLeadQualified ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Lead G1 (10%)</p><span className="text-xl text-blue-600 font-black">{stats.bonusLead10.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isLeadQualified ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Lead Depth (5%)</p><span className="text-xl text-emerald-600 font-black">{stats.bonusLead05.toFixed(2)} €</span></div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t-4 border-slate-50 text-center">
                    <p className="text-slate-400 text-[11px] uppercase tracking-[0.4em] mb-10 opacity-40 italic font-black">Versement Net Total</p>
                    <div className="bg-slate-950 p-10 rounded-[3rem] shadow-xl border-4 border-indigo-600/30">
                        <p className="text-5xl text-white tracking-tighter font-black italic">{stats.grandTotal.toFixed(2)} €</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-[4rem] p-10 md:p-16 animate-in fade-in duration-500 space-y-16 shadow-xl border border-white font-black italic uppercase">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-12 gap-8 font-black uppercase italic">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase no-wrap italic">Roadmap Points SV</h2>
                  <p className="text-base text-slate-400 tracking-widest border-l-8 border-indigo-600 pl-6 uppercase font-black italic">Synthèse Performance Globale</p>
               </div>
               <div className="p-10 bg-slate-950 rounded-[3rem] text-center min-w-[300px] shadow-xl border-b-8 border-indigo-600 italic font-black">
                  <p className="text-[10px] text-indigo-400 tracking-[0.5em] mb-2 uppercase font-black">Volume Global Cumulé</p>
                  <p className="text-5xl text-white font-black">{(stats.totalGsv + stats.g1Sv + stats.teamSv).toFixed(0)} SV</p>
               </div>
            </div>
            <div className="grid grid-cols-1 gap-12">
               <div className="bg-slate-50/50 p-10 md:p-12 rounded-[4rem] border border-slate-100 shadow-sm font-black italic uppercase">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                     <h3 className="text-2xl md:text-3xl tracking-tight no-wrap font-black uppercase italic">
                        <span className="underline decoration-indigo-200 decoration-4 underline-offset-8">Qualification Master Lead</span>
                        <span className="text-lg opacity-30 ml-2 italic">: Seuil 3 000 SV</span>
                     </h3>
                     <div className="text-right no-wrap flex items-center justify-end font-black italic uppercase">
                        <span className="text-5xl md:text-6xl text-indigo-600 tracking-tighter font-black">{stats.totalGsv.toFixed(0)}</span>
                        <span className="text-slate-300 mx-4 text-2xl font-black italic">/</span>
                        <span className="text-xl text-slate-400 tracking-widest uppercase italic"> 3 000 SV</span>
                     </div>
                  </div>
                  <div className="relative h-12 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner p-1.5 border-4 border-white font-black">
                     <div className="h-full bg-gradient-to-r from-orange-400 to-indigo-600 rounded-full transition-all duration-1000 animate-stripe" style={{ width: `${Math.min((stats.totalGsv / LEAD_THRESHOLD) * 100, 100)}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="bg-white rounded-[4rem] shadow-2xl border border-white p-8 md:p-16 space-y-16 font-black italic uppercase">
            <div className="flex items-center gap-6 md:gap-10 border-b border-slate-100 pb-12 uppercase font-black italic">
                <div className="h-20 w-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                    <h2 className="text-3xl md:text-5xl tracking-tighter mb-2 italic uppercase whitespace-nowrap font-black">Levier de Rendement</h2>
                    <p className="text-sm md:text-lg text-slate-400 tracking-widest border-l-8 border-red-500 pl-6 uppercase font-black italic">Seuil 3 000 GSV = Profits Master</p>
                </div>
            </div>

            <div className="flex flex-col font-black italic uppercase font-black">
                {!stats.isLeadQualified ? (
                    <div className="bg-red-50 border-4 border-red-100 rounded-[3rem] p-12 text-center animate-pulse shadow-xl uppercase italic">
                        <TrendingUp className="w-16 h-16 text-red-500 mx-auto mb-6" />
                        <h4 className="text-xl md:text-2xl font-black mb-4 italic uppercase">Manque à gagner total</h4>
                        <p className="text-red-950 text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 italic uppercase font-black">
                            -{((stats.g1Sv * VALEUR_PIVOT_5PCT * 2) + (stats.teamSv * VALEUR_PIVOT_5PCT)).toFixed(2)} €
                        </p>
                        <p className="text-[11px] text-red-700 tracking-[0.3em] font-black underline uppercase italic">
                            Il vous manque {Math.round(3000 - stats.totalGsv)} GSV pour débloquer les commissions Équipe
                        </p>
                    </div>
                ) : (
                    <div className="bg-emerald-50 border-4 border-emerald-100 rounded-[3rem] p-12 text-center shadow-xl transform scale-105 uppercase italic">
                        <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-6 font-black italic" />
                        <h4 className="text-xl md:text-2xl font-black mb-4 italic uppercase font-black">Qualification Master OK</h4>
                        <p className="text-emerald-950 text-6xl md:text-7xl lg:text-8xl impact-text-size font-black tracking-tighter mb-8 italic uppercase font-black">
                            +{(stats.bonusLead10 + stats.bonusLead05).toFixed(2)} €
                        </p>
                        <div className="flex items-center gap-3 bg-emerald-500 text-white px-8 py-3 rounded-full mx-auto w-fit text-xs font-black uppercase italic font-black">
                           <CheckCircle2 className="w-5 h-5 font-black" /> Leader Master Débloqué
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        input[type='range'] { -webkit-appearance: none; background: transparent; }
        input[type='range']::-webkit-slider-thumb { 
            -webkit-appearance: none; height: 32px; width: 32px; border-radius: 50%; background: #ffffff; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); cursor: pointer; border: 4px solid #4f46e5; margin-top: -12px; 
        }
        input[type='range']::-webkit-slider-runnable-track { width: 100%; height: 8px; background: #1e293b; border-radius: 10px; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}