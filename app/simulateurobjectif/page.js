<!DOCTYPE html>
<html lang="fr">
<head>
<!-- DEBUT DU BLOC DE SÉCURITÉ -->
<script src="[https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2](https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2)"></script>
<script>
  (function() {
    // 🛡️ Fonction de nettoyage (Empêche l'erreur "Invalid URL" sur Mac)
    function clean(s) { 
        if (!s) return "";
        return s.toString()
            .replace(/[\u201C\u201D\u2018\u2019\u0022\u0027]/g, '') // Supprime les guillemets Mac
            .replace(/[\u200B-\u200D\uFEFF]/g, '')                // Supprime les caractères invisibles
            .replace(/\s+/g, '')                                  // Supprime les espaces
            .trim(); 
    }

    const S_URL = clean("[https://rbmzmduojlxdzfgmolly.supabase.co](https://rbmzmduojlxdzfgmolly.supabase.co)");
    const S_KEY = clean("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E");
    
    // Initialisation sécurisée
    const sc = supabase.createClient(S_URL, S_KEY);

    async function check() {
      try {
        const { data } = await sc.auth.getSession();
        
        // Autorise l'affichage local (Mac) et l'aperçu Gemini
        const isSafeEnv = window.location.hostname.includes('goog') || 
                          window.location.protocol === 'file:' || 
                          window.location.protocol === 'blob:';

        // Sur le site Netlify réel : si aucune session n'est trouvée -> Redirection
        if ((!data || !data.session) && !isSafeEnv) {
          document.documentElement.innerHTML = ""; // Vide l'écran
          window.location.href = "index.html";     // Renvoie au portail
        }
      } catch (e) { 
        console.warn("Sécurité active."); 
      }
    }
    check();
  })();
</script>
<!-- FIN DU BLOC DE SÉCURITÉ -->


    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulateur d'objectif Pro - Nu Skin 2026</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #FBFBFA;
            color: #1E293B;
            -webkit-tap-highlight-color: transparent;
        }
        .italic-all { font-style: italic; }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        input[type=range] {
            -webkit-appearance: none;
            background: transparent;
            cursor: pointer;
        }
        input[type=range]::-webkit-slider-runnable-track {
            height: 6px;
            background: #f1f5f9;
            border-radius: 999px;
        }
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: currentColor;
            margin-top: -6px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
    </style>
</head>
<body class="p-4 md:p-8 italic-all">

    <div class="max-w-6xl mx-auto space-y-10">
        
        <!-- TITRE -->
        <div class="text-left border-l-4 border-indigo-600 pl-6">
            <h1 class="text-3xl font-black uppercase tracking-tighter">Simulateur d'objectif</h1>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Calculateur Stratégique de Commissions 2026</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <!-- SECTION GAUCHE : PARAMÈTRES -->
            <div class="lg:col-span-7 space-y-8">
                
                <!-- 1. OBJECTIF NET -->
                <div class="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div class="relative z-10 flex flex-col gap-6 text-left">
                        <div class="flex justify-between items-center italic mb-4 leading-none">
                            <label class="text-[10px] font-black uppercase tracking-widest opacity-60">Revenu Mensuel Souhaité</label>
                            <button onclick="handleAutoRoute()" class="px-4 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform">
                                Tracer ma route
                            </button>
                        </div>
                        <div class="flex items-baseline gap-4 border-b-2 border-indigo-400 pb-2">
                            <input id="targetIncome" type="number" class="text-6xl font-black bg-transparent outline-none w-full italic tabular-nums text-left placeholder:text-white/20" placeholder="0" oninput="calculate()">
                            <span class="text-3xl font-black opacity-40">€</span>
                        </div>
                    </div>
                </div>

                <!-- 1. VOLUME PROPRE -->
                <div class="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 text-left">
                    <div class="flex justify-between items-center leading-none">
                        <h3 class="font-black italic uppercase text-indigo-900 flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                            1. Volume Propre
                        </h3>
                        <span id="display-personalSv" class="text-2xl font-black italic tabular-nums text-indigo-600">0 SV</span>
                    </div>
                    <input id="personalSv" type="range" min="0" max="2000" step="50" value="0" class="w-full text-indigo-600" oninput="calculate()">
                </div>

                <!-- 2. CLIENTS N1 -->
                <div class="bg-white p-8 rounded-[3.5rem] border border-indigo-100 shadow-sm space-y-8 text-left">
                    <div class="flex justify-between items-center">
                        <div class="space-y-1">
                            <h3 class="font-black italic uppercase text-indigo-900 flex items-center gap-3 leading-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                2. Mes Clients (N1)
                            </h3>
                            <p id="display-svN1" class="text-2xl font-black text-indigo-600 tabular-nums ml-8">0 SV</p>
                        </div>
                        <div id="selling-badge" class="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm italic">Selling: 4%</div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                        <div class="space-y-4">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Nb de clients</p>
                            <p id="display-n1Clients" class="text-3xl font-black italic text-indigo-600 tabular-nums leading-none">0</p>
                            <input id="n1Clients" type="range" min="0" max="50" value="0" class="w-full text-indigo-400" oninput="calculate()">
                        </div>
                        <div class="space-y-4">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Volume / client</p>
                            <p id="display-n1SvPerClient" class="text-3xl font-black italic text-indigo-600 tabular-nums text-left leading-none">0 SV</p>
                            <input id="n1SvPerClient" type="range" min="0" max="500" step="5" value="0" class="w-full text-indigo-400" oninput="calculate()">
                        </div>
                    </div>
                </div>

                <!-- 3. LEVIER RÉSEAU (L1 & N2 ALIGNÉS) -->
                <div class="bg-blue-50/50 p-8 rounded-[3.5rem] border border-blue-100 shadow-sm space-y-8 text-left">
                    <div class="flex justify-between items-center text-left">
                        <div class="space-y-1">
                            <h3 class="font-black italic uppercase text-blue-900 flex items-center gap-3 leading-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600"><path d="m12 14 4-4 4 4-4 4-4-4Z"/><path d="M16 4V2"/><path d="M5 4v2"/><path d="M16 22v-2"/><path d="M5 22v-2"/><path d="M2 13h2"/><path d="M20 13h2"/></svg>
                                3. Levier Réseau (L1 & N2)
                            </h3>
                            <p id="display-svNetwork" class="text-2xl font-black text-blue-600 tabular-nums ml-8">0 SV</p>
                        </div>
                        <div id="referring-badge" class="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg leading-none">Referring: 0%</div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-6 border-t border-blue-100 pt-6">
                        <div class="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Partenaires Directs (L1)</p>
                            <p id="display-l1Partners" class="text-3xl font-black italic text-blue-600 tabular-nums leading-none">0</p>
                            <input id="l1Partners" type="range" min="0" max="20" value="0" class="w-full text-blue-600" oninput="calculate()">
                            <p id="display-l1PartnerVolume" class="text-xs font-bold text-slate-400 text-right uppercase">0 SV / Partner</p>
                            <input id="l1PartnerVolume" type="range" min="0" max="2000" step="50" value="0" class="w-full text-blue-300" oninput="calculate()">
                        </div>
                        <div class="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm space-y-4">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none italic">Clients Réseau (N2)</p>
                            <p id="display-n2Clients" class="text-3xl font-black italic text-blue-600 tabular-nums leading-none">0</p>
                            <input id="n2Clients" type="range" min="0" max="100" value="0" class="w-full text-blue-500" oninput="calculate()">
                            <p id="display-n2SvPerClient" class="text-xs font-bold text-slate-400 text-right uppercase">0 SV / Client N2</p>
                            <input id="n2SvPerClient" type="range" min="0" max="500" step="5" value="0" class="w-full text-blue-300" oninput="calculate()">
                        </div>
                    </div>
                </div>

                <!-- 5. BLOC DE SÉCURITÉ : CERCLE GROUPE -->
                <div id="card-gsv" class="p-8 rounded-[3.5rem] border-2 transition-all duration-700 italic text-left bg-amber-50 border-amber-100 shadow-lg relative overflow-hidden">
                    <div class="flex justify-between items-center relative z-10">
                        <div class="space-y-1">
                            <h3 class="font-black italic uppercase text-lg text-slate-900 leading-tight">5. Cercle Groupe (GSV)</h3>
                            <div class="flex items-center gap-2">
                                <span id="gsv-icon"></span>
                                <p id="gsv-status" class="text-[10px] font-black uppercase tracking-widest text-amber-600">Calcul en cours...</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p id="display-totalGsv" class="text-4xl font-black tabular-nums leading-none text-amber-600">0</p>
                            <p class="text-[10px] font-black uppercase mt-1 opacity-40">SV Global</p>
                        </div>
                    </div>
                    <div id="gsv-alert" class="mt-6 p-4 bg-white/50 rounded-2xl border border-dashed border-amber-200 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"></svg>
                        <p id="gsv-message" class="text-[11px] font-bold text-amber-700 leading-tight"></p>
                    </div>
                </div>

                <!-- 6. ORGANISATION (SÉCURISÉE) -->
                <div id="card-org" class="p-8 rounded-[4rem] border-2 transition-all duration-500 italic relative overflow-hidden shadow-2xl text-left bg-slate-100 border-slate-200 opacity-60 grayscale">
                    <!-- Overlay de Sécurité -->
                    <div id="org-lock-overlay" class="absolute inset-0 z-20 bg-slate-900/5 backdrop-blur-[2px] flex items-center justify-center">
                        <div class="bg-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span class="text-xs font-black uppercase text-slate-700 tracking-widest italic">Qualification Leader Requise</span>
                        </div>
                    </div>

                    <div class="flex justify-between items-start mb-8 text-left italic">
                        <div class="flex gap-4 italic text-left">
                            <div id="org-icon-bg" class="p-3 rounded-2xl text-white italic shadow-lg bg-slate-400 transition-colors duration-500">
                                <svg id="org-icon-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></svg>
                            </div>
                            <div>
                                <h3 class="font-black italic uppercase text-lg text-slate-900 leading-tight italic">6. Organisation des ventes</h3>
                                <p id="org-label" class="text-[10px] uppercase font-bold mt-1 leading-none italic text-slate-400">Section Verrouillée (5%)</p>
                            </div>
                        </div>
                        <div class="text-right italic">
                            <p id="display-leadingVolume" class="text-3xl font-black italic tabular-nums leading-none text-slate-400">0 SV</p>
                            <p class="text-[9px] font-black text-slate-300 uppercase mt-1 italic leading-none">Volume Profondeur</p>
                        </div>
                    </div>
                    <input id="leadingVolume" type="range" min="0" max="500000" step="1000" value="0" disabled class="w-full h-2 rounded-full appearance-none bg-slate-100 cursor-pointer italic transition-all duration-500 text-slate-400" oninput="calculate()">
                    <div class="grid grid-cols-5 gap-2 mt-8 italic text-left" id="org-buttons">
                        <!-- Boutons générés par JS -->
                    </div>
                </div>
            </div>

            <!-- SECTION DROITE : BILAN -->
            <div class="lg:col-span-5 italic">
                <div class="bg-[#0f172a] rounded-[4rem] p-10 text-white shadow-2xl min-h-[850px] flex flex-col text-left italic border border-white/5 sticky top-8">
                    <div class="flex-1 space-y-10 italic">
                        <div class="flex items-center gap-4 italic leading-none">
                            <div class="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 font-black italic leading-none">€</div>
                            <h3 class="font-black uppercase tracking-[0.3em] text-[10px] text-slate-500 italic leading-none">Bilan Commissions Net</h3>
                        </div>

                        <div class="space-y-8 italic">
                            <div class="flex justify-between items-center italic border-b border-white/5 pb-6">
                                <div class="leading-none italic"><p class="text-slate-400 font-bold text-[10px] uppercase mb-1">Selling Bonus (N1)</p><p class="text-sm font-bold text-slate-200 italic">Ventes Directes</p></div>
                                <p id="res-selling" class="text-2xl font-black italic tabular-nums text-indigo-400">0,00 €</p>
                            </div>
                            <div class="flex justify-between items-center italic border-b border-white/5 pb-6">
                                <div class="leading-none italic"><p class="text-slate-400 font-bold text-[10px] uppercase mb-1">Referring Bonus (Réseau)</p><p class="text-sm font-bold text-slate-200 italic">L1 + CN2</p></div>
                                <p id="res-referring" class="text-2xl font-black italic tabular-nums text-blue-400">0,00 €</p>
                            </div>
                            
                            <div id="res-br-card" class="p-6 rounded-[2.5rem] border-2 transition-all italic opacity-20 border-white/5 grayscale">
                                <div class="flex justify-between items-center italic">
                                    <div class="leading-none italic"><p class="text-emerald-400 font-black text-[10px] uppercase mb-1">Building Bonus</p><p id="res-br-rate" class="text-lg font-bold italic text-white italic leading-none">0%</p></div>
                                    <p id="res-br" class="text-2xl font-black italic text-emerald-400 tabular-nums">0,00 €</p>
                                </div>
                            </div>

                            <div id="res-ldr-card" class="p-6 rounded-[2.5rem] border-2 transition-all italic opacity-10 border-white/5">
                                <div class="flex justify-between items-center italic">
                                    <div class="leading-none italic"><p class="text-purple-400 font-black text-[10px] uppercase mb-1">Leading Bonus</p><p class="text-lg font-bold italic text-white leading-none italic">Organisation</p></div>
                                    <p id="res-leader" class="text-2xl font-black italic text-slate-600 line-through opacity-50">0,00 €</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-10 border-t border-white/10 mt-auto text-left">
                        <p class="text-slate-500 font-black uppercase text-[10px] mb-4 italic leading-none">Total Prévisionnel Net</p>
                        <h4 id="grand-total" class="text-5xl font-black italic transition-all tabular-nums leading-none mb-10 text-white">0,00 €</h4>
                        
                        <div class="space-y-4 italic">
                            <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                <span id="label-target">Objectif : 0€</span>
                                <span id="label-percent">0%</span>
                            </div>
                            <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0 italic">
                                <div id="progress-bar" class="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-1000" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const MULTIPLIER_HT = 1.2;
        const RATIO_BR_NET = 282.16 / 3018.60;
        const RATIO_LDR_NET = 2181.10 / 47557.29;

        const getBracket = (sv) => {
            const val = Number(sv) || 0;
            if (val < 250) return { s: 0.04, r: 0.00 };
            if (val < 500) return { s: 0.04, r: 0.04 };
            if (val < 2500) return { s: 0.08, r: 0.12 };
            if (val < 10000) return { s: 0.12, r: 0.16 };
            return { s: 0.20, r: 0.24 };
        };

        function formatEuro(val) {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val || 0);
        }

        function calculate() {
            const targetIncome = parseFloat(document.getElementById('targetIncome').value) || 0;
            const personalSv = parseInt(document.getElementById('personalSv').value) || 0;
            const n1Clients = parseInt(document.getElementById('n1Clients').value) || 0;
            const n1SvPerClient = parseInt(document.getElementById('n1SvPerClient').value) || 0;
            const l1Partners = parseInt(document.getElementById('l1Partners').value) || 0;
            const l1PartnerVolume = parseInt(document.getElementById('l1PartnerVolume').value) || 0;
            const n2Clients = parseInt(document.getElementById('n2Clients').value) || 0;
            const n2SvPerClient = parseInt(document.getElementById('n2SvPerClient').value) || 0;
            const leadingVolume = parseInt(document.getElementById('leadingVolume').value) || 0;

            const svN1 = n1Clients * n1SvPerClient;
            const svL1 = l1Partners * l1PartnerVolume;
            const svN2 = n2Clients * n2SvPerClient;
            const networkSv = svL1 + svN2;
            const totalGsv = personalSv + svN1 + networkSv;

            const isBrQualified = totalGsv >= 2000;
            const isLeadingQualified = totalGsv >= 3000;

            const bracket = getBracket(svN1);
            const gainSelling = (svN1 * MULTIPLIER_HT) * bracket.s;
            const gainReferring = (networkSv * MULTIPLIER_HT) * bracket.r;

            let brTotal = 0; let brRate = 0;
            if(totalGsv >= 3000) { brRate = 0.10; brTotal = totalGsv * RATIO_BR_NET; }
            else if(totalGsv >= 2000) { brRate = 0.05; brTotal = totalGsv * (RATIO_BR_NET / 2); }

            const leaderTotal = isLeadingQualified ? (leadingVolume * RATIO_LDR_NET) : 0;
            const grandTotal = gainSelling + gainReferring + brTotal + leaderTotal;

            // --- UI Updates ---
            document.getElementById('display-personalSv').innerText = personalSv + " SV";
            document.getElementById('display-svN1').innerText = svN1.toLocaleString() + " SV";
            document.getElementById('display-n1Clients').innerText = n1Clients;
            document.getElementById('display-n1SvPerClient').innerText = n1SvPerClient + " SV";
            document.getElementById('display-svNetwork').innerText = networkSv.toLocaleString() + " SV";
            document.getElementById('display-l1Partners').innerText = l1Partners;
            document.getElementById('display-l1PartnerVolume').innerText = l1PartnerVolume + " SV";
            document.getElementById('display-n2Clients').innerText = n2Clients;
            document.getElementById('display-n2SvPerClient').innerText = n2SvPerClient + " SV";
            document.getElementById('display-totalGsv').innerText = totalGsv.toLocaleString();
            document.getElementById('display-leadingVolume').innerText = leadingVolume.toLocaleString() + " SV";

            document.getElementById('selling-badge').innerText = `Selling: ${Math.round(bracket.s * 100)}%`;
            document.getElementById('referring-badge').innerText = `Referring: ${Math.round(bracket.r * 100)}%`;

            // Bloc Sécurité Cercle Groupe
            const cardGsv = document.getElementById('card-gsv');
            const gsvStatus = document.getElementById('gsv-status');
            const gsvIcon = document.getElementById('gsv-icon');
            const gsvAlert = document.getElementById('gsv-alert');
            const gsvMessage = document.getElementById('gsv-message');

            if(isLeadingQualified) {
                cardGsv.className = "p-8 rounded-[3.5rem] border-2 transition-all duration-700 italic text-left bg-emerald-50 border-emerald-200 shadow-xl";
                gsvStatus.innerText = "Qualification Leader OK";
                gsvStatus.className = "text-[10px] font-black uppercase tracking-widest text-emerald-600";
                gsvIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>`;
                document.getElementById('display-totalGsv').className = "text-4xl font-black tabular-nums leading-none text-emerald-600";
                gsvAlert.classList.add('hidden');
            } else {
                cardGsv.className = "p-8 rounded-[3.5rem] border-2 transition-all duration-700 italic text-left bg-amber-50 border-amber-100 shadow-lg";
                gsvStatus.innerText = "Seuil 3000 SV Requis";
                gsvStatus.className = "text-[10px] font-black uppercase tracking-widest text-amber-600";
                gsvIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
                document.getElementById('display-totalGsv').className = "text-4xl font-black tabular-nums leading-none text-amber-600";
                gsvAlert.classList.remove('hidden');
                gsvMessage.innerHTML = `Manque <span class="font-black">${(3000 - totalGsv).toLocaleString()} SV</span> pour débloquer l'Organisation.`;
            }

            // Bloc Organisation (Styles de Rangs)
            const cardOrg = document.getElementById('card-org');
            const orgLock = document.getElementById('org-lock-overlay');
            const orgIconBg = document.getElementById('org-icon-bg');
            const orgIconSvg = document.getElementById('org-icon-svg');
            const orgLabel = document.getElementById('org-label');
            const orgSlider = document.getElementById('leadingVolume');
            const displayLdr = document.getElementById('display-leadingVolume');

            if(!isLeadingQualified) {
                orgLock.classList.remove('hidden');
                orgSlider.disabled = true;
                orgSlider.className = "w-full h-2 rounded-full appearance-none bg-slate-100 cursor-pointer text-slate-400";
                orgIconBg.className = "p-3 rounded-2xl text-white italic shadow-lg bg-slate-400";
                orgLabel.innerText = "Section Verrouillée (5%)";
                orgLabel.className = "text-[10px] uppercase font-bold mt-1 leading-none italic text-slate-400";
                displayLdr.className = "text-3xl font-black italic tabular-nums leading-none text-slate-400";
                orgIconSvg.innerHTML = `<path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>`;
            } else {
                orgLock.classList.add('hidden');
                orgSlider.disabled = false;
                
                let accent = 'bg-purple-600', text = 'text-purple-600', card = 'bg-white border-purple-100 shadow-purple-50', label = 'Organisation';
                if (leadingVolume >= 40000) { accent = 'bg-amber-500'; text = 'text-amber-600'; card = 'bg-amber-50 border-amber-200 shadow-amber-100'; label = 'Team Élite'; }
                else if (leadingVolume >= 30000) { accent = 'bg-indigo-700'; text = 'text-indigo-800'; card = 'bg-indigo-50 border-indigo-200 shadow-indigo-100'; label = 'Diamant Bleu'; }
                else if (leadingVolume >= 20000) { accent = 'bg-cyan-500'; text = 'text-cyan-600'; card = 'bg-cyan-50 border-cyan-200 shadow-cyan-100'; label = 'Diamant'; }
                else if (leadingVolume >= 10000) { accent = 'bg-emerald-500'; text = 'text-emerald-600'; card = 'bg-emerald-50 border-emerald-200 shadow-emerald-100'; label = 'Émeraude'; }
                else if (leadingVolume >= 5000) { accent = 'bg-rose-500'; text = 'text-rose-600'; card = 'bg-rose-50 border-rose-200 shadow-rose-100'; label = 'Rubis'; }

                cardOrg.className = `p-8 rounded-[4rem] border-2 transition-all duration-500 italic relative overflow-hidden shadow-2xl text-left ${card}`;
                orgIconBg.className = `p-3 rounded-2xl text-white italic shadow-lg transition-colors duration-500 ${accent}`;
                orgLabel.innerText = `${label} (5%)`;
                orgLabel.className = `text-[10px] uppercase font-bold mt-1 leading-none italic ${text}`;
                displayLdr.className = `text-3xl font-black italic tabular-nums leading-none ${text}`;
                orgSlider.className = `w-full h-2 rounded-full appearance-none bg-slate-100 cursor-pointer italic transition-all duration-500 accent-current ${text}`;
                
                if(leadingVolume >= 5000) {
                    orgIconSvg.innerHTML = `<path d="M12 15l-2 5l2-1l2 1l-2-5z"/><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>`;
                } else {
                    orgIconSvg.innerHTML = `<path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>`;
                }
            }

            // Bilan Commissions
            document.getElementById('res-selling').innerText = formatEuro(gainSelling);
            document.getElementById('res-referring').innerText = formatEuro(gainReferring);
            
            const resBrCard = document.getElementById('res-br-card');
            document.getElementById('res-br-rate').innerText = Math.round(brRate * 100) + "%";
            document.getElementById('res-br').innerText = formatEuro(brTotal);
            resBrCard.className = `p-6 rounded-[2.5rem] border-2 transition-all italic text-left ${isBrQualified ? 'bg-white/5 border-emerald-500/20 shadow-emerald-900/10 opacity-100 grayscale-0' : 'opacity-20 border-white/5 grayscale'}`;

            const resLdrCard = document.getElementById('res-ldr-card');
            const resLdrVal = document.getElementById('res-leader');
            if(isLeadingQualified) {
                resLdrCard.className = "p-6 rounded-[2.5rem] border-2 transition-all italic text-left bg-white/5 border-purple-500/20 shadow-purple-900/10 opacity-100";
                resLdrVal.innerText = formatEuro(leaderTotal);
                resLdrVal.className = "text-2xl font-black italic tabular-nums leading-none text-purple-400";
            } else {
                resLdrCard.className = "p-6 rounded-[2.5rem] border-2 transition-all italic text-left opacity-10 border-white/5 grayscale";
                resLdrVal.innerText = formatEuro(leaderTotal);
                resLdrVal.className = "text-2xl font-black italic tabular-nums leading-none text-slate-600 line-through opacity-50";
            }

            const grandTotalEl = document.getElementById('grand-total');
            grandTotalEl.innerText = formatEuro(grandTotal);
            if(grandTotal >= targetIncome && targetIncome > 0) {
                grandTotalEl.className = "text-5xl font-black italic transition-all tabular-nums leading-none mb-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]";
            } else {
                grandTotalEl.className = "text-5xl font-black italic transition-all tabular-nums leading-none mb-10 text-white";
            }

            document.getElementById('label-target').innerText = `Objectif : ${targetIncome}€`;
            const percent = targetIncome > 0 ? Math.min(100, Math.round((grandTotal / targetIncome) * 100)) : 0;
            document.getElementById('label-percent').innerText = percent + "%";
            document.getElementById('progress-bar').style.width = percent + "%";

            updateOrgButtons(isLeadingQualified, leadingVolume);
        }

        function updateOrgButtons(isQualified, currentVolume) {
            const container = document.getElementById('org-buttons');
            container.innerHTML = '';
            const tiers = [5, 10, 20, 30, 40];
            const colors = { 5: 'rose', 10: 'emerald', 20: 'cyan', 30: 'indigo', 40: 'amber' };
            const labels = { 5: 'Rubis', 10: 'Émeraude', 20: 'Diamant', 30: 'D. Bleu', 40: 'T. Élite' };

            tiers.forEach(k => {
                const btn = document.createElement('button');
                const vol = k * 1000;
                let classes = "py-2 rounded-xl text-[9px] font-black border-2 transition-all italic ";
                
                if (!isQualified) {
                    classes += "cursor-not-allowed border-slate-100 text-slate-200";
                    btn.disabled = true;
                } else if (currentVolume >= vol) {
                    const c = colors[k];
                    const bgMap = { rose: 'bg-rose-500', emerald: 'bg-emerald-500', cyan: 'bg-cyan-500', indigo: 'bg-indigo-700', amber: 'bg-amber-500' };
                    classes += `${bgMap[c]} border-transparent text-white shadow-md`;
                } else {
                    classes += "bg-white border-slate-100 text-slate-300 hover:border-slate-200";
                }

                btn.className = classes;
                btn.innerText = labels[k];
                btn.onclick = () => {
                    document.getElementById('leadingVolume').value = vol;
                    calculate();
                };
                container.appendChild(btn);
            });
        }

        function handleAutoRoute() {
            const income = parseFloat(document.getElementById('targetIncome').value) || 0;
            if(income <= 0) return;

            document.getElementById('personalSv').value = 200;
            document.getElementById('n1Clients').value = 15;
            document.getElementById('n1SvPerClient').value = 100;
            document.getElementById('l1Partners').value = 4;
            document.getElementById('l1PartnerVolume').value = 500;
            document.getElementById('n2Clients').value = 20;
            document.getElementById('n2SvPerClient').value = 50;

            const fixedGain = (1500 * 1.2 * 0.12) + (3000 * 1.2 * 0.16) + (4700 * RATIO_BR_NET);
            const needed = Math.max(0, Math.ceil((income - fixedGain) / RATIO_LDR_NET));
            document.getElementById('leadingVolume').value = needed;
            
            calculate();
        }

        calculate();
    </script>
</body>
</html>
