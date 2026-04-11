import React, { useState, useEffect } from 'react';
import { 
  Rocket, Check, X, ArrowRight, 
  ShieldCheck, Zap, Star, ScrollText,
  TrendingUp, Users, Calculator, Activity, Calendar
} from 'lucide-react';

/**
 * COMPOSANT UNIQUE POUR L'APERÇU
 * Ce fichier fusionne le Layout et la Page pour que le bouton "Preview" fonctionne.
 */

const App = () => {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('login'); 
  const [selectedPack, setSelectedPack] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const checkoutLinks = {
    starter_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/ed733f72-4562-4e93-8594-a3bdd319f5b3",
    starter_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/3e40bab0-a707-429e-9424-fd0d6b0de81e",
    business_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/910988d0-26a5-4a5d-b4c7-a29dd3302b12",
    business_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/2ad67cb8-485b-48a7-b089-1f13a4a871e8",
    performance_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/7fdb7200-82ff-48c7-b28b-a69ed2a87dc3",
    performance_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/8b1ed304-f6a6-4b65-8f8d-fb1011109bad",
  };

  const applications = [
    { id: 1, name: "Gestionnaire Clientèle", path: "/adrclient", icon: <Users size={24}/>, pack: "starter" },
    { id: 2, name: "Suivi de Réseau", path: "/adrbamembre", icon: <Users size={24}/>, pack: "starter" },
    { id: 3, name: "Calculateur PRYSM io", path: "/prysmio", icon: <Calculator size={24}/>, pack: "starter" },
    { id: 4, name: "Planificateur d'Objectif", path: "/simulateurobjectif", icon: <Calendar size={24}/>, pack: "business" },
    { id: 5, name: "Tracker Global", path: "/tracker", icon: <Activity size={24}/>, pack: "business" },
    { id: 6, name: "Analyse de Gains", path: "/simulateurgains", icon: <TrendingUp size={24}/>, pack: "performance" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView('packs');
    }, 800);
  };

  const LegalModal = () => {
    if (!legalModal) return null;
    const content = {
      mentions: { title: "Mentions Légales", p: "Éditeur : Invest In Your Future. Contact : +33 6 87 69 49 82. Hébergement : Vercel Inc." },
      remboursement: { title: "Remboursement", p: "Art L221-28 : Le droit de rétractation ne peut être exercé pour les contenus numériques dont l'exécution commence immédiatement." },
      conditions: { title: "Conditions CGV/CGU", p: "L'accès aux outils est strictement personnel et limité à 2 appareils simultanés par licence." },
      confidentialite: { title: "Confidentialité", p: "L’accès aux outils est strictement personnel et limité à deux appareils par licence (un smartphone et un ordinateur)." }
    };
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 italic font-sans">
        <div className="bg-white p-10 rounded-[3rem] max-w-lg w-full relative shadow-2xl border border-slate-100">
          <button onClick={() => setLegalModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={18}/></button>
          <div className="flex items-center gap-4 text-indigo-600 mb-6">
            <ScrollText size={24} />
            <h3 className="text-xl font-black uppercase italic tracking-tighter">{content[legalModal].title}</h3>
          </div>
          <p className="text-slate-600 font-bold leading-relaxed mb-8 italic">{content[legalModal].p}</p>
          <button onClick={() => setLegalModal(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest italic hover:bg-indigo-600 transition-colors">Fermer la fenêtre</button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 italic font-sans flex flex-col antialiased">
      <LegalModal />
      
      {view === 'login' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-700">
          <div className="p-6 bg-white rounded-3xl shadow-xl text-indigo-600 mb-10 ring-8 ring-indigo-50 border border-slate-100">
            <Rocket size={44} />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-12 italic leading-none text-center">
            Business <span className="text-indigo-600">NSK</span>
          </h1>
          
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl w-full max-w-md border-t-8 border-indigo-600 text-left relative">
            <div className="absolute -top-4 right-10 bg-indigo-600 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Accès Sécurisé</div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input placeholder="Prénom" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-indigo-300 transition-all italic text-sm" />
              <input placeholder="Nom" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-indigo-300 transition-all italic text-sm" />
              <input type="email" placeholder="Email" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:border-indigo-300 transition-all italic text-sm" />
              <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all italic mt-4 hover:bg-indigo-700">
                {loading ? "Initialisation..." : "Découvrir les Packs →"}
              </button>
            </form>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-12 gap-y-3 w-full max-w-md px-4">
            <button onClick={() => setLegalModal('mentions')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 text-left italic tracking-widest">Mentions Légales</button>
            <button onClick={() => setLegalModal('remboursement')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 text-right italic tracking-widest">Remboursement</button>
            <button onClick={() => setLegalModal('conditions')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 text-left italic tracking-widest">Conditions</button>
            <button onClick={() => setLegalModal('confidentialite')} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 text-right italic tracking-widest">Confidentialité</button>
          </div>
        </div>
      )}

      {view === 'packs' && (
        <div className="max-w-7xl mx-auto w-full py-20 px-6 text-center animate-in fade-in duration-700">
          <h2 className="text-6xl font-black uppercase tracking-tighter mb-4 italic leading-none">Votre <span className="text-indigo-600">Stratégie</span></h2>
          <p className="text-slate-500 font-bold mb-16 italic text-lg tracking-tight">Pilotez votre réussite avec nos solutions premium.</p>
          
          <div className="flex justify-center items-center gap-6 mb-20 italic">
            <span className={`text-[10px] font-black transition-all tracking-widest ${!isAnnual ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>MENSUEL</span>
            <div onClick={() => setIsAnnual(!isAnnual)} className="w-16 h-8 bg-slate-200 rounded-full p-1 cursor-pointer flex items-center relative transition-all shadow-inner">
                <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-md transition-all duration-300 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
            </div>
            <span className={`text-[10px] font-black transition-all tracking-widest ${isAnnual ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>ANNUEL <span className="text-emerald-500">(-20%)</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-stretch italic">
            {[
              { id:'starter', name:'STARTER', price: isAnnual ? '99 €' : '9,90 €', feat: ["Gestionnaire Clientèle", "Suivi de Réseau", "Calculateur PRYSM io"] },
              { id:'business', name:'BUSINESS', price: isAnnual ? '149 €' : '14,90 €', pop:true, feat: ["Offre STARTER Incluse", "Planificateur d'Objectif", "Tracker Global"] },
              { id:'performance', name:'PERFORMANCE', price: isAnnual ? '199 €' : '19,90 €', feat: ["Offre BUSINESS Incluse", "Analyse de Gains"] }
            ].map(p => (
              <div key={p.id} className={`bg-white p-14 rounded-[4rem] flex flex-col text-left transition-all duration-500 w-full max-w-[400px] border-2 relative ${p.pop ? 'border-indigo-600 shadow-2xl scale-105' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}>
                {p.pop && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg italic">LE PLUS POPULAIRE</div>}
                <h3 className="text-4xl font-black uppercase mb-8 italic tracking-tighter">{p.name}</h3>
                <div className="text-6xl font-black mb-2 italic tracking-tighter">{p.price}</div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-12 italic">PAR {isAnnual ? 'AN' : 'MOIS'}</div>
                <div className="space-y-4 mb-14 flex-grow italic">
                  {p.feat.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-600 font-bold text-sm italic">
                      <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                        <Check size={12} className="text-emerald-500" strokeWidth={4} />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => { 
                  const linkKey = `${p.id}_${isAnnual ? 'a' : 'm'}`;
                  window.open(checkoutLinks[linkKey], '_blank'); 
                  setSelectedPack(p.id); setView('dashboard'); 
                }} className={`w-full py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg italic active:scale-95 transition-all ${p.pop ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white hover:bg-indigo-600'}`}>Sélectionner cette offre</button>
              </div>
            ))}
          </div>
          <button onClick={() => setView('login')} className="mt-20 text-[10px] font-black uppercase text-slate-300 hover:text-indigo-600 italic transition-all tracking-widest">← Retour à l'accueil</button>
        </div>
      )}

      {view === 'dashboard' && (
        <div className="max-w-7xl mx-auto w-full py-20 px-6 text-left animate-in zoom-in duration-500">
          <div className="flex justify-between items-end mb-20 italic">
            <div>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">Espace Intelligence Actif</p>
              <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">Niveau <span className="text-indigo-600">{selectedPack}</span></h2>
              <div className="mt-6 flex items-center gap-3 text-emerald-600 text-[10px] font-black uppercase italic bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 w-fit"><ShieldCheck size={18}/> Session Stratégique Sécurisée</div>
            </div>
            <button onClick={() => setView('packs')} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm text-slate-300 hover:text-indigo-600 transition-all hover:shadow-xl"><X size={28} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 italic">
            {applications.filter(app => {
              if (selectedPack === 'performance') return true;
              if (selectedPack === 'business') return app.pack !== 'performance';
              return app.pack === 'starter';
            }).map((app) => (
              <div key={app.id} className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group flex flex-col italic relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:bg-indigo-50 transition-colors duration-500" />
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 relative shadow-inner">{app.icon}</div>
                <h3 className="text-3xl font-black uppercase tracking-tight mb-10 italic leading-none">{app.name}</h3>
                <button onClick={() => alert("Navigation vers " + app.path)} className="w-full py-6 bg-slate-900 text-white rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 italic group-hover:bg-indigo-600 transition-all shadow-lg active:scale-95">Démarrer l'outil <ArrowRight size={18}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;