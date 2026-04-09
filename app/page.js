import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Lock, ArrowRight, Mail, User, Sparkles, Rocket, 
  ShieldCheck, AlertCircle, Check, Star, Crown, Zap, X, ScrollText, LayoutDashboard
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'business-nsk-leads';

export default function App() {
  // États
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'packs', ou 'dashboard'
  const [selectedPack, setSelectedPack] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);

  // --- CONFIGURATION DES APPLICATIONS ---
  const applications = [
    { id: 1, name: "Gestionnaire Clientèle", file: "app1.html", pack: "starter" },
    { id: 2, name: "Suivi de Réseau", file: "app2.html", pack: "starter" },
    { id: 3, name: "Analyse de Performance", file: "app3.html", pack: "starter" },
    { id: 4, name: "Planificateur de Succès", file: "app4.html", pack: "business" },
    { id: 5, name: "Tableau de Bord Détaillé", file: "app5.html", pack: "business" },
    { id: 6, name: "Calculateur de Commissions", file: "app6.html", pack: "performance" },
  ];

  // --- LIENS DE PAIEMENT ---
  const links = {
    starter_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/ed733f72-4562-4e93-8594-a3bdd319f5b3", 
    starter_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/3e40bab0-a707-429e-9424-fd0d6b0de81e", 
    business_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/910988d0-26a5-4a5d-b4c7-a29dd3302b12",
    business_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/2ad67cb8-485b-48a7-b089-1f13a4a871e8",
    performance_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/7fdb7200-82ff-48c7-b28b-a69ed2a87dc3",
    performance_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/8b1ed304-f6a6-4b65-8f8d-fb1011109bad",
  };

  const packs = [
    {
      id: 'starter',
      name: 'STARTER',
      icon: <Zap className="text-slate-400" size={24} />,
      price: { m: "9,90 €", a: "99 €" },
      focus: "Bases & Suivi",
      description: "L'essentiel pour digitaliser votre base de données et sécuriser vos relations clients.",
      features: ['Gestionnaire Clientèle', 'Suivi de Réseau', 'Analyse de Performance'],
    },
    {
      id: 'business',
      name: 'BUSINESS',
      icon: <Star className="text-indigo-600" size={24} />,
      price: { m: "14,90 €", a: "149 €" },
      focus: "Pilotage & Stratégie",
      description: "Le pack favori : inclut le Planificateur de Succès et le Tableau de Bord détaillé.",
      features: ['Tout le Pack STARTER', 'Planificateur de Succès', 'Tableau de Bord détaillé'],
      popular: true
    },
    {
      id: 'performance',
      name: 'PERFORMANCE',
      icon: <Crown className="text-amber-500" size={24} />,
      price: { m: "19,90 €", a: "199 €" },
      focus: "Leadership & Revenus",
      description: "La puissance totale : inclut le Calculateur de Commissions et accès prioritaire aux futures Apps.",
      features: ['Packs STARTER & BUSINESS', 'Calculateur de Commissions', 'Accès prioritaire futures Apps'],
    }
  ];

  // --- LOGIQUE DE FILTRAGE ---
  const getVisibleApps = () => {
    if (selectedPack === 'performance') return applications;
    if (selectedPack === 'business') return applications.filter(a => a.pack === 'starter' || a.pack === 'business');
    if (selectedPack === 'starter') return applications.filter(a => a.pack === 'starter');
    return [];
  };

  // --- AUTHENTIFICATION ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.prenom || !formData.nom || !formData.email) return;
    setLoading(true);
    try {
      const leadsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
      await addDoc(leadsCollection, {
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        timestamp: serverTimestamp(),
        userId: user?.uid || 'anonymous',
        source: 'Business NSK Portal'
      });
      setView('packs');
    } catch (err) {
      setErrorMsg("Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPack = (packId) => {
    const key = `${packId}_${isAnnual ? 'a' : 'm'}`;
    window.open(links[key], '_blank');
    setSelectedPack(packId);
    setView('dashboard');
  };

  // --- MODALE LÉGALE ---
  const LegalModal = () => {
    if (!legalModal) return null;
    const content = {
      conditions: {
        title: "Conditions Générales",
        sections: [
          { h: "1. Objet", p: "Modalités d'accès aux outils NSK Strategic Intelligence." },
          { h: "2. Services", p: "Outils de pilotage business sous forme d'abonnement numérique." }
        ]
      },
      confidentialite: {
        title: "Confidentialité",
        sections: [
          { h: "1. Collecte", p: "Nom et email uniquement pour valider l'accès." },
          { h: "2. Sécurité", p: "Données chiffrées et jamais partagées." }
        ]
      }
    };
    const active = content[legalModal];
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative border border-slate-100 italic">
          <button onClick={() => setLegalModal(null)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X size={20}/></button>
          <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><ScrollText className="text-indigo-600"/> {active.title}</h3>
          <div className="space-y-6">
            {active.sections.map((s, idx) => (
              <div key={idx}><h4 className="text-[10px] font-black text-indigo-600 uppercase">{s.h}</h4><p className="text-xs font-bold text-slate-500">{s.p}</p></div>
            ))}
          </div>
          <button onClick={() => setLegalModal(null)} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px]">Fermer</button>
        </div>
      </div>
    );
  };

  // --- VUE 1 : LOGIN ---
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans italic">
        <LegalModal />
        <div className="w-full max-w-[460px] text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-xl text-indigo-600 rotate-3"><Rocket size={40} /></div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Business <span className="text-indigo-600">NSK</span></h2>
          </div>
          <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 relative overflow-hidden text-left border border-slate-50">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <input type="text" required placeholder="Prénom" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold italic" />
              <input type="text" required placeholder="Nom" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold italic" />
              <input type="email" required placeholder="Email Privé" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-indigo-600 font-bold italic" />
              <button type="submit" disabled={loading} className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-indigo-700 transition-all">
                {loading ? "Vérification..." : "Accéder aux Packs"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE 2 : PACKS ---
  if (view === 'packs') {
    return (
      <div className="min-h-screen bg-[#f8fafc] py-20 px-6 font-sans italic">
        <LegalModal />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-6 italic">Choisissez votre <span className="text-indigo-600">Niveau</span></h1>
            <div className="flex items-center justify-center gap-6 mt-10">
              <span className={`text-xs font-black uppercase ${!isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Mensuel</span>
              <button onClick={() => setIsAnnual(!isAnnual)} className="w-16 h-8 bg-slate-200 rounded-full relative p-1">
                <div className={`w-6 h-6 bg-indigo-600 rounded-full transform transition-transform ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-xs font-black uppercase ${isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Annuel (-20%)</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <div key={pack.id} className={`bg-white rounded-[3.5rem] border-2 p-10 flex flex-col relative ${pack.popular ? 'border-indigo-500 shadow-2xl scale-105' : 'border-slate-100'}`}>
                <div className="mb-6"><h3 className="text-3xl font-black uppercase italic">{pack.name}</h3></div>
                <div className="mb-8 font-black text-4xl">{isAnnual ? pack.price.a : pack.price.m}</div>
                <div className="flex-grow space-y-4 mb-8">
                  {pack.features.map((f, i) => <div key={i} className="flex items-center gap-3 text-xs font-bold"><Check size={14} className="text-emerald-500"/> {f}</div>)}
                </div>
                <button onClick={() => handleSelectPack(pack.id)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] hover:bg-indigo-600 transition-all">Sélectionner</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VUE 3 : DASHBOARD (FILTRAGE DES 6 APPS) ---
  if (view === 'dashboard') {
    const myApps = getVisibleApps();
    return (
      <div className="min-h-screen bg-[#f8fafc] py-16 px-6 font-sans italic">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Accès Stratégique Actif</p>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Espace <span className="text-indigo-600">{selectedPack}</span></h2>
            </div>
            <button onClick={() => setView('packs')} className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 hover:text-indigo-600"><X size={24}/></button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myApps.map((app) => (
              <div key={app.id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 flex flex-col gap-6 hover:border-indigo-500 transition-all group">
                <div className="flex justify-between items-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all"><LayoutDashboard size={28}/></div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">{app.pack}</span>
                </div>
                <h3 className="text-xl font-black uppercase italic leading-tight">{app.name}</h3>
                <button 
                  onClick={() => window.location.href = app.file} 
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-all"
                >
                  Ouvrir <ArrowRight size={14}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}