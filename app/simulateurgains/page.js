"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// --- CONFIGURATION SUPABASE ---
const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";

const GLOBAL_BASE_COEFF = 0.915636;
const LEAD_MIN_GSV_REQUIRED = 3000;
const L2_UNLOCK_THRESHOLD = 500;
const MAX_SELL_LIMIT = 2500;
const MAX_BUILD_LIMIT = 25000;

// --- INITIALISATION SÉCURISÉE POUR LE PUBLIC ET LE LOCAL ---
const getFirebaseConfig = () => {
    // 1. Cherche d'abord dans l'environnement système (Canvas)
    if (typeof __firebase_config !== 'undefined') return JSON.parse(__firebase_config);
    // 2. Cherche dans les variables d'environnement standard (Vercel/Local)
    if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) return JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    // 3. Fallback vide
    return null;
};

const firebaseConfig = getFirebaseConfig();
const isFirebaseEnabled = firebaseConfig && firebaseConfig.apiKey;

// Initialisation conditionnelle pour éviter l'erreur "invalid-api-key"
const app = isFirebaseEnabled ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'gains-2026-master';

// --- Icônes SVG intégrées ---
const Icons = {
    TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>,
    ShoppingBag: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    Layers: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
    Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Zap: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
    RotateCcw: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>,
    ShieldCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
    CheckCircle2: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>,
    ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>,
    AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>,
    CloudUpload: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.592"></path><path d="M12 12v9"></path><path d="m8 16 4-4 4 4"></path></svg>
};

const VolumeInput = ({ label, value, onChange, min = 0, max = 1000000, step = 1, colorClass = "text-indigo-600", disabled = false, lockMessage = "" }) => (
    <div className={`group p-6 rounded-[2.2rem] transition-all duration-300 border ${disabled ? 'bg-slate-100/50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg'}`}>
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col">
                <label className="text-[11px] font-[900] text-slate-400 uppercase tracking-widest mb-1 leading-tight italic">{label}</label>
                {disabled && lockMessage && (
                    <span className="text-[10px] font-black text-rose-500 flex items-center gap-1 animate-pulse italic">
                        <Icons.Lock /> {lockMessage}
                    </span>
                )}
            </div>
            <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all w-full max-w-[280px] ${disabled ? 'bg-slate-100 border-transparent text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-900 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-500 shadow-inner'}`}>
                <input 
                    type="number" 
                    value={value || ''} 
                    disabled={disabled}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onChange(isNaN(val) ? 0 : val);
                    }}
                    className="w-full text-left bg-transparent outline-none font-[900] text-2xl tracking-tight italic"
                    placeholder="0"
                />
                <span className="text-[12px] font-[900] opacity-30 select-none italic">SV</span>
            </div>
        </div>
        <div className={colorClass}>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className={`cursor-pointer transition-opacity h-3 slider-original ${disabled ? 'opacity-30' : 'opacity-100'}`}
            />
        </div>
    </div>
);

export default function SimulateurGainsPage() {
    const [activeTab, setActiveTab] = useState('sell');
    const [user, setUser] = useState(null);
    const [supabase, setSupabase] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);
    const [syncStatus, setSyncStatus] = useState(null);

    const [sellL1, setSellL1] = useState(0); 
    const [sellL2, setSellL2] = useState(0); 
    const [gsv, setGsv] = useState(0);
    const [numLts, setNumLts] = useState(0);
    const [orgVolume, setOrgVolume] = useState(0); 
    const [directBrVolume, setDirectBrVolume] = useState(0); 

    const handleReset = () => {
        setSellL1(0); setSellL2(0); setGsv(0); setNumLts(0);
        setOrgVolume(0); setDirectBrVolume(0); setActiveTab('sell');
    };

    // --- INITIALISATION AUTH & SUPABASE ---
    useEffect(() => {
        setMounted(true);
        if (!auth) return;

        const initAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (err) { 
                console.warn("Auth status: Running in limited mode (Missing valid keys)"); 
            }
        };
        initAuth();

        const initSupabase = async () => {
            try {
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                setSupabase(createClient(S_URL, S_KEY));
            } catch (e) { console.warn("Supabase local mode"); }
        };
        initSupabase();

        const unsubscribe = onAuthStateChanged(auth, (u) => { 
            setUser(u); 
        });
        return () => unsubscribe();
    }, []);

    // --- SYNC DONNÉES CLOUD (Correction Permissions) ---
    useEffect(() => {
        // RÈGLE 3 : On n'appelle Firestore QUE si l'utilisateur est authentifié
        if (!user || !db) return;
        
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'simulations', 'gains-current');
        
        const unsub = onSnapshot(docRef, 
            (docSnap) => {
                if (docSnap.exists()) {
                    const d = docSnap.data();
                    setSellL1(d.sellL1 || 0); 
                    setSellL2(d.sellL2 || 0);
                    setGsv(d.gsv || 0); 
                    setNumLts(d.numLts || 0);
                    setOrgVolume(d.orgVolume || 0); 
                    setDirectBrVolume(d.directBrVolume || 0);
                }
            },
            (err) => {
                // Évite l'écran rouge de permission si l'auth met du temps à se propager
                console.log("Firestore sync pending...");
            }
        );
        return () => unsub();
    }, [user]);

    const stats = useMemo(() => {
        const bonusL1 = (sellL1 * GLOBAL_BASE_COEFF) * 0.05;
        const isL2Eligible = sellL1 >= L2_UNLOCK_THRESHOLD;
        const bonusL2 = isL2Eligible ? (sellL2 * GLOBAL_BASE_COEFF) * 0.05 : 0;
        
        const buildingBonusTiers = [
            { threshold: 10000, percentage: 0.25 },
            { threshold: 5000, percentage: 0.20 },
            { threshold: 3000, percentage: 0.15 },
            { threshold: 2000, percentage: 0.10 },
        ];
        const tier = buildingBonusTiers.find(t => gsv >= t.threshold);
        const bonusBuild = (gsv * GLOBAL_BASE_COEFF) * (tier ? tier.percentage : 0);

        const totalLeadSv = orgVolume + directBrVolume;
        const ranks = [
            { id: 0, name: 'Brand Rep', color: 'bg-slate-500', hex: '#64748b', textColor: 'text-slate-500', bgMet: 'bg-slate-50' },
            { id: 1, name: 'GOLD', color: 'bg-amber-500', hex: '#fbbf24', textColor: 'text-amber-500', bgMet: 'bg-amber-50' },
            { id: 2, name: 'LAPIS', color: 'bg-blue-600', hex: '#2563eb', textColor: 'text-blue-600', bgMet: 'bg-blue-50' },
            { id: 3, name: 'RUBY', color: 'bg-rose-600', hex: '#e11d48', textColor: 'text-rose-600', bgMet: 'bg-rose-50' },
            { id: 4, name: 'EMERALD', color: 'bg-emerald-600', hex: '#059669', textColor: 'text-emerald-600', bgMet: 'bg-emerald-50' },
            { id: 5, name: 'DIAMOND', color: 'bg-sky-400', hex: '#38bdf8', textColor: 'text-sky-400', bgMet: 'bg-sky-50' },
            { id: 6, name: 'BLUE DIAMOND', color: 'bg-blue-700', hex: '#1d4ed8', textColor: 'text-blue-700', bgMet: 'bg-blue-50' },
        ];

        let currentRank = ranks[0];
        if (numLts >= 1) currentRank = ranks[1];
        if (numLts >= 2) currentRank = ranks[2];
        if (numLts >= 3 && totalLeadSv >= 5000) currentRank = ranks[3];
        if (numLts >= 4 && totalLeadSv >= 15000) currentRank = ranks[4];
        if (numLts >= 5 && totalLeadSv >= 35000) currentRank = ranks[5];
        if (numLts >= 6 && totalLeadSv >= 69000) currentRank = ranks[6];

        const isLeadEligible = gsv >= LEAD_MIN_GSV_REQUIRED && currentRank.id >= 1;
        const leadGlobalBonus = isLeadEligible ? (orgVolume * GLOBAL_BASE_COEFF) * 0.05 : 0;
        const directBrBonus = isLeadEligible ? (directBrVolume * GLOBAL_BASE_COEFF) * 0.10 : 0;

        return { 
            total: (bonusL1 + bonusL2 + bonusBuild + leadGlobalBonus + directBrBonus),
            bonusL1, bonusL2, bonusBuild, leadGlobalBonus, directBrBonus,
            currentRank, isL2Eligible, isLeadEligible, ranks, totalLeadSv,
            buildRate: tier ? tier.percentage * 100 : 0
        };
    }, [sellL1, sellL2, gsv, numLts, orgVolume, directBrVolume]);

    const saveToCloud = async () => {
        if (!user || !db) return;
        setSaving(true);
        try {
            const data = { 
                sellL1, sellL2, gsv, numLts, orgVolume, directBrVolume, 
                total_ht: stats.total, 
                updatedAt: new Date().toISOString() 
            };
            await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'simulations', 'gains-current'), data);
            if (supabase) await supabase.from('simulations').insert([{ type: "GAINS_MASTER_2026", ...data }]);
            setSyncStatus('success');
            setTimeout(() => setSyncStatus(null), 3000);
        } catch (err) { setSyncStatus('error'); }
        setSaving(false);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen p-4 md:p-10 pb-24 text-slate-900 bg-slate-50 italic font-[900] uppercase antialiased">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3">
                            <Icons.TrendingUp />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-[900] tracking-tight leading-none italic uppercase">Simulateur de Gain</h1>
                            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.35em] mt-3 italic flex items-center gap-2">
                                <Icons.ShieldCheck /> Plan de rémunération • Juin 2026
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 w-full md:w-auto font-[900] italic uppercase">
                        <button onClick={handleReset} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-white text-rose-500 border-2 border-rose-50 rounded-[1.8rem] font-[900] text-[12px] uppercase shadow-sm hover:bg-rose-50 transition-all active:scale-95 italic">
                            <Icons.RotateCcw /> Reset
                        </button>
                        <div className={`flex-1 md:flex-none flex flex-col items-center justify-center px-10 py-5 rounded-[1.8rem] shadow-2xl text-white font-[900] transition-all duration-700 min-w-[220px] ${stats.currentRank.color.replace('text-', 'bg-')}`}>
                            <span className="text-[9px] uppercase tracking-[0.45em] opacity-60 mb-1">Statut Atteint</span>
                            <span className="text-2xl tracking-tighter uppercase italic leading-none">{stats.currentRank.name}</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-10">
                        <nav className="flex bg-slate-200/50 p-2.5 rounded-[2.8rem] gap-2.5 shadow-inner italic font-black uppercase">
                            {[
                                { id: 'sell', label: 'SELL', icon: Icons.ShoppingBag, color: 'text-emerald-600' },
                                { id: 'build', label: 'BUILD', icon: Icons.Layers, color: 'text-indigo-600' },
                                { id: 'lead', label: 'LEAD', icon: Icons.Users, color: 'text-rose-600' }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-5 rounded-[2rem] font-[900] transition-all duration-500 text-[12px] tracking-[0.25em] flex items-center justify-center gap-3 ${activeTab === tab.id ? 'bg-white shadow-xl ' + tab.color : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <tab.icon />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>

                        <main className="bg-white rounded-[4.5rem] shadow-2xl border border-slate-50 min-h-[600px] overflow-hidden italic font-[900] uppercase">
                            {activeTab === 'sell' && (
                                <div className="p-10 md:p-16 space-y-14 animate-in fade-in duration-700 italic font-[900] uppercase">
                                    <div className="flex items-center gap-5"><div className="w-2.5 h-10 bg-emerald-500 rounded-full" /><h3 className="text-2xl font-[900] text-slate-800 uppercase italic">Commission SELL</h3></div>
                                    <div className="space-y-10">
                                        <VolumeInput label="Ligne 1 : Direct (Clients, Membres, BAs)" value={sellL1} onChange={setSellL1} max={MAX_SELL_LIMIT} colorClass="text-emerald-500" />
                                        <div className={`p-10 rounded-[3.5rem] transition-all duration-500 ${stats.isL2Eligible ? 'bg-emerald-50/50 border-2 border-emerald-100 shadow-inner' : 'bg-slate-50 border border-dashed opacity-40 grayscale'}`}>
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                                <span className="text-[12px] font-[900] text-emerald-700 uppercase tracking-widest italic flex items-center gap-4">
                                                    {stats.isL2Eligible ? <Icons.CheckCircle2 /> : <div className="w-6 h-6 rounded-full border-2 border-slate-300" />}
                                                    Ligne 2 : BA Personnellement Parrainés
                                                </span>
                                                {!stats.isL2Eligible && <span className="text-[11px] font-black text-rose-500 uppercase bg-white px-5 py-3 rounded-full shadow-sm animate-pulse italic">500 SV REQUIS EN L1</span>}
                                            </div>
                                            <VolumeInput label="Volume total de vos BAs parrainés" value={sellL2} onChange={setSellL2} max={MAX_SELL_LIMIT} colorClass="text-emerald-600" disabled={!stats.isL2Eligible} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'build' && (
                                <div className="p-10 md:p-16 space-y-14 animate-in fade-in duration-700 italic font-[900] uppercase">
                                    <div className="text-center space-y-5 italic">
                                        <h3 className="text-2xl font-[900] text-slate-800 uppercase italic underline decoration-indigo-200 underline-offset-8">Commission BUILD</h3>
                                    </div>
                                    <div className="space-y-12 max-w-4xl mx-auto italic">
                                        <VolumeInput label="Votre GSV du mois" value={gsv} onChange={setGsv} max={MAX_BUILD_LIMIT} step={10} colorClass="text-indigo-600" />
                                        <div className="flex justify-center gap-4 pt-4">
                                            {[10, 15, 20, 25].map(p => (
                                                <button 
                                                    key={p} onClick={() => setGsv(p === 10 ? 2000 : p === 15 ? 3000 : p === 20 ? 5000 : 10000)}
                                                    className={`px-6 py-3 rounded-2xl border-2 transition-all text-xs font-[900] italic ${stats.buildRate >= p ? 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-300'}`}
                                                >
                                                    {p}%
                                                </button>
                                            ))}
                                        </div>
                                        <div className={`p-12 rounded-[3.5rem] flex flex-col items-center justify-center text-center transition-all duration-700 shadow-2xl relative overflow-hidden ${stats.bonusBuild > 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-50 border border-slate-100 opacity-40'}`}>
                                            <p className="text-[11px] font-[900] uppercase tracking-[0.45em] mb-5 opacity-60 italic">Total Commissions BUILD</p>
                                            <span className="text-5xl font-[900] tracking-tighter italic leading-none">{stats.bonusBuild.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'lead' && (
                                <div className="p-10 md:p-16 space-y-14 animate-in fade-in duration-700 italic uppercase font-[900]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
                                        <div className="p-12 bg-slate-50/80 rounded-[3.5rem] border border-slate-100 shadow-inner text-center h-full flex flex-col justify-center italic">
                                            <h4 className="text-[12px] font-[900] text-slate-400 uppercase tracking-[0.25em] mb-8 italic leading-none">Leadership Teams (LT)</h4>
                                            <span className="text-7xl font-[900] text-indigo-950 italic leading-none mb-8 leading-none">{numLts}</span>
                                            <div className="w-full px-4 text-indigo-600 italic">
                                                <input type="range" min="0" max="6" step="1" value={numLts} onChange={e => setNumLts(parseInt(e.target.value))} className="w-full slider-original" />
                                                <div className="flex justify-between px-1 mt-3 text-[10px] font-[900] opacity-40 uppercase tracking-tighter"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span></div>
                                            </div>
                                        </div>
                                        <div className={`p-12 rounded-[4.5rem] flex flex-col items-center justify-center text-center transition-all duration-700 shadow-2xl relative overflow-hidden h-full ${stats.leadGlobalBonus + stats.directBrBonus > 0 ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-50 border border-slate-100 opacity-40'}`}>
                                            <p className="text-[12px] font-[900] uppercase tracking-[0.45em] mb-8 opacity-60 italic leading-relaxed">Commission LEAD Totale</p>
                                            <span className="text-4xl font-[900] tracking-tighter leading-none italic">{(stats.leadGlobalBonus + stats.directBrBonus).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 italic uppercase font-[900]">
                                        <div className="space-y-6 p-10 bg-[#f8fafc]/50 border border-slate-100 rounded-[3.5rem] shadow-sm">
                                            <h5 className="text-[12px] font-[900] text-indigo-400 uppercase tracking-widest mb-8 text-center italic leading-none">Objectifs (LTSV)</h5>
                                            {[
                                                { label: "Ruby : 1 LT à 5K+", vol: 5000, rankId: 3 },
                                                { label: "Emerald : 1 LT à 10K+", vol: 15000, rankId: 4 },
                                                { label: "Diamond : 10K & 1 LT 20K+", vol: 35000, rankId: 5 },
                                                { label: "B-Diamond : 69K+ Global", vol: 69000, rankId: 6 },
                                            ].map((p, idx) => {
                                                const isMet = stats.totalLeadSv >= p.vol && numLts >= (idx + 3);
                                                const rD = stats.ranks[p.rankId];
                                                return (
                                                    <div key={idx} className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all duration-500 ${isMet ? `${rD.bgMet} border-indigo-100 shadow-sm` : 'opacity-20 grayscale border-slate-50'}`}>
                                                        <div className={`w-11 h-11 flex items-center justify-center font-[900] ${rD.textColor}`}>{isMet ? <Icons.CheckCircle2 /> : <Icons.ShieldCheck />}</div>
                                                        <p className={`text-[12px] font-[900] uppercase italic ${rD.textColor} leading-none`}>{p.label}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="space-y-12">
                                            <h4 className="text-[12px] font-[900] text-slate-400 uppercase tracking-[0.25em] italic flex items-center gap-4 italic font-black uppercase"><div className="w-4 h-4 rounded-full bg-rose-500 shadow-lg" /> Volumes Organisation</h4>
                                            <VolumeInput label="G1 BR (Directs • Bonus 10%)" value={directBrVolume} onChange={setDirectBrVolume} max={150000} colorClass="text-rose-600" disabled={!stats.isLeadEligible} lockMessage="GOLD REQUIS" />
                                            <VolumeInput label="Organisation (G1-G6 • Bonus 5%)" value={orgVolume} onChange={setOrgVolume} max={500000} colorClass="text-rose-400" disabled={!stats.isLeadEligible} lockMessage="GOLD REQUIS" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>

                    <aside className="lg:col-span-4 space-y-10 italic uppercase font-[900]">
                        <div className="sticky top-10 italic uppercase font-[900]">
                            <div className="bg-slate-950 rounded-[4.5rem] p-10 md:p-14 shadow-2xl text-white relative overflow-hidden border border-white/10 group">
                                <div className="relative z-10 space-y-14 italic uppercase font-[900]">
                                    <div className="flex items-center gap-5 italic font-black uppercase">
                                        <div className="p-4 bg-indigo-500 rounded-2xl shadow-xl rotate-12 italic"><Icons.Zap /></div>
                                        <p className="text-slate-400 text-[12px] font-[900] uppercase tracking-[0.55em] italic">Somme Mensuelle Estimée</p>
                                    </div>
                                    <div className="space-y-8 italic font-black">
                                        <div className="font-[900] tracking-tighter text-5xl drop-shadow-2xl italic uppercase leading-none">
                                            {stats.total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
                                        </div>
                                        <div className="flex items-center gap-4 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 w-fit backdrop-blur-md italic font-black">
                                            <div className="text-amber-500 scale-125 font-black uppercase italic"><Icons.AlertTriangle /></div>
                                            <p className="text-[11px] font-[900] text-slate-300 uppercase tracking-widest italic leading-tight">Marge de vente non incluse</p>
                                        </div>
                                    </div>
                                    <div className="space-y-8 pt-16 border-t border-white/10 italic">
                                        <div className="flex justify-between items-center group/item cursor-pointer font-[900] italic" onClick={() => setActiveTab('sell')}>
                                            <div className="flex items-center gap-5 italic uppercase font-black"><div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg" /><span className="text-[11px] font-[900] text-slate-400 group-hover/item:text-white uppercase tracking-[0.35em] italic">SELL</span></div>
                                            <span className="font-[900] text-2xl text-emerald-400 italic">{(stats.bonusL1 + stats.bonusL2).toFixed(0)}€</span>
                                        </div>
                                        <div className="flex justify-between items-center group/item cursor-pointer font-[900] italic" onClick={() => setActiveTab('build')}>
                                            <div className="flex items-center gap-5 italic uppercase font-black"><div className="w-3.5 h-3.5 rounded-full bg-indigo-500 shadow-lg" /><span className="text-[11px] font-[900] text-slate-400 group-hover/item:text-white uppercase tracking-[0.35em] italic">BUILD</span></div>
                                            <span className="font-[900] text-2xl text-indigo-400 italic">{stats.bonusBuild.toFixed(0)}€</span>
                                        </div>
                                        <div className={`space-y-4 pt-4 border-t border-white/5 transition-opacity ${stats.isLeadEligible ? 'opacity-100' : 'opacity-10'} italic`}>
                                            <div className="flex justify-between items-center italic font-black uppercase"><div className="flex items-center gap-5 italic uppercase font-black"><div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-lg" /><span className="text-[11px] font-[900] text-slate-50 uppercase tracking-[0.35em] italic">LEAD 5%</span></div><span className="font-[900] text-xl text-rose-400 italic">{(stats.leadGlobalBonus).toFixed(0)}€</span></div>
                                            <div className="flex justify-between items-center italic font-black uppercase"><div className="flex items-center gap-5 italic uppercase font-black"><div className="w-3.5 h-3.5 rounded-full bg-indigo-300 shadow-lg" /><span className="text-[11px] font-[900] text-slate-50 uppercase tracking-[0.35em] italic">LEAD 10%</span></div><span className="font-[900] text-xl text-indigo-300 italic">{(stats.directBrBonus).toFixed(0)}€</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-[220px] opacity-20 pointer-events-none transition-all duration-1000 animate-pulse" style={{ backgroundColor: stats.currentRank.hex }}></div>
                            </div>
                            <div className="mt-12 bg-white rounded-[4rem] p-12 border border-slate-100 shadow-sm space-y-10 italic font-black uppercase">
                                <h4 className="text-[10px] font-[900] text-slate-400 uppercase tracking-[0.45em] text-center italic underline underline-offset-8 decoration-slate-100 font-black uppercase italic">Progression des Rangs</h4>
                                <div className="space-y-8 italic font-black uppercase">
                                    {stats.ranks.filter(r => r.id > 0).map((r) => {
                                        const isActive = stats.currentRank.id >= r.id;
                                        return (
                                            <div key={r.id} className={`flex items-center gap-8 transition-all duration-700 ${isActive ? 'opacity-100 translate-x-4 scale-105 font-bold' : 'opacity-20 grayscale translate-x-0'}`}>
                                                <div className={`w-6 h-6 flex items-center justify-center font-black ${r.textColor}`}><Icons.ShieldCheck /></div>
                                                <div className="flex-1 flex justify-between items-center italic font-black uppercase">
                                                    <span className={`text-[12px] font-[900] uppercase italic tracking-tighter ${isActive ? 'text-slate-950' : 'text-slate-400'}`}>{r.name}</span>
                                                    {isActive && <div className="text-emerald-500 scale-125 font-black uppercase italic animate-pulse leading-none"><Icons.ChevronRight /></div>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="pt-10 italic font-black uppercase">
                                <button onClick={saveToCloud} disabled={saving} className="w-full bg-slate-900 text-white rounded-[2rem] p-6 shadow-xl hover:bg-black transition-all flex items-center justify-center gap-4 italic font-black uppercase active:scale-95">
                                    {saving ? <RefreshCw className="animate-spin" /> : <Icons.CloudUpload />} {saving ? "Synchronisation..." : "Sauvegarder Cloud"}
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .slider-original { -webkit-appearance: none; width: 100%; height: 8px; background: #e2e8f0; border-radius: 12px; outline: none; }
                .slider-original::-webkit-slider-thumb { -webkit-appearance: none; height: 32px; width: 32px; border-radius: 50%; background: #ffffff; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 3px solid currentColor; transition: transform 0.1s ease; }
                .slider-original:active::-webkit-slider-thumb { transform: scale(1.1); }
                input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                input[type=number] { -moz-appearance: textfield; }
            `}</style>
        </div>
    );
}

function RefreshCw({ className }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" height="24" 
            viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" 
            strokeWidth="2" strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );
}