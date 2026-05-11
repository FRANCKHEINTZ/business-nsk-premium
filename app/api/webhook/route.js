import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    // 1. VÉRIFICATION DE SÉCURITÉ
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');
      if (!crypto.timingSafeEqual(digest, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    
    // On nettoie l'email reçu : tout en minuscules et on enlève les espaces
    const emailRecu = payload.data.attributes.user_email.toLowerCase().trim();
    const eventName = payload.meta.event_name;
    const variantId = payload.data.attributes.variant_id.toString(); 

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log(`[WEBHOOK] Événement: ${eventName} | Client: ${emailRecu} | Variant ID: ${variantId}`);

    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';

      // --- CONFIGURATION DES IDS RÉELS ---
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId)) statutFinal = 'Starter';
      else if (idsBusiness.includes(variantId)) statutFinal = 'Business';
      else if (idsPerformance.includes(variantId)) statutFinal = 'Performance';

      console.log(`[WEBHOOK] Statut déterminé: ${statutFinal}`);

      // 2. MISE À JOUR DANS SUPABASE
      // On cherche la ligne où l'email correspond (sans tenir compte de la casse)
      const { error, data } = await supabase
        .from('leads') // On utilise 'leads' en minuscules (vérifié sur votre écran)
        .update({ Statut: statutFinal })
        .ilike('Email', emailRecu)
        .select(); // On demande à voir le résultat

      if (error) {
        console.error("[SUPABASE ERROR]:", error.message);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`✅ [SUCCÈS]: La ligne de ${emailRecu} a été mise à jour en ${statutFinal}`);
      } else {
        console.log(`⚠️ [ATTENTION]: Aucune ligne trouvée dans Supabase pour l'email: ${emailRecu}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ [ERREUR GLOBALE]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}