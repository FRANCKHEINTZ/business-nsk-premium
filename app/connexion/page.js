'use client';
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Rocket, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const supabase = createClient('https://rbmzmduojlxdzfgmolly.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E');

export default function Connexion() {
  const [f, setF] = useState(''); const [l, setL] = useState(''); const [e, setE] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    await supabase.from('leads').insert([{ nombre: f, nom: l, email: e }]);
    localStorage.setItem('nsk_access_granted', 'true');
    window.location.href = '/packs';
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 italic text-slate-900">
      <div className="w-full max-w-[460px] text-center space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 text-indigo-600 mb-2 rotate-3 hover:rotate-0 duration-500 transition-all"><Rocket size={40} /></div>
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Business <span className="text-indigo-600">NSK</span></h2>
          <div className="flex items-center justify-center gap-2 opacity-40 not-italic font-sans text-[10px] font-black uppercase tracking-[0.4em]">Propulsion Premium</div>
        </div>
        <div className="bg-white rounded-[3.5rem] shadow-2xl p-10 md:p-12 relative overflow-hidden text-left border border-slate-50">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" required placeholder="Prénom" className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold italic text-slate-900" onChange={(ev)=>setF(ev.target.value)} />
            <input type="text" required placeholder="Nom" className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold italic text-slate-900" onChange={(ev)=>setL(ev.target.value)} />
            <input type="email" required placeholder="Email Privé" className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-indigo-600 font-bold italic text-slate-900" onChange={(ev)=>setE(ev.target.value)} />
            <button type="submit" className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-indigo-700 flex items-center justify-center gap-3 transition-all active:scale-95">{loading ? "Vérification..." : "Découvrir les offres →"}</button>
          </form>
          <div className="mt-12 flex justify-center gap-8 border-t border-slate-50 pt-8 text-slate-400 font-sans not-italic">
            <a href="/conditions" className="text-[10px] font-black hover:text-indigo-600 uppercase tracking-widest">Conditions</a>
            <a href="/confidentialite" className="text-[10px] font-black hover:text-indigo-600 uppercase tracking-widest">Confidentialité</a>
          </div>
        </div>
      </div>
    </div>
  );
}
