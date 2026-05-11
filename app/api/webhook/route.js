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
    
    // Récupération et nettoyage de l'email
    const emailRecuRaw = payload.data.attributes.user_email || payload.data.attributes.customer_email || "";
    const emailRecu = emailRecuRaw.toLowerCase().trim();
    
    const eventName = payload.meta.event_name;
    const variantId = payload.data.attributes.variant_id?.toString() || ""; 

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log(`[LOG] Webhook: ${eventName} | Email Nettoyé: "${emailRecu}" | ID: ${variantId}`);

    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId)) statutFinal = 'Starter';
      else if (idsBusiness.includes(variantId)) statutFinal = 'Business';
      else if (idsPerformance.includes(variantId)) statutFinal = 'Performance';

      console.log(`[LOG] Tentative de mise à jour -> Statut: ${statutFinal}`);

      // 2. MISE À JOUR DANS SUPABASE
      // On utilise .ilike pour la colonne 'Email' et on cible la table 'leads'
      const { error, data } = await supabase
        .from('leads') 
        .update({ Statut: statutFinal })
        .ilike('Email', emailRecu)
        .select();

      if (error) {
        console.error("[ERREUR SUPABASE]:", error.message);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`✅ [SUCCÈS]: ${emailRecu} est passé en ${statutFinal} (Ligne ID: ${data[0].id})`);
      } else {
        // Diagnostic : Si on arrive ici, l'email envoyé par Lemon Squeezy n'existe pas dans la colonne Email de Supabase
        console.error(`⚠️ [ALERTE]: Aucune ligne trouvée pour l'email "${emailRecu}".`);
        
        // Tentative de secours : on cherche si l'email existe quand même sans filtre strict
        const { data: search } = await supabase.from('leads').select('Email').ilike('Email', emailRecu);
        console.log(`[DIAGNOSTIC] Recherche simple pour "${emailRecu}": ${search?.length > 0 ? "Trouvé" : "Non trouvé dans la table"}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ [ERREUR CRITIQUE]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}