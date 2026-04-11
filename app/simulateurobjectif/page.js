"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Target, User, Users, Globe, 
  Lock, Unlock, ShieldCheck, TrendingUp, 
  Zap, AlertTriangle, CheckCircle2, RotateCcw,
  Trophy, Medal, Star
} from 'lucide-react';

// --- CONFIGURATION TECHNIQUE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const MULTIPLIER_HT = 1.2;
const RATIO_BR_NET = 282.16 / 3018.60;
const RATIO_LDR_NET = 2181.10 / 47557.29;

export default function SimulateurObjectifPage() {
  const [authorized, setAuthorized] = useState(false);
  
  // États des Inputs
  const [targetIncome, setTargetIncome] = useState('');
  const [personalSv, setPersonalSv] = useState(0);
  const [n1Clients, setN1Clients] = useState(0);
  const [n1SvPerClient, setN1SvPerClient] = useState(0);
  const [l1Partners, setL1Partners] = useState(0);
  const [l1PartnerVolume, setL1PartnerVolume] = useState(0);
  const [n2Clients, setN2Clients] = useState(0);
  const [n2SvPerClient, setN2SvPerClient] = useState(0);
  const [leadingVolume, setLeadingVolume] = useState(0);

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
      } catch (e) { console.warn("Security initialisation"); }
    };
    checkAuth();
  }, []);

  // --- CALCULS ---
  const getBracket = (sv) => {
    const val = Number(sv) || 0;
    if (val < 250) return { s: 0.04, r: 0.00 };
    if (val < 500) return { s: 0.04, r: 0.04 };
    if (val < 2500) return { s: 0.08, r: 0.12 };
    if (val < 10000) return { s: 0.12, r: 0.16 };
    return { s: 0.20, r: 0.24 };
  };

  const calculate = () => {
    const svN1 = n1Clients * n1SvPerClient;
    const svL1 = l1Partners * l1PartnerVolume;
    const svN2 = n2Clients * n2SvPerClient;
    const networkSv = svL1 + svN2;
    const totalGsv = personalSv + svN1 + networkSv;

    const isBrQualified = totalGsv >= 2000;
    const isLeadingQualified = totalGsv >= 3000;

    const bracket = getBracket(svN1);
    const gainSelling = (svN1 * MULTIPLIER_HT) * bracket.s;
    const gainReferring = (networkSv * MULTIPLIER_HT) * bracket.r;

    let brTotal = 0; let brRate = 0;
    if(totalGsv >= 3000) { brRate = 0.10; brTotal = totalGsv * RATIO_BR_NET; }
    else if(totalGsv >= 2000) { brRate = 0.05; brTotal = totalGsv * (RATIO_BR_NET / 2); }

    const leaderTotal = isLeadingQualified ? (leadingVolume * RATIO_LDR_NET) : 0;
    const grandTotal = gainSelling + gainReferring + brTotal + leaderTotal;

    const target = parseFloat(targetIncome) || 0;
    const progressPercent = target > 0 ? Math.min(100, Math.round((grandTotal / target) * 100)) : 0;

    return {
      svN1, networkSv, totalGsv, isBrQualified, isLeadingQualified,
      bracket, gainSelling, gainReferring, brTotal, brRate, 
      leaderTotal, grandTotal, progressPercent
    };
  };

  const results = calculate();

  const handleAutoRoute = () => {
    const income = parseFloat(targetIncome) || 0;
    if(income <= 0) return;

    setPersonalSv(200);
    setN1Clients(15);
    setN1SvPerClient(100);
    setL1Partners(4);
    setL1PartnerVolume(500);
    setN2Clients(20);
    setN2SvPerClient(50);

    const fixedGain = (1500 * 1.2 * 0.12) + (3000 * 1.2 * 0.16) + (4700 * RATIO_BR_NET);
    const needed = Math.max(0, Math.ceil((income - fixedGain) / RATIO_LDR_NET));
    setLeadingVolume(needed);
  };

  const resetAll = () => {
    setTargetIncome(''); setPersonalSv(0); setN1Clients(0); setN1SvPerClient(0);
    setL1Partners(0); setL1PartnerVolume(0); setN2Clients(0); setN2SvPerClient(0);
    setLeadingVolume(0);
  };

  const formatEuro = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v);

  if (!authorized) return null;

  return (
    <div className="p-4 md:p-8 bg-[#FBFBFA] min-h-screen text-[#1E293B] italic font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Titre */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="text-left border-l-4 border-indigo-600 pl-6">
                <button onClick={() => window.location.href = window.location.origin} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 transition-all mb-2">
                    <ArrowLeft size={14} /> Retour au portail
                </button>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Simulateur d'objectif</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Calculateur Stratégique de Commissions 2026</p>
            </div>
            <button onClick={resetAll} className="w-fit p-4 bg-white text-slate-400 hover:text-red-500 rounded-3xl transition-all shadow-sm border border-slate-100 flex items-center gap-3 font-black text-[10px] uppercase italic">
                <RotateCcw size={16} /> Réinitialiser
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* SECTION GAUCHE : PARAMÈTRES */}
            <div className="lg:col-span-7 space-y-8">
                
                {/* 1. OBJECTIF NET */}
                <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                        <Trophy size={200} />
                    </div>
                    <div className="relative z-10 flex flex-col gap-6 text-left">
                        <div className="flex justify-between items-center italic mb-4 leading-none">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                                <Zap size={14}/> Revenu Mensuel Souhaité
                            </label>
                            <button onClick={handleAutoRoute} className="px-5 py-2.5 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform active:scale-95">
                                Tracer ma route
                            </button>
                        </div>
                        <div className="flex items-baseline gap-4 border-b-2 border-indigo-400 pb-2">
                            <input type="number" value={targetIncome} onChange={(e) => setTargetIncome(e.target.value)} className="text-6xl font-black bg-transparent outline-none w-full italic tabular-nums text-left placeholder:text-white/20" placeholder="0" />
                            <span className="text-3xl font-black opacity-40">€</span>
                        </div>
                    </div>
                </div>

                {/* 2. VOLUME PROPRE */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 text-left">
                    <div className="flex justify-between items-center leading-none">
                        <h3 className="font-black italic uppercase text-indigo-900 flex items-center gap-3">
                            <Star size={20} className="text-indigo-600 fill-indigo-100"/> 1. Volume Propre
                        </h3>
                        <span className="text-2xl font-black italic tabular-nums text-indigo-600">{personalSv} SV</span>
                    </div>
                    <input type="range" min="0" max="2000" step="50" value={personalSv} onChange={(e) => setPersonalSv(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-indigo-600" />
                </div>

                {/* 3. CLIENTS N1 */}
                <div className="bg-white p-8 rounded-[3.5rem] border border-indigo-100 shadow-sm space-y-8 text-left">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="font-black italic uppercase text-indigo-900 flex items-center gap-3 leading-none">
                                <User size={20} className="text-indigo-600"/> 2. Mes Clients (N1)
                            </h3>
                            <p className="text-2xl font-black text-indigo-600 tabular-nums ml-8">{results.svN1.toLocaleString()} SV</p>
                        </div>
                        <div className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm italic ring-4 ring-indigo-50">
                            Selling: {Math.round(results.bracket.s * 100)}%
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Nb de clients</p>
                            <p className="text-3xl font-black italic text-indigo-600 tabular-nums leading-none">{n1Clients}</p>
                            <input type="range" min="0" max="50" value={n1Clients} onChange={(e) => setN1Clients(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-indigo-400" />
                        </div>
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Volume / client</p>
                            <p className="text-3xl font-black italic text-indigo-600 tabular-nums leading-none">{n1SvPerClient} SV</p>
                            <input type="range" min="0" max="500" step="5" value={n1SvPerClient} onChange={(e) => setN1SvPerClient(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-indigo-400" />
                        </div>
                    </div>
                </div>

                {/* 4. LEVIER RÉSEAU */}
                <div className="bg-blue-50/50 p-8 rounded-[3.5rem] border border-blue-100 shadow-sm space-y-8 text-left">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="font-black italic uppercase text-blue-900 flex items-center gap-3 leading-none">
                                <Globe size={20} className="text-blue-600"/> 3. Levier Réseau (L1 & N2)
                            </h3>
                            <p className="text-2xl font-black text-blue-600 tabular-nums ml-8">{results.networkSv.toLocaleString()} SV</p>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg italic ring-4 ring-blue-50">
                            Referring: {Math.round(results.bracket.r * 100)}%
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 border-t border-blue-100 pt-6">
                        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Partenaires Directs (L1)</p>
                            <p className="text-3xl font-black italic text-blue-600 tabular-nums leading-none">{l1Partners}</p>
                            <input type="range" min="0" max="20" value={l1Partners} onChange={(e) => setL1Partners(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-blue-600" />
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] font-black text-slate-300 uppercase italic">Vol / Partenaire</p>
                                <p className="text-xs font-black text-slate-400 uppercase">{l1PartnerVolume} SV</p>
                            </div>
                            <input type="range" min="0" max="2000" step="50" value={l1PartnerVolume} onChange={(e) => setL1PartnerVolume(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-blue-300" />
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Clients Réseau (N2)</p>
                            <p className="text-3xl font-black italic text-blue-600 tabular-nums leading-none">{n2Clients}</p>
                            <input type="range" min="0" max="100" value={n2Clients} onChange={(e) => setN2Clients(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-blue-500" />
                            <div className="flex justify-between items-center">
                                <p className="text-[9px] font-black text-slate-300 uppercase italic">Vol / Client N2</p>
                                <p className="text-xs font-black text-slate-400 uppercase">{n2SvPerClient} SV</p>
                            </div>
                            <input type="range" min="0" max="500" step="5" value={n2SvPerClient} onChange={(e) => setN2SvPerClient(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-blue-300" />
                        </div>
                    </div>
                </div>

                {/* 5. CERCLE GROUPE (SÉCURITÉ) */}
                <div className={`p-8 rounded-[3.5rem] border-2 transition-all duration-700 italic text-left shadow-xl ${results.isLeadingQualified ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="space-y-1">
                            <h3 className="font-black italic uppercase text-lg text-slate-900 leading-tight italic">5. Cercle Groupe (GSV)</h3>
                            <div className="flex items-center gap-2">
                                {results.isLeadingQualified ? <CheckCircle2 size={16} className="text-emerald-600"/> : <AlertTriangle size={16} className="text-amber-500"/>}
                                <p className={`text-[10px] font-black uppercase tracking-widest ${results.isLeadingQualified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {results.isLeadingQualified ? 'Qualification Leader OK' : 'Seuil 3000 SV Requis'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right italic">
                            <p className={`text-4xl font-black tabular-nums leading-none ${results.isLeadingQualified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {results.totalGsv.toLocaleString()}
                            </p>
                            <p className="text-[10px] font-black uppercase mt-1 opacity-40 italic">SV Global</p>
                        </div>
                    </div>
                    {!results.isLeadingQualified && (
                        <div className="mt-6 p-4 bg-white/50 rounded-2xl border border-dashed border-amber-200 flex items-center gap-3 italic font-bold text-amber-700 text-[11px]">
                            Manque <span className="font-black">{(3000 - results.totalGsv).toLocaleString()} SV</span> pour débloquer l'Organisation.
                        </div>
                    )}
                </div>

                {/* 6. ORGANISATION (OVERLAY) */}
                <div className={`p-8 rounded-[4rem] border-2 transition-all duration-500 italic relative overflow-hidden shadow-2xl text-left ${results.isLeadingQualified ? 'bg-white border-purple-100' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'}`}>
                    {!results.isLeadingQualified && (
                        <div className="absolute inset-0 z-20 bg-slate-900/5 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-slate-200">
                                <Lock size={24} className="text-amber-500" strokeWidth={3} />
                                <span className="text-xs font-black uppercase text-slate-700 tracking-widest italic">Qualification Leader Requise</span>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between items-start mb-8 text-left italic">
                        <div className="flex gap-4 italic text-left">
                            <div className={`p-3 rounded-2xl text-white italic shadow-lg transition-all duration-500 ${results.isLeadingQualified ? 'bg-purple-600' : 'bg-slate-400'}`}>
                                {leadingVolume >= 5000 ? <Medal size={24}/> : <Trophy size={24}/>}
                            </div>
                            <div>
                                <h3 className="font-black italic uppercase text-lg text-slate-900 leading-tight italic">6. Organisation</h3>
                                <p className={`text-[10px] uppercase font-bold mt-1 leading-none italic ${results.isLeadingQualified ? 'text-purple-600' : 'text-slate-400'}`}>
                                    {results.isLeadingQualified ? (leadingVolume >= 5000 ? 'Leader Actif' : 'Qualification OK') : 'Section Verrouillée'} (5%)
                                </p>
                            </div>
                        </div>
                        <div className="text-right italic">
                            <p className={`text-3xl font-black italic tabular-nums leading-none ${results.isLeadingQualified ? 'text-purple-600' : 'text-slate-400'}`}>
                                {leadingVolume.toLocaleString()} SV
                            </p>
                            <p className="text-[9px] font-black text-slate-300 uppercase mt-1 italic">Volume Profondeur</p>
                        </div>
                    </div>
                    <input type="range" min="0" max="500000" step="1000" value={leadingVolume} disabled={!results.isLeadingQualified} onChange={(e) => setLeadingVolume(parseInt(e.target.value))} className="w-full h-2 rounded-full appearance-none bg-slate-100 accent-purple-600 cursor-pointer" />
                </div>
            </div>

            {/* SECTION DROITE : BILAN COMMISSIONS */}
            <div className="lg:col-span-5 italic">
                <div className="bg-[#0f172a] rounded-[4rem] p-10 text-white shadow-2xl min-h-[850px] flex flex-col text-left italic border border-white/5 sticky top-8">
                    <div className="flex-1 space-y-10 italic">
                        <div className="flex items-center gap-4 italic leading-none">
                            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 font-black italic">€</div>
                            <h3 className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 italic">Bilan Commissions Net</h3>
                        </div>

                        <div className="space-y-8 italic">
                            <div className="flex justify-between items-center italic border-b border-white/5 pb-6">
                                <div className="leading-none italic"><p className="text-slate-400 font-bold text-[10px] uppercase mb-1 italic">Selling Bonus (N1)</p><p className="text-sm font-bold text-slate-200 italic">Ventes Directes</p></div>
                                <p className="text-2xl font-black italic tabular-nums text-indigo-400">{formatEuro(results.gainSelling)}</p>
                            </div>
                            <div className="flex justify-between items-center italic border-b border-white/5 pb-6">
                                <div className="leading-none italic"><p className="text-slate-400 font-bold text-[10px] uppercase mb-1 italic">Referring Bonus (Réseau)</p><p className="text-sm font-bold text-slate-200 italic">L1 + CN2</p></div>
                                <p className="text-2xl font-black italic tabular-nums text-blue-400">{formatEuro(results.gainReferring)}</p>
                            </div>
                            
                            <div className={`p-6 rounded-[2.5rem] border-2 transition-all italic text-left ${results.isBrQualified ? 'bg-white/5 border-emerald-500/20 opacity-100 shadow-emerald-900/10' : 'opacity-20 border-white/5 grayscale'}`}>
                                <div className="flex justify-between items-center italic">
                                    <div className="leading-none italic"><p className="text-emerald-400 font-black text-[10px] uppercase mb-1 italic">Building Bonus</p><p className="text-lg font-bold italic text-white italic">{Math.round(results.brRate * 100)}% Validé</p></div>
                                    <p className="text-2xl font-black italic text-emerald-400 tabular-nums">{formatEuro(results.brTotal)}</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-[2.5rem] border-2 transition-all italic text-left ${results.isLeadingQualified ? 'bg-white/5 border-purple-500/20 opacity-100' : 'opacity-10 border-white/5 grayscale'}`}>
                                <div className="flex justify-between items-center italic">
                                    <div className="leading-none italic"><p className="text-purple-400 font-black text-[10px] uppercase mb-1 italic">Leading Bonus</p><p className="text-lg font-bold italic text-white italic">Organisation</p></div>
                                    <p className={`text-2xl font-black italic tabular-nums leading-none ${results.isLeadingQualified ? 'text-purple-400' : 'text-slate-600 line-through opacity-50'}`}>
                                        {formatEuro(results.leaderTotal)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/10 mt-auto text-left">
                        <p className="text-slate-500 font-black uppercase text-[10px] mb-4 italic leading-none">Total Prévisionnel Net</p>
                        <h4 className={`text-5xl font-black italic transition-all tabular-nums leading-none mb-10 ${results.grandTotal >= parseFloat(targetIncome) && parseFloat(targetIncome) > 0 ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'text-white'}`}>
                            {formatEuro(results.grandTotal)}
                        </h4>
                        
                        <div className="space-y-4 italic">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                <span>Objectif : {targetIncome || 0}€</span>
                                <span>{results.progressPercent}%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0 italic">
                                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${results.progressPercent}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-50 italic">
          Strategic Success Intelligence v2.1 © Strategy Partners
        </footer>
      </div>
    </div>
  );
}