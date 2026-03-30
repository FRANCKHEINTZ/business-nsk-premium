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
  ShieldCheck, AlertCircle, Check, Star, Crown, Zap, X, ScrollText
} from 'lucide-react';

// --- CONFIGURATION FIREBASE ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'business-nsk-leads';

export default function App() {
  // États pour le formulaire de Lead Gen
  const [formData, setFormData] = useState({ prenom: '', nom: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' ou 'packs'
  const [errorMsg, setErrorMsg] = useState(null);
  
  // État pour les textes légaux (Modale)
  const [legalModal, setLegalModal] = useState(null); // null, 'conditions', 'confidentialite'

  // États pour la partie Packs
  const [isAnnual, setIsAnnual] = useState(false);

  // --- LIENS DE PAIEMENT VÉRIFIÉS ---
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
    if (!user) {
      setErrorMsg("Initialisation de la sécurité... Patientez.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const leadsCollection = collection(db, 'artifacts', appId, 'public', 'data', 'leads');
      await addDoc(leadsCollection, {
        firstName: formData.prenom,
        lastName: formData.nom,
        email: formData.email,
        timestamp: serverTimestamp(),
        userId: user.uid,
        source: 'Business NSK Integrated'
      });
      setView('packs');
    } catch (err) {
      setErrorMsg("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPack = (packId) => {
    const key = `${packId}_${isAnnual ? 'a' : 'm'}`;
    const checkoutUrl = links[key];
    // window.open est plus fiable pour les redirections vers un paiement externe
    window.open(checkoutUrl, '_blank');
  };

  // --- COMPOSANT MODALE LÉGALE ---
  const LegalModal = () => {
    if (!legalModal) return null;

    const content = {
      conditions: {
        title: "Conditions Générales",
        sections: [
          { h: "1. Objet", p: "Les présentes conditions visent à définir les modalités d'accès aux outils de gestion NSK Strategic Intelligence." },
          { h: "2. Services", p: "NSK propose des outils de pilotage business (Starter, Business, Performance) sous forme d'abonnement numérique." },
          { h: "3. Paiement", p: "Les transactions sont traitées de manière sécurisée par notre partenaire Lemon Squeezy. L'accès est immédiat après validation." },
          { h: "4. Propriété", p: "Tous les modèles et interfaces restent la propriété de NSK Strategic Intelligence." }
        ]
      },
      confidentialite: {
        title: "Confidentialité",
        sections: [
          { h: "1. Collecte", p: "Nous collectons uniquement votre nom et email pour valider votre accès stratégique." },
          { h: "2. Utilisation", p: "Ces données servent au support client et à la personnalisation de votre tableau de bord." },
          { h: "3. Sécurité", p: "Vos données sont chiffrées sur des serveurs sécurisés et ne sont jamais partagées." },
          { h: "4. Droits", p: "Vous disposez d'un droit de retrait total de vos données sur simple demande." }
        ]
      }
    };

    const active = content[legalModal];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden border border-slate-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
          <button 
            onClick={() => setLegalModal(null)}
            className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <ScrollText size={20} className="text-indigo-600" />
            <h3 className="text-xl font-black uppercase tracking-tight italic text-slate-900 leading-none">
              {active.title}
            </h3>
          </div>
          
          <div className="space-y-6 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar not-italic font-sans">
            {active.sections.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{s.h}</h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">{s.p}</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setLegalModal(null)}
            className="w-full mt-8 py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all not-italic"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  };

  // --- VUE 1 : IDENTIFICATION ---
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans italic text-slate-900">
        <LegalModal />
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-[460px] relative z-10 text-center space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 text-indigo-600 mb-2 rotate-3 transition-transform hover:rotate-0 duration-500">
              <Rocket size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">
              Business <span className="text-indigo-600">NSK</span>
            </h2>
            <div className="flex items-center justify-center gap-2 opacity-40">
              <Sparkles size={12} className="text-indigo-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] not-italic">Identification de sécurité</p>
            </div>
          </div>

          <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-50 p-10 md:p-12 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] font-bold uppercase animate-pulse italic">
                <AlertCircle size={16} /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" required placeholder="Prénom" 
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm italic"
                />
              </div>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" required placeholder="Nom de famille" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm italic"
                />
              </div>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="email" required placeholder="Email Privé" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 transition-all font-bold text-slate-900 text-sm italic"
                />
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-8 not-italic"
              >
                {loading ? "Vérification..." : <>Accéder aux Packs <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="mt-12 flex justify-center gap-8 border-t border-slate-50 pt-8 opacity-40 hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setLegalModal('conditions')}
                className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest not-italic font-sans"
              >
                Conditions
              </button>
              <button 
                onClick={() => setLegalModal('confidentialite')}
                className="text-[9px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest not-italic font-sans"
              >
                Confidentialité
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 opacity-30">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] font-sans">Connection Sécurisée SSL v2.5</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400 italic font-sans">
              NSK Strategic Intelligence © 2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- VUE 2 : GRILLE DES PACKS ---
  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-6 font-sans text-slate-900 italic animate-in fade-in duration-1000">
      <LegalModal />
      <div className="max-w-6xl mx-auto">
        
        {/* Header Packs */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6 not-italic">
            <Rocket size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Identification réussie : {formData.prenom}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-none italic">
            Choisissez votre <span className="text-indigo-600">Niveau</span>
          </h1>

          <div className="flex items-center justify-center gap-6 mt-10 not-italic font-sans text-left">
            <span className={`text-xs font-black uppercase tracking-widest ${!isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Mensuel</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-16 h-8 bg-slate-200 rounded-full relative p-1 transition-all duration-500"
            >
              <div className={`w-6 h-6 bg-indigo-600 rounded-full shadow-lg transform transition-transform duration-500 ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`}></div>
            </button>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black uppercase tracking-widest ${isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Annuel</span>
              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter animate-bounce">
                -20% Économie
              </span>
            </div>
          </div>
        </div>

        {/* Grille */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {packs.map((pack) => (
            <div key={pack.id} className={`bg-white rounded-[3.5rem] border-2 p-10 flex flex-col relative transition-all duration-500 hover:shadow-2xl ${pack.popular ? 'border-indigo-500 shadow-xl scale-105 z-10' : 'border-slate-100'}`}>
              {pack.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2.5 rounded-full shadow-xl not-italic font-sans">
                  Plus Populaire
                </div>
              )}
              
              <div className="flex justify-between items-start mb-8 not-italic font-sans text-left text-left">
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${pack.popular ? 'text-indigo-600' : 'text-slate-400'}`}>{pack.focus}</p>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic">{pack.name}</h3>
                </div>
                <div className={`p-4 rounded-[1.5rem] ${pack.popular ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                   {pack.icon}
                </div>
              </div>

              <div className="mb-8 text-left not-italic font-sans text-left">
                <span className="text-5xl font-black tracking-tighter text-slate-900">{isAnnual ? pack.price.a : pack.price.m}</span>
                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest ml-2">/{isAnnual ? 'an' : 'mois'}</span>
              </div>

              <div className="flex-grow space-y-8 text-left text-left">
                <p className="text-slate-500 text-sm font-medium leading-relaxed border-l-4 border-slate-50 pl-4 italic">
                  {pack.description}
                </p>
                <div className="space-y-4 pt-6 border-t border-slate-50 not-italic">
                  {pack.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-emerald-600" strokeWidth={4} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleSelectPack(pack.id)}
                className={`w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all mt-12 shadow-xl active:scale-95 not-italic ${
                  pack.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                Sélectionner <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col items-center gap-6 not-italic font-sans opacity-40 text-center">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={18} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Paiement Sécurisé SSL via Lemon Squeezy</span>
          </div>
          <div className="flex gap-6 mt-2">
            <button 
              onClick={() => setLegalModal('conditions')}
              className="text-[9px] font-bold uppercase tracking-widest hover:text-indigo-600"
            >
              Conditions
            </button>
            <button 
              onClick={() => setLegalModal('confidentialite')}
              className="text-[9px] font-bold uppercase tracking-widest hover:text-indigo-600"
            >
              Confidentialité
            </button>
            <button onClick={() => setView('login')} className="text-[9px] font-bold uppercase tracking-widest hover:text-indigo-600">Modifier profil</button>
          </div>
        </div>
      </div>
    </div>
  );
}
