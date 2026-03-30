'use client';
import React from 'react';
import { ArrowLeft, Landmark, Info, Mail, Globe } from 'lucide-react';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        <button 
          onClick={() => window.history.back()}
          className="group mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl p-10 md:p-16 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl text-indigo-600 mb-6">
              <Landmark size={32} />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Mentions <span className="text-indigo-600">Légales</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Informations Officielles — Business NSK
            </p>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed text-sm">
            
            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <Info size={20} className="text-indigo-600" />
                1. Édition du site
              </h2>
              <p>
                Le présent site, accessible à l'URL <strong>https://mon-saas-netflix.vercel.app</strong>, est édité par :
                <br /><br />
                <strong>Business NSK</strong>, représenté par Franck H., agissant en qualité d'éditeur et responsable de la publication.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <Globe size={20} className="text-indigo-600" />
                2. Hébergement
              </h2>
              <p>
                Le Site est hébergé par la société <strong>Vercel Inc.</strong>, situé au :
                <br />
                <em>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</em>
                <br />
                Contact : https://vercel.com
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <Mail size={20} className="text-indigo-600" />
                3. Contactez-nous
              </h2>
              <p>
                Pour toute question ou demande d'information concernant le site, ou toute notification d'un contenu illicite, l'utilisateur peut contacter l'éditeur via l'adresse e-mail fournie dans son espace membre sécurisé.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <Landmark size={20} className="text-indigo-600" />
                4. Propriété intellectuelle
              </h2>
              <p>
                La structure générale du site Business NSK, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété de l'éditeur. Toute représentation et/ou reproduction et/ou exploitation partielle ou totale des contenus et services proposés par le site sans l'autorisation préalable et par écrit de Franck H. est strictement interdite.
              </p>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
              Business NSK © 2026 — Tous droits réservés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}