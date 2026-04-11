"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, RotateCcw, Zap, Users, ShieldCheck, 
  TrendingUp, Star, Lock, Unlock, CheckCircle2, AlertCircle 
} from 'lucide-react';

// --- CONFIGURATION TECHNIQUE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const COEF = { sell: 1.2, ref: 1.2, build: 0.9347333333, lead: 0.045863 };

export default function SimulateurGainsPage() {
  const [authorized, setAuthorized] = useState(false);
  const [svDirect, setSvDirect] = useState('');
  const [svPartenaire, setSvPartenaire] = useState('');
  const [svCercle, setSvCercle] = useState('');
  const [svOrganisation, setSvOrganisation] = useState('');

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
      } catch (e) { console.warn("Security check"); }
    };
    checkAuth();
  }, []);

  // --- CALCULS ---
  const getRates = (dcsv) => {
    const val = parseFloat(dcsv) || 0;
    if (val >= 10000) return { s: 0.20, r: 0.24, tier: "Expert", color: "from-amber-500 to-orange-600" };
    if (val >= 2500)  return { s: 0.12, r: 0.16, tier: "Elite", color: "from-indigo-600 to-purple-700" };
    if (val >= 500)   return { s: 0.08, r: 0.12, tier: "Pro", color: "from-blue-600 to-indigo-700" };
    if (val >= 250)   return { s: 0.04, r: 0.04, tier: "Actif", color: "from-emerald-500 to-teal-600" };
    return { s: 0.04, r: 0.00, tier: "Débutant", color: "from-slate-600 to-slate-700" };
  };

  const calculate = () => {
    const dcsv = parseFloat(svDirect) || 0;
    const l2sv = parseFloat(svPartenaire) || 0;
    const bsv = parseFloat(svCercle) || 0;
    const lsv = parseFloat(svOrganisation) || 0;

    const rates = getRates(dcsv);
    
    let bRate = 0;
    if (bsv >= 3000) bRate = 0.10;
    else if (bsv >= 2000) bRate = 0.05;

    const isBuildingActive = bRate > 0;
    const isLeadingUnlocked = bsv >= 3000;

    const selling = dcsv * rates.s * COEF.sell;
    const referring = l2sv * rates.r * COEF.ref;
    const building = isBuildingActive ? (bsv * bRate * COEF.build) : 0;
    const leading = isLeadingUnlocked ? (lsv * COEF.lead) : 0;
    
    return {
      total: selling + referring + building + leading,
      selling, referring, building, leading,
      rates, bRate, isBuildingActive, isLeadingUnlocked,
      volTotal: bsv + lsv
    };
  };

  const results = calculate();

  const resetAll = () => {
    setSvDirect(''); setSvPartenaire(''); setSvCercle(''); setSvOrganisation('');
  };

  const formatEuro = (v) => v.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!authorized) return null;

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen text-[#0f172a] italic font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation */}
        <button onClick={() => window.location.href = window.location.origin} className="no-print flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={14} /> Retour au Portail
        </button>

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-700 to-blue-800 rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3">
                    <Zap size={28} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Simulateur de <span className="text-indigo-700">gains 2026</span></h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-slate-700 opacity-60">(hors marge revente)</p>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
                <button onClick={resetAll} className="p-4 bg-slate-100 text-slate-900 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-slate-200">
                    <RotateCcw size={24} />
                </button>
                <div className="flex-1 lg:flex-none bg-gradient-to-r from-slate-950 to-indigo-950 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex flex-col items-end border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-1 italic text-nowrap">TOTAL DES GAINS (HT)</span>
                    <span className="text-5xl font-black tracking-tighter flex items-center">
                        {formatEuro(results.total)}
                        <span className="text-2xl font-normal text-slate-500 ml-1">€</span>
                    </span>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SECTION GAUCHE : SAISIE */}
            <div className="lg:col-span-7 space-y-4">
                
                {/* Vente Directe */}
                <div className="p-8 rounded-[2.5rem] border border-indigo-200 bg-indigo-50/70 shadow-sm transition-all hover:bg-indigo-50">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Vente Directe (DCSV)</label>
                            <div className="flex items-baseline gap-2 text-slate-950">
                                <input type="number" value={svDirect} onChange={(e) => setSvDirect(e.target.value)} className="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-indigo-900" placeholder="0" />
                                <span className="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md bg-gradient-to-r ${results.rates.color} transition-all`}>
                          {results.rates.tier}
                        </span>
                    </div>
                    <input type="range" min="0" max="10000" step="50" value={svDirect || 0} onChange={(e) => setSvDirect(e.target.value)} className="w-full h-2 rounded-full appearance-none bg-indigo-200 accent-indigo-600 cursor-pointer" />
                </div>

                {/* Partenaire */}
                <div className="p-8 rounded-[2.5rem] border border-blue-200 bg-blue-50/70 shadow-sm transition-all hover:bg-blue-50">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Partenaire (Niveau 2)</label>
                            <div className="flex items-baseline gap-2 text-slate-950">
                                <input type="number" value={svPartenaire} onChange={(e) => setSvPartenaire(e.target.value)} className="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-blue-900" placeholder="0" />
                                <span className="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        {results.rates.r > 0 && <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md bg-blue-600">{(results.rates.r * 100)}% Com.</span>}
                    </div>
                    <input type="range" min="0" max="20000" step="100" value={svPartenaire || 0} onChange={(e) => setSvPartenaire(e.target.value)} className="w-full h-2 rounded-full appearance-none bg-blue-200 accent-blue-600 cursor-pointer" />
                </div>

                {/* Cercle Groupe */}
                <div className="p-8 rounded-[2.5rem] border border-emerald-200 bg-emerald-50/70 shadow-sm transition-all hover:bg-emerald-50">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Cercle Groupe</label>
                            <div className="flex items-baseline gap-2 text-slate-950">
                                <input type="number" value={svCercle} onChange={(e) => setSvCercle(e.target.value)} className="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-emerald-900" placeholder="0" />
                                <span className="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase transition-all ${results.isBuildingActive ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-white border-slate-300 text-slate-700'}`}>
                            {results.isLeadingUnlocked ? <CheckCircle2 size={14}/> : <Lock size={14}/>}
                            <span>{results.isLeadingUnlocked ? 'Validé 10%' : (results.isBuildingActive ? 'Activé 5%' : 'Seuil 2000')}</span>
                        </div>
                    </div>
                    <input type="range" min="0" max="10000" step="50" value={svCercle || 0} onChange={(e) => setSvCercle(e.target.value)} className="w-full h-2 rounded-full appearance-none bg-emerald-200 accent-emerald-600 cursor-pointer" />
                </div>

                {/* Organisation */}
                <div className="p-8 rounded-[2.5rem] border border-violet-200 bg-violet-50/70 shadow-sm transition-all hover:bg-violet-50">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Organisation</label>
                            <div className="flex items-baseline gap-2 text-slate-950">
                                <input type="number" value={svOrganisation} onChange={(e) => setSvOrganisation(e.target.value)} className="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-violet-900" placeholder="0" />
                                <span className="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                    </div>
                    <input type="range" min="0" max="50000" step="500" value={svOrganisation || 0} onChange={(e) => setSvOrganisation(e.target.value)} className="w-full h-2 rounded-full appearance-none bg-violet-200 accent-violet-600 cursor-pointer" />
                </div>
            </div>

            {/* SECTION DROITE : RECAPITULATIF */}
            <div className="lg:col-span-5 lg:sticky lg:top-8">
                <div className="bg-white rounded-[3rem] p-8 md:p-10 space-y-8 shadow-xl border border-slate-200 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-2">
                            <Star size={18} className="text-amber-500 fill-amber-500" />
                            Détail de vos Gains
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {/* Selling */}
                        <div className={`p-5 rounded-[2rem] border transition-all duration-300 ${parseFloat(svDirect) > 0 ? 'bg-indigo-50 border-indigo-200 opacity-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-20 grayscale'}`}>
                            <div className="flex justify-between items-center text-slate-900">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">Selling Bonus</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">{(results.rates.s * 100)}% × 1.2</span>
                                </div>
                                <div className="text-right font-black"><span className="text-2xl tracking-tighter">{formatEuro(results.selling)}</span><span className="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        {/* Referring */}
                        <div className={`p-5 rounded-[2rem] border transition-all duration-300 ${results.rates.r > 0 ? 'bg-blue-50 border-blue-200 opacity-100 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-20 grayscale'}`}>
                            <div className="flex justify-between items-center text-slate-900">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">Referring Bonus</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">{(results.rates.r * 100)}% × 1.2</span>
                                </div>
                                <div className="text-right font-black"><span className="text-2xl tracking-tighter">{formatEuro(results.referring)}</span><span className="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        {/* Building */}
                        <div className={`p-5 rounded-[2rem] border transition-all duration-300 ${results.isBuildingActive ? 'bg-emerald-50 border-emerald-200 opacity-100 shadow-sm' : (parseFloat(svCercle) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-20 grayscale')}`}>
                            <div className="flex justify-between items-center text-slate-900">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">Building Bonus</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">{results.isBuildingActive ? (results.bRate*100)+'% Validé' : 'Seuil 2000 SV'}</span>
                                </div>
                                <div className="text-right font-black"><span className="text-2xl tracking-tighter">{formatEuro(results.building)}</span><span className="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        {/* Leading */}
                        <div className={`p-5 rounded-[2rem] border transition-all duration-300 ${results.isLeadingUnlocked && parseFloat(svOrganisation) > 0 ? 'bg-violet-50 border-violet-200 opacity-100 shadow-sm' : (parseFloat(svOrganisation) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-20 grayscale')}`}>
                            <div className="flex justify-between items-center text-slate-900">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">Leading Bonus</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">{results.isLeadingUnlocked ? "Leading 5%" : "Cercle requis (3k)"}</span>
                                </div>
                                <div className="text-right font-black"><span className="text-2xl tracking-tighter">{formatEuro(results.leading)}</span><span className="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Volume Total */}
                    <div className="pt-8 border-t border-slate-200">
                        <div className="flex justify-between items-center bg-slate-950 p-6 rounded-[2rem] text-white shadow-xl border border-slate-800">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest block opacity-60">Volume (Cercle + Org)</span>
                                <p className="text-3xl font-black tracking-tighter">{results.volTotal.toLocaleString()} <span className="text-sm font-normal text-slate-400 ml-1 uppercase">SV</span></p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl text-indigo-400">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                    </div>

                    {/* Alert Box */}
                    {parseFloat(svCercle) > 0 && parseFloat(svCercle) < 3000 && (
                      <div className="bg-amber-50 p-5 rounded-[2rem] border border-amber-200 flex items-center gap-4 shadow-sm animate-pulse">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                              <AlertCircle size={20} />
                          </div>
                          <div className="flex-1">
                              <p className="text-[10px] font-black text-amber-900 uppercase leading-none mb-1 tracking-tighter">
                                {parseFloat(svCercle) < 2000 ? "Accès Bonus" : "Accès Leader"}
                              </p>
                              <p className="text-[13px] font-bold text-amber-700 leading-tight">
                                Encore <span className="text-amber-950 font-black">{(parseFloat(svCercle) < 2000 ? 2000 - svCercle : 3000 - svCercle).toLocaleString()} SV</span> en Cercle pour débloquer le palier suivant.
                              </p>
                          </div>
                      </div>
                    )}
                </div>
            </div>
        </div>

        <footer className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-50 italic">
          Strategic Earnings Intelligence v2.0 © Invest In Your Future
        </footer>
      </div>
    </div>
  );
}