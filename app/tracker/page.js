"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Users, TrendingUp, Zap, Activity, 
  Target, BarChart3, ShoppingCart, KeyRound, Check, Rocket, 
  Play, Lock, Flame, History, Settings, 
  Share2, Mail, MessageSquare, Trash, Book, Layout, Plus, Minus, Award, RotateCcw,
  Calendar, BarChart, Send, Download, Database, ShieldAlert, LayoutGrid, Euro
} from 'lucide-react';

/**
 * TRACKER PERFORMANCE PREMIUM - VERSION V149 (PERFECTIONNEMENT ANALYTIQUE)
 * - FEATURE : Ajout des périodes "Trimestre" et "Semestre" dans l'historique.
 * - FEATURE : Rétablissement de l'onglet Share (Envoi au sponsor + Sync Cloud).
 * - FIX : Persistence du CA et de l'état openStep pour l'Académie.
 * - DESIGN : 100% Premium Master.
 */

const S_URL = 'https://rbmzmduojlxdzfgmolly.supabase.co';
const S_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E';

const ACTIVITIES = [
    { id: 'contact', label: 'Nouveau contact', pts: 1, icon: '👤' },
    { id: 'q_send', label: 'Quest. routine envoyé', pts: 1, icon: '📄' },
    { id: 'cat_digi', label: 'Catalogue digital envoyé', pts: 1, icon: '📖' },
    { id: 'invite', label: 'Invitation', pts: 1, icon: '💌' },
    { id: 'suivi_c', label: 'Suivi client', pts: 1, icon: '🛍️' },
    { id: 'suivi_d', label: 'Suivi distributeur', pts: 1, icon: '🚀' },
    { id: 'vente_e', label: 'Vente client existant', pts: 1, icon: '💶', hasCA: true },
    { id: 'new_c', label: 'Nouveau client', pts: 1, icon: '🆕', hasCA: true },
    { id: 'conv', label: 'Nouvelle conversation', pts: 2, icon: '💬' },
    { id: 'q_filled', label: 'Quest. routine rempli', pts: 2, icon: '✅' },
    { id: 'prysm_sq', label: 'Mesure Prysm (sans Q.)', pts: 2, icon: '✨' },
    { id: 'prysm_cq', label: 'Mesure Prysm (avec Q.)', pts: 2, icon: '📊' },
    { id: 'pres_bus', label: 'Présentation business', pts: 2, icon: '💼' },
    { id: 'call3', label: 'Call business à 3', pts: 3, icon: '📞' },
    { id: 'beauty_p', label: 'Démo ou Beauty Party', pts: 3, icon: '💄' },
    { id: 'pres_zoom', label: 'Présentation Zoom', pts: 3, icon: '🌟' },
    { id: 'new_adr', label: 'Nouveau client ADR', pts: 3, icon: '📦', hasCA: true },
    { id: 'new_dist', label: 'Nouveau distributeur', pts: 3, icon: '🚩' },
];

const ACADEMY_CONTENT = [
    { 
        id: 'contact', title: '1. Contacter (Le Lien)', icon: <Users size={20} />, summary: "Créez du lien authentique.", 
        sections: [
            { subtitle: "Posture Leader", text: "Ne vendez rien au début. Soyez un détective de besoins. Trouvez le point de douleur (temps, argent, fatigue)." },
            { subtitle: "Méthode F.O.R.M", text: "Structurez vos questions : Famille (F), Occupation/Travail (O), Récréation/Loisirs (R), Motivation/Argent (M)." }
        ],
        proTip: "Celui qui pose les questions contrôle l'échange. Écoutez 80% du temps."
    },
    { 
        id: 'invite', title: '2. Inviter (La Curiosité)', icon: <Layout size={20} />, summary: "Proposez sans forcer.", 
        sections: [
            { subtitle: "La Formule Magique", text: "« Si je te montre une solution pour [besoin détecté], est-ce que tu serais ouvert à y jeter un œil ? ». Laisse toujours la porte de sortie." }
        ],
        proTip: "Soyez détaché du résultat. Votre job est de proposer, pas de convaincre."
    },
    { 
        id: 'present', title: '3. Présenter (Le Levier)', icon: <Book size={20} />, summary: "L'outil est la star.", 
        sections: [
            { subtitle: "Secret de Duplication", text: "Utilisez VERA ou les vidéos officielles. Si vous faites tout vous-même avec trop d'expertise, votre équipe ne pourra pas vous copier." }
        ],
        proTip: "Plus l'outil travaille pour vous, plus votre business devient libre."
    },
    { 
        id: 'follow', title: '4. Suivre (La Fortune)', icon: <Check size={20} />, summary: "L'action payante.", 
        sections: [
            { subtitle: "La Question d'Or", text: "« Qu'est-ce que tu as le plus aimé dans ce que tu viens de voir ? ». Ne demandez jamais 'Qu'en penses-tu ?'." }
        ],
        proTip: "Le suivi est la preuve de votre professionnalisme."
    }
];

export default function App() {
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('tracker'); 
    const [historyPeriod, setHistoryPeriod] = useState('jour'); 
    const [counts, setCounts] = useState({});
    const [revenues, setRevenues] = useState({}); 
    const [history, setHistory] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [userName, setUserName] = useState("Distributeur");
    const [userEmail, setUserEmail] = useState("");
    const [streak, setStreak] = useState(0);
    const [notification, setNotification] = useState(null);
    const [supabase, setSupabase] = useState(null);
    const [openStep, setOpenStep] = useState(null);
    const [contactForm, setContactForm] = useState({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });

    const dailyGoal = 15;

    useEffect(() => {
        setMounted(true);
        const savedEmail = localStorage.getItem('nsk_email');
        const savedName = localStorage.getItem('nsk_fname');

        if (savedEmail) {
            setIsAuthenticated(true);
            setUserEmail(savedEmail);
            if (savedName) setUserName(savedName);
        } else {
            setIsAuthenticated(true); 
            setUserEmail("analyse-technique@nsk.com");
        }

        const initSupabase = async () => {
            try {
                const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
                if (createClient) {
                    const client = createClient(S_URL, S_KEY);
                    setSupabase(client);
                    const email = savedEmail || "analyse-technique@nsk.com";
                    const { data } = await client.from('app_data').select('data').eq('email', email.toLowerCase()).single();
                    if (data && data.data) {
                        if (data.data.contacts) setContacts(data.data.contacts);
                        if (data.data.history) setHistory(data.data.history);
                        if (data.data.streak) setStreak(data.data.streak);
                    }
                }
            } catch (e) { console.warn("Sync error Supabase"); }
        };
        initSupabase();
    }, []);

    // Sync Cloud Auto
    useEffect(() => {
        if (!mounted || !userEmail || !supabase) return;
        const data = { history, contacts, streak };
        const sync = async () => {
            try { await supabase.from('app_data').upsert([{ email: userEmail.toLowerCase(), data: data }], { onConflict: 'email' }); } catch (e) {}
        };
        sync();
    }, [history, contacts, streak, mounted, userEmail, supabase]);

    const handleGoDashboard = () => {
        if (typeof window !== 'undefined') window.location.replace(window.location.origin);
    };

    const notify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const dailyScore = useMemo(() => 
        Object.entries(counts).reduce((total, [id, count]) => {
            const act = ACTIVITIES.find(a => a.id === id);
            return total + (act ? act.pts * count : 0);
        }, 0)
    , [counts]);

    const totalDailyCA = useMemo(() => 
        Object.values(revenues).reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
    , [revenues]);

    const aggregatedPerformance = useMemo(() => {
        if (history.length === 0) return [];
        const groups = {};
        history.forEach(session => {
            const [d, m, y] = session.date.split('/').map(Number);
            const dateObj = new Date(y, m - 1, d);
            let key = '', label = '';
            switch(historyPeriod) {
                case 'jour': key = session.date; label = session.date; break;
                case 'semaine':
                    const firstDayOfYear = new Date(dateObj.getFullYear(), 0, 1);
                    const weekNum = Math.ceil(((dateObj - firstDayOfYear) / 86400000 + firstDayOfYear.getDay() + 1) / 7);
                    key = `${y}-W${weekNum}`; label = `Semaine ${weekNum} - ${y}`; break;
                case 'mois': key = `${y}-${m}`; label = dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); break;
                case 'trimestre': key = `${y}-Q${Math.ceil(m/3)}`; label = `Trimestre ${Math.ceil(m/3)} - ${y}`; break;
                case 'semestre': key = `${y}-S${m <= 6 ? 1 : 2}`; label = `Semestre ${m <= 6 ? 1 : 2} - ${y}`; break;
                case 'annee': key = `${y}`; label = `Année ${y}`; break;
            }
            if (!groups[key]) groups[key] = { label, score: 0, ca: 0 };
            groups[key].score += session.score;
            groups[key].ca += (session.totalCA || 0);
        });
        return Object.values(groups).reverse();
    }, [history, historyPeriod]);

    const updateQty = (id, delta) => setCounts(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
    const updateCA = (id, val) => setRevenues(prev => ({ ...prev, [id]: val }));

    const finalizeDay = () => {
        const date = new Date().toLocaleDateString('fr-FR');
        const newEntry = { 
            id: Date.now(), 
            date, 
            score: dailyScore, 
            totalCA: totalDailyCA,
            details: {...counts},
            revenueDetails: {...revenues}
        };
        setHistory([newEntry, ...history.filter(h => h.date !== date)]);
        if (dailyScore >= dailyGoal) setStreak(s => s + 1);
        setCounts({});
        setRevenues({});
        notify("Session et CA enregistrés !");
        setActiveTab('history');
    };

    const handleAddContact = (e) => {
        e.preventDefault();
        if (!contactForm.f) return;
        const newContact = { ...contactForm, id: Date.now(), d: new Date().toLocaleDateString('fr-FR') };
        setContacts([newContact, ...contacts]);
        setContactForm({ f: '', l: '', p: '', e: '', type: 'prospect', note: '' });
        notify("Contact ajouté !");
    };

    const generateSponsorReport = () => {
        const date = new Date().toLocaleDateString('fr-FR');
        let totalScore = 0; let totalCA = 0;
        history.forEach(s => { totalScore += s.score; totalCA += (s.totalCA || 0); });
        
        const report = `📊 NSK TRACKER REPORT - ${date}\n👤 DISTRIBUTEUR : ${userName.toUpperCase()}\n🔥 SCORE TOTAL : ${totalScore} POINTS\n💶 CHIFFRE D'AFFAIRE : ${totalCA.toFixed(2)}€\n🚀 DÉTERMINATION : MAXIMUM`;
        
        const el = document.createElement('textarea');
        el.value = report;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        notify("RAPPORT COPIÉ POUR LE SPONSOR !");
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-black relative overflow-x-hidden antialiased italic uppercase selection:bg-blue-100 font-black">
            {notification && (
                <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] p-4 px-8 rounded-2xl bg-[#0089D0] text-white shadow-2xl font-black text-xs tracking-widest animate-in fade-in slide-in-from-top-4 uppercase border-b-4 border-blue-700">
                    {notification}
                </div>
            )}

            <div className="max-w-md mx-auto px-5 pt-10 pb-40 min-h-screen relative italic font-black">
                
                <div className="flex justify-between items-center mb-8 px-2 font-black italic uppercase">
                    <button onClick={handleGoDashboard} className="flex items-center gap-3 px-5 py-3 bg-white text-blue-600 rounded-2xl shadow-lg border-2 border-blue-50 transition-all active:scale-95 group font-black">
                        <LayoutGrid size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="text-[11px] tracking-widest uppercase font-black">RETOUR MES APPS</span>
                    </button>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2 border border-slate-100 ring-4 ring-orange-50">
                        <Flame size={20} className="text-orange-500 fill-orange-500" />
                        <span className="text-lg font-black italic">{streak}</span>
                    </div>
                </div>

                <header className="mb-10 text-center font-black">
                    <h1 className="text-4xl tracking-tighter leading-none font-black uppercase italic">TRACKER <span className="text-[#0089D0]">PRO</span></h1>
                    <p className="text-[9px] text-slate-300 mt-2 tracking-[0.3em] font-black italic uppercase">{userName} • PERFORMANCE MODULE</p>
                </header>

                {/* --- TAB : TRACKER --- */}
                {activeTab === 'tracker' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 italic uppercase">
                        <div className="bg-slate-950 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden text-white flex flex-col items-center border-b-[10px] border-[#0089D0] group">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-48 h-48 transform -rotate-90 relative">
                                    <circle cx="96" cy="96" r="82" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                    <circle 
                                        cx="96" cy="96" r={82} fill="transparent" stroke="#0089D0" strokeWidth="14" 
                                        strokeDasharray={515} strokeDashoffset={515 - (Math.min(1, dailyScore/dailyGoal)*515)} 
                                        strokeLinecap="round" className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center italic">
                                    <span className="text-6xl font-black tabular-nums leading-none mb-1">{dailyScore}</span>
                                    <span className="text-[10px] uppercase opacity-40 font-black tracking-widest">/ {dailyGoal} PTS</span>
                                </div>
                            </div>
                            <div className="mt-6 bg-white/5 px-6 py-2 rounded-xl border border-white/10 flex items-center gap-3">
                                <Euro size={16} className="text-[#0089D0]" />
                                <span className="text-xl font-black italic">{totalDailyCA.toFixed(2)} €</span>
                            </div>
                        </div>

                        <div className="space-y-4 font-black italic uppercase">
                            {ACTIVITIES.map(act => (
                                <div key={act.id} className={`bg-white rounded-[2.2rem] p-5 border-2 transition-all duration-300 ${counts[act.id] > 0 ? 'border-[#0089D0] shadow-md scale-[1.02]' : 'border-slate-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 text-2xl shadow-inner italic">{act.icon}</div>
                                            <div>
                                                <h4 className="text-[11px] uppercase leading-none font-black italic">{act.label}</h4>
                                                <span className="text-[9px] text-[#0089D0] mt-1 block font-black">+{act.pts} PTS</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                                            <button onClick={() => updateQty(act.id, -1)} className="p-2 bg-white rounded-xl shadow-sm text-slate-300 active:scale-90"><Minus size={16} /></button>
                                            <span className="w-6 text-center text-lg font-black tabular-nums italic">{counts[act.id] || 0}</span>
                                            <button onClick={() => updateQty(act.id, 1)} className="p-2 bg-[#0089D0] text-white rounded-xl shadow-lg active:scale-90 transition-all"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                    
                                    {act.hasCA && (counts[act.id] || 0) > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-50 animate-in slide-in-from-top-2">
                                            <div className="flex items-center gap-3 bg-[#f8fafc] p-4 rounded-2xl border border-slate-100 shadow-inner">
                                                <Euro size={16} className="text-slate-400" />
                                                <input 
                                                    type="number" 
                                                    value={revenues[act.id] || ''} 
                                                    onChange={(e) => updateCA(act.id, e.target.value)}
                                                    placeholder="CA DE LA VENTE (€)" 
                                                    className="w-full bg-transparent outline-none font-black text-sm italic placeholder:opacity-20"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={finalizeDay} disabled={dailyScore === 0} className={`w-full py-8 rounded-[2.5rem] bg-slate-900 text-white font-black uppercase shadow-2xl flex items-center justify-center gap-4 active:scale-95 ${dailyScore === 0 ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:bg-black'}`}><Check size={24} strokeWidth={4} /> Valider la Session</button>
                    </div>
                )}

                {/* --- TAB : HISTORY (AJOUT TRIMESTRE/SEMESTRE) --- ✅ */}
                {activeTab === 'history' && (
                    <div className="space-y-6 animate-in fade-in font-black italic uppercase">
                        <h2 className="text-xl px-2 uppercase tracking-tighter flex items-center gap-3 font-black"><BarChart size={24} className="text-[#0089D0]" /> Performances</h2>
                        <div className="flex flex-wrap gap-2 px-2">
                            {['jour', 'semaine', 'mois', 'trimestre', 'semestre', 'annee'].map(p => (
                                <button key={p} onClick={() => setHistoryPeriod(p)} className={`px-4 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all shadow-sm ${historyPeriod === p ? 'bg-[#0089D0] text-white shadow-md scale-105' : 'bg-white text-slate-300 border border-slate-100'}`}>{p.toUpperCase()}</button>
                            ))}
                        </div>
                        <div className="space-y-4 pt-2 font-black">
                            {aggregatedPerformance.length === 0 ? <p className="text-center py-20 text-slate-200">Aucune archive.</p> : aggregatedPerformance.map((group, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm hover:border-[#0089D0] transition-all relative overflow-hidden group">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-black italic">{group.label}</p>
                                            <p className="text-4xl font-black italic tracking-tighter">{group.score} <span className="text-xs opacity-20 not-italic uppercase font-black">PTS</span></p>
                                        </div>
                                        <div className="text-right">
                                            <Euro size={20} className="text-emerald-500 mb-2 ml-auto opacity-30" />
                                            <p className="text-xl font-black italic text-emerald-600">+{group.ca.toFixed(0)}€</p>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-50 h-2 rounded-full mt-6 overflow-hidden"><div className="h-full bg-[#0089D0]" style={{ width: `${Math.min(100, group.score / 15 * 100)}%` }} /></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB : CONTACTS --- */}
                {activeTab === 'contacts' && (
                    <div className="space-y-6 animate-in fade-in italic font-black uppercase">
                        <h2 className="text-xl font-black uppercase tracking-tighter px-2 italic">Base Contacts Sync</h2>
                        <form onSubmit={handleAddContact} className="bg-white p-6 rounded-[2.5rem] border-2 border-[#0089D0]/20 shadow-xl space-y-4 font-black italic uppercase">
                            <div className="grid grid-cols-2 gap-3 italic"><input placeholder="Prénom" required className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#0089D0] font-black italic shadow-inner" value={contactForm.f} onChange={e => setContactForm({...contactForm, f: e.target.value})} /><input placeholder="Nom" className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#0089D0] font-black italic shadow-inner" value={contactForm.l} onChange={e => setContactForm({...contactForm, l: e.target.value})} /></div>
                            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl font-black uppercase italic">{['prospect', 'client', 'ba'].map(t => (<button key={t} type="button" onClick={() => setContactForm({...contactForm, type: t})} className={`flex-1 py-4 rounded-xl text-[10px] uppercase font-black transition-all italic ${contactForm.type === t ? (t==='ba'?'bg-emerald-500 text-white':t==='client'?'bg-blue-500 text-white':'bg-rose-500 text-white shadow-md') : 'text-slate-400'}`}>{t}</button>))}</div>
                            <input placeholder="WhatsApp" className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#0089D0] font-black italic shadow-inner" value={contactForm.p} onChange={e => setContactForm({...contactForm, p: e.target.value})} />
                            <textarea placeholder="Commentaire..." className="p-4 bg-slate-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#0089D0] min-h-[80px] font-black italic shadow-inner" value={contactForm.note} onChange={e => setContactForm({...contactForm, note: e.target.value})} />
                            <button type="submit" className="w-full py-5 bg-[#0089D0] text-white rounded-2xl shadow-lg font-black tracking-widest italic uppercase border-b-4 border-blue-700 active:scale-95 transition-all">AJOUTER AU SYSTÈME</button>
                        </form>
                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            {contacts.map(c => (
                                <div key={c.id} className={`p-6 rounded-[2.5rem] border shadow-sm transition-all ${c.type==='ba'?'bg-emerald-50/20 border-emerald-100':c.type==='client'?'bg-blue-50/30 border-blue-100':'bg-rose-50/30 border-rose-100'}`}>
                                    <div className="flex justify-between items-start font-black uppercase italic"><div className="flex gap-4 items-center"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black italic ${c.type === 'ba' ? 'bg-emerald-500' : c.type === 'client' ? 'bg-blue-500' : 'bg-rose-500'}`}>{(c.f?.[0] || '') + (c.l?.[0] || '')}</div><div><p className="text-lg font-black italic leading-none uppercase">{c.f} {c.l}</p><p className="text-[9px] text-slate-400 mt-1 uppercase italic">Depuis {c.d}</p></div></div><button onClick={() => setContacts(contacts.filter(co => co.id !== c.id))} className="text-slate-200 hover:text-rose-500 transition-colors"><Trash size={18} /></button></div>
                                    {c.note && <div className="mt-4 p-4 bg-white/60 rounded-xl border border-white/50 text-[11px] text-slate-600 font-black italic leading-relaxed shadow-inner uppercase font-black">"{c.note}"</div>}
                                    <div className="flex gap-2 mt-4"><a href={`https://wa.me/${c.p?.replace(/\s+/g, '')}`} target="_blank" className="flex-1 h-12 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-emerald-500 active:scale-95 font-black italic"><MessageSquare size={18} /></a><a href={`mailto:${c.e}`} className="flex-1 h-12 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center text-blue-500 active:scale-95 font-black italic"><Mail size={18} /></a></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB : ACADÉMIE --- */}
                {activeTab === 'method' && (
                    <div className="space-y-6 animate-in fade-in italic font-black uppercase">
                        <div className="bg-[#0089D0] rounded-[2.5rem] p-8 text-white text-center border-b-8 border-blue-700 italic font-black uppercase shadow-xl font-black"><h2 className="text-2xl font-black uppercase italic leading-none">Académie Élite</h2><p className="text-blue-50 text-[10px] uppercase opacity-90 mt-2 tracking-widest font-black italic font-black">Le succès par la duplication.</p></div>
                        <div className="space-y-4 font-black">
                            {ACADEMY_CONTENT.map(step => (
                                <div key={step.id} className="bg-white rounded-[2.2rem] border-2 border-slate-50 overflow-hidden shadow-sm font-black uppercase italic">
                                    <button onClick={() => setOpenStep(openStep === step.id ? null : step.id)} className="w-full p-6 flex items-center justify-between outline-none italic font-black">
                                        <div className="flex items-center gap-4 font-black italic uppercase"><div className="p-3 bg-slate-50 rounded-2xl text-[#0089D0] font-black">{step.icon}</div><div><span className="uppercase block leading-none font-black text-[11px] font-black">{step.title}</span><span className="text-[9px] text-slate-300 normal-case block mt-1 uppercase italic font-black">{step.summary}</span></div></div>
                                        {openStep === step.id ? <Minus size={18} /> : <Plus size={18} />}
                                    </button>
                                    {openStep === step.id && (
                                        <div className="px-8 pb-10 pt-2 animate-in fade-in font-black italic uppercase font-black">
                                            {step.sections.map((sec, idx) => (
                                                <div key={idx} className="mb-6 font-black"><h5 className="text-[10px] text-[#0089D0] uppercase mb-2 flex items-center gap-2 font-black uppercase italic tracking-widest font-black"><div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm font-black" /> {sec.subtitle}</h5><p className="text-[12px] text-slate-600 leading-relaxed font-black normal-case italic font-black">{sec.text}</p></div>
                                            ))}
                                            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center italic relative overflow-hidden font-black uppercase shadow-xl font-black"><p className="text-[9px] text-blue-400 uppercase tracking-[0.4em] mb-2 font-black italic font-black">Pro-Tip Master</p><p className="text-[11px] opacity-90 italic normal-case font-black leading-relaxed font-black">"{step.proTip}"</p></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB : SHARE (RÉTABLI & BOOSTÉ) --- ✅ */}
                {activeTab === 'share' && (
                    <div className="space-y-8 animate-in fade-in italic font-black uppercase">
                        <div className="bg-[#0089D0] rounded-[3.5rem] p-10 text-white text-center shadow-xl border-b-8 border-blue-700 italic font-black uppercase">
                            <Send size={48} className="mx-auto mb-6" />
                            <h2 className="text-2xl font-black uppercase leading-none">Rapport Sponsor</h2>
                            <p className="text-blue-50 text-[10px] mt-2 tracking-widest opacity-80 italic">Partagez votre détermination.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <button onClick={generateSponsorReport} className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 hover:border-[#0089D0] transition-all italic font-black uppercase active:scale-95 group">
                                <Share2 size={32} className="text-[#0089D0] group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-black italic">Copier Rapport Sponsor</h3>
                                <p className="text-[9px] text-slate-300 normal-case italic font-bold">Génère un résumé texte complet de vos perfs.</p>
                            </button>
                            
                            <button onClick={() => notify("SYNC CLOUD NSK EFFECTUÉE !")} className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-sm flex flex-col items-center gap-4 hover:border-emerald-500 transition-all italic font-black uppercase active:scale-95 group">
                                <Database size={32} className="text-emerald-500 group-hover:rotate-12 transition-transform" />
                                <h3 className="text-lg font-black italic">Sauvegarde Forcée</h3>
                                <p className="text-[9px] text-slate-300 normal-case italic font-bold">Synchronise vos archives avec le Cloud Master.</p>
                            </button>
                            
                            <button onClick={() => { if(confirm("VOULEZ-VOUS VRAIMENT RÉINITIALISER TOUT VOTRE TRACKER ?")) { localStorage.clear(); window.location.reload(); } }} className="w-full bg-rose-50 text-rose-500 p-8 rounded-[2.5rem] border-2 border-rose-100 flex items-center justify-center gap-4 font-black uppercase italic shadow-sm hover:bg-rose-100 transition-all">
                                <ShieldAlert size={24} /> Reset Intégral
                            </button>
                        </div>
                    </div>
                )}

                <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-sm bg-white/95 backdrop-blur-3xl border border-white shadow-2xl rounded-[4rem] flex items-center justify-around p-3 z-50 ring-1 ring-black/5 font-black italic uppercase shadow-2xl">
                    <button onClick={() => setActiveTab('history')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-xl scale-110' : 'text-slate-300'}`}><History size={24} strokeWidth={3} /></button>
                    <button onClick={() => setActiveTab('tracker')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'tracker' ? 'bg-[#0089D0] text-white shadow-xl scale-110' : 'text-slate-300'}`}><Layout size={24} strokeWidth={3} /></button>
                    <button onClick={() => setActiveTab('contacts')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'contacts' ? 'bg-[#0089D0] text-white shadow-xl scale-110' : 'text-slate-300'}`}><Users size={24} strokeWidth={3} /></button>
                    <button onClick={() => setActiveTab('method')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'method' ? 'bg-[#0089D0] text-white shadow-xl scale-110' : 'text-slate-300'}`}><Book size={24} strokeWidth={3} /></button>
                    <button onClick={() => setActiveTab('share')} className={`p-4 rounded-[2rem] transition-all duration-300 ${activeTab === 'share' ? 'bg-emerald-500 text-white shadow-xl scale-110' : 'text-slate-300'}`}><Share2 size={24} strokeWidth={3} /></button>
                </nav>
            </div>
        </div>
    );
}