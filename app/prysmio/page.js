"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, LayoutDashboard, Target, TrendingUp, RefreshCw, 
  Package, Layers, Lock, Unlock, Star, ArrowRight, 
  AlertTriangle, CheckCircle2, Users, ShieldCheck, Crown
} from 'lucide-react';

// --- CONFIGURATION TECHNIQUE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const REFERRING_BA_FACTOR = 1.20; 
const TEAM_YIELD_PER_SV = 0.045863;    
const GROUP_YIELD_10_PER_SV = 0.0934733; 
const GROUP_YIELD_5_PER_SV = GROUP_YIELD_10_PER_SV / 2;

const PRODUCTS = [
    { id: 1, name: "Beauty Focus (ADR)", clientHT: 52.32, baHT: 40.25, sv: 36.19 },
    { id: 2, name: "Collagene (ADR)", clientHT: 76.71, baHT: 58.99, sv: 50.80 },
    { id: 3, name: "LifePack", clientHT: 102.96, baHT: 79.04, sv: 67.45 },
    { id: 4, name: "JVI (Gibi)", clientHT: 103.27, baHT: 79.49, sv: 66.50 }, 
    { id: 5, name: "Beauty Duo ADR", clientHT: 123.79, baHT: 95.22, sv: 76.48 }, 
    { id: 6, name: "LifePack MarinOmega ADR", clientHT: 130.22, baHT: 100.05, sv: 67.45 }, 
    { id: 7, name: "Pack Essentiel ADR", clientHT: 211.81, baHT: 162.84, sv: 126.70 },
];

export default function PrysmIOPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('simulator');
  const [quantities, setQuantities] = useState(Object.fromEntries(PRODUCTS.map(p => [p.id, ''])));
  const [n2SV, setN2SV] = useState('');
  const [groupSV, setGroupSV] = useState('');
  const [orgSV, setOrgSV] = useState('');

  // --- BLOC DE SÉCURITÉ ---
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
      } catch (e) { console.warn("Security error"); }
    };
    checkAuth();
  }, []);

  // --- MOTEUR DE CALCUL ---
  const calculate = () => {
    let directSV = 0;
    let totalMargin = 0;
    
    PRODUCTS.forEach(p => {
      const q = parseFloat(quantities[p.id]) || 0;
      directSV += p.sv * q;
      totalMargin += (p.clientHT - p.baHT) * q;
    });

    const n2 = parseFloat(n2SV) || 0;
    const group = parseFloat(groupSV) || 0;
    const org = parseFloat(orgSV) || 0;

    const totalVolumeDirect = directSV + n2;
    const isGroupUnlocked = totalVolumeDirect >= 2000;
    const canLead = isGroupUnlocked && group >= 3000;

    let sellRate = 0.04;
    let refRate = 0;
    if (directSV >= 10000) { sellRate = 0.20; refRate = 0.24; }
    else if (directSV >= 2500) { sellRate = 0.16; refRate = 0.20; }
    else if (directSV >= 500) { sellRate = 0.08; refRate = 0.12; }
    else if (directSV >= 250) { sellRate = 0.04; refRate = 0.04; }

    const buildingRate = isGroupUnlocked ? (group >= 3000 ? 0.10 : 0.05) : 0;
    
    const sellingBonus = directSV * REFERRING_BA_FACTOR * sellRate;
    const referringBonus = n2 * REFERRING_BA_FACTOR * refRate;
    const buildingBonus = group * (buildingRate === 0.10 ? GROUP_YIELD_10_PER_SV : (buildingRate === 0.05 ? GROUP_YIELD_5_PER_SV : 0));
    const leadingBonus = canLead ? (org * TEAM_YIELD_PER_SV) : 0;
    
    const totalGains = totalMargin + sellingBonus + referringBonus + buildingBonus + leadingBonus;

    return {
      directSV, totalMargin, totalVolumeDirect, isGroupUnlocked, canLead,
      sellRate, refRate, buildingRate, sellingBonus, referringBonus,
      buildingBonus, leadingBonus, totalGains, group, org
    };
  };

  const results = calculate();

  const resetAll = () => {
    setQuantities(Object.fromEntries(PRODUCTS.map(p => [p.id, ''])));
    setN2SV(''); setGroupSV(''); setOrgSV('');
    setActiveTab('simulator');
  };

  const formatEuro = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

  if (!authorized) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-black italic uppercase tracking-widest text-xs">Initialisation PRYSM Engine...</div>;

  return (
    <div className="text-slate-900 tracking-tight italic font-black uppercase p-4 md:p-8 lg:p-12 bg-[#f1f5f9] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl rotate-3">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl tracking-tighter leading-none italic font-black">
                  PRYSM io <span className="text-indigo-600">Simulateur</span>
                </h1>
                <p className="text-[10px] text-slate-400 tracking-[0.4em] mt-2 italic font-black">Business Strategic Engine v4.7</p>
              </div>
            </div>
            
            <nav className="flex p-1.5 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white w-fit gap-1">
              {[
                {id:'simulator', icon:<LayoutDashboard size={16}/>, label:'Simulateur'},
                {id:'roadmap', icon:<Target size={16}/>, label:'Objectifs'},
                {id:'impact', icon:<TrendingUp size={16}/>, label:'Impact'}
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all duration-300 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-indigo-600'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
              <button onClick={resetAll} className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] text-red-500 hover:bg-red-50 transition-all font-black">
                <RefreshCw size={16} /> Reset
              </button>
            </nav>
          </div>

          <div className="relative group min-w-[320px] md:min-w-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 blur-[60px] opacity-20 scale-110"></div>
            <div className="relative bg-slate-950 p-8 rounded-[4rem] shadow-2xl border border-slate-800 text-center overflow-hidden">
              <p className="text-[10px] text-indigo-400 tracking-[0.5em] mb-4 opacity-70 italic font-black">Net Global Estimé</p>
              <p className="text-5xl md:text-6xl text-white tracking-tighter italic font-black">{formatEuro(results.totalGains)}</p>
              <div className="mt-6 flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-2 px-6 rounded-full mx-auto w-fit font-black italic">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-white/70 tracking-widest uppercase italic font-black">Calcul Temps Réel</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENU - SIMULATEUR */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in fade-in">
            <div className="xl:col-span-2 space-y-10">
              
              {/* VENTES NIVEAU 1 */}
              <div className="bg-white rounded-[3.5rem] shadow-sm border border-white overflow-hidden">
                <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <h2 className="text-slate-800 text-[11px] tracking-[0.3em] flex items-center gap-4 underline decoration-indigo-300 underline-offset-8 font-black">
                    <Package className="w-5 h-5 text-indigo-600" /> Inventaire Niveau 1
                  </h2>
                  <div className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] tracking-widest shadow-lg italic font-black">{Math.round(results.directSV)} SV</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-widest min-w-[500px]">
                    <thead className="bg-slate-50/80 text-slate-400 font-black uppercase">
                      <tr>
                        <th className="px-10 py-8">Désignation</th>
                        <th className="px-6 py-8 text-center">SV</th>
                        <th className="px-6 py-8 text-center w-32">Qté</th>
                        <th className="px-10 py-8 text-right">Marge HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTS.map(p => (
                        <tr key={p.id} className="hover:bg-indigo-50/10 transition-all group duration-300 font-black italic">
                          <td className="px-8 md:px-10 py-8">
                            <p className="text-slate-950 text-base mb-1 font-black group-hover:text-indigo-700">{p.name}</p>
                            <p className="text-[9px] text-slate-400 italic">BA HT: {formatEuro(p.baHT)}</p>
                          </td>
                          <td className="px-6 py-8 text-center text-indigo-600 font-black italic">{p.sv}</td>
                          <td className="px-6 py-8 text-center">
                            <input 
                              type="text" 
                              value={quantities[p.id]} 
                              onChange={(e) => setQuantities({...quantities, [p.id]: e.target.value})}
                              className="w-20 md:w-24 bg-slate-100/50 border-2 border-transparent rounded-[1.5rem] px-4 py-3 text-center font-black text-lg focus:bg-white focus:border-indigo-600 outline-none shadow-inner" 
                              placeholder="0"
                            />
                          </td>
                          <td className="px-8 md:px-10 py-8 text-right text-emerald-600 text-lg font-black italic">
                            {formatEuro((p.clientHT - p.baHT) * (parseFloat(quantities[p.id]) || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-indigo-50/50 p-10 flex justify-between items-center border-t border-indigo-100 font-black italic">
                  <span className="text-indigo-900/40 text-[10px] tracking-widest uppercase">Total Marges Directes</span>
                  <span className="text-indigo-600 text-3xl md:text-4xl tracking-tighter font-black italic">{formatEuro(results.totalMargin)}</span>
                </div>
              </div>

              {/* PERFORMANCE RÉSEAU */}
              <div className="bg-slate-950 rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-slate-800 text-white relative overflow-hidden group">
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-4">
                    <h2 className="uppercase text-[10px] tracking-[0.4em] text-indigo-400 flex items-center gap-5">
                      <Layers className="w-5 h-5" /> Performance Réseau
                    </h2>
                    <div className="bg-indigo-600/20 text-indigo-400 px-6 py-2 rounded-full text-[9px] tracking-widest border border-indigo-600/30 font-black italic">
                      CUMUL N1+N2 : {Math.round(results.totalVolumeDirect)} SV
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 italic font-black">
                    <div className="space-y-6">
                      <label className="text-[10px] text-slate-500 tracking-widest ml-4">Niveau 2 (Affiliés)</label>
                      <input type="text" value={n2SV} onChange={(e) => setN2SV(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center focus:border-purple-500 focus:bg-white/10" placeholder="0" />
                    </div>
                    <div className="space-y-6 relative">
                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] text-slate-500 tracking-widest">Volume Groupe</label>
                        {results.isGroupUnlocked ? <Unlock size={12} className="text-emerald-500" /> : <Lock size={12} className="text-red-500" />}
                      </div>
                      <div className="relative">
                        <input type="text" value={groupSV} onChange={(e) => setGroupSV(e.target.value)} disabled={!results.isGroupUnlocked} className={`w-full bg-white/5 border-2 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center ${!results.isGroupUnlocked ? 'opacity-20' : 'border-indigo-600 shadow-lg shadow-indigo-900/20'}`} placeholder="0" />
                        {!results.isGroupUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="bg-red-600/90 text-white text-[8px] px-3 py-1 rounded-full font-black">2k Direct requis</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6 relative">
                      <div className="flex items-center justify-between ml-4">
                        <label className="text-[10px] text-slate-500 tracking-widest">Volume Équipe</label>
                        {results.canLead ? <Unlock size={12} className="text-emerald-500" /> : <Lock size={12} className="text-red-500" />}
                      </div>
                      <div className="relative">
                        <input type="text" value={orgSV} onChange={(e) => setOrgSV(e.target.value)} disabled={!results.canLead} className={`w-full bg-white/5 border-2 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center ${!results.canLead ? 'opacity-20' : 'border-indigo-600 shadow-lg shadow-indigo-900/20'}`} placeholder="0" />
                        {!results.canLead && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
                            <span className="bg-red-600/90 text-white text-[8px] px-3 py-1 rounded-full font-black">3k Groupe requis</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="space-y-10 italic font-black">
              <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white sticky top-8">
                <h2 className="text-xl mb-12 flex items-center gap-4 border-b border-slate-100 pb-10 tracking-[0.1em] text-slate-950 underline decoration-indigo-200 decoration-[4px] underline-offset-[12px]">
                  <Star className="w-8 h-8 text-indigo-600" /> Récapitulatif
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] font-black uppercase">Bénéfice Ventes</span>
                    <div className="flex justify-between items-center px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 italic">
                      <span className="text-[10px]">Marges Directes</span>
                      <span className="text-xl text-indigo-600 font-black">{formatEuro(results.totalMargin)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-50 pt-8">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] font-black uppercase">Commissions Points</span>
                    <div className="space-y-6 text-[10px] tracking-[0.1em]">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">Selling Bonus</span>
                          <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">{results.sellRate * 100}%</span>
                        </div>
                        <span className="text-base text-slate-950 font-black">{formatEuro(results.sellingBonus)}</span>
                      </div>
                      <div className={`flex justify-between items-center ${results.refRate === 0 ? 'opacity-20 grayscale' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">Referring Bonus</span>
                          <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">{results.refRate > 0 ? (results.refRate * 100) + '%' : 'Off'}</span>
                        </div>
                        <span className="text-base text-slate-950 font-black">{formatEuro(results.referringBonus)}</span>
                      </div>
                      <div className={`flex justify-between items-center ${results.buildingBonus === 0 ? 'opacity-20 grayscale' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">Groupe Bonus</span>
                          <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">{results.buildingRate > 0 ? (results.buildingRate * 100) + '%' : 'Bloqué'}</span>
                        </div>
                        <span className="text-base text-slate-950 font-black">{formatEuro(results.buildingBonus)}</span>
                      </div>
                      <div className={`flex justify-between items-center ${results.leadingBonus === 0 ? 'opacity-20 grayscale' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <span className="text-slate-400">Équipe Bonus</span>
                          <span className="text-[8px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-black">{results.canLead ? 'Lead 5%' : 'Bloqué'}</span>
                        </div>
                        <span className="text-base text-slate-950 font-black">{formatEuro(results.leadingBonus)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-16 border-t-4 border-slate-50 text-center">
                  <p className="text-slate-400 text-[11px] uppercase tracking-[0.4em] mb-10 opacity-40 italic font-black">Versement Net Total</p>
                  <div className="bg-slate-950 p-10 rounded-[3rem] shadow-xl border-4 border-indigo-600/30">
                    <p className="text-5xl text-white tracking-tighter font-black italic">{formatEuro(results.totalGains)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU - ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="animate-in fade-in italic uppercase font-black">
            <div className="bg-white rounded-[4rem] shadow-2xl border border-white p-10 md:p-16 space-y-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-12 gap-8">
                <div>
                  <h2 className="text-4xl md:text-5xl tracking-tighter mb-4 italic">Roadmap Points SV</h2>
                  <p className="text-base text-slate-400 tracking-widest border-l-8 border-indigo-500 pl-6 font-black">Synthèse Performance Globale</p>
                </div>
                <div className="p-10 bg-slate-950 rounded-[3rem] text-center min-w-[300px] border-b-8 border-indigo-600">
                  <p className="text-[10px] text-indigo-400 tracking-[0.5em] mb-2 opacity-70">Volume Cumulé (G+E)</p>
                  <p className="text-5xl text-white tracking-tighter font-black">{Math.round(results.group + results.org)} SV</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12">
                {/* GROUPE PROGRESS */}
                <div className="bg-slate-50/50 p-10 md:p-12 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                    <h3 className="text-2xl md:text-3xl tracking-tight">
                      <span className="underline decoration-indigo-200 decoration-4 underline-offset-8">Groupe</span>
                      <span className="text-lg opacity-30 ml-2 font-black">: Objectif 3k SV</span>
                    </h3>
                    <div className="text-right flex items-center justify-end font-black italic">
                      <span className="text-5xl md:text-6xl text-indigo-600 tracking-tighter">{Math.round(results.group)}</span>
                      <span className="text-slate-300 mx-4 text-2xl">/</span>
                      <span className="text-xl text-slate-400 tracking-widest">3 000 SV</span>
                    </div>
                  </div>
                  <div className="relative h-10 w-full bg-slate-200 rounded-[2rem] overflow-hidden shadow-inner p-1.5 border-4 border-white">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-[1.5rem] transition-all duration-[2000ms]" style={{ width: `${Math.min((results.group / 3000) * 100, 100)}%` }}></div>
                  </div>
                </div>

                {/* EQUIPE PROGRESS */}
                <div className="bg-slate-50/50 p-10 md:p-16 rounded-[4rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 font-black uppercase italic">
                    <h3 className="text-2xl md:text-3xl tracking-tight no-wrap font-black uppercase">
                      <span className="underline decoration-indigo-200 decoration-4 underline-offset-8">Équipe</span>
                      <span className="text-lg opacity-30 ml-2 italic font-black">: Objectif 10k SV</span>
                    </h3>
                    <div className="text-right no-wrap flex items-center justify-end font-black italic uppercase">
                      <span className="text-5xl md:text-7xl text-indigo-600 tracking-tighter font-black italic">{Math.round(results.org)}</span>
                      <span className="text-slate-300 mx-4 text-2xl font-black italic">/</span>
                      <span className="text-xl md:text-2xl text-slate-400 tracking-widest italic font-black uppercase">10 000 SV</span>
                    </div>
                  </div>
                  <div className="relative h-10 w-full bg-slate-200 rounded-[2rem] overflow-hidden shadow-inner p-1.5 border-4 border-white">
                    <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[1.5rem] transition-all duration-[2500ms]" style={{ width: `${Math.min((results.org / 10000) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU - IMPACT */}
        {activeTab === 'impact' && (
          <div className="animate-in fade-in uppercase font-black italic">
            <div className="bg-white rounded-[4rem] shadow-2xl border border-white p-8 md:p-16 space-y-16">
              <div className="flex items-center gap-6 md:gap-10 border-b border-slate-100 pb-12">
                <div className="h-20 w-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl tracking-tighter mb-2 italic">Levier Déblocage</h2>
                  <p className="text-sm md:text-lg text-slate-400 tracking-widest border-l-8 border-red-500 pl-6">Seuil 3 000 SV = Profits Maximisés</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 font-black">
                <div className="space-y-12">
                  <div className="bg-slate-50/80 p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                    <div className="flex justify-between items-center mb-10">
                      <h3 className="text-lg font-black tracking-widest text-slate-800">Volume Groupe (GSV)</h3>
                      <div className={`px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black italic shadow-lg text-white ${results.canLead ? 'bg-emerald-500' : (results.buildingRate > 0 ? 'bg-orange-500' : 'bg-red-500')}`}>
                        {Math.round(results.group)} SV
                      </div>
                    </div>
                    <div className="relative pt-8 pb-6 px-2 italic">
                      <input type="range" min="0" max="5000" step="50" value={results.group} onChange={(e) => setGroupSV(e.target.value)} className="w-full h-8 bg-slate-200 rounded-full appearance-none cursor-pointer accent-red-600" />
                      <div className="absolute top-0 left-0 w-full flex justify-between text-[9px] tracking-[0.2em] text-slate-400 italic">
                        <span>Base</span>
                        <span className="text-indigo-600 underline decoration-indigo-200 font-black">CIBLE : 3 000 SV</span>
                        <span>Elite</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 text-indigo-400 tracking-widest italic">
                      <Users className="w-6 h-6" />
                      <h4 className="text-xl md:text-2xl font-black">Volume Équipe (Org)</h4>
                    </div>
                    <div className="relative flex items-center justify-center min-h-[120px]">
                      <input type="text" value={orgSV} onChange={(e) => setOrgSV(e.target.value)} className="bg-white/5 border-2 border-white/10 rounded-[2rem] px-4 py-8 text-4xl md:text-5xl text-center text-white italic outline-none focus:border-indigo-500 transition-all w-full tracking-tighter" placeholder="0" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  {!results.canLead ? (
                    <div className="flex-1 bg-red-50 border-4 border-red-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center animate-pulse shadow-xl">
                      <TrendingUp className="w-12 h-12 text-red-500 mb-6 rotate-180" />
                      <h4 className="text-lg md:text-xl font-black mb-4 italic">Perte Potentielle</h4>
                      <p className="text-red-950 text-6xl md:text-7xl font-black tracking-tighter mb-10 drop-shadow-md leading-none italic">
                        -{formatEuro((results.org * TEAM_YIELD_PER_SV) + (results.group * (GROUP_YIELD_10_PER_SV - GROUP_YIELD_5_PER_SV)))}
                      </p>
                      <p className="mt-10 text-[9px] text-red-500 tracking-[0.3em] font-black underline italic no-wrap">IL MANQUE {Math.max(0, 3000 - results.group)} SV DANS LE GROUPE</p>
                    </div>
                  ) : (
                    <div className="flex-1 bg-emerald-50 border-4 border-emerald-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl transform scale-105">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-6 animate-bounce" />
                      <h4 className="text-lg md:text-xl font-black mb-4 italic">Gain Actif</h4>
                      <p className="text-emerald-950 text-6xl md:text-7xl font-black tracking-tighter mb-10 drop-shadow-md leading-none italic">
                        +{formatEuro(results.buildingBonus + results.leadingBonus)}
                      </p>
                      <div className="bg-emerald-500 text-white px-8 py-3 rounded-[2rem] text-[12px] tracking-[0.4em] shadow-lg italic font-black">
                        3 000 SV ATTEINTS
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER ENGINE INFO */}
        <footer className="mt-16 pb-12 border-t border-slate-200 pt-16 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase text-slate-400 tracking-[0.5em] italic">
            <div className="flex items-center gap-6 font-black italic">
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse"></div>
                <span>PRYSM io Platinum Engine v4.7</span>
            </div>
            <span className="opacity-30">Strategic Intelligence © Strategy Partners</span>
        </footer>
      </div>
    </div>
  );
}