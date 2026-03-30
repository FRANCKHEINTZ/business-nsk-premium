
'use client';
import React from 'react';
import { ArrowLeft, CircleDollarSign, Clock, CreditCard, AlertCircle, RefreshCcw } from 'lucide-react';

export default function RemboursementPage() {
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
              <CircleDollarSign size={32} />
            </div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Politique de <span className="text-indigo-600">Remboursement</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
              Transparence & Engagement — Business NSK
            </p>
          </div>

          <div className="space-y-10 text-slate-600 leading-relaxed text-sm">
            
            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <Clock size={20} className="text-indigo-600" />
                1. Droit de rétractation
              </h2>
              <p>
                Conformément à la législation en vigueur sur les contenus numériques, le droit de rétractation de 14 jours ne s'applique pas dès lors que l'accès au service (simulateurs, packs, données privées) a été activé. En validant votre commande sur <strong>Business NSK</strong>, vous reconnaissez que l'exécution du service commence immédiatement après le paiement.
              </p>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <AlertCircle size={20} className="text-indigo-600" />
                2. Conditions exceptionnelles
              </h2>
              <p>
                Un remboursement total ou partiel peut être envisagé exclusivement dans les cas suivants :
              </p>
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Défaut technique majeur empêchant l'accès prolongé au Service (plus de 7 jours consécutifs).</li>
                <li>Double facturation accidentelle avérée par nos systèmes de paiement.</li>
                <li>Erreur de pack lors de la commande avant toute première utilisation.</li>
              </ul>
            </section>

            <section>
              <h2 className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-900 mb-4">
                <RefreshCcw size={20} className="text-indigo-600" />
                3. Procédure de demande
              </h2>
              <p>
                Toute demande doit être adressée par e-mail. Elle doit inclure votre numéro de commande Lemon Squeezy et le motif détaillé. Notre équipe examine chaque dossier sous 48 à 72 heures ouvrées.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-center">
              <p>
                Nous privilégions toujours la satisfaction de nos membres. Pour tout problème d'utilisation, n'hésitez pas à solliciter notre support technique.
              </p>
            </section>

          </div>

          <div className="mt-16 pt-8 border-t text-center">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
              Soutien Client Business NSK © 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}