"use client";

import React, { useState, useEffect } from 'react';
import { 
  Rocket, Check, X, LayoutDashboard, ArrowRight, 
  ShieldCheck, Zap, Star, Crown, ScrollText,
  MonitorSmartphone, TrendingUp, Users, Calculator, Activity, Calendar
} from 'lucide-react';

// --- DESIGN SYSTEM (Styles Premium) ---
const styles = {
  main: { minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'sans-serif', fontStyle: 'italic', display: 'flex', flexDirection: 'column' },
  loginCard: { backgroundColor: 'white', padding: '48px', borderRadius: '56px', boxShadow: '0 35px 60px -15px rgba(0,0,0,0.1)', textAlign: 'left', borderTop: '8px solid #4f46e5', width: '100%', maxWidth: '420px' },
  input: { width: '100%', padding: '22px', marginBottom: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '15px', fontWeight: '700', outline: 'none', boxSizing: 'border-box' },
  btnIndigo: { width: '100%', padding: '22px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '22px', fontWeight: '900', textTransform: 'uppercase', cursor: 'pointer', fontSize: '12px', letterSpacing: '2px', boxShadow: '0 15px 25px -5px rgba(79, 70, 229, 0.4)', transition: 'all 0.3s' },
  legalLink: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px', fontStyle: 'italic' },
  modal: { position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modalBox: { backgroundColor: 'white', padding: '40px', borderRadius: '44px', maxWidth: '500px', width: '100%', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', color: '#1e293b' },
  packCard: { backgroundColor: 'white', padding: '40px', borderRadius: '50px', position: 'relative', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', flex: '1', minWidth: '300px', maxWidth: '380px' },
  toggleBtn: { width: '64px', height: '32px', backgroundColor: '#e2e8f0', borderRadius: '30px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }
};

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState('login'); 
  const [selectedPack, setSelectedPack] = useState(null);
  const [legalModal, setLegalModal] = useState(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState(null);

  // --- INITIALISATION SUPABASE (Connexion Leads) ---
  useEffect(() => {
    setMounted(true);
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
        const client = createClient(
          'https://rbmzmduojlxdzfgmolly.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E'
        );
        setSupabase(client);
      } catch (e) { console.warn("Erreur Database"); }
    };
    initSupabase();
  }, []);

  if (!mounted) return null;

  // --- CONFIGURATION LEMON SQUEEZY (Paiements) ---
  const checkoutLinks = {
    starter_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/ed733f72-4562-4e93-8594-a3bdd319f5b3",
    starter_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/3e40bab0-a707-429e-9424-fd0d6b0de81e",
    business_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/910988d0-26a5-4a5d-b4c7-a29dd3302b12",
    business_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/2ad67cb8-485b-48a7-b089-1f13a4a871e8",
    performance_m: "https://business-nsk.lemonsqueezy.com/checkout/buy/7fdb7200-82ff-48c7-b28b-a69ed2a87dc3",
    performance_a: "https://business-nsk.lemonsqueezy.com/checkout/buy/8b1ed304-f6a6-4b65-8f8d-fb1011109bad",
  };

  // --- MATRICE DES APPLICATIONS (Droits d'accès) ---
  const applications = [
    { id: 1, name: "Gestionnaire Clientèle", path: "/adrclient", icon: <Zap size={24}/>, pack: "starter" },
    { id: 2, name: "Suivi de Réseau", path: "/adrbamembre", icon: <Users size={24}/>, pack: "starter" },
    { id: 3, name: "Calculateur PRYSM io", path: "/prysmio", icon: <Calculator size={24}/>, pack: "starter" },
    { id: 4, name: "Planificateur d'Objectif", path: "/simulateurobjectif", icon: <Calendar size={24}/>, pack: "business" },
    { id: 5, name: "Tracker Global", path: "/tracker", icon: <Activity size={24}/>, pack: "business" },
    { id: 6, name: "Analyse de Gains", path: "/simulateurgains", icon: <TrendingUp size={24}/>, pack: "performance" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const leadData = { 
      Prénom: formData.get('p'), 
      Nom: formData.get('n'), 
      Email: formData.get('e') 
    };

    try {
      if (supabase) await supabase.from('leads').insert([leadData]);
      setView('packs');
    } catch (err) { setView('packs'); }
    setLoading(false);
  };

  const LegalModal = () => {
    if (!legalModal) return null;
    const content = {
      mentions: { title: "Mentions Légales", p: "Éditeur : Invest In Your Future. Contact : +33 6 87 69 49 82. Hébergement : Vercel Inc. Plateforme de pilotage stratégique." },
      remboursement: { title: "Remboursement", p: "Art L221-28 : Le droit de rétractation ne peut être exercé pour les contenus numériques fournis sur un support non matériel dont l'exécution a commencé après accord préalable exprès." },
      conditions: { title: "Conditions", p: "L'accès aux outils est strictement personnel et limité à 2 appareils simultanés par licence. Toute revente ou partage est prohibé." },
      confidentialite: { title: "Confidentialité", p: "Vos données sont protégées par chiffrement SSL Supabase. Nous ne collectons que les informations nécessaires à votre identification professionnelle." }
    };
    return (
      <div style={styles.modal}>
        <div style={styles.modalBox}>
          <button onClick={() => setLegalModal(null)} style={{position:'absolute', top:'25px', right:'25px', border:'none', background:'#f1f5f9', padding:'8px', borderRadius:'50%', cursor:'pointer'}}><X size={18}/></button>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', color:'#4f46e5'}}><ScrollText size={24} /> <h3 style={{textTransform:'uppercase', fontWeight:900, margin:0}}>{content[legalModal].title}</h3></div>
          <p style={{fontSize:'14px', lineHeight:'1.7', color:'#64748b', fontWeight:'700', marginBottom:'30px'}}>{content[legalModal].p}</p>
          <button onClick={() => setLegalModal(null)} style={{...styles.btnIndigo, backgroundColor:'#0f172a'}}>Fermer</button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.main}>
      <LegalModal />
      
      {view === 'login' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ display: 'inline-flex', padding: '22px', backgroundColor: 'white', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', color: '#4f46e5', marginBottom: '36px' }}>
            <Rocket size={44} />
          </div>
          <h1 style={{ fontSize: '46px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '45px', letterSpacing: '-3px' }}>Business <span style={{ color: '#4f46e5' }}>NSK</span></h1>
          
          <div style={styles.loginCard}>
            <form onSubmit={handleLogin}>
              <input name="p" type="text" placeholder="Prénom" required style={styles.input} />
              <input name="n" type="text" placeholder="Nom" required style={styles.input} />
              <input name="e" type="email" placeholder="Email" required style={styles.input} />
              <button type="submit" disabled={loading} style={styles.btnIndigo}>
                {loading ? "Chargement..." : "Découvrir les Packs"}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', width: '100%', maxWidth: '420px' }}>
            <button onClick={() => setLegalModal('mentions')} style={styles.legalLink}>Mentions Légales</button>
            <button onClick={() => setLegalModal('remboursement')} style={{...styles.legalLink, textAlign:'right'}}>Remboursement</button>
            <button onClick={() => setLegalModal('conditions')} style={styles.legalLink}>Conditions</button>
            <button onClick={() => setLegalModal('confidentialite')} style={{...styles.legalLink, textAlign:'right'}}>Confidentialité</button>
          </div>
        </div>
      )}

      {view === 'packs' && (
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '52px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '-3px' }}>Choisissez votre <span style={{ color: '#4f46e5' }}>Niveau</span></h2>
          <p style={{color: '#64748b', fontWeight: 'bold', marginBottom: '50px', fontSize: '17px'}}>Pilotez votre réussite avec nos solutions stratégiques.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginBottom: '60px' }}>
            <span style={{ fontSize: '13px', fontWeight: '900', color: !isAnnual ? '#4f46e5' : '#94a3b8' }}>MENSUEL</span>
            <div onClick={() => setIsAnnual(!isAnnual)} style={{ ...styles.toggleBtn }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: '#4f46e5', borderRadius: '50%', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'absolute', transform: isAnnual ? 'translateX(32px)' : 'translateX(0)', transition: 'all 0.3s' }}></div>
            </div>
            <span style={{ fontSize: '13px', fontWeight: '900', color: isAnnual ? '#4f46e5' : '#94a3b8' }}>ANNUEL <span style={{color:'#10b981'}}>(-20%)</span></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', gap: '30px', flexWrap: 'wrap' }}>
            {[
              { id:'starter', name:'STARTER', price: isAnnual ? '99 €' : '9,90 €', feat: ["Gestionnaire Clientèle", "Suivi de Réseau", "Calculateur PRYSM io"] },
              { id:'business', name:'BUSINESS', price: isAnnual ? '149 €' : '14,90 €', pop:true, feat: ["Offre STARTER Incluse", "Planificateur d'Objectif", "Tracker Global"] },
              { id:'performance', name:'PERFORMANCE', price: isAnnual ? '199 €' : '19,90 €', feat: ["Offre BUSINESS Incluse", "Analyse de Gains"] }
            ].map(p => (
              <div key={p.id} style={{ ...styles.packCard, border: p.pop ? '4px solid #4f46e5' : '1px solid #f1f5f9', boxShadow: p.pop ? '0 40px 70px -15px rgba(79, 70, 229, 0.25)' : '0 10px 25px rgba(0,0,0,0.05)' }}>
                {p.pop && <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#4f46e5', color: 'white', padding: '8px 20px', borderRadius: '25px', fontSize: '10px', fontWeight: '900' }}>RECOMMANDÉ</div>}
                <h3 style={{ fontSize: '30px', fontWeight: '900', marginBottom: '14px', textTransform:'uppercase' }}>{p.name}</h3>
                <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '30px', textAlign: 'left' }}>{p.price}</div>
                <div style={{ textAlign: 'left', marginBottom: '40px', flexGrow: 1 }}>
                  {p.feat.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '14px' }}>
                      <Check size={16} color="#10b981" strokeWidth={3}/> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => { 
                  const linkKey = `${p.id}_${isAnnual ? 'a' : 'm'}`;
                  window.open(checkoutLinks[linkKey], '_blank'); 
                  setSelectedPack(p.id); setView('dashboard'); 
                }} style={styles.btnIndigo}>Sélectionner</button>
              </div>
            ))}
          </div>
          <button onClick={() => setView('login')} style={{marginTop: '65px', ...styles.legalLink}}>← Retour</button>
        </div>
      )}

      {view === 'dashboard' && (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '65px' }}>
            <div style={{textAlign: 'left'}}>
              <h2 style={{ margin: 0, fontSize: '46px', fontWeight: '900', textTransform: 'uppercase' }}>Niveau <span style={{ color: '#4f46e5' }}>{selectedPack}</span></h2>
              <div style={{marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase'}}><ShieldCheck size={16}/> Accès Sécurisé</div>
            </div>
            <button onClick={() => setView('packs')} style={{ padding: '18px', backgroundColor: 'white', border: '1px solid #f1f5f9', borderRadius: '22px', cursor: 'pointer' }}><X size={24} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {applications.filter(app => {
              if (selectedPack === 'performance') return true;
              if (selectedPack === 'business') return app.pack !== 'performance';
              return app.pack === 'starter';
            }).map((app) => (
              <div key={app.id} style={{ backgroundColor: 'white', padding: '44px', borderRadius: '52px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '22px', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>{app.icon}</div>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>{app.name}</h3>
                <button onClick={() => window.location.href = window.location.origin + app.path} style={styles.btnIndigo}>Démarrer <ArrowRight size={18} style={{marginLeft:'10px'}}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}