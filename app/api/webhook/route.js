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
    
    // 2. EXTRACTION SÉCURISÉE DES DONNÉES
    const attributes = payload?.data?.attributes;
    const emailRecu = attributes?.user_email?.toLowerCase().trim() || attributes?.customer_email?.toLowerCase().trim();
    const eventName = payload?.meta?.event_name;
    const variantId = attributes?.variant_id?.toString() || ""; 

    console.log(`[CHECK] Event: ${eventName} | Email: ${emailRecu} | Variant: ${variantId}`);

    if (!emailRecu) {
      console.error("❌ Erreur : Aucun email trouvé dans le payload");
      return NextResponse.json({ error: "Email manquant" }, { status: 200 });
    }

    // 3. VÉRIFICATION DES CLÉS SUPABASE (Variables d'environnement Vercel)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ ERREUR CRITIQUE : Les clés NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY sont absentes.");
      return NextResponse.json({ error: "Configuration serveur incomplète" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. LOGIQUE DE MISE À JOUR DU STATUT
    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId)) {
        statutFinal = 'Starter';
      } else if (idsBusiness.includes(variantId)) {
        statutFinal = 'Business';
      } else if (idsPerformance.includes(variantId)) {
        statutFinal = 'Performance';
      }

      // Mise à jour dans la table 'leads'
      const { error, data } = await supabase
        .from('leads') 
        .update({ Statut: statutFinal })
        .ilike('Email', emailRecu)
        .select();

      if (error) {
        console.error("❌ Erreur Supabase:", error.message);
        throw error;
      }

      if (data && data.length > 0) {
        console.log(`✅ SUCCÈS : ${emailRecu} mis à jour en ${statutFinal}`);
      } else {
        console.warn(`⚠️ Client ${emailRecu} non trouvé dans la table leads`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ ERREUR GLOBALE :", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}