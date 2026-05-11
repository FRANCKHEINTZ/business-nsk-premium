import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    // 1. SÉCURITÉ : On vérifie que c'est bien Lemon Squeezy qui parle
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');
      if (!crypto.timingSafeEqual(digest, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    
    // NETTOYAGE EXTRÊME DE L'EMAIL (Supprime espaces et majuscules)
    const emailRecu = payload.data.attributes.user_email.toLowerCase().trim();
    const eventName = payload.meta.event_name;
    const variantId = payload.data.attributes.variant_id.toString(); 

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 2. LOGIQUE DE DÉCISION DU PACK
    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId)) statutFinal = 'Starter';
      else if (idsBusiness.includes(variantId)) statutFinal = 'Business';
      else if (idsPerformance.includes(variantId)) statutFinal = 'Performance';

      // 3. MISE À JOUR AUTOMATIQUE DANS SUPABASE
      // ilike('Email', emailRecu) permet de trouver "Valerie" même si on cherche "valerie"
      const { error, data } = await supabase
        .from('leads') // Vérifié sur ta capture : minuscule
        .update({ Statut: statutFinal })
        .ilike('Email', emailRecu) 
        .select();

      if (error) throw error;

      // Si l'email n'existait pas encore, on peut même décider de le créer (Optionnel)
      if (!data || data.length === 0) {
        console.log(`⚠️ Client ${emailRecu} non trouvé pour mise à jour.`);
      } else {
        console.log(`✅ SUCCÈS : ${emailRecu} est passé en ${statutFinal}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ ERREUR WEBHOOK :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}