<!DOCTYPE html>
<html lang="fr">
<head>
<!-- DEBUT DU BLOC DE SÉCURITÉ -->
<script src="[https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2](https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2)"></script>
<script>
  (function() {
    // 🛡️ Fonction de nettoyage (Empêche l'erreur "Invalid URL" sur Mac)
    function clean(s) { 
        if (!s) return "";
        return s.toString()
            .replace(/[\u201C\u201D\u2018\u2019\u0022\u0027]/g, '') // Supprime les guillemets Mac
            .replace(/[\u200B-\u200D\uFEFF]/g, '')                // Supprime les caractères invisibles
            .replace(/\s+/g, '')                                  // Supprime les espaces
            .trim(); 
    }

    const S_URL = clean("[https://rbmzmduojlxdzfgmolly.supabase.co](https://rbmzmduojlxdzfgmolly.supabase.co)");
    const S_KEY = clean("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E");
    
    // Initialisation sécurisée
    const sc = supabase.createClient(S_URL, S_KEY);

    async function check() {
      try {
        const { data } = await sc.auth.getSession();
        
        // Autorise l'affichage local (Mac) et l'aperçu Gemini
        const isSafeEnv = window.location.hostname.includes('goog') || 
                          window.location.protocol === 'file:' || 
                          window.location.protocol === 'blob:';

        // Sur le site Netlify réel : si aucune session n'est trouvée -> Redirection
        if ((!data || !data.session) && !isSafeEnv) {
          document.documentElement.innerHTML = ""; // Vide l'écran
          window.location.href = "index.html";     // Renvoie au portail
        }
      } catch (e) { 
        console.warn("Sécurité active."); 
      }
    }
    check();
  })();
</script>
<!-- FIN DU BLOC DE SÉCURITÉ -->


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>TRACKER PRO - Licence Officielle</title>
    
    <!-- Bibliothèques distantes -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        
        :root {
            --primary: #0089D0;
            --primary-dark: #005691;
            --success: #10B981;
            --danger: #EF4444;
        }

        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background-color: #F8FAFC;
            color: #1E293B;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
            display: flex;
            justify-content: center;
            min-height: 100vh;
        }

        #root {
            width: 100%;
            max-width: 500px; 
            min-height: 100vh;
            background: #F8FAFC;
            position: relative;
            box-shadow: 0 0 50px rgba(0,0,0,0.05);
        }

        .premium-gradient {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        }

        .animate-up {
            animation: slideUp 0.4s ease-out forwards;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        input::-webkit-outer-spin-button, 
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        .circle-progress {
            transition: stroke-dashoffset 0.8s ease-in-out;
        }

        nav {
            max-width: 480px;
            left: 50% !important;
            transform: translateX(-50%) !important;
        }

        .card-shadow {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
        }
        
        textarea { resize: none; }
        
        /* Personnalisation des boutons de type de contact */
        .btn-type-prospect { background-color: #EF4444; color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
        .btn-type-client { background-color: #0089D0; color: white; box-shadow: 0 4px 12px rgba(0, 137, 208, 0.2); }
        .btn-type-ba { background-color: #10B981; color: white; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useMemo, Fragment, useRef } = React;

        // --- COMPOSANT ICONES SVG ---
        const Icon = ({ name, size = 24, className = "" }) => {
            const icons = {
                plus: <path d="M12 5v14M5 12h14" />,
                minus: <path d="M5 12h14" />,
                flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
                award: <Fragment><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></Fragment>,
                history: <Fragment><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></Fragment>,
                settings: <Fragment><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></Fragment>,
                check: <polyline points="20 6 9 17 4 12" />,
                layout: <Fragment><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></Fragment>,
                users: <Fragment><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Fragment>,
                book: <Fragment><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Fragment>,
                trash: <Fragment><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Fragment>,
                mail: <Fragment><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Fragment>,
                messageSquare: <Fragment><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></Fragment>,
                trending: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
                search: <Fragment><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Fragment>,
                star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            };
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    {icons[name] || <circle cx="12" cy="12" r="10" />}
                </svg>
            );
        };

        // --- BARÈME ACTIONS (19 POINTS CLÉS) ---
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

        // --- ACADÉMIE ÉLITE ---
        const ACADEMY_CONTENT = [
            { 
                id: 'contact', title: '1. Contacter (Le Lien)', icon: 'users', summary: "L'art de recréer du lien authentique.", 
                sections: [
                    { subtitle: "Posture Leader", text: "Le but n'est pas de vendre Nu Skin immédiatement, mais de récolter des informations. Devenez un détective de besoins. Plus vous savez sur le prospect, plus votre solution sera pertinente." },
                    { subtitle: "Méthode F.O.R.M", text: "Structurez vos questions pour identifier un manque (temps, argent, fatigue, peau) :", 
                      list: ["Famille : 'Comment vont les enfants/les parents ?'", "Occupation : 'Le boulot se passe comment en ce moment ?'", "Récréation : 'Tu as pu partir en vacances récemment ?'", "Motivation : 'C'est quoi ton gros projet de l'année ?'"] 
                    },
                    { subtitle: "Script Social", text: "Commentez sincèrement une story : « Salut [Prénom], j'adore ton énergie ! Dis-moi, tu utilises quoi pour ton teint en ce moment ? Il est super éclatant ! »" }
                ],
                proTip: "Écoutez 80% du temps. Celui qui pose les questions contrôle l'échange."
            },
            { 
                id: 'invite', title: '2. Inviter (La Curiosité)', icon: 'layout', summary: "Le pont vers la proposition.", 
                sections: [
                    { subtitle: "La Formule Magique", text: "Structurez toujours votre proposition ainsi : « Si je... est-ce que tu... ? ». C'est psychologiquement irrésistible car cela laisse le prospect libre de dire non." },
                    { subtitle: "Invitation VERA", text: "« Tu m'as dit que tu avais la peau fatiguée. Si je t'envoie mon lien VERA pour un diagnostic gratuit, est-ce que tu prendrais 2 minutes pour le faire ? »" },
                    { subtitle: "Invitation Business", text: "« J'ai remarqué que tu cherchais un complément de revenus. Si je t'invite à un Zoom de 15 min demain pour t'expliquer mon projet, serais-tu prête à écouter ? »" }
                ],
                proTip: "Soyez toujours un peu pressé. L'urgence crée l'attraction."
            },
            { 
                id: 'present', title: '3. Présenter (Le Levier)', icon: 'book', summary: "L'outil est la star.", 
                sections: [
                    { subtitle: "Secret de Duplication", text: "Si vous expliquez tout vous-même, le prospect se dira : 'Je ne pourrai jamais faire comme elle'. Utilisez les outils (VERA, vidéos, Sponsor)." },
                    { subtitle: "Storytelling (Le 'Why')", text: "Raconte ton parcours en 4 points : 1. Ton passé, 2. Ce qui ne t'allait plus, 3. La solution (Nu Skin), 4. Ta vision du futur." }
                ],
                proTip: "Le but est de TRIER les gens, pas de convaincre."
            },
            { 
                id: 'follow', title: '4. Suivre (La Fortune)', icon: 'award', summary: "Transformer l'intérêt en action.", 
                sections: [
                    { subtitle: "La Question d'Or", text: "Demandez : « Qu'est-ce que tu as le plus aimé dans ce que tu viens de voir ? » (Cela oriente vers le positif)." },
                    { subtitle: "Gérer l'objection (Feel/Felt/Found)", text: "« Je comprends ce que tu RESSENS. J'ai RESSENTI la même chose au début. Mais j'ai DÉCOUVERT que... »" }
                ],
                proTip: "80% des inscriptions se font après le 5ème contact. La fortune est réellement dans le suivi constant."
            }
        ];

        function App() {
            const [activeTab, setActiveTab] = useState('tracker');
            const [counts, setCounts] = useState({});
            const [caData, setCaData] = useState({});
            const [history, setHistory] = useState([]);
            const [contacts, setContacts] = useState([]);
            const [goal, setGoal] = useState(15); 
            const [userName, setUserName] = useState("Distributeur");
            const [streak, setStreak] = useState(0);
            const [openStep, setOpenStep] = useState(null);
            const [showConfetti, setShowConfetti] = useState(false);
            const [isAddingContact, setIsAddingContact] = useState(false);
            const [searchTerm, setSearchTerm] = useState("");
            
            // État pour le formulaire - PAR DÉFAUT : Prospect (Rouge)
            const [contactForm, setContactForm] = useState({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });
            const fileInputRef = useRef(null);

            useEffect(() => {
                const saved = localStorage.getItem('tracker_pro_v2026_final_ultimate_v7');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.history) setHistory(parsed.history);
                        if (parsed.contacts) setContacts(parsed.contacts);
                        if (parsed.goal) setGoal(parsed.goal);
                        if (parsed.userName) setUserName(parsed.userName);
                        if (parsed.streak) setStreak(parsed.streak);
                    } catch (e) { console.error("Restore failed"); }
                }
            }, []);

            useEffect(() => {
                localStorage.setItem('tracker_pro_v2026_final_ultimate_v7', JSON.stringify({ history, contacts, goal, userName, streak }));
            }, [history, contacts, goal, userName, streak]);

            // --- CALCULS STATS MULTI-PÉRIODES ---
            const detailedStats = useMemo(() => {
                const now = new Date();
                const todayStr = now.toLocaleDateString('fr-FR');
                const getMonday = (d) => {
                    const date = new Date(d);
                    const day = date.getDay() || 7;
                    date.setDate(date.getDate() - day + 1);
                    date.setHours(0,0,0,0);
                    return date;
                };

                const startOfWeek = getMonday(now);
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                const startOfSemester = new Date(now.getFullYear(), now.getMonth() < 6 ? 0 : 6, 1);
                const startOfYear = new Date(now.getFullYear(), 0, 1);

                const parseDateFr = (dStr) => {
                    if (!dStr) return new Date(0);
                    const p = dStr.split('/');
                    if (p.length < 3) return new Date(0);
                    return new Date(p[2], p[1] - 1, p[0]);
                };

                const compute = (filterFn, targetMultiplier) => {
                    const entries = (history || []).filter(filterFn);
                    return {
                        pts: entries.reduce((s, e) => s + (Number(e.score) || 0), 0),
                        ca: entries.reduce((s, e) => s + (Number(e.ca) || 0), 0),
                        target: targetMultiplier * 15,
                        actions: entries.reduce((acc, e) => {
                            if (e.details) {
                                Object.entries(e.details).forEach(([id, val]) => acc[id] = (acc[id] || 0) + val);
                            }
                            return acc;
                        }, {})
                    };
                };

                return {
                    today: compute(e => e.date === todayStr, 1),
                    week: compute(e => parseDateFr(e.date) >= startOfWeek, 7),
                    month: compute(e => parseDateFr(e.date) >= startOfMonth, 30),
                    quarter: compute(e => parseDateFr(e.date) >= startOfQuarter, 91),
                    semester: compute(e => parseDateFr(e.date) >= startOfSemester, 182),
                    year: compute(e => parseDateFr(e.date) >= startOfYear, 365)
                };
            }, [history]);

            const dailyScore = useMemo(() => 
                Object.entries(counts).reduce((acc, [id, count]) => {
                    const act = ACTIVITIES.find(a => a.id === id);
                    return acc + (act ? act.pts * count : 0);
                }, 0)
            , [counts]);

            const dailyTotalCA = useMemo(() => 
                Object.values(caData).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
            , [caData]);

            const handleUpdate = (id, delta) => setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));

            const saveDay = () => {
                const today = new Date().toLocaleDateString('fr-FR');
                const filtered = history.filter(h => h.date !== today);
                setHistory([{ id: Date.now(), date: today, score: dailyScore, ca: dailyTotalCA, details: {...counts} }, ...filtered]);
                if (dailyScore >= goal) {
                    setShowConfetti(true);
                    setStreak(s => s + 1);
                    setTimeout(() => setShowConfetti(false), 5000);
                }
                setCounts({}); setCaData({});
                setActiveTab('history');
            };

            const generateBilan = async (period = 'month') => {
                const data = period === 'month' ? detailedStats.month : detailedStats.week;
                const label = period === 'month' ? 'MENSUEL' : 'HEBDOMADAIRE';
                let list = "";
                Object.entries(data.actions).forEach(([id, count]) => {
                    if (count > 0) {
                        const act = ACTIVITIES.find(a => a.id === id);
                        list += `- ${act.icon} ${act.label} : ${count}\n`;
                    }
                });
                const text = `📊 TRACKER PRO - BILAN DÉTAILLÉ ${label}\n\n👤 Ambassadeur : ${userName}\n🏆 RÉSULTATS :\n- POINTS : ${data.pts} pts (Obj : ${data.target} pts)\n- CA TOTAL : ${data.ca.toFixed(2)} €\n\n⚡ ACTIONS :\n${list || "- Aucune action"}\n\n👥 Contacts suivis : ${contacts.length}`;
                if (navigator.share) { try { await navigator.share({ title: 'Bilan', text }); } catch(e) {} } 
                else { navigator.clipboard.writeText(text); alert("Bilan copié !"); }
            };

            const getContactColor = (type) => {
                if (type === 'ba') return 'bg-emerald-500';
                if (type === 'client') return 'bg-blue-500';
                return 'bg-rose-500'; // Prospect (Rouge)
            };

            const getContactBg = (type) => {
                if (type === 'ba') return 'border-emerald-100 bg-emerald-50/30';
                if (type === 'client') return 'border-blue-100 bg-blue-50/30';
                return 'border-rose-100 bg-rose-50/30';
            };

            const handleAddContact = (e) => {
                e.preventDefault();
                if (!contactForm.f) return;
                setContacts([{ ...contactForm, id: Date.now(), d: new Date().toLocaleDateString('fr-FR') }, ...contacts]);
                setContactForm({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });
                setIsAddingContact(false);
                handleUpdate('contact', 1);
            };

            // FILTRAGE DES CONTACTS
            const filteredContacts = useMemo(() => {
                if (!searchTerm) return contacts;
                const lower = searchTerm.toLowerCase();
                return contacts.filter(c => 
                    (c.f + " " + (c.l || "")).toLowerCase().includes(lower) || 
                    (c.e || "").toLowerCase().includes(lower)
                );
            }, [contacts, searchTerm]);

            return (
                <div className="min-h-screen pb-40 w-full">
                    <div className="h-2 premium-gradient w-full sticky top-0 z-[60]" />
                    <div className="px-5">
                        
                        <header className="py-8 flex justify-between items-center animate-up">
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none uppercase italic">TRACKER <span className="text-[#0089D0]">PRO</span></h1>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-none italic">{userName}</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 ring-4 ring-orange-50 active:scale-95 transition-transform">
                                <Icon name="flame" size={20} className="text-orange-500 fill-orange-500" />
                                <span className="font-black text-lg">{streak}</span>
                            </div>
                        </header>

                        {/* --- TAB: TRACKER --- */}
                        {activeTab === 'tracker' && (
                            <div className="space-y-6 animate-up">
                                <div className="premium-gradient rounded-[2.8rem] p-8 shadow-2xl relative overflow-hidden text-white text-center border border-white/10">
                                    <div className="relative z-10 flex flex-col items-center">
                                        <div className="relative flex items-center justify-center">
                                            <svg className="w-48 h-48 transform -rotate-90 relative">
                                                <circle cx="96" cy="96" r="82" fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
                                                <circle cx="96" cy="96" r={82} fill="transparent" stroke="white" strokeWidth="14" strokeDasharray={515} strokeDashoffset={515 - (Math.min(1, dailyScore/(goal || 1))*515)} strokeLinecap="round" className="circle-progress" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-6xl font-black tracking-tighter tabular-nums">{dailyScore}</span>
                                                <span className="text-[10px] font-black uppercase opacity-60">Score / {goal} pts</span>
                                            </div>
                                        </div>
                                        <div className="w-full mt-6 bg-white/10 p-4 rounded-2xl flex justify-between items-center italic">
                                            <span className="text-[10px] font-black uppercase opacity-60 tracking-tighter italic">CA du Jour</span>
                                            <span className="text-xl font-black tabular-nums">{dailyTotalCA.toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>

                                {['1 POINT', '2 POINTS', '3 POINTS'].map(cat => (
                                    <div key={cat} className="space-y-4 pt-2">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] pl-4 italic">{cat}</h3>
                                        {ACTIVITIES.filter(a => a.category === cat).map(act => (
                                            <div key={act.id} className={`bg-white rounded-[2.2rem] p-5 border border-slate-100 shadow-sm flex flex-col transition-all ${counts[act.id] > 0 ? 'ring-2 ring-[#0089D0]' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-2xl shadow-inner italic">{act.icon}</div>
                                                        <div><h4 className="text-sm font-black text-slate-800 leading-none italic">{act.label}</h4><span className="text-[10px] font-bold text-blue-500 uppercase mt-1 block">+{act.pts} pts</span></div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                                                        <button onClick={() => handleUpdate(act.id, -1)} className="p-2 bg-white rounded-xl shadow-sm text-slate-300 active:scale-95"><Icon name="minus" size={16} /></button>
                                                        <span className="w-6 text-center font-black text-lg tabular-nums">{counts[act.id] || 0}</span>
                                                        <button onClick={() => handleUpdate(act.id, 1)} className="p-2 bg-[#0089D0] text-white rounded-xl shadow-lg active:scale-90"><Icon name="plus" size={16} /></button>
                                                    </div>
                                                </div>
                                                {act.hasCA && (counts[act.id] || 0) > 0 && (
                                                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 animate-up">
                                                        <span className="text-[11px] font-black text-emerald-600 uppercase italic">Saisie CA (€)</span>
                                                        <input type="number" placeholder="0.00" value={caData[act.id] || ''} onChange={(e) => setCaData({...caData, [act.id]: e.target.value})} className="w-24 bg-white border-2 border-emerald-100 rounded-xl px-3 py-2 text-right font-black text-emerald-700 outline-none focus:border-emerald-400 transition-all" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <button onClick={saveDay} disabled={dailyScore === 0} className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 transition-all ${dailyScore === 0 ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white active:scale-95'}`}><Icon name="check" size={24} className="text-emerald-400" /> Valider ma Journée</button>
                            </div>
                        )}

                        {/* --- TAB: PERFORMANCE --- */}
                        {activeTab === 'history' && (
                            <div className="space-y-6 animate-up pt-2 text-slate-800 pb-20 px-2">
                                <h2 className="text-xl font-black uppercase italic leading-none">Dashboard Performance</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { label: "Aujourd'hui", data: detailedStats.today, color: "text-[#0089D0]", bg: "bg-blue-50" },
                                        { label: "Cette Semaine", data: detailedStats.week, color: "text-indigo-600", bg: "bg-indigo-50" },
                                        { label: "Ce Mois", data: detailedStats.month, color: "text-emerald-600", bg: "bg-emerald-50" },
                                        { label: "Ce Trimestre (Q)", data: detailedStats.quarter, color: "text-amber-600", bg: "bg-amber-50" },
                                        { label: "Ce Semestre (S)", data: detailedStats.semester, color: "text-rose-600", bg: "bg-rose-50" },
                                        { label: "Cette Année", data: detailedStats.year, color: "text-slate-900", bg: "bg-slate-100" }
                                    ].map((block, idx) => (
                                        <div key={idx} className={`${block.bg} p-6 rounded-[2.5rem] border border-white card-shadow animate-up`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{block.label}</p>
                                                <span className="text-[10px] font-black text-slate-400 uppercase italic">Objectif : {block.data.target} pts</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 italic">Points</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <p className={`text-3xl font-black ${block.color} tabular-nums`}>{block.data.pts}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">/{block.data.target}</p>
                                                    </div>
                                                </div>
                                                <div className="border-l border-slate-200 pl-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1 italic">CA</p>
                                                    <p className={`text-2xl font-black ${block.color} tabular-nums italic`}>{block.data.ca.toFixed(0)} €</p>
                                                </div>
                                            </div>
                                            <div className="mt-4 h-2 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                                <div className={`h-full ${block.color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${Math.min(100, (block.data.pts / block.data.target) * 100)}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- TAB: CONTACTS --- */}
                        {activeTab === 'contacts' && (
                            <div className="space-y-6 animate-up pt-2 pb-20 px-2">
                                <div className="px-2">
                                    <div className="flex justify-between items-center mb-4 italic">
                                        <h2 className="text-2xl font-black text-slate-800 uppercase italic">Contacts</h2>
                                        <button onClick={() => setIsAddingContact(!isAddingContact)} className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${isAddingContact ? 'bg-slate-400 rotate-45' : 'bg-[#0089D0]'}`}><Icon name="plus" size={24} /></button>
                                    </div>
                                    
                                    {/* --- LÉGENDE AGRANDIE (ORDRE: PROSPECT, CLIENT, BA) --- */}
                                    <div className="flex gap-6 mb-6 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 italic"><div className="w-5 h-5 rounded-md bg-rose-500 shadow-sm" /><span className="text-[14px] font-black uppercase text-slate-700 tracking-tight">Prospect</span></div>
                                        <div className="flex items-center gap-3 italic"><div className="w-5 h-5 rounded-md bg-blue-500 shadow-sm" /><span className="text-[14px] font-black uppercase text-slate-700 tracking-tight">Client</span></div>
                                        <div className="flex items-center gap-3 italic"><div className="w-5 h-5 rounded-md bg-emerald-500 shadow-sm" /><span className="text-[14px] font-black uppercase text-slate-700 tracking-tight">BA</span></div>
                                    </div>
                                </div>

                                {isAddingContact && (
                                    <form onSubmit={handleAddContact} className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-xl space-y-4 animate-up">
                                        <div className="grid grid-cols-2 gap-3 italic">
                                            <input placeholder="Prénom" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold w-full outline-none italic" value={contactForm.f} onChange={e => setContactForm({...contactForm, f: e.target.value})} required />
                                            <input placeholder="Nom" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold w-full outline-none italic" value={contactForm.l} onChange={e => setContactForm({...contactForm, l: e.target.value})} />
                                        </div>
                                        
                                        {/* --- SÉLECTEUR AGRANDI (ORDRE: PROSPECT, CLIENT, BA) --- */}
                                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl italic">
                                            {['prospect', 'client', 'ba'].map(type => (
                                                <button 
                                                    key={type} type="button" 
                                                    onClick={() => setContactForm({...contactForm, type})} 
                                                    className={`flex-1 py-5 rounded-xl text-[14px] font-black uppercase transition-all italic ${contactForm.type === type ? (type==='ba'?'btn-type-ba':type==='client'?'btn-type-client':'btn-type-prospect') : 'text-slate-400 hover:text-slate-600'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <input placeholder="WhatsApp (ex: 33600...)" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold w-full outline-none italic" value={contactForm.p} onChange={e => setContactForm({...contactForm, p: e.target.value})} />
                                        <input placeholder="Email" type="email" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold w-full outline-none italic" value={contactForm.e} onChange={e => setContactForm({...contactForm, e: e.target.value})} />
                                        <textarea placeholder="Commentaires personnels..." className="p-4 bg-slate-50 rounded-2xl text-sm font-bold w-full outline-none focus:ring-2 focus:ring-[#0089D0] min-h-[100px]" value={contactForm.note} onChange={e => setContactForm({...contactForm, note: e.target.value})} />
                                        <button type="submit" className="w-full py-5 bg-[#0089D0] text-white rounded-2xl font-black uppercase tracking-widest shadow-lg">Ajouter Contact (+1 pt)</button>
                                    </form>
                                )}

                                <div className="relative italic"><Icon name="search" size={20} className="absolute left-4 top-4 text-slate-300" /><input placeholder="Rechercher (Nom, Email...)" className="w-full p-4 pl-12 bg-white rounded-2xl shadow-sm border border-slate-100 font-bold text-sm outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>

                                <div className="space-y-4 italic">
                                    {filteredContacts.map(c => (
                                        <div key={c.id} className={`p-6 rounded-[2.5rem] border animate-up flex flex-col card-shadow transition-colors ${c.type==='ba'?'border-emerald-100 bg-emerald-50/30':c.type==='client'?'border-blue-100 bg-blue-50/30':'border-rose-100 bg-rose-50/30'}`}>
                                            <div className="flex justify-between items-center w-full mb-3 italic">
                                                <div className="flex items-center gap-4 italic">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-inner uppercase italic ${c.type==='ba'?'bg-emerald-500':c.type==='client'?'bg-blue-500':'bg-rose-500'}`}>{(c.f?.[0] || '') + (c.l?.[0] || '')}</div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-lg leading-tight uppercase italic">{c.f} {c.l}</p>
                                                        <span className={`text-[11px] font-black uppercase px-4 py-1.5 rounded-full text-white mt-2 inline-block shadow-sm ${c.type==='ba'?'bg-emerald-500':c.type==='client'?'bg-blue-500':'bg-rose-500'}`}>{c.type}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {c.p && <a href={`https://wa.me/${c.p.replace(/\s+/g, '')}`} target="_blank" className="p-3 bg-white text-emerald-500 rounded-xl border border-slate-100 shadow-sm active:scale-90"><Icon name="messageSquare" size={20} /></a>}
                                                    {c.e && <a href={`mailto:${c.e}`} className="p-3 bg-white text-blue-500 rounded-xl border border-slate-100 shadow-sm active:scale-90"><Icon name="mail" size={20} /></a>}
                                                    <button onClick={() => {if(confirm("Supprimer ?")) setContacts(contacts.filter(con => con.id !== c.id))}} className="p-3 bg-white text-rose-200 hover:text-rose-500 rounded-xl border border-slate-100 shadow-sm transition-colors"><Icon name="trash" size={20} /></button>
                                                </div>
                                            </div>
                                            {c.note && <div className="bg-white/70 p-4 rounded-2xl border border-white mt-2 italic font-bold text-slate-600 text-[13px] leading-relaxed">"{c.note}"</div>}
                                            <p className="text-[10px] font-bold text-slate-400 mt-4 text-right">Ajouté le {c.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- TAB: ACADEMIE --- */}
                        {activeTab === 'method' && (
                            <div className="space-y-6 animate-up pb-32 pt-2 text-slate-800 px-2 italic">
                                <div className="bg-[#0089D0] rounded-[3.5rem] p-10 text-white shadow-xl relative overflow-hidden text-center border border-white/10">
                                    <h2 className="text-3xl font-black tracking-tight mb-2 italic uppercase">Académie Élite</h2>
                                    <p className="text-blue-50 text-[11px] font-black uppercase tracking-widest opacity-90 max-w-[85%] mx-auto leading-relaxed italic">La duplication est la clé de votre liberté financière.</p>
                                </div>
                                <div className="space-y-5 pb-20">
                                    {ACADEMY_CONTENT.map(step => (
                                        <div key={step.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                                            <button onClick={() => setOpenStep(openStep === step.id ? null : step.id)} className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors text-left outline-none italic">
                                                <div className="flex items-center gap-4 italic">
                                                    <div className="p-3 bg-slate-50 rounded-2xl shadow-inner italic"><Icon name={step.icon} size={24} className="text-[#0089D0]" /></div>
                                                    <div><span className="font-black text-slate-800 uppercase tracking-tight block leading-none italic">{step.title}</span><span className="text-[10px] text-slate-400 font-bold mt-1 inline-block uppercase tracking-tighter italic">{step.summary}</span></div>
                                                </div>
                                                <Icon name={openStep === step.id ? "minus" : "plus"} size={20} className="text-slate-300" />
                                            </button>
                                            {openStep === step.id && (
                                                <div className="px-8 pb-10 pt-2 animate-up italic">
                                                    <div className="space-y-6 italic">
                                                        {step.sections.map((sec, idx) => (
                                                            <div key={idx} className="space-y-3 italic">
                                                                <h5 className="text-[13px] font-black text-[#0089D0] uppercase tracking-widest flex items-center gap-2 italic"><div className="w-1.5 h-1.5 rounded-full bg-blue-600" /> {sec.subtitle}</h5>
                                                                <p className="text-[14px] text-slate-600 leading-relaxed font-medium pl-3 italic">{sec.text}</p>
                                                                {sec.list && <ul className="space-y-2 pl-6 mt-2 italic">{sec.list.map((item, i) => <li key={i} className="text-sm font-bold text-slate-700 flex gap-2 italic"><span className="text-blue-400">•</span> {item}</li>)}</ul>}
                                                            </div>
                                                        ))}
                                                        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl border border-white/5 relative overflow-hidden italic"><p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic">Conseil Leader</p><p className="text-[14px] font-bold italic opacity-95">"{step.proTip}"</p></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- TAB: SETTINGS --- */}
                        {activeTab === 'settings' && (
                            <div className="space-y-6 animate-up pb-20 pt-2 text-slate-800 px-2 italic">
                                <div className="bg-white p-12 rounded-[4.5rem] shadow-sm border border-slate-100 text-center relative overflow-hidden italic italic">
                                    <div className="w-32 h-32 premium-gradient rounded-[3rem] mx-auto flex items-center justify-center text-5xl mb-6 shadow-2xl text-white border-4 border-white rotate-6 duration-500 shadow-blue-200">👤</div>
                                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="text-3xl font-black text-center w-full focus:outline-none bg-transparent italic" />
                                    <p className="text-[11px] font-black text-[#0089D0] uppercase mt-3 tracking-[0.4em] italic text-center uppercase leading-none opacity-60 italic">Profil Leader Pro</p>
                                </div>

                                <div className="bg-white p-8 rounded-[3.5rem] border border-slate-100 space-y-4 shadow-sm italic">
                                    <h4 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-2 px-2 flex items-center gap-2 italic italic"><Icon name="trending" size={14} /> Coaching & Management</h4>
                                    <button onClick={() => generateBilan('month')} className="w-full py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-lg shadow-emerald-100 italic"><Icon name="star" size={20} /> Envoyer Bilan Détaillé au Sponsor</button>
                                    <div className="grid grid-cols-2 gap-3 italic">
                                        <button onClick={() => generateBilan('week')} className="py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-emerald-100 active:scale-95 shadow-sm italic font-bold">Extraction Hebdo</button>
                                        <button onClick={() => {
                                            const data = JSON.stringify({ history, contacts, goal, userName, streak });
                                            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
                                            a.download = `NuSkin_Pro_Save.json`; a.click();
                                        }} className="py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-200 active:scale-95 shadow-sm hover:bg-slate-100 italic font-bold">Save Data</button>
                                    </div>
                                </div>

                                <div className="bg-rose-50 p-8 rounded-[3.5rem] border border-rose-100 space-y-4 shadow-sm italic italic">
                                    <h4 className="font-black uppercase tracking-widest text-[9px] text-rose-400 mb-2 px-2 flex items-center gap-2 italic leading-none italic italic italic">
                                        <Icon name="refresh" size={14} /> Fin de Cycle
                                    </h4>
                                    <button onClick={() => { if(window.confirm("🚨 Clôturer la semaine ? Les scores seront vidés mais vos CONTACTS seront sauvegardés.")) { setHistory([]); setCounts({}); setCaData({}); setStreak(0); alert("C'est reparti !"); }}} className="w-full py-4 bg-white text-rose-500 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest border-2 border-rose-100 flex items-center justify-center gap-3 active:scale-95 shadow-sm shadow-rose-100 italic italic">
                                        <Icon name="refresh" size={16} /> Clôturer la semaine
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- NAVIGATION --- */}
                        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/95 backdrop-blur-3xl border border-white shadow-[0_45px_100px_-15px_rgba(0,0,0,0.35)] rounded-[4rem] flex items-center justify-around p-3 z-50 ring-1 ring-black/5 italic">
                            <button onClick={() => setActiveTab('history')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300 hover:text-slate-500'}`}><Icon name="history" size={24} /></button>
                            <button onClick={() => setActiveTab('tracker')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'tracker' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300 hover:text-slate-500'}`}><Icon name="layout" size={24} /></button>
                            <button onClick={() => setActiveTab('contacts')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'contacts' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300'}`}><Icon name="users" size={24} /></button>
                            <button onClick={() => setActiveTab('method')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'method' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300 hover:text-slate-500'}`}><Icon name="book" size={24} /></button>
                            <button onClick={() => setActiveTab('settings')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'settings' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300'}`}><Icon name="settings" size={24} /></button>
                        </nav>

                        {showConfetti && (
                            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-[100] animate-up italic italic">
                                <div className="bg-white/95 backdrop-blur-3xl p-16 rounded-[5.5rem] shadow-[0_80px_200px_-20px_rgba(0,0,0,0.4)] border border-blue-100 text-center scale-110 relative overflow-hidden italic italic">
                                    <Icon name="award" size={80} className="text-yellow-500 mx-auto animate-bounce italic italic" />
                                    <h2 className="text-5xl font-black text-slate-800 tracking-tighter uppercase leading-none mt-4 italic italic italic">ÉLITE !</h2>
                                    <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.45em] mt-6 italic italic italic italic">Objectif Atteint ! 🚀</p>
                                    <div className="absolute top-0 left-0 w-full h-3 bg-[#0089D0] italic italic" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>

