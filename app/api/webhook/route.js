import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    
    if (secret) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');
      if (!crypto.timingSafeEqual(digest, signature)) {
        return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    // On force l'email en minuscules pour être sûr de trouver le client
    const email = payload.data.attributes.user_email.toLowerCase().trim();
    const eventName = payload.meta.event_name;
    const variantId = payload.data.attributes.variant_id.toString(); 

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success' || eventName === 'order_created') {
      
      let statutFinal = 'Gratuit';
      const idsStarter = ["1586709", "1586774"]; 
      const idsBusiness = ["1586893", "1586877"]; 
      const idsPerformance = ["1586912", "1586896"]; 

      if (idsStarter.includes(variantId)) statutFinal = 'Starter';
      else if (idsBusiness.includes(variantId)) statutFinal = 'Business';
      else if (idsPerformance.includes(variantId)) statutFinal = 'Performance';

      // --- CORRECTION ICI : table 'leads' en minuscules ---
      const { error, data } = await supabase
        .from('leads') 
        .update({ Statut: statutFinal })
        .ilike('Email', email); // ilike permet d'ignorer les majuscules/minuscules

      if (error) throw error;
      console.log(`✅ Statut ${statutFinal} activé pour ${email}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err) {
    console.error("❌ Erreur Webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}