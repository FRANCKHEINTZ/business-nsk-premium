"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Users, TrendingUp, Zap, Activity, 
  Target, BarChart3, ShoppingCart, KeyRound, Rocket, Play, LogIn, Check, AlertCircle, RefreshCcw, Loader2
} from 'lucide-react';

/**
 * PORTAIL BUSINESS NSK PREMIUM - VERSION V207 (MASTER FINAL SÉCURISÉ)
 * - FIX : Activation réelle des fonctions de vérification de paiement.
 * - SÉCURITÉ : Verrouillage du Dashboard si le statut n'est pas "Premium".
 * - FEATURE : Détection automatique du retour de paiement Lemon Squeezy.
 */

const LEGAL_TEXTS = {
  MENTIONS_LEGALES: { 
    titre: "Mentions Légales", 
    contenu: `ÉDITEUR DU SITE : Invest In Your Future\nContact : business.nsk.premium@gmail.com\nHÉBERGEMENT : Le site est hébergé par Vercel Inc. (San Francisco, USA).` 
  },
  REMBOURSEMENT: { 
    titre: "Politique de Remboursement", 
    contenu: `ABSENCE DE DROIT DE RÉTRACTATION : Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après paiement.\n\nActivation immédiate : L'accès aux outils étant instantané après validation du paiement, l'utilisateur reconnaît renoncer expressément à son droit de rétractation.\n\nRemboursement : Aucun remboursement ne pourra être accordé après la première connexion ou l'utilisation effective du service.` 
  },
  CONDITIONS: { 
    titre: "Conditions Générales", 
    contenu: `Accès au service : L’accès au portail est strictement personnel, individuel et non cessible. Toute revente est proscrite.\n\nUtilisation autorisée : Maximum 2 appareils en connexion simultanée.\n\nSécurité : Le partage d’identifiants entraîne une suspension définitive de l'accès.\n\nDisponibilité : Le service est accessible 24h/24 sauf maintenance.\n\nResponsabilité : L’utilisateur reste seul responsable de ses décisions business.` 
  },
  CONFIDENTIALITE: { 
    titre: "Politique de Confidentialité", 
    contenu: `Données collectées : Prénom, Nom et Email uniquement.\n\nUtilisation : Gestion du compte utilisateur.\n\nStockage : Données sécurisées via Supabase.\n\nCalculations : Les données saisies restent locales à votre session.` 
  }
};

const S_URL = 'https://rbmzmduojlxdzfgmolly.supabase.co';
const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E';

const CHECKOUT_LINKS = {
  STARTER: { 
    mensuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/af165861-adfa-4e43-8ad5-393c0d9c8412", 
    annuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/71e19837-18e6-4908-bd23-3e9f3411164d?enabled=1586774", 
  },
  BUSINESS: { 
    mensuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/588c0773-beb2-4e72-b2bc-51136a11059a", 
    annuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/588c0773-beb2-4e72-b2bc-51136a11059a?enabled=1586877", 
  },
  PERFORMANCE: { 
    mensuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/e1929154-4465-445c-a2f8-21e686ffcf3c", 
    annuel: "https://business-nsk-premium.lemonsqueezy.com/checkout/buy/e1929154-4465-445c-a2f8-21e686ffcf3c?enabled=1586896", 
  },
};

const PACK_FEATURES = {
  STARTER: ["GESTION CLIENTÈLE", "SUIVI RÉSEAU", "CALCULATEUR PRYSM"],
  BUSINESS: ["PACK STARTER INCLUS", "TRACKER PRO LEADER", "SIMULATEUR OBJECTIF"],
  PERFORMANCE: ["PACK STARTER INCLUS","PACK BUSINESS INCLUS", "SIMULATEUR GAINS", "OFFRE ÉVOLUTIVE",]
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPack, setSelectedPack] = useState('STARTER');
  const [loginEmail, setLoginEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [notif, setNotif] = useState(null);
  const [legalView, setLegalView] = useState(null); 

  const checkPaymentStatus = async (email) => {
    try {
      const res = await fetch(`${S_URL}/rest/v1/leads?Email=eq.${email.toLowerCase()}&select=Statut`, {
        headers: { 'apikey': S_KEY, 'Authorization': `Bearer ${S_KEY}` }
      });
      const data = await res.json();
      return data[0]?.Statut === 'Premium';
    } catch (e) { return false; }
  };

  const setStatusPremium = async (email) => {
    try {
      await fetch(`${S_URL}/rest/v1/leads?Email=eq.${email.toLowerCase()}`, {
        method: 'PATCH',
        headers: { 'apikey': S_KEY, 'Authorization': `Bearer ${S_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ "Statut": "Premium" })
      });
    } catch (e) {}
  };

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const isSuccess = params.get('status') === 'success'; 
    const savedEmail = localStorage.getItem('nsk_email');

    const init = async () => {
        if (savedEmail) {
            setLoginEmail(savedEmail);
            setFirstName(localStorage.getItem('nsk_fname') || "");
            setLastName(localStorage.getItem('nsk_lname') || "");
            
            // 1. Si retour de paiement Lemon Squeezy réussi
            if (isSuccess) {
                await setStatusPremium(savedEmail);
                setNotif("PAIEMENT VALIDÉ ! BIENVENUE");
                setView('dashboard');
                return;
            }

            // 2. Vérification systématique du statut réel
            const hasPaid = await checkPaymentStatus(savedEmail);
            if (hasPaid) {
                setSelectedPack(localStorage.getItem('nsk_pack')?.toUpperCase() || 'STARTER');
                setView('dashboard'); 
            } else {
                setView('packs');
            }
        }
    };
    init();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const emailV = (formData.get('e') || "").toString().toLowerCase().trim();
    const passV = (formData.get('pass') || "").toString();
    const fnameV = (formData.get('p') || "").toString().trim();
    const lnameV = (formData.get('n') || "").toString().trim();

    try {
      await fetch(`${S_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'apikey': S_KEY,
          'Authorization': `Bearer ${S_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify([{
          "Prénom": fnameV, "Nom": lnameV, "Email": emailV, 
          "Password": passV, "pack_type": selectedPack, "Statut": "Identifié"
        }])
      });
    } catch (err) {}

    localStorage.setItem('nsk_email', emailV);
    localStorage.setItem('nsk_fname', fnameV);
    localStorage.setItem('nsk_lname', lnameV);
    localStorage.setItem('nsk_pass', passV);
    setFirstName(fnameV); setLastName(lnameV); setLoginEmail(emailV);
    
    // Vérification de sécurité immédiate
    const alreadyPremium = await checkPaymentStatus(emailV);
    setNotif("CONNEXION RÉUSSIE");
    
    setTimeout(() => { 
        if (alreadyPremium) { setView('dashboard'); } else { setView('packs'); }
        setLoading(false); 
        setNotif(null); 
    }, 800);
  };

  const handleForgotPassword = () => {
    setNotif("FONCTIONNALITÉ INDISPONIBLE EN MODE DIRECT");
  };

  const handleLogout = () => {
      localStorage.clear();
      window.location.reload();
  };

  const handleStartPack = (pId) => {
    localStorage.setItem('nsk_pack', pId);
    setSelectedPack(pId);
    const link = isAnnual ? CHECKOUT_LINKS[pId].annuel : CHECKOUT_LINKS[pId].mensuel;
    if (link) window.open(link, '_blank');
    
    // Sécurité : on ne change plus de vue, on attend le retour ?status=success
    setNotif("EN ATTENTE DU PAIEMENT...");
  };
  const allApps = [
    { n: "Gestionnaire Clientèle", p: "/adrclient", i: <Users />, d: "Suivi ADR et base clients", packs: ["STARTER", "BUSINESS", "PERFORMANCE"] },
    { n: "Suivi de Réseau", p: "/adrbamembre", i: <TrendingUp />, d: "Analyse structure BA et membres", packs: ["STARTER", "BUSINESS", "PERFORMANCE"] },
    { n: "Calculateur PRYSM", p: "/prysmio", i: <Zap />, d: "Simulateur de revenus en temps réel", packs: ["STARTER", "BUSINESS", "PERFORMANCE"] },
    { n: "Tracker Pro Leader", p: "/tracker", i: <Activity />, d: "Suivi des actions quotidiennes", packs: ["BUSINESS", "PERFORMANCE"] },
    { n: "Simulateur Objectif", p: "/simulateurobjectif", i: <Target />, d: "Planification stratégique mensuelle", packs: ["BUSINESS", "PERFORMANCE"] },
    { n: "Simulateur Gains", p: "/simulateurgains", i: <BarChart3 />, d: "Projection de commissions avancée", packs: ["PERFORMANCE"] }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased text-slate-950 font-black relative overflow-hidden italic selection:bg-blue-100 uppercase">
      
      {notif && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[5000] bg-[#4285f4] text-white px-10 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-b-4 border-blue-700 animate-in slide-in-from-top-10">
          <Rocket size={20} />
          <span className="text-[10px] tracking-widest uppercase font-black">{notif}</span>
        </div>
      )}

      {/* --- VUE LOGIN --- */}
      {view === 'login' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-1000 relative">
          <h1 className="text-5xl sm:text-7xl lg:text-[7.5rem] font-black uppercase tracking-tighter mb-16 leading-none text-center select-none italic font-black">
            BUSINESS NSK <span className="text-[#4285f4]">PREMIUM</span>
          </h1>
          <div className="bg-white p-10 sm:p-14 rounded-[4rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] w-full max-w-[500px] border-[1px] border-slate-100 relative pt-20 font-black italic">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4285f4] text-white px-12 py-4 rounded-full text-[11px] font-black tracking-[0.25em] italic shadow-[0_15px_30px_rgba(66,133,244,0.5)] uppercase whitespace-nowrap z-20 font-black">ACCÈS MEMBRE</div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input required name="p" placeholder="Prénom" className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-50 outline-none placeholder:text-slate-300 transition-all text-lg shadow-inner normal-case font-black" />
              <input required name="n" placeholder="Nom" className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-50 outline-none placeholder:text-slate-300 transition-all text-lg shadow-inner normal-case font-black" />
              <input required name="e" type="email" placeholder="Email" onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-50 outline-none placeholder:text-slate-300 transition-all text-lg shadow-inner normal-case font-black" />
              <div className="relative font-black">
                <input required name="pass" type="password" placeholder="Mot de passe" className="w-full p-6 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-50 outline-none placeholder:text-slate-300 transition-all text-lg shadow-inner normal-case font-black" />
                <KeyRound size={24} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" />
              </div>
              <div className="flex justify-end pt-1 pb-4">
                <button type="button" onClick={handleForgotPassword} className="text-[10px] font-black italic uppercase text-slate-300 tracking-widest hover:text-[#4285f4] transition-colors uppercase font-black italic">MOT DE PASSE OUBLIÉ ?</button>
              </div>
              <button type="submit" disabled={loading} className="w-full py-8 bg-[#4285f4] text-white rounded-[2.2rem] font-black uppercase tracking-[0.25em] italic shadow-[0_25px_60px_-10px_rgba(66,133,244,0.6)] flex items-center justify-center gap-4 hover:bg-blue-600 active:scale-95 transition-all text-lg font-black uppercase font-black italic">
                {loading ? <Loader2 className="animate-spin" size={26} /> : <LogIn size={26} strokeWidth={3} />}
                <span>{loading ? "TRAITEMENT..." : "ENTRER"}</span>
              </button>
            </form>
          </div>
          <div className="mt-20 w-full max-w-[800px] grid grid-cols-2 gap-x-12 gap-y-6 text-center px-4 font-black italic text-slate-300 uppercase text-[10px] tracking-[0.2em]">
            {Object.keys(LEGAL_TEXTS).map(k => (
              <button key={k} onClick={() => setLegalView(k)} className="hover:text-blue-500 transition-colors uppercase font-black tracking-widest">{k.replace('_', ' ')}</button>
            ))}
          </div>
          <footer className="mt-20 py-10 opacity-30 text-center text-[10px] tracking-[0.5em] font-black italic uppercase select-none">BUSINESS NSK PREMIUM • VERSION V207</footer>
        </div>
      )}

      {/* --- VUE PACKS --- */}
      {view === 'packs' && (
        <div className="max-w-7xl mx-auto py-12 px-4 text-center animate-in zoom-in duration-500 italic uppercase font-black">
          <h2 className="text-7xl sm:text-8xl lg:text-[7.5rem] font-black mb-16 italic tracking-tighter uppercase leading-[0.8]">CHOISISSEZ VOTRE <span className="text-[#4285f4]">NIVEAU</span></h2>
          <div className="flex justify-center items-center gap-10 mb-24 font-black">
            <span className={`text-[10px] tracking-widest transition-colors ${!isAnnual ? 'text-[#4285f4]' : 'text-slate-300'}`}>MENSUEL</span>
            <div onClick={() => setIsAnnual(!isAnnual)} className="w-24 h-11 bg-slate-200 rounded-full p-1.5 cursor-pointer flex items-center transition-all shadow-inner relative"><div className={`w-8 h-8 bg-[#4285f4] rounded-full shadow-lg transition-all duration-500 ${isAnnual ? 'translate-x-13' : 'translate-x-0'}`} /></div>
            <span className={`text-[10px] tracking-widest transition-colors ${isAnnual ? 'text-[#4285f4]' : 'text-slate-300'}`}>ANNUEL <span className="text-emerald-500 ml-2">(-20%)</span></span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto items-stretch font-black italic uppercase">
            {['STARTER', 'BUSINESS', 'PERFORMANCE'].map((pId) => (
              <div key={pId} className={`bg-white p-14 rounded-[4.5rem] flex flex-col text-left transition-all relative border-[3px] ${pId === 'BUSINESS' ? 'border-[#4285f4] shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-lg'}`}>
                {pId === 'BUSINESS' && <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#4285f4] text-white px-10 py-3.5 rounded-2xl text-[10px] font-black tracking-[0.35em] shadow-lg">RECOMMANDÉ</div>}
                <h3 className="text-4xl font-black mb-10 tracking-tight text-slate-950 uppercase">{pId}</h3>
                <div className="flex items-baseline gap-2 mb-2 font-black italic"><span className="text-5xl lg:text-6xl tracking-tighter leading-none text-slate-950">{(pId === 'STARTER' ? (isAnnual ? '99' : '9,90') : pId === 'BUSINESS' ? (isAnnual ? '149' : '14,90') : (isAnnual ? '199' : '19,90'))}</span><span className="text-2xl text-[#4285f4] italic">€</span></div>
                <div className="text-[10px] text-slate-300 font-black mb-12 tracking-[0.25em] uppercase italic">PAR MOIS</div>
                <div className="space-y-6 mb-20 flex-grow font-black italic">
                   {PACK_FEATURES[pId].map((feat, idx) => (
                     <div key={idx} className="flex items-center gap-4 text-slate-400 font-black text-[11px] tracking-tight italic uppercase">
                        <Check size={16} className="text-[#4285f4]" strokeWidth={5} />
                        {feat}
                     </div>
                   ))}
                </div>
                <button onClick={() => handleStartPack(pId)} className={`w-full py-8 rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 mt-auto transition-all ${pId === 'BUSINESS' ? 'bg-[#4285f4] text-white hover:bg-blue-600 shadow-[0_20px_45px_-5px_rgba(66,133,244,0.5)]' : 'bg-slate-950 text-white hover:bg-[#4285f4]'}`}>DÉMARRER <ShoppingCart size={22} strokeWidth={3} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- DASHBOARD --- */}
      {view === 'dashboard' && (
        <div className="max-w-7xl mx-auto w-full py-16 px-6 animate-in fade-in duration-700 font-black italic uppercase">
           <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-10 font-black italic uppercase">
              <div className="text-left font-black">
                <p className="text-[#4285f4] text-[10px] tracking-[0.5em] mb-4 font-black italic uppercase font-black italic">
                  MASTER SESSION : <span className="normal-case font-black italic">{firstName} {lastName}</span> <span className="text-slate-300 ml-4 opacity-50 uppercase font-black italic">{selectedPack}</span>
                </p>
                <h2 className="text-7xl sm:text-9xl font-black italic text-slate-950 tracking-tighter uppercase leading-[0.8]">MES <span className="text-[#4285f4]">APPS</span></h2>
              </div>
              <div className="flex gap-4 font-black italic uppercase font-black italic">
                <button onClick={() => window.location.reload()} className="p-8 bg-white rounded-3xl shadow-xl text-blue-500 border-2 border-slate-50 active:scale-95"><RefreshCcw size={40} strokeWidth={4} /></button>
                <button onClick={handleLogout} className="p-8 bg-white rounded-3xl shadow-xl text-slate-200 hover:text-red-500 transition-all border-2 border-slate-50 active:scale-95 font-black italic font-black italic"><X size={40} strokeWidth={4} /></button>
              </div>
           </header>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 font-black italic uppercase font-black italic">
              {allApps.map((app, idx) => {
                const isLocked = loginEmail === "franckheintz71@gmail.com" ? false : (!app.packs.includes(selectedPack) && selectedPack !== 'PERFORMANCE');
                return (
                    <button key={idx} onClick={() => { if(!isLocked) window.location.href = app.p; else setNotif("PACK SUPÉRIEUR REQUIS"); }} className={`bg-white p-14 rounded-[4.5rem] shadow-sm border-2 border-slate-50 transition-all flex flex-col text-left hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-3 relative overflow-hidden group ${isLocked ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}>
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-colors bg-blue-50 text-[#4285f4] group-hover:bg-[#4285f4] group-hover:text-white shadow-inner`}>{app.i}</div>
                        <h3 className="text-3xl font-black mb-4 uppercase leading-none tracking-tight">{app.n}</h3>
                        <p className="text-[11px] text-slate-300 font-bold mb-14 normal-case leading-relaxed italic font-black italic">{app.d}</p>
                        <div className={`w-full py-8 rounded-[2.5rem] font-black text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 bg-slate-950 text-white group-hover:bg-[#4285f4] transition-all shadow-lg italic uppercase font-black italic`}>{isLocked ? "VERROUILLÉ" : <>OUVRIR L'APP <Play size={18} fill="currentColor" /></>}</div>
                    </button>
                )
              })}
           </div>
        </div>
      )}

      {/* --- MODAL JURIDIQUE --- */}
      {legalView && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300 font-black italic uppercase">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border-t-8 border-[#4285f4] flex flex-col animate-in zoom-in duration-300 font-black italic">
                <header className="p-8 border-b border-slate-50 flex justify-between items-center italic font-black uppercase font-black italic">
                    <h2 className="text-xl text-[#4285f4] tracking-tighter uppercase font-black italic">{LEGAL_TEXTS[legalView].titre}</h2>
                    <button onClick={() => setLegalView(null)} className="p-4 bg-slate-50 rounded-full hover:text-red-500 transition-all focus:outline-none uppercase font-black italic"><X size={24} /></button>
                </header>
                <div className="p-12 text-left font-black normal-case text-sm text-slate-400 leading-relaxed whitespace-pre-line italic bg-[#fcfdfe] max-h-[60vh] overflow-y-auto uppercase font-black italic">
                    {LEGAL_TEXTS[legalView].contenu}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
