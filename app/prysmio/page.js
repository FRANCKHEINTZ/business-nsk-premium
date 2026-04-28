"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, LayoutDashboard, Target, TrendingUp, RefreshCw, 
  Package, Layers, Star, Lock, Unlock, ShieldCheck,
  Users, ShoppingCart
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

// --- CONFIGURATION SUPABASE (PRODUITS & IDENTIFIANTS) ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const GLOBAL_BASE_COEFF = 0.915636;
const VALEUR_PIVOT_5PCT = 0.0457818; // Base : 1 SV * 0.915636 * 5%
const LEAD_THRESHOLD = 3000;
const L2_UNLOCK_THRESHOLD = 500;

const PRODUCTS = [
  { id: 1, name: "Beauty Focus (ADR)", clientHT: 52.32, baHT: 40.25, sv: 36.19 },
  { id: 2, name: "Collagène (ADR)", clientHT: 76.71, baHT: 58.99, sv: 50.80 },
  { id: 3, name: "LifePack", clientHT: 102.96, baHT: 79.04, sv: 67.45 },
  { id: 4, name: "JVI", clientHT: 103.27, baHT: 79.49, sv: 66.50 }, 
  { id: 5, name: "Beauty Duo (ADR)", clientHT: 123.79, baHT: 95.22, sv: 76.48 }, 
  { id: 6, name: "LifePack Marine Omega (ADR)", clientHT: 130.22, baHT: 100.05, sv: 67.45 }, 
  { id: 7, name: "Pack Essentiel (ADR)", clientHT: 211.81, baHT: 162.84, sv: 126.70 },
];

// INITIALISATION FIREBASE CONFIG (Remplacer par vos vraies clés)
const firebaseConfig = {
  apiKey: "TON_API_KEY_ICI",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'prysm-2026-master'; // Garde ce nom ou change-le selon ton projet

export default function PrysmioPage() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [quantities, setQuantities] = useState({});
  const [n2Sv, setN2Sv] = useState(0);
  const [buildGsv, setBuildGsv] = useState(0);
  const [g1Sv, setG1Sv] = useState(0); 
  const [teamSv, setTeamSv] = useState(0);
  const [user, setUser] = useState(null);

// AUTHENTIFICATION AUTOMATIQUE SIMPLIFIÉE
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Sur ton Mac, on se connecte anonymement par défaut
        await signInAnonymously(auth);
      } catch (err) { 
        console.error("Erreur Auth:", err); 
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // RÉCUPÉRATION DES DONNÉES CLOUD
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'simulations', 'prysm-current');
    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        if (d.quantities) setQuantities(d.quantities);
        setN2Sv(d.n2Sv || 0); 
        setBuildGsv(d.buildGsv || 0);
        setG1Sv(d.g1Sv || 0); 
        setTeamSv(d.teamSv || 0);
      }
    }, (err) => console.warn("Sync Firestore Error:", err.message));
    return () => unsub();
  }, [user]);

  // LOGIQUE DE CALCUL DU PLAN 2026
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

    // Volume Groupe = cumul des ventes directes + partenaires ou valeur du curseur
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

    // QUALIFICATION LEAD REQUISE : 3000 GSV
    const isLeadQualified = totalGsv >= LEAD_THRESHOLD;
    
    // Bonus Lead (Forcés à 0 si non qualifié)
    const bonusLead10 = isLeadQualified ? (g1Sv * VALEUR_PIVOT_5PCT * 2) : 0; // Bonus 10%
    const bonusLead05 = isLeadQualified ? (teamSv * VALEUR_PIVOT_5PCT) : 0; // Bonus 5%

    const grandTotal = totalMargin + bonusL1 + bonusL2 + bonusBuild + bonusLead10 + bonusLead05;

    return {
      totalMargin, l1Sv, n2Sv, g1Sv, teamSv, totalGsv, buildRate, 
      bonusL1, bonusL2, bonusBuild, bonusLead10, bonusLead05, grandTotal,
      isL2Unlocked, isLeadQualified
    };
  }, [quantities, n2Sv, buildGsv, g1Sv, teamSv]);

  const resetAll = () => {
    setQuantities({}); setN2Sv(0); setBuildGsv(0); setG1Sv(0); setTeamSv(0); setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 italic font-black uppercase p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* HEADER RÉCAPITULATIF */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl rotate-3">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl tracking-tighter leading-none italic font-black text-slate-950">PRYSM io <span className="text-indigo-600">Master</span></h1>
                <p className="text-[10px] text-slate-400 tracking-[0.4em] mt-2 italic font-black">Performance Strategist 2026</p>
              </div>
            </div>

            <nav className="flex p-1.5 bg-white rounded-[2rem] shadow-sm border border-white w-fit gap-1">
              <button onClick={() => setActiveTab('simulator')} className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all ${activeTab === 'simulator' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>
                <LayoutDashboard className="w-4 h-4" /> Simulateur
              </button>
              <button onClick={() => setActiveTab('roadmap')} className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all ${activeTab === 'roadmap' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}>
                <Target className="w-4 h-4" /> Roadmap
              </button>
              <button onClick={resetAll} className="flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] text-red-500 font-black hover:bg-red-50">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </nav>
          </div>

          <div className="relative min-w-[320px] md:min-w-[420px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 blur-[60px] opacity-20 scale-110"></div>
            <div className="relative bg-slate-950 p-8 rounded-[3.5rem] shadow-2xl border border-slate-800 text-center">
              <p className="text-[9px] text-indigo-400 tracking-[0.6em] mb-4 opacity-70 italic font-black uppercase">Net Mensuel Global Estimé</p>
              <p className="text-6xl md:text-7xl text-white tracking-tighter tabular-nums font-black font-black">
                {stats.grandTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </p>
            </div>
          </div>
        </header>

        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-in fade-in duration-500">
            
            {/* INPUTS PRINCIPAUX */}
            <div className="xl:col-span-8 space-y-10">
              
              <div className="bg-white rounded-[3.5rem] shadow-sm border border-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <h2 className="text-[11px] tracking-[0.3em] flex items-center gap-4 font-black italic">
                    <Package className="w-5 h-5 text-indigo-600" /> 1. Ligne Directe (L1)
                  </h2>
                  <div className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-[10px] shadow-lg italic font-black">{stats.l1Sv.toFixed(0)} SV</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] tracking-widest min-w-[500px]">
                    <thead className="bg-slate-50 text-slate-400 font-black italic">
                      <tr>
                        <th className="px-10 py-6 uppercase">Produit</th>
                        <th className="px-6 py-6 text-center uppercase">SV</th>
                        <th className="px-6 py-6 text-center w-32 uppercase">Qté</th>
                        <th className="px-10 py-6 text-right uppercase">Marge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-black italic uppercase">
                      {PRODUCTS.map(p => (
                        <tr key={p.id} className="hover:bg-indigo-50/10 transition-all">
                          <td className="px-10 py-6 text-slate-900">{p.name}</td>
                          <td className="px-6 py-6 text-center text-indigo-600">{p.sv}</td>
                          <td className="px-6 py-6 text-center">
                            <input 
                              type="number" value={quantities[p.id] || ""} 
                              onChange={(e) => setQuantities({...quantities, [p.id]: parseInt(e.target.value) || 0})}
                              className="w-20 bg-slate-100 rounded-xl px-3 py-2 text-center font-black focus:bg-white outline-none" 
                              placeholder="0"
                            />
                          </td>
                          <td className="px-10 py-6 text-right text-emerald-600">
                            {((p.clientHT - p.baHT) * (quantities[p.id] || 0)).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-slate-800 text-white space-y-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center font-black italic">
                    <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 flex items-center gap-4"><Users className="w-5 h-5" /> 2. Ligne Partenaires (L2)</h2>
                    <span className="text-3xl text-white font-black">{n2Sv.toFixed(0)} SV</span>
                  </div>
                  <input type="range" min="0" max="10000" step="100" value={n2Sv} onChange={(e) => setN2Sv(parseInt(e.target.value))} className="slider-prysm" />
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center font-black italic">
                    <div className="flex items-center gap-4">
                       <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">3. Volume Groupe (GSV)</h2>
                       {stats.l1Sv < L2_UNLOCK_THRESHOLD ? <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black italic uppercase"><Lock size={10}/> 500 L1 REQUIS</div> : <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black italic uppercase"><Unlock size={10}/> ACTIF</div>}
                    </div>
                    <span className="text-3xl text-white font-black">{stats.totalGsv.toFixed(0)} SV</span>
                  </div>
                  <input type="range" min="0" max="25000" step="250" value={buildGsv} onChange={(e) => setBuildGsv(parseInt(e.target.value))} className="slider-prysm accent-indigo-500" />
                </div>

                <div className={`space-y-6 pt-6 border-t border-white/5 transition-opacity ${!stats.isLeadQualified ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex justify-between items-center font-black italic">
                    <div className="flex items-center gap-4">
                       <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">4. Volume G1 BR (10%)</h2>
                       {!stats.isLeadQualified ? <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black italic uppercase"><Lock size={10}/> 3000 GSV REQUIS</div> : <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black italic uppercase"><Unlock size={10}/> DÉBLOQUÉ</div>}
                    </div>
                    <span className="text-3xl text-white font-black">{g1Sv.toFixed(0)} SV</span>
                  </div>
                  <input 
                    type="range" min="0" max="100000" step="500" value={g1Sv} 
                    disabled={!stats.isLeadQualified}
                    onChange={(e) => setG1Sv(parseInt(e.target.value))} 
                    className="slider-prysm" 
                  />
                </div>

                <div className={`space-y-6 pt-6 border-t border-white/5 transition-opacity ${!stats.isLeadQualified ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="flex justify-between items-center font-black italic">
                    <h2 className="text-[11px] tracking-[0.4em] text-indigo-400 uppercase">5. Volume Profondeur (5%)</h2>
                    <span className="text-3xl text-white font-black">{teamSv.toFixed(0)} SV</span>
                  </div>
                  <input 
                    type="range" min="0" max="500000" step="1000" value={teamSv} 
                    disabled={!stats.isLeadQualified}
                    onChange={(e) => setTeamSv(parseInt(e.target.value))} 
                    className="slider-prysm" 
                  />
                </div>
              </div>
            </div>

            {/* RÉCAPITULATIF DROITE */}
            <div className="xl:col-span-4 space-y-10 font-black italic uppercase">
              <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white sticky top-8 italic uppercase font-black">
                <h2 className="text-xl mb-12 flex items-center gap-4 border-b border-slate-100 pb-10 tracking-[0.1em] text-slate-950 underline decoration-indigo-200 decoration-[4px] underline-offset-[12px] font-black italic"><Star className="w-8 h-8 text-indigo-600" /> Détail Gains</h2>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] uppercase italic">Profit Commercial</span>
                    <div className="flex justify-between items-center px-4 py-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 font-black italic uppercase"><span className="text-[10px]">Marges Ventes</span><span className="text-2xl text-indigo-600 font-black">{stats.totalMargin.toFixed(2)} €</span></div>
                  </div>

                  <div className="space-y-6 pt-8 border-t border-slate-100 font-black italic uppercase">
                    <span className="text-[9px] text-slate-400 tracking-[0.3em] uppercase">Commissions Points</span>
                    <div className="flex justify-between items-center font-black"><p className="text-xs">Bonus L1 (5%)</p><span className="text-xl text-slate-950 font-black">{stats.bonusL1.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isL2Unlocked ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Bonus L2 (5%)</p><span className="text-xl text-slate-950 font-black">{stats.bonusL2.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.buildRate > 0 ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Build ({stats.buildRate}%)</p><span className="text-xl text-indigo-600 font-black">{stats.bonusBuild.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isLeadQualified ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Lead G1 (10%)</p><span className="text-xl text-blue-600 font-black">{stats.bonusLead10.toFixed(2)} €</span></div>
                    <div className={`flex justify-between items-center transition-all ${stats.isLeadQualified ? 'opacity-100' : 'opacity-20 grayscale'}`}><p className="text-xs">Lead G1-G6 (5%)</p><span className="text-xl text-emerald-600 font-black">{stats.bonusLead05.toFixed(2)} €</span></div>
                  </div>
                </div>
                <div className="mt-16 pt-10 border-t-4 border-slate-50"><div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-3"><ShieldCheck className="text-emerald-500 w-5 h-5" /><span className="text-[9px] font-black uppercase text-slate-400 italic">Protection Subaru Active</span></div></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <div className="bg-white rounded-[4rem] p-10 md:p-16 animate-in fade-in duration-500 space-y-16 shadow-xl border border-white font-black italic uppercase">
            <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-100 pb-12 gap-8">
               <div>
                  <h2 className="text-4xl italic tracking-tighter">Objectifs SV</h2>
                  <p className="text-slate-400 text-sm tracking-widest mt-2 border-l-4 border-indigo-600 pl-4">Synthèse Performance Globale</p>
               </div>
               <div className="bg-slate-950 p-10 rounded-[3rem] text-center min-w-[300px]">
                  <p className="text-indigo-400 text-[10px] tracking-[0.5em] mb-2">Volume Global Cumulé</p>
                  <p className="text-5xl text-white font-black">{(stats.totalGsv + stats.g1Sv + stats.teamSv).toFixed(0)} SV</p>
               </div>
            </div>
            <div className="grid grid-cols-1 gap-12">
               <div className="space-y-6">
                  <div className="flex justify-between items-end italic"><h3 className="text-xl">Statut Qualification Lead</h3><p className="text-2xl text-indigo-600 font-black">{stats.totalGsv.toFixed(0)} / {LEAD_THRESHOLD} SV</p></div>
                  <div className="h-10 w-full bg-slate-100 rounded-full border-4 border-white shadow-inner p-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min((stats.totalGsv / LEAD_THRESHOLD) * 100, 100)}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider-prysm { -webkit-appearance: none; width: 100%; height: 12px; background: #1e293b; border-radius: 10px; outline: none; border: 1px solid rgba(255,255,255,0.05); }
        .slider-prysm::-webkit-slider-thumb { -webkit-appearance: none; height: 32px; width: 32px; border-radius: 50%; background: #ffffff; border: 6px solid #4f46e5; box-shadow: 0 0 20px rgba(79, 70, 229, 0.4); cursor: pointer; transition: transform 0.2s ease; }
        .slider-prysm:active::-webkit-slider-thumb { transform: scale(1.15); }
        .slider-prysm:disabled { opacity: 0.15; cursor: not-allowed; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}