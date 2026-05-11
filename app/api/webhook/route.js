import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    // 1. SÉCURITÉ DE SIGNATURE
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');
      if (!crypto.timingSafeEqual(digest, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    
    // 2. EXTRACTION DES DONNÉES
    const attributes = payload?.data?.attributes;
    const emailRecu = attributes?.user_email?.toLowerCase().trim() || attributes?.customer_email?.toLowerCase().trim();
    const eventName = payload?.meta?.event_name;
    const variantId = attributes?.variant_id?.toString() || ""; 
    const variantName = attributes?.variant_name?.toLowerCase() || ""; 

    console.log(`[CHECK] Event: ${eventName} | Email: ${emailRecu} | Variant ID: ${variantId} | Name: ${variantName}`);

    if (!emailRecu) return NextResponse.json({ error: "Email manquant" }, { status: 200 });

    // 3. CONNEXION SUPABASE
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. LOGIQUE DE MISE À JOUR DU PACK
    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';

      // Vérification par IDs ou par Nom (Starter, Business, Performance)
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId) || variantName.includes('starter')) {
        statutFinal = 'Starter';
      } else if (idsBusiness.includes(variantId) || variantName.includes('business')) {
        statutFinal = 'Business';
      } else if (idsPerformance.includes(variantId) || variantName.includes('performance')) {
        statutFinal = 'Performance';
      }

      // --- SÉCURITÉ DE SECOURS (Si le statut est encore Gratuit) ---
      // On va lire la colonne pack_type de Supabase pour confirmer le choix du client
      if (statutFinal === 'Gratuit') {
        const { data: userRecord } = await supabase
          .from('leads')
          .select('pack_type')
          .ilike('Email', emailRecu)
          .single();
        
        const packTypeExistant = userRecord?.pack_type?.toUpperCase();
        if (packTypeExistant === 'STARTER') statutFinal = 'Starter';
        else if (packTypeExistant === 'BUSINESS') statutFinal = 'Business';
        else if (packTypeExistant === 'PERFORMANCE') statutFinal = 'Performance';
      }

      console.log(`[DÉCISION FINALE] Le client ${emailRecu} sera : ${statutFinal}`);

      // Mise à jour de la colonne 'Statut' dans Supabase
      const { error, data } = await supabase
        .from('leads') 
        .update({ Statut: statutFinal })
        .ilike('Email', emailRecu)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        console.log(`✅ SUCCÈS : ${emailRecu} est passé en ${statutFinal}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ ERREUR GLOBALE :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}