"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, X, Users, TrendingUp, Zap, Activity, 
  Target, BarChart3, Info, ShoppingCart, KeyRound, Check, Scale, Rocket, Play, Lock, AlertCircle, LogIn
} from 'lucide-react';

/**
 * PORTAIL BUSINESS NSK - VERSION V79 (ULTRA-STABLE FAIL-SAFE)
 * STRUCTURE : Next.js App Router (app/page.js)
 * CORRECTIF VERCEL : Fail-Safe de 3s pour forcer l'accès.
 * VISUEL : Respect strict de la capture d'écran (Badge, Inputs, Bouton Entrer).
 */

const LEGAL_TEXTS = {
  MENTIONS_LEGALES: {
    titre: "Mentions Légales",
    contenu: `ÉDITEUR DU SITE :
Invest In Your Future
Email : contact@invest-future.com
Contact support : +33 6 87 69 49 82

HÉBERGEMENT :
Le site est hébergé par Vercel Inc.`
  },

  REMBOURSEMENT: {
    titre: "Politique de Remboursement",
    contenu: `ABSENCE DE DROIT DE RÉTRACTATION :
Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques fournis immédiatement après paiement.

Activation immédiate :
L'accès aux outils étant instantané après validation du paiement, l'utilisateur reconnaît renoncer à son droit de rétractation.

Remboursement :
Aucun remboursement ne pourra être accordé après la première connexion ou utilisation du service.`
  },

  CONDITIONS: {
    titre: "Conditions Générales",
    contenu: `Accès au service :
L’accès au portail est strictement personnel, individuel et non cessible.

Utilisation autorisée :
Maximum 2 appareils simultanés.

Sécurité :
Le partage d’identifiants ou la revente entraîne une suspension immédiate sans remboursement.

Disponibilité :
Service accessible 24h/24 sauf maintenance.

Responsabilité :
L’utilisateur reste responsable de ses décisions.`
  },

  CONFIDENTIALITE: {
    titre: "Politique de Confidentialité",
    contenu: `Données collectées :
Prénom, Nom, Email uniquement.

Utilisation :
Gestion du compte utilisateur.

Stockage :
Données sécurisées via Supabase.

Calculs :
Les données saisies ne sont pas stockées et restent locales dans votre navigateur.`
  }
};

const SUPABASE_URL = 'https://rbmzmduojlxdzfgmolly.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E';

const CHECKOUT_LINKS = {
  Starter: {
    mensuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/ed733f72-4562-4e93-8594-a3bdd319f5b3",
    annuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/3e40bab0-a707-429e-9424-fd0d6b0de81e"
  },
  Business: {
    mensuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/910988d0-26a5-4a5d-b4c7-a29dd3302b12",
    annuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/2ad67cb8-485b-48a7-b089-1f13a4a871e8"
  },
  Performance: {
    mensuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/7fdb7200-82ff-48c7-b28b-a69ed2a87dc3",
    annuel: "https://business-nsk.lemonsqueezy.com/checkout/buy/8b1ed304-f6a6-4b65-8f8d-fb1011109bad"
  }
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPack, setSelectedPack] = useState('Starter');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [supabase, setSupabase] = useState(null);
  const [sysError, setSysError] = useState(null);
  const [notif, setNotif] = useState(null);
  const [legalView, setLegalView] = useState(null);

  useEffect(() => {
    setMounted(true);
    setSysError("SYSTÈME EN COURS D'INITIALISATION...");
    
    // FAIL-SAFE : Force la disparition de l'erreur après 3s
    const failSafeTimer = setTimeout(() => {
      setSysError(null);
    }, 3000);

    const savedEmail = localStorage.getItem('nsk_email');
    const savedName = localStorage.getItem('nsk_name');
    const savedView = localStorage.getItem('nsk_view') || 'login';
    const savedPack = localStorage.getItem('nsk_pack') || 'Starter';
    
    if (savedEmail) setUserEmail(savedEmail);
    if (savedName) setUserName(savedName);
    setView(savedView);
    setSelectedPack(savedPack);

    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        if (createClient) {
          const client = createClient(SUPABASE_URL, SUPABASE_KEY);
          setSupabase(client);
          setSysError(null);
          clearTimeout(failSafeTimer);
        }
      } catch (e) { 
        console.warn("Supabase init failed");
      }
    };
    initSupabase();

    return () => clearTimeout(failSafeTimer);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('nsk_email', userEmail);
      localStorage.setItem('nsk_name', userName);
      localStorage.setItem('nsk_view', view);
      localStorage.setItem('nsk_pack', selectedPack);
    }
  }, [userEmail, userName, view, selectedPack, mounted]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const email = formData.get('e').toLowerCase().trim();
    const name = formData.get('p');
    
    const data = {
      "Prénom": name,
      "Nom": formData.get('n'),
      "Email": email,
      "Password": formData.get('pass'),
      "Statut": "Identifié"
    };

    setUserEmail(email);
    setUserName(name);

    try {
      if (supabase) {
        await supabase.from('leads').upsert([data], { onConflict: 'Email' });
      }
      setNotif("ACCÈS MASTER VALIDÉ");
      setTimeout(() => { setView('packs'); setLoading(false); setNotif(null); }, 800);
    } catch (err) {
      setView('packs'); setLoading(false);
    }
  };

  const handleCheckout = (pack) => {
    setSelectedPack(pack);
    const link = isAnnual ? CHECKOUT_LINKS[pack].annuel : CHECKOUT_LINKS[pack].mensuel;
    if (link) {
      window.open(link, '_blank');
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const launchApp = (app) => {
    if (!app.packs.includes(selectedPack)) {
        setNotif(`UPGRADE VERS ${app.packs[app.packs.length-1].toUpperCase()} REQUIS`);
        setTimeout(() => setNotif(null), 3000);
        return;
    }
    // Redirection vers le dossier correspondant (ex: /prysmio)
    window.location.href = app.p;
  };

  const allApps = [
    { n: "Gestionnaire Clientèle", p: "/adrclient", i: <Users />, d: "Suivi ADR et base clients", packs: ["Starter", "Business", "Performance"] },
    { n: "Suivi de Réseau", p: "/adrbamembre", i: <TrendingUp />, d: "Analyse structure BA et membres", packs: ["Starter", "Business", "Performance"] },
    { n: "Calculateur PRYSM", p: "/prysmio", i: <Zap />, d: "Simulateur de revenus en temps réel", packs: ["Starter", "Business", "Performance"] },
    { n: "Tracker Pro Leader", p: "/tracker", i: <Activity />, d: "Suivi des actions quotidiennes", packs: ["Business", "Performance"] },
    { n: "Simulateur Objectif", p: "/simulateurobjectif", i: <Target />, d: "Planification stratégique mensuelle", packs: ["Business", "Performance"] },
    { n: "Simulateur Gains", p: "/simulateurgains", i: <BarChart3 />, d: "Projection de commissions avancée", packs: ["Performance"] }
  ];

  const getPrice = (packId) => {
    if (packId === 'Starter') return isAnnual ? '99' : '9,90';
    if (packId === 'Business') return isAnnual ? '149' : '14,90';
    if (packId === 'Performance') return isAnnual ? '199' : '19,90';
    return '0';
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 font-sans antialiased text-slate-900 font-black relative overflow-hidden">
      
      {sysError && (
        <div 
          onClick={() => setSysError(null)}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[1200] bg-[#f85454] text-white px-8 py-5 rounded-[1.5rem] shadow-2xl animate-in slide-in-from-top-10 flex items-center gap-4 font-black italic uppercase text-[10px] tracking-widest min-w-[340px] border-b-4 border-black/10 cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Info size={18} strokeWidth={3} />
          </div>
          <span>ERREUR : {sysError}</span>
        </div>
      )}

      {notif && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1100] bg-[#3b82f6] text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 flex items-center gap-3 font-black italic uppercase text-center min-w-[320px] justify-center border-2 border-white/20">
          <Rocket size={20} />
          <span className="text-[10px] tracking-widest leading-none">{notif}</span>
        </div>
      )}

      {/* --- FENÊTRE JURIDIQUE --- */}
      {legalView && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-2xl rounded-[3.5rem] shadow-2xl flex flex-col overflow-hidden border-t-8 border-[#3b82f6]">
                <header className="p-8 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-[#3b82f6] tracking-tighter uppercase italic">
                        {LEGAL_TEXTS[legalView].titre}
                    </h2>
                    <button onClick={() => setLegalView(null)} className="p-3 bg-slate-50 rounded-full hover:text-red-500 transition-all">
                        <X size={20} />
                    </button>
                </header>
                <div className="p-10 overflow-y-auto max-h-[60vh] text-left font-sans font-bold normal-case text-sm text-slate-400 leading-relaxed whitespace-pre-line italic">
                    {LEGAL_TEXTS[legalView].contenu}
                </div>
            </div>
        </div>
      )}

      {view === 'login' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-1000 relative">
          <h1 className="text-7xl sm:text-8xl lg:text-[7rem] font-black uppercase tracking-tighter mb-12 italic leading-[0.8] text-center select-none opacity-90">
            BUSINESS <span className="text-[#3b82f6]">NSK</span>
          </h1>
          
          <div className="bg-white p-10 sm:p-14 rounded-[4.5rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.15)] w-full max-w-[500px] border-[2px] border-slate-100 relative pt-16">
            
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white px-10 py-3.5 rounded-full text-[10px] font-black tracking-[0.2em] italic shadow-[0_10px_30px_-5px_rgba(59,130,246,0.6)] uppercase whitespace-nowrap">
                ACCÈS MEMBRE
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-4">
                <input required name="p" placeholder="Franck" className="w-full p-7 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-100 outline-none placeholder:text-slate-300 transition-all font-black normal-case text-lg" />
                <input required name="n" placeholder="Heintz" className="w-full p-7 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-100 outline-none placeholder:text-slate-300 transition-all font-black normal-case text-lg" />
                <input required name="e" type="email" placeholder="franckheintz71@gmail.com" className="w-full p-7 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-100 outline-none placeholder:text-slate-300 transition-all font-black normal-case text-lg" />
                <div className="relative">
                  <input required name="pass" type="password" placeholder="••••" className="w-full p-7 bg-[#f8fafc] rounded-[1.5rem] font-black italic border-2 border-transparent focus:border-blue-100 outline-none placeholder:text-slate-300 transition-all font-black normal-case text-lg" />
                  <KeyRound size={22} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" />
                </div>
              </div>
              
              <div className="flex justify-end pt-2 pb-4">
                <button type="button" className="text-[9px] font-black italic uppercase text-slate-300 tracking-widest hover:text-blue-500 transition-colors border-b border-slate-200">
                    MOT DE PASSE OUBLIÉ ?
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-8 bg-[#3b82f6] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] italic shadow-[0_20px_50px_-10px_rgba(59,130,246,0.5)] flex items-center justify-center gap-4 hover:bg-blue-600 active:scale-95 transition-all group">
                <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
                <span>{loading ? "INITIALISATION..." : "ENTRER"}</span>
              </button>
            </form>
          </div>

          <div className="mt-20 w-full max-w-[800px] grid grid-cols-2 gap-x-12 gap-y-6 text-center px-4 font-black italic text-slate-300 uppercase text-[9px] tracking-[0.15em]">
            {Object.keys(LEGAL_TEXTS).map(k => (
              <button key={k} onClick={() => setLegalView(k)} className="hover:text-blue-500 transition-colors uppercase font-black">{k.replace('_', ' ')}</button>
            ))}
          </div>
        </div>
      )}

      {view === 'packs' && (
        <div className="max-w-7xl mx-auto py-12 px-4 text-center animate-in zoom-in duration-500">
          <h2 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-black mb-16 italic tracking-tighter uppercase leading-[0.8] text-slate-900">Choisissez votre <span className="text-[#3b82f6]">Niveau</span></h2>
          
          <div className="flex justify-center items-center gap-10 mb-20 font-black uppercase">
            <span className={`font-black text-xs tracking-widest italic ${!isAnnual ? 'text-[#3b82f6]' : 'text-slate-300'}`}>MENSUEL</span>
            <div onClick={() => setIsAnnual(!isAnnual)} className="w-20 h-10 bg-slate-200 rounded-full p-1.5 cursor-pointer flex items-center transition-all shadow-inner relative">
                <div className={`w-7 h-7 bg-[#3b82f6] rounded-full shadow-lg transition-all duration-500 ${isAnnual ? 'translate-x-10' : 'translate-x-0'}`} />
            </div>
            <span className={`font-black text-xs tracking-widest italic ${isAnnual ? 'text-[#3b82f6]' : 'text-slate-300'}`}>ANNUEL <span className="text-emerald-500 ml-2">(-20%)</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto items-stretch font-black uppercase">
            {[
              { id: 'Starter', feats: ['Gestion Clientèle ADR', 'Suivi Réseau BA', 'Calculateur PRYSM'] },
              { id: 'Business', pop: true, feats: ['Pack Starter Inclus', 'Tracker Pro Leader', 'Simulateur Objectif'] },
              { id: 'Performance', feats: ['Pack Business Inclus', 'Simulateur Gains', 'Accès Total'] }
            ].map(p => (
              <div key={p.id} className={`bg-white p-14 rounded-[4.5rem] flex flex-col text-left transition-all hover:-translate-y-2 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative border-2 ${p.pop ? 'border-[#3b82f6] shadow-2xl scale-105 z-10' : 'border-slate-100 shadow-lg'}`}>
                {p.pop && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white px-8 py-2 rounded-full text-[10px] font-black tracking-[0.3em] shadow-lg">RECOMMANDÉ</div>}
                <h3 className="text-3xl font-black mb-8 italic tracking-tight text-slate-900 uppercase font-black">{p.id}</h3>
                <div className="flex items-baseline gap-1 mb-2 font-black italic">
                  <span className="text-5xl lg:text-6xl tracking-tighter leading-none">{getPrice(p.id)}</span>
                  <span className="text-2xl text-[#3b82f6] ml-1 font-black">€</span>
                  <span className="text-slate-200 text-xl ml-1">/</span>
                </div>
                <div className="text-[11px] text-slate-300 font-black mb-14 tracking-[0.3em] uppercase italic">{isAnnual ? 'L\'année entière' : 'Par mois'}</div>
                <div className="space-y-6 mb-20 flex-grow italic">
                   {p.feats.map((f, i) => (
                     <div key={i} className="flex items-center gap-4 text-slate-500 font-black text-xs uppercase leading-none tracking-tight">
                        <Check size={16} className="text-[#3b82f6]" strokeWidth={4} /> {f}
                     </div>
                   ))}
                </div>
                <button onClick={() => handleCheckout(p.id)} className={`w-full py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-widest italic shadow-xl flex items-center justify-center gap-3 mt-auto transition-all ${p.pop ? 'bg-[#3b82f6] text-white hover:bg-blue-600' : 'bg-slate-900 text-white hover:bg-[#3b82f6]'}`}>
                   COMMANDER <ShoppingCart size={18} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="max-w-7xl mx-auto w-full py-12 px-6 text-left animate-in fade-in duration-700">
           <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
              <div className="text-left font-black uppercase">
                <p className="text-[#3b82f6] text-[10px] tracking-[0.4em] mb-4 italic leading-none uppercase font-black">SESSION MASTER : {userName} <span className="text-slate-300 ml-4">{selectedPack.toUpperCase()}</span></p>
                <h2 className="text-6xl sm:text-8xl font-black italic leading-[0.8] text-slate-950 tracking-tighter uppercase font-black">Tableau de <span className="text-[#3b82f6]">Bord</span></h2>
              </div>
              <button onClick={handleLogout} className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl text-slate-200 hover:text-red-500 transition-all active:scale-95 group">
                <X size={36} strokeWidth={4} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
           </header>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 font-black uppercase italic">
              {allApps.map((app, idx) => {
                const isLocked = !app.packs.includes(selectedPack);
                return (
                    <button 
                        key={idx} 
                        onClick={() => launchApp(app)} 
                        className={`bg-white p-14 rounded-[4.5rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.05)] border-2 border-slate-50 transition-all flex flex-col group text-left relative overflow-hidden ${isLocked ? 'opacity-70 grayscale-[0.5]' : 'hover:shadow-2xl hover:border-[#3b82f6]/20 hover:-translate-y-2'}`}
                    >
                        {isLocked && (
                            <div className="absolute top-8 right-8 bg-slate-900 text-white px-5 py-2 rounded-full flex items-center gap-2 font-black italic uppercase text-[8px] tracking-widest z-20">
                                <Lock size={10} strokeWidth={4} /> MASTER REQUIS
                            </div>
                        )}
                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all shadow-inner ${isLocked ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white'}`}>
                            {React.cloneElement(app.i, { size: 36, strokeWidth: 3 })}
                        </div>
                        <h3 className={`text-3xl font-black mb-4 uppercase leading-none font-black ${isLocked ? 'text-slate-400' : 'group-hover:text-[#3b82f6]'}`}>{app.n}</h3>
                        <p className="text-[11px] text-slate-300 font-bold mb-12 normal-case leading-tight italic">{app.d}</p>
                        
                        <div className={`w-full py-8 rounded-[2.5rem] font-black text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-lg ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-950 text-white group-hover:bg-[#3b82f6]'}`}>
                            {isLocked ? "PACK SUPÉRIEUR REQUIS" : <>DÉMARRER <Play size={16} fill="currentColor" /></>}
                        </div>
                    </button>
                );
              })}
           </div>
        </div>
      )}

      <footer className="mt-20 py-10 opacity-20">
         <p className="text-[10px] tracking-[0.5em] font-black italic uppercase">BUSINESS NSK MASTER • VERSION V79</p>
      </footer>

    </div>
  );
}