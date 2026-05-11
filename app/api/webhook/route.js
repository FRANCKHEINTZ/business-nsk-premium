import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * Route API pour gérer les notifications de paiement Lemon Squeezy (Webhooks)
 * Emplacement : app/api/webhook/route.js
 */
export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    // 1. VÉRIFICATION DE LA SIGNATURE (SÉCURITÉ)
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

      if (!crypto.timingSafeEqual(digest, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const email = payload.data.attributes.user_email;
    const eventName = payload.meta.event_name;
    const variantId = payload.data.attributes.variant_id.toString(); 

    // Initialisation du client Supabase avec la clé de service (Service Role Key)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log(`Événement reçu : ${eventName} | Client : ${email} | Variant ID : ${variantId}`);

    // 2. LOGIQUE DE DISTRIBUTION DES ACCÈS (STARTER, BUSINESS, PERFORMANCE)
    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';

      // --- IDS RÉELS CONFIGURÉS ---
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      // Détermination du statut selon l'ID du pack acheté
      if (idsStarter.includes(variantId)) {
        statutFinal = 'Starter';
      } else if (idsBusiness.includes(variantId)) {
        statutFinal = 'Business';
      } else if (idsPerformance.includes(variantId)) {
        statutFinal = 'Performance';
      }

      // 3. MISE À JOUR DE LA TABLE "Leads" DANS SUPABASE
      const { error } = await supabase
        .from('Leads')
        .update({ Statut: statutFinal })
        .eq('Email', email);

      if (error) {
        throw new Error(`Erreur Supabase : ${error.message}`);
      }
      
      console.log(`✅ Succès : Accès ${statutFinal} activé pour l'utilisateur ${email}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ Erreur Webhook :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}