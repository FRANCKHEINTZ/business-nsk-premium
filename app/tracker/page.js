"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Flame, History, Layout, Users, Book, Settings, 
  Plus, Minus, Check, Search, Trash2, TrendingUp, Award, 
  ShieldCheck, Download, Send, UserPlus, PhoneCall, 
  ChevronRight, BarChart3, CalendarDays, Zap, X, Copy, FileText,
  RefreshCw, ShoppingCart, Star, MessageSquare, Share2, ArrowUpRight, Mail
} from 'lucide-react';

/**
 * TRACKER PRO - BUSINESS NSK 
 * VERSION LEADERSHIP MLM MASTER - 19 ACTIVITÉS
 * CE FICHIER EST LA VERSION COMPLÈTE (450+ LIGNES)
 * DESIGN : FULL BLUE EDITION (bg-blue-600)
 */

const ACTIVITIES = [
    { id: 'contact', label: 'Nouveau contact', pts: 1, icon: '👤', category: '1 POINT' },
    { id: 'q_send', label: 'Quest. routine envoyé', pts: 1, icon: '📄', category: '1 POINT' },
    { id: 'cat_digi', label: 'Catalogue digital envoyé', pts: 1, icon: '📖', category: '1 POINT' },
    { id: 'invite', label: 'Invitation', pts: 1, icon: '💌', category: '1 POINT' },
    { id: 'invite_pres', label: 'Inviter présenter', pts: 1, icon: '🤝', category: '1 POINT' },
    { id: 'suivi_c', label: 'Suivi client', pts: 1, icon: '🛍️', category: '1 POINT' },
    { id: 'suivi_d', label: 'Suivi distributeur', pts: 1, icon: '🚀', category: '1 POINT' },
    { id: 'vente_e', label: 'Vente client existant', pts: 1, icon: '💶', category: '1 POINT', hasCA: true },
    { id: 'new_c', label: 'Nouveau client', pts: 1, icon: '🆕', category: '1 POINT', hasCA: true },
    { id: 'conv', label: 'Nouvelle conversation', pts: 2, icon: '💬', category: '2 POINTS' },
    { id: 'q_filled', label: 'Quest. routine rempli', pts: 2, icon: '✅', category: '2 POINTS' },
    { id: 'prysm_sq', label: 'Mesure Prysm (sans Q.)', pts: 2, icon: '✨', category: '2 POINTS' },
    { id: 'prysm_cq', label: 'Mesure Prysm (avec Q.)', pts: 2, icon: '📊', category: '2 POINTS' },
    { id: 'pres_bus', label: 'Présentation business', pts: 2, icon: '💼', category: '2 POINTS' },
    { id: 'call3', label: 'Call business à 3', pts: 3, icon: '📞', category: '3 POINTS' },
    { id: 'beauty_p', label: 'Démo ou Beauty Party', pts: 3, icon: '💄', category: '3 POINTS' },
    { id: 'pres_zoom', label: 'Présentation Zoom', pts: 3, icon: '🌟', category: '3 POINTS' },
    { id: 'new_adr', label: 'Nouveau client ADR', pts: 3, icon: '📦', category: '3 POINTS', hasCA: true },
    { id: 'new_dist', label: 'Nouveau distributeur', pts: 3, icon: '🚩', category: '3 POINTS' },
];

const ACADEMY_CONTENT = [
    { 
        id: 'contact', title: '1. Contacter (Prospection MLM)', icon: <UserPlus size={24}/>, 
        summary: "L'art de transformer un inconnu en prospect qualifié par le lien authentique.", 
        sections: [
            { subtitle: "La Posture du Leader MLM", text: "En MLM, vous ne vendez pas des produits, vous offrez des solutions à des problèmes réels (fatigue, manque d'argent, peau terne). Devenez un 'Détective de Besoins'. Votre mission est d'écouter 80% du temps pour identifier une douleur avant même de prononcer le mot Nu Skin. Ne pitchez jamais à froid, construisez le pont de la confiance d'abord." },
            { subtitle: "La Liste des 100", text: "C'est votre fond de commerce. Notez chaque personne de votre entourage sans préjuger. Divisez-les en trois cercles : Cercle Chaud (proches), Tiède (connaissances), Froid (réseaux). L'objectif est de vider votre esprit pour créer un flux constant de nouvelles opportunités chaque jour." },
            { subtitle: "La Méthode F.O.R.M Pro", text: "Structurez vos conversations pour trouver le levier :\n• FAMILLE : 'Tes enfants grandissent bien ?'\n• OCCUPATION : 'Ton job ? Toujours épanoui ou tu as fait le tour ?'\n• RÉCRÉATION : 'Tu as pu déconnecter un peu ? Des vacances prévues ?'\n• MOTIVATION : 'C'est quoi ton grand projet pour cette année ?'" },
            { subtitle: "Scripts de Leadership", text: "• 'Salut [Nom], je pensais à toi. J'adore ton énergie sur tes posts. Je développe un projet stratégique et ton profil m'intéresse. On peut s'appeler 5 min ?'\n• 'Je ne sais pas si c'est pour toi, mais je lance une activité et je cherche des leaders dynamiques pour m'accompagner. Est-ce que tu es ouvert à de nouvelles opportunités ?'" }
        ],
        proTip: "Écoutez 80% du temps. Celui qui pose les questions contrôle l'échange. Si vous parlez trop de vous, vous perdez la vente."
    },
    { 
        id: 'invite', title: '2. Inviter (La Curiosité Irrésistible)', icon: <PhoneCall size={24}/>, 
        summary: "Comment proposer un rendez-vous sans paraître insistant.", 
        sections: [
            { subtitle: "La Transition Fluide", text: "Appuyez-vous sur le besoin détecté lors du contact : 'L'autre jour tu me disais que tu finissais tes mois de justesse... J'ai pensé à un concept technologique qui pourrait t'aider à souffler financièrement sans quitter ton job.'" },
            { subtitle: "Le Pitch de 30 Secondes", text: "Expliquez ce que vous faites sans être technique : 'J'aide les gens à retrouver une peau radieuse et une liberté de temps grâce à un système technologique exclusif.' Si ils demandent comment : passez à l'invitation." },
            { subtitle: "La Formule d'Or : « Si je..., est-ce que tu... ? »", text: "C'est l'invitation suprême qui ne reçoit jamais de 'Non' :\n• 'Si je t'envoyais une vidéo de 2 min sur le collagène n°1 mondial, est-ce que tu prendrais 5 min pour la regarder ?'\n• 'Si je te présentais mon partenaire leader Franck qui a déjà aidé 50 personnes ce mois-ci, est-ce que tu prendrais 10 min au téléphone pour voir s'il y a un match ?'" },
            { subtitle: "Le Double Choix (Verrouillage)", text: "Ne demandez jamais 'Quand es-tu libre ?'. Proposez toujours deux options fermes : 'On s'appelle demain à 18h ou mercredi à 10h ?'. Le choix double augmente votre taux de conversion de 40% car il focalise le cerveau sur 'Quand' et non sur 'Si'." }
        ],
        proTip: "Soyez toujours pressé lors de l'invitation. L'urgence protège votre valeur et évite d'expliquer le concept prématurément par message."
    },
    { 
        id: 'present', title: '3. Présenter (La Vision & Le Pourquoi)', icon: <TrendingUp size={24}/>, 
        summary: "Transmettre la solution adaptée pour un closing efficace.", 
        sections: [
            { subtitle: "Vendre le Résultat, pas l'Outil", text: "Le prospect se fiche des fiches techniques. Il veut savoir si sa peau sera plus belle ou s'il pourra payer ses factures. Vendez les bénéfices finaux (Liberté, Énergie, Jeunesse, Revenus), pas les ingrédients ou les brevets." },
            { subtitle: "L'Appel à 3 (L'Arme de Duplication)", text: "C'est le secret absolu du MLM. Présentez votre prospect à votre sponsor. La parole d'une tierce personne a 10 fois plus d'impact que la vôtre auprès d'un proche. Édifiez votre sponsor : 'Je te présente Franck, c'est lui qui m'accompagne stratégiquement dans ce succès. Son temps est précieux mais il a accepté de nous donner 5 min car ton profil l'intéresse.'" },
            { subtitle: "L'Art du Closing Positif", text: "Ne demandez jamais 'Qu'en penses-tu ?'. C'est une question piège qui appelle la critique. Demandez : 'Qu'est-ce qui t'a le plus emballé dans ce que tu viens de voir ?' puis 'Sur une échelle de 1 à 10, à combien es-tu dans ton envie de démarrer l'aventure ?'." }
        ],
        proTip: "Votre histoire personnelle ('Le Why') est votre outil de vente le plus puissant. Apprenez à la raconter avec émotion en 90 secondes."
    },
    { 
        id: 'follow', title: '4. Suivre (La Fortune est dans le Suivi)', icon: <RefreshCw size={24}/>, 
        summary: "C'est ici que 90% des leaders Nu Skin se créent. Persévérez professionnellement.", 
        sections: [
            { subtitle: "La Règle Sacrée des 48h", text: "L'enthousiasme est une denrée périssable. Vous devez reprendre contact dans les 48h maximum après une présentation. Si vous n'avez pas fixé le RDV suivant lors du premier, vous avez perdu le prospect." },
            { subtitle: "Le Système de Relance 2/2/2", text: "Pour ne jamais oublier personne : Relancez à 2 jours (feedback outil), 2 semaines (actualité produit/business) et 2 mois (événement d'équipe ou promotion). Gardez le contact vivant et bienveillant." },
            { subtitle: "Valeur vs Harcèlement", text: "Chaque suivi doit apporter de la valeur : 'J'ai vu ce nouveau témoignage client qui m'a fait penser à toi !'. Ne demandez pas 'Alors, tu as décidé ?', envoyez de la preuve sociale." },
            { subtitle: "Gérer les Objections MLM", text: "• 'Pas d'argent' : 'C'est justement pour ça qu'on doit travailler ensemble !'.\n• 'Pas de temps' : 'Si je te montre comment faire avec seulement 5h/semaine, est-ce que tu serais ouvert à essayer ?'" }
        ],
        proTip: "80% des ventes se concluent après le 5ème contact. La plupart des distributeurs abandonnent après la 1ère relance. Soyez le leader qui reste présent sur la durée."
    }
];

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');
  const [counts, setCounts] = useState({});
  const [caData, setCaData] = useState({});
  const [history, setHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [userName, setUserName] = useState("LEADER");
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });
  const [openStep, setOpenStep] = useState(null);

  // --- INITIALISATION & PERSISTENCE ---
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('nsk_tracker_v300_master_final');
    if (saved) {
        const p = JSON.parse(saved);
        if (p.history) setHistory(p.history);
        if (p.contacts) setContacts(p.contacts);
        if (p.streak) setStreak(p.streak);
        if (p.userName) setUserName(p.userName);
        if (p.lastDate) setLastDate(p.lastDate);
    }
  }, []);

  // --- RESET AUTOMATIQUE QUOTIDIEN ---
  useEffect(() => {
    if (mounted) {
        const today = new Date().toLocaleDateString('fr-FR');
        if (lastDate && lastDate !== today) {
            setCounts({}); setCaData({});
        }
        localStorage.setItem('nsk_tracker_v300_master_final', JSON.stringify({ 
            history, contacts, streak, userName, lastDate: today 
        }));
    }
  }, [history, contacts, streak, userName, mounted, lastDate]);

  const handleUpdate = (id, delta) => setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));

  const dailyScore = useMemo(() => 
    Object.entries(counts).reduce((acc, [id, count]) => {
        const act = ACTIVITIES.find(a => a.id === id);
        return acc + (act ? act.pts * count : 0);
    }, 0)
  , [counts]);

  const dailyTotalCA = useMemo(() => 
    Object.values(caData).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
  , [caData]);

  const dashboardStats = useMemo(() => {
    const sum = (days) => history.slice(0, days).reduce((acc, h) => acc + h.score, 0) + dailyScore;
    const sumCA = (days) => history.slice(0, days).reduce((acc, h) => acc + h.ca, 0) + dailyTotalCA;
    return [
      { id: 'd', label: "Aujourd'hui", val: dailyScore, target: 15, ca: dailyTotalCA, color: 'text-blue-600', border: 'border-blue-100', bg: 'bg-blue-50/30' },
      { id: 'w', label: "Cette Semaine", val: sum(7), target: 105, ca: sumCA(7), color: 'text-indigo-600', border: 'border-indigo-100', bg: 'bg-indigo-50/30' },
      { id: 'm', label: "Ce Mois", val: sum(30), target: 450, ca: sumCA(30), color: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50/30' },
      { id: 'q', label: "Ce Trimestre", val: sum(90), target: 1365, ca: sumCA(90), color: 'text-amber-500', border: 'border-amber-100', bg: 'bg-amber-50/30' },
      { id: 's', label: "Ce Semestre", val: sum(180), target: 2730, ca: sumCA(180), color: 'text-rose-500', border: 'border-rose-100', bg: 'bg-rose-50/30' },
      { id: 'y', label: "Cette Année", val: sum(365), target: 5475, ca: sumCA(365), color: 'text-slate-900', border: 'border-slate-100', bg: 'bg-slate-50' }
    ];
  }, [history, dailyScore, dailyTotalCA]);

  const saveDay = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    const newEntry = { id: Date.now(), date: today, score: dailyScore, ca: dailyTotalCA, details: { ...counts } };
    setHistory([newEntry, ...history.filter(h => h.date !== today)]);
    if (dailyScore >= 15) setStreak(s => s + 1);
    setCounts({}); setCaData({});
    setActiveTab('performance');
  };

  const sendWeeklyByEmail = () => {
    const todayStr = new Date().toLocaleDateString('fr-FR');
    const subject = encodeURIComponent(`Bilan Hebdo Leadership - ${userName}`);
    const body = encodeURIComponent(`Bilan au ${todayStr} :\n🎯 Score : ${dashboardStats[1].val} pts / 105\n💶 CA : ${dashboardStats[1].ca.toFixed(2)} €\n🔥 Streak : ${streak} jours`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWeeklyReset = () => {
    if(window.confirm("🚨 ACTION STRATÉGIQUE : Souhaitez-vous réinitialiser uniquement les données de la SEMAINE (7 jours) ?")) {
        const now = Date.now();
        const limit = 7 * 24 * 60 * 60 * 1000;
        setHistory(history.filter(h => (now - h.id) > limit));
        setCounts({}); setCaData({});
        alert("Semaine remise à zéro.");
    }
  };

  const exportCRM = () => {
    if (contacts.length === 0) { alert("Base CRM vide."); return; }
    const headers = "Prenom,Nom,WhatsApp,Type,Note\n";
    const rows = contacts.map(c => `${c.f},${c.l},${c.p},${c.type},"${c.note}"`).join('\n');
    const blob = new Blob(["\ufeff" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `CRM_BusinessNSK.csv`; a.click();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 italic font-sans flex flex-col antialiased font-black uppercase">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen relative shadow-2xl flex flex-col border-x border-slate-100 italic font-black uppercase">
        
        {/* HEADER */}
        <header className="px-6 py-8 flex justify-between items-center bg-white sticky top-0 z-[100] border-b border-slate-50 italic font-black uppercase leading-none">
            <div className="text-left font-black leading-none italic">
                <h1 className="text-2xl tracking-tighter text-slate-900 uppercase mb-1 leading-none font-black">TRACKER <span className="text-blue-600 font-black">PRO</span></h1>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black leading-none italic">{userName}</p>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 shadow-sm italic font-black leading-none">
                <Flame size={20} className="text-orange-500 fill-orange-500" />
                <span className="font-black text-lg leading-none">{streak}</span>
            </div>
        </header>

        <div className="px-6 flex-1 pb-32 overflow-y-auto italic font-black uppercase">
            
            {/* 1. PERFORMANCE */}
            {activeTab === 'performance' && (
                <div className="space-y-6 pt-6 animate-in slide-in-from-bottom-4 duration-500 italic font-black uppercase">
                    <h2 className="text-xl font-black uppercase tracking-tighter text-left italic">Performance</h2>
                    <div className="space-y-4 font-black uppercase">
                        {dashboardStats.map((stat, i) => (
                            <div key={i} className={`${stat.bg} p-8 rounded-[3.5rem] border-2 ${stat.border} shadow-sm transition-all hover:shadow-xl italic font-black uppercase`}>
                                <div className="flex justify-between items-start mb-6 text-left font-black uppercase leading-none">
                                    <div className="italic font-black uppercase leading-tight text-left">
                                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">{stat.label}</p>
                                        <p className="text-[9px] font-bold uppercase text-slate-400 mt-1 leading-none italic font-black uppercase">Objectif : {stat.target} pts</p>
                                    </div>
                                    <div className="text-right italic font-black leading-none">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 italic font-black uppercase">CA</p>
                                        <p className={`text-xl font-black ${stat.color}`}>{stat.ca.toFixed(0)} €</p>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between italic font-black uppercase">
                                    <div className="flex items-baseline gap-1 italic leading-none font-black uppercase">
                                        <span className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.val}</span>
                                        <span className="text-lg text-slate-200 font-bold opacity-50 italic">/{stat.target}</span>
                                    </div>
                                    <div className="w-full max-w-[140px] h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                        <div className={`h-full ${stat.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${Math.min(100, (stat.val/stat.target)*100)}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* BOUTON SAISIE EN BLEU */}
                    <button onClick={() => setActiveTab('tracker')} className="w-full py-6 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 mt-6 italic active:scale-95 transition-all shadow-blue-200 uppercase leading-none font-black">
                        <Plus size={20}/> Saisir mes actions
                    </button>
                </div>
            )}

            {/* 2. TRACKER */}
            {activeTab === 'tracker' && (
                <div className="space-y-6 pt-6 animate-in slide-in-from-bottom-4 duration-500 italic font-black uppercase">
                    <button onClick={() => setActiveTab('performance')} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 mb-2 transition-all italic uppercase leading-none font-black">
                        <ArrowLeft size={12} /> Retour Performance
                    </button>
                    <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white text-center shadow-2xl relative overflow-hidden italic font-black uppercase leading-none">
                        <p className="text-[10px] font-black uppercase opacity-40 mb-3 tracking-widest italic font-black">Points du jour</p>
                        <p className="text-7xl font-black tracking-tighter italic tabular-nums leading-none">{dailyScore}</p>
                        <p className="text-sm font-bold text-blue-400 mt-4 italic tracking-tighter uppercase leading-none">{dailyTotalCA.toFixed(2)} € cumulés</p>
                    </div>

                    <div className="space-y-4 pt-4 italic font-black uppercase leading-none">
                        {ACTIVITIES.map(act => (
                            <div key={act.id} className={`bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col transition-all ${counts[act.id] > 0 ? 'ring-2 ring-blue-600 scale-[1.02]' : ''} italic font-black uppercase leading-none`}>
                                <div className="flex items-center justify-between text-left italic font-black uppercase leading-none">
                                    <div className="flex items-center gap-4 italic text-left leading-none font-black uppercase leading-none">
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-2xl shadow-inner italic leading-none font-black uppercase leading-none">{act.icon}</div>
                                        <div className="text-left leading-none italic font-black uppercase leading-none">
                                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1.5 leading-none font-black">{act.label}</h4>
                                          <span className="text-[10px] font-bold text-blue-500 uppercase italic font-black uppercase leading-none">+{act.pts} pts</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl italic font-black uppercase leading-none">
                                        <button onClick={() => handleUpdate(act.id, -1)} className="p-2.5 bg-white rounded-xl shadow-sm text-slate-300 italic active:scale-90 font-black uppercase leading-none"><Minus size={16}/></button>
                                        <span className="w-6 text-center font-black text-lg italic tabular-nums leading-none font-black uppercase leading-none">{counts[act.id] || 0}</span>
                                        <button onClick={() => handleUpdate(act.id, 1)} className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg active:scale-90 font-black uppercase leading-none"><Plus size={16}/></button>
                                    </div>
                                </div>
                                {act.hasCA && (counts[act.id] || 0) > 0 && (
                                    <div className="mt-5 pt-5 border-t border-slate-50 flex items-center justify-between bg-blue-50/50 p-4 rounded-3xl border border-blue-100 animate-in slide-in-from-top-2 italic font-black uppercase leading-none font-black uppercase">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic font-black leading-none uppercase">Saisie CA HT (€)</span>
                                        <input type="number" value={caData[act.id] || ''} onChange={(e) => setCaData({...caData, [act.id]: e.target.value})} className="w-24 bg-white border-2 border-blue-100 rounded-xl px-3 py-2 text-right font-black text-blue-700 outline-none italic font-black uppercase leading-none font-black uppercase" placeholder="0.00" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* BOUTON VALIDER BLEU NSK */}
                    <button onClick={saveDay} className="w-full py-8 bg-blue-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 sticky bottom-4 z-50 italic font-black shadow-blue-300 transition-transform active:scale-95 leading-none uppercase font-black">
                        <Check size={24} strokeWidth={4} /> Valider la Journée
                    </button>
                </div>
            )}

            {/* 3. CONTACTS */}
            {activeTab === 'contacts' && (
                <div className="space-y-6 pt-6 text-left italic font-black uppercase leading-none font-black uppercase">
                    <div className="flex justify-between items-center mb-6 italic font-black uppercase font-black">
                        <h2 className="text-xl tracking-tighter italic font-black uppercase leading-none font-black">Réseau Contacts</h2>
                        <button onClick={() => setIsAddingContact(!isAddingContact)} className="p-3 bg-slate-100 text-slate-900 rounded-full italic hover:bg-blue-50 transition-all leading-none font-black">
                            {isAddingContact ? <X size={24}/> : <UserPlus size={24}/>}
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 flex justify-between items-center mb-6 shadow-sm italic leading-none uppercase font-black">
                        <div className="flex items-center gap-2 italic font-black uppercase leading-none font-black"><div className="w-3 h-3 rounded bg-blue-600 font-black" /><span className="text-[9px] tracking-widest text-slate-500 italic font-black uppercase leading-none font-black">Prospect</span></div>
                        <div className="flex items-center gap-2 italic font-black uppercase leading-none font-black"><div className="w-3 h-3 rounded bg-red-600 font-black" /><span className="text-[9px] tracking-widest text-slate-500 italic font-black uppercase leading-none font-black">Client</span></div>
                        <div className="flex items-center gap-2 italic font-black uppercase leading-none font-black"><div className="w-3 h-3 rounded bg-emerald-600 font-black" /><span className="text-[9px] tracking-widest text-slate-500 italic font-black uppercase leading-none font-black">BA</span></div>
                    </div>
                    {isAddingContact && (
                        <div className="bg-white p-8 rounded-[4rem] border border-slate-100 shadow-2xl space-y-6 animate-in zoom-in mb-8 italic font-black uppercase">
                            <div className="grid grid-cols-2 gap-4 italic font-black leading-none uppercase font-black">
                                <input placeholder="Prénom" className="p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm italic border border-slate-100 uppercase font-black" value={contactForm.f} onChange={e => setContactForm({...contactForm, f: e.target.value})} />
                                <input placeholder="Nom" className="p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm italic border border-slate-100 uppercase font-black" value={contactForm.l} onChange={e => setContactForm({...contactForm, l: e.target.value})} />
                            </div>
                            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 italic font-black uppercase">
                                {[
                                    { id: 'prospect', label: 'PROSPECT', color: 'bg-blue-600' },
                                    { id: 'client', label: 'CLIENT', color: 'bg-red-600' },
                                    { id: 'membre', label: 'BA', color: 'bg-emerald-600' }
                                ].map(type => (
                                    <button key={type.id} onClick={() => setContactForm({...contactForm, type: type.id})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${contactForm.type === type.id ? `${type.color} text-white shadow-xl scale-[1.03]` : 'text-slate-400 hover:bg-white font-black'}`}>
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                            <input placeholder="WhatsApp" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm italic border border-slate-100 font-black uppercase font-black" value={contactForm.p} onChange={e => setContactForm({...contactForm, p: e.target.value})} />
                            <textarea placeholder="Notes stratégiques (F.O.R.M...)" className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm h-32 border border-slate-100 font-black uppercase font-black" value={contactForm.note} onChange={e => setContactForm({...contactForm, note: e.target.value})} />
                            <button onClick={() => {
                                setContacts([{...contactForm, id: Date.now(), date: new Date().toLocaleDateString()}, ...contacts]);
                                setContactForm({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });
                                setIsAddingContact(false);
                            }} className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all italic font-black leading-none font-black uppercase">Ajouter Contact</button>
                        </div>
                    )}
                    <div className="space-y-4 italic font-black uppercase leading-none font-black">
                        {contacts.map(c => (
                            <div key={c.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between text-left italic font-black uppercase leading-none font-black">
                                <div className="flex items-center gap-4 italic text-left leading-none font-black uppercase">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-lg text-xl italic ${c.type === 'membre' ? 'bg-emerald-600 font-black uppercase leading-none' : c.type === 'client' ? 'bg-red-600 font-black uppercase leading-none' : 'bg-blue-600 font-black uppercase leading-none'}`}>
                                        {c.f[0] || '?'}{c.l[0] || ''}
                                    </div>
                                    <div className="italic leading-tight text-left font-black uppercase">
                                        <h4 className="font-black text-slate-900 uppercase tracking-tight italic font-black uppercase">{c.f} {c.l}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic font-black uppercase">{c.type === 'membre' ? 'BA' : c.type} • {c.date}</p>
                                    </div>
                                </div>
                                <button onClick={() => setContacts(contacts.filter(x => x.id !== c.id))} className="p-3.5 bg-red-50 text-red-500 rounded-xl transition-all italic active:scale-90 leading-none uppercase font-black"><Trash2 size={18}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 4. ACADÉMIE MLM ÉLITE */}
            {activeTab === 'method' && (
                <div className="space-y-6 pt-6 text-left italic font-black uppercase leading-none font-black">
                    <div className="bg-blue-600 rounded-[3.5rem] p-12 text-white shadow-xl text-center relative overflow-hidden border border-white/10 italic leading-none font-black">
                        <Award size={64} className="mx-auto mb-6 opacity-30 italic leading-none font-black" />
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic font-black">Académie Élite</h2>
                        <p className="text-blue-100 text-[10px] font-black uppercase mt-3 opacity-80 tracking-[0.3em] italic uppercase font-black font-black">Duplication MLM Pro</p>
                    </div>
                    {ACADEMY_CONTENT.map(step => (
                        <div key={step.id} className="bg-white rounded-[3.5rem] border border-slate-100 overflow-hidden shadow-sm italic font-black uppercase font-black">
                            <button onClick={() => setOpenStep(openStep === step.id ? null : step.id)} className="w-full p-8 flex items-center justify-between text-left italic font-black uppercase leading-none font-black">
                                <div className="flex items-center gap-5 italic font-black uppercase leading-none font-black">
                                    <div className="p-4 bg-slate-50 rounded-2xl text-blue-600 shadow-inner italic leading-none font-black">{step.icon}</div>
                                    <span className="font-black text-slate-900 uppercase block text-lg tracking-tight italic leading-none font-black">{step.title}</span>
                                </div>
                                <ChevronRight size={24} className={`text-slate-300 transition-transform duration-500 ${openStep === step.id ? 'rotate-90 text-blue-600 font-black uppercase' : ''} italic font-black uppercase leading-none font-black`} />
                            </button>
                            {openStep === step.id && (
                                <div className="px-10 pb-12 space-y-8 animate-in slide-in-from-top-4 italic font-black uppercase leading-tight font-black">
                                    {step.sections.map((sec, idx) => (
                                        <div key={idx} className="space-y-3 italic font-black uppercase leading-tight font-black">
                                            <h5 className="text-[11px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-3 italic font-black font-black leading-none font-black">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 italic font-black" /> {sec.subtitle}
                                            </h5>
                                            <p className="text-[15px] text-slate-600 leading-relaxed font-bold italic opacity-80 pl-4 whitespace-pre-line italic font-medium lowercase first-letter:uppercase font-black uppercase">{sec.text}</p>
                                        </div>
                                    ))}
                                    <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white border border-white/5 shadow-2xl relative overflow-hidden italic font-black uppercase leading-none mt-4 font-black">
                                        <Star size={60} className="absolute -right-4 -bottom-4 opacity-10 rotate-12 italic font-black uppercase font-black" fill="white"/>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic font-black uppercase leading-none font-black">Le Conseil Leader</p>
                                        <p className="text-[14px] font-black opacity-95 leading-relaxed relative z-10 italic font-black uppercase leading-tight font-black font-black">"{step.proTip}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* 5. RÉGLAGES & PILOTAGE */}
            {activeTab === 'settings' && (
                <div className="space-y-6 pt-6 text-left italic font-black uppercase italic font-black uppercase leading-none font-black">
                    <h2 className="text-xl tracking-tighter italic uppercase font-black font-black uppercase leading-none mb-4 font-black">Pilotage & Reporting</h2>
                    
                    <div className="bg-slate-900 rounded-[4rem] p-10 text-white shadow-2xl relative overflow-hidden italic border-b-8 border-blue-600 italic font-black uppercase leading-none font-black">
                        <div className="flex justify-between items-start mb-8 italic font-black uppercase leading-none font-black text-left">
                            <div className="italic font-black uppercase leading-none">
                                <p className="text-[10px] text-blue-400 tracking-[0.3em] mb-2 font-black uppercase italic leading-none font-black text-left font-black">Reporting Sponsor</p>
                                <h3 className="text-3xl tracking-tighter italic uppercase font-black leading-none uppercase font-black text-left font-black">Bilan de la Semaine</h3>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl italic shadow-inner leading-none font-black uppercase font-black"><Mail size={24} className="text-blue-400 italic font-black uppercase"/></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 mb-10 italic font-black uppercase leading-none font-black text-left">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 italic font-black uppercase leading-none font-black text-left font-black">
                                <p className="text-[8px] text-slate-500 tracking-widest mb-1 italic font-black uppercase leading-none font-black text-left font-black">Points Hebdo</p>
                                <p className="text-2xl text-white italic font-black uppercase leading-none font-black text-left font-black">{dashboardStats[1].val} pts</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 italic font-black uppercase leading-none font-black text-left font-black">
                                <p className="text-[8px] text-slate-500 tracking-widest mb-1 italic font-black uppercase leading-none font-black text-left font-black">CA Hebdo HT</p>
                                <p className="text-2xl text-emerald-400 italic font-black uppercase leading-none font-black text-left font-black">{dashboardStats[1].ca.toFixed(0)} €</p>
                            </div>
                        </div>
                        <button onClick={sendWeeklyByEmail} className="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-[11px] tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all italic font-black uppercase hover:bg-blue-500 font-black uppercase shadow-blue-300 leading-none font-black">
                            <Send size={16} className="italic font-black uppercase"/> Transférer par Email
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8 italic font-black uppercase leading-none font-black">
                        <div className="space-y-4 italic text-left font-black uppercase leading-none font-black">
                            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1 italic font-black leading-none uppercase font-black">Entretien ma Performance</h3>
                            <button onClick={handleWeeklyReset} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-orange-500 transition-all italic shadow-md font-black uppercase italic leading-none uppercase font-black">
                                <RefreshCw size={16} className="italic font-black uppercase font-black"/> Reset Hebdo (7 Jours)
                            </button>
                        </div>
                        {/* IDENTITÉ LEADER (NOM) */}
                        <div className="space-y-2 italic text-left font-black uppercase leading-none font-black">
                            <label className="text-[10px] text-slate-400 tracking-widest ml-1 italic font-black uppercase font-black leading-none font-black">NOM</label>
                            <input value={userName} onChange={(e) => setUserName(e.target.value.toUpperCase())} className="w-full p-5 bg-slate-50 rounded-2xl outline-none text-lg border border-slate-100 italic font-black font-black uppercase leading-none font-black" placeholder="VOTRE NOM" />
                        </div>
                        <div className="space-y-4 pt-4 border-t border-slate-50 italic font-black uppercase leading-none font-black">
                            <button onClick={exportCRM} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] tracking-widest flex items-center justify-center gap-3 italic font-black uppercase transition-all active:scale-95 italic leading-none uppercase font-black">
                                <Download size={14} className="italic font-black uppercase"/> Exporter CRM (CSV)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* NAVIGATION BASSE */}
        <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-3xl border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-[3.5rem] flex items-center justify-around p-2.5 z-[1000] ring-1 ring-black/5 italic font-black uppercase font-black">
            <button onClick={() => setActiveTab('performance')} className={`p-4 rounded-full transition-all duration-500 italic font-black uppercase font-black ${activeTab === 'performance' ? 'bg-slate-900 text-white shadow-2xl scale-110 font-black' : 'text-slate-300 hover:text-slate-500 font-black'}`}><History size={26}/></button>
            <button onClick={() => setActiveTab('tracker')} className={`p-4 rounded-full transition-all duration-500 italic font-black uppercase font-black ${activeTab === 'tracker' ? 'bg-slate-900 text-white shadow-2xl scale-110 font-black' : 'text-slate-300 hover:text-slate-500 font-black'}`}><Layout size={26}/></button>
            <button onClick={() => setActiveTab('contacts')} className={`p-4 rounded-full transition-all duration-500 italic font-black uppercase font-black ${activeTab === 'contacts' ? 'bg-slate-900 text-white shadow-2xl scale-110 font-black' : 'text-slate-300 hover:text-slate-500 font-black'}`}><Users size={26}/></button>
            <button onClick={() => setActiveTab('method')} className={`p-4 rounded-full transition-all duration-500 italic font-black uppercase font-black ${activeTab === 'method' ? 'bg-slate-900 text-white shadow-2xl scale-110 font-black' : 'text-slate-300 hover:text-slate-500 font-black'}`}><Book size={26}/></button>
            <button onClick={() => setActiveTab('settings')} className={`p-4 rounded-full transition-all duration-500 italic font-black uppercase font-black ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-2xl scale-110 font-black' : 'text-slate-300 hover:text-slate-500 font-black'}`}><Settings size={26}/></button>
        </nav>
      </div>
    </div>
  );
}