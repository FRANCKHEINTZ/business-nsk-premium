<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- BLOC DE SÉCURITÉ -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  (function() {
    function clean(s) { 
        if (!s) return "";
        return s.toString()
            .replace(/\[|\]/g, '')
            .replace(/\(.*\)/g, '')
            .replace(/[\u201C\u201D\u2018\u2019\u0022\u0027]/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .replace(/\s+/g, '')
            .trim(); 
    }

    const S_URL = "https://rbmzmduojlxdzfgmolly.supabase.co";
    const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXptZHVvamx4ZHpmZ21vbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTY3NDMsImV4cCI6MjA4OTM5Mjc0M30.plryXDY6786ct7TLIlh-DGWiCWi8OtQA9Te7LgsHz3E";
    
    let sc;
    try {
        if (typeof supabase !== 'undefined') {
            sc = supabase.createClient(S_URL, S_KEY);
        }
    } catch (e) { console.error("Erreur d'initialisation:", e); }

    async function check() {
      if (!sc) return;
      try {
        const { data } = await sc.auth.getSession();
        const isSafeEnv = window.location.hostname.includes('goog') || 
                          window.location.hostname.includes('localhost') ||
                          window.location.protocol === 'file:' || 
                          window.location.protocol === 'blob:';
        if ((!data || !data.session) && !isSafeEnv) {
          document.documentElement.innerHTML = ""; 
          window.location.href = "index.html";     
        }
      } catch (e) { }
    }
    check();
  })();
</script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulateur de Gains 2026</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            -webkit-tap-highlight-color: transparent;
            color: #0f172a; /* Texte gris très foncé */
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=range] { cursor: pointer; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .accent-indigo { accent-color: #4338ca; }
        .accent-blue { accent-color: #2563eb; }
        .accent-emerald { accent-color: #059669; }
        .accent-violet { accent-color: #7c3aed; }
    </style>
</head>
<body class="bg-[#F8FAFC] min-h-screen p-4 md:p-8">

    <div class="max-w-6xl mx-auto">
        <!-- HEADER -->
        <header class="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200">
            <div class="flex items-center gap-4 text-slate-950">
                <div class="w-14 h-14 bg-gradient-to-br from-indigo-700 to-blue-800 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div>
                    <h1 class="text-3xl font-black tracking-tighter uppercase leading-none">Simulateur de <span class="text-indigo-700">gains 2026</span></h1>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic text-slate-700">(hors marge revente)</p>
                </div>
            </div>

            <div class="flex items-center gap-4 w-full lg:w-auto">
                <button onclick="resetValues()" class="p-4 bg-slate-100 text-slate-900 hover:text-indigo-700 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm border border-slate-200" title="Réinitialiser">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                </button>
                <div class="flex-1 lg:flex-none bg-gradient-to-r from-slate-950 to-indigo-950 text-white px-10 py-6 rounded-[2.5rem] shadow-2xl flex flex-col items-end border border-slate-800">
                    <span class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-1 italic text-right text-nowrap">TOTAL DES GAINS (HT)</span>
                    <span class="text-5xl font-black tracking-tighter flex items-center">
                        <span id="display-total">0,00</span>
                        <span class="text-2xl font-normal text-slate-500 ml-1">€</span>
                    </span>
                </div>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- SECTION GAUCHE : SAISIE -->
            <div class="lg:col-span-7 space-y-4">
                
                <!-- Vente Directe -->
                <div class="p-8 rounded-[2.5rem] border border-indigo-200 bg-indigo-50/70 shadow-sm">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Vente Directe (DCSV)</label>
                            <div class="flex items-baseline gap-2 text-slate-950">
                                <input type="number" id="sv_direct" oninput="updateAll()" class="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-indigo-900" placeholder="0">
                                <span class="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        <span id="badge-tier" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md bg-slate-600 transition-all">Débutant</span>
                    </div>
                    <input type="range" id="range_direct" min="0" max="10000" step="10" oninput="syncRange('sv_direct', this.value)" class="w-full h-2 rounded-full appearance-none accent-indigo">
                </div>

                <!-- Partenaire -->
                <div class="p-8 rounded-[2.5rem] border border-blue-200 bg-blue-50/70 shadow-sm">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Partenaire (Niveau 2)</label>
                            <div class="flex items-baseline gap-2 text-slate-950">
                                <input type="number" id="sv_partenaire" oninput="updateAll()" class="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-blue-900" placeholder="0">
                                <span class="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        <span id="badge-ref" class="hidden px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md bg-blue-600">0%</span>
                    </div>
                    <input type="range" id="range_partenaire" min="0" max="20000" step="10" oninput="syncRange('sv_partenaire', this.value)" class="w-full h-2 rounded-full appearance-none accent-blue">
                </div>

                <!-- Cercle Groupe -->
                <div class="p-8 rounded-[2.5rem] border border-emerald-200 bg-emerald-50/70 shadow-sm">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Cercle Groupe</label>
                            <div class="flex items-baseline gap-2 text-slate-950">
                                <input type="number" id="sv_cercle" oninput="updateAll()" class="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-emerald-900" placeholder="0">
                                <span class="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                        <div id="badge-cercle" class="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm font-black text-[10px] uppercase transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span>Seuil 2000</span>
                        </div>
                    </div>
                    <input type="range" id="range_cercle" min="0" max="10000" step="10" oninput="syncRange('sv_cercle', this.value)" class="w-full h-2 rounded-full appearance-none accent-emerald">
                </div>

                <!-- Organisation -->
                <div class="p-8 rounded-[2.5rem] border border-violet-200 bg-violet-50/70 shadow-sm">
                    <div class="flex justify-between items-start gap-4 mb-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-slate-900 uppercase tracking-widest block ml-1">Organisation</label>
                            <div class="flex items-baseline gap-2 text-slate-950">
                                <input type="number" id="sv_organisation" oninput="updateAll()" class="text-5xl font-black outline-none bg-transparent w-full max-w-[200px] tracking-tighter text-violet-900" placeholder="0">
                                <span class="text-xl font-black uppercase opacity-30">SV</span>
                            </div>
                        </div>
                    </div>
                    <input type="range" id="range_organisation" min="0" max="50000" step="10" oninput="syncRange('sv_organisation', this.value)" class="w-full h-2 rounded-full appearance-none accent-violet">
                </div>
            </div>

            <!-- SECTION DROITE : RECAPITULATIF -->
            <div class="lg:col-span-5 lg:sticky lg:top-8">
                <div class="bg-white rounded-[3rem] p-8 md:p-10 space-y-8 shadow-xl border border-slate-200 relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <h3 class="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            Détail de vos Gains
                        </h3>
                    </div>

                    <div id="bonus-container" class="space-y-4">
                        <!-- Selling -->
                        <div id="card-selling" class="p-5 rounded-[2rem] border border-slate-200 bg-slate-50 opacity-20 transition-all duration-300">
                            <div class="flex justify-between items-center text-slate-900">
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-black uppercase tracking-widest block opacity-70">Selling Bonus</span>
                                    <span id="sub-selling" class="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">4% × 1.2</span>
                                </div>
                                <div class="text-right font-black"><span id="val-selling" class="text-2xl tracking-tighter">0,00</span><span class="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        <!-- Referring -->
                        <div id="card-referring" class="p-5 rounded-[2rem] border border-slate-200 bg-slate-50 opacity-20 transition-all duration-300">
                            <div class="flex justify-between items-center text-slate-900">
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-black uppercase tracking-widest block opacity-70">Referring Bonus</span>
                                    <span id="sub-referring" class="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">0% × 1.2</span>
                                </div>
                                <div class="text-right font-black"><span id="val-referring" class="text-2xl tracking-tighter">0,00</span><span class="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        <!-- Building -->
                        <div id="card-building" class="p-5 rounded-[2rem] border border-slate-200 bg-slate-50 opacity-20 transition-all duration-300">
                            <div class="flex justify-between items-center text-slate-900">
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-black uppercase tracking-widest block opacity-70">Building Bonus</span>
                                    <span id="sub-building" class="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">Seuil 2000 SV</span>
                                </div>
                                <div class="text-right font-black"><span id="val-building" class="text-2xl tracking-tighter">0,00</span><span class="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                        <!-- Leading -->
                        <div id="card-leading" class="p-5 rounded-[2rem] border border-slate-200 bg-slate-50 opacity-20 transition-all duration-300">
                            <div class="flex justify-between items-center text-slate-900">
                                <div class="space-y-0.5">
                                    <span class="text-[10px] font-black uppercase tracking-widest block opacity-70">Leading Bonus</span>
                                    <span id="sub-leading" class="text-[9px] font-bold uppercase tracking-widest text-slate-500 italic">Cercle requis (3k)</span>
                                </div>
                                <div class="text-right font-black"><span id="val-leading" class="text-2xl tracking-tighter">0,00</span><span class="text-sm ml-1 opacity-60">€</span></div>
                            </div>
                        </div>
                    </div>

                    <!-- Volume Total -->
                    <div class="pt-8 border-t border-slate-200">
                        <div class="flex justify-between items-center bg-slate-950 p-6 rounded-[2rem] text-white shadow-xl border border-slate-800">
                            <div class="space-y-1">
                                <span class="text-[10px] font-black uppercase tracking-widest block opacity-60">Volume (Cercle + Org)</span>
                                <p class="text-3xl font-black tracking-tighter"><span id="display-vol">0</span> <span class="text-sm font-normal text-slate-400 ml-1">SV</span></p>
                            </div>
                            <div class="p-3 bg-white/10 rounded-2xl text-indigo-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </div>
                        </div>
                    </div>

                    <!-- Alert Box -->
                    <div id="alert-cercle" class="hidden bg-amber-50 p-5 rounded-[2rem] border border-amber-200 flex items-center gap-4 shadow-sm animate-pulse">
                        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <div class="flex-1">
                            <p id="alert-title" class="text-[10px] font-black text-amber-900 uppercase leading-none mb-1 tracking-tighter">Accès Bonus</p>
                            <p id="alert-text" class="text-[13px] font-bold text-amber-700 leading-tight">Encore <span id="missing-sv" class="text-amber-950 font-black">0</span> SV en Cercle pour débloquer les 5%.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const COEF = { sell: 1.2, ref: 1.2, build: 0.9347333333, lead: 0.045863 };

        function getRates(dcsv) {
            if (dcsv >= 10000) return { s: 0.20, r: 0.24, tier: "Expert", color: "from-amber-500 to-orange-600" };
            if (dcsv >= 2500)  return { s: 0.12, r: 0.16, tier: "Elite", color: "from-indigo-600 to-purple-700" };
            if (dcsv >= 500)   return { s: 0.08, r: 0.12, tier: "Pro", color: "from-blue-600 to-indigo-700" };
            if (dcsv >= 250)   return { s: 0.04, r: 0.04, tier: "Actif", color: "from-emerald-500 to-teal-600" };
            return { s: 0.04, r: 0.00, tier: "", color: "from-slate-600 to-slate-700" };
        }

        function formatVal(val) {
            return val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function syncRange(id, val) {
            document.getElementById(id).value = val;
            updateAll();
        }

        function resetValues() {
            ['sv_direct', 'sv_partenaire', 'sv_cercle', 'sv_organisation'].forEach(id => {
                document.getElementById(id).value = "";
                document.getElementById('range_' + id.split('_')[1]).value = 0;
            });
            updateAll();
        }

        function updateCard(id, isActive, isLocked, val, colorClass, subText) {
            const card = document.getElementById(`card-${id}`);
            const valEl = document.getElementById(`val-${id}`);
            const subEl = document.getElementById(`sub-${id}`);

            valEl.innerText = formatVal(val);
            subEl.innerText = subText;

            if (!isActive && !isLocked) {
                card.className = "p-5 rounded-[2rem] border border-slate-100 bg-slate-50 opacity-20 grayscale transition-all";
                subEl.className = "text-[9px] font-bold uppercase tracking-widest text-slate-500 italic";
            } else if (isLocked) {
                card.className = "p-5 rounded-[2rem] border border-amber-200 bg-amber-50 opacity-100 shadow-sm transition-all";
                subEl.className = "text-[9px] font-black uppercase tracking-widest text-amber-700 italic";
            } else {
                const bgMap = {
                    indigo: "bg-indigo-50 border-indigo-200 text-indigo-950 shadow-sm",
                    blue: "bg-blue-50 border-blue-200 text-blue-950 shadow-sm",
                    emerald: "bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm",
                    violet: "bg-violet-50 border-violet-200 text-violet-950 shadow-sm"
                };
                card.className = `p-5 rounded-[2rem] border ${bgMap[id]} transition-all opacity-100`;
                subEl.className = `text-[9px] font-black uppercase tracking-widest text-slate-600 italic`;
            }
        }

        function updateAll() {
            const dcsv = parseFloat(document.getElementById('sv_direct').value) || 0;
            const l2sv = parseFloat(document.getElementById('sv_partenaire').value) || 0;
            const bsv = parseFloat(document.getElementById('sv_cercle').value) || 0;
            const lsv = parseFloat(document.getElementById('sv_organisation').value) || 0;

            document.getElementById('range_direct').value = dcsv;
            document.getElementById('range_partenaire').value = l2sv;
            document.getElementById('range_cercle').value = bsv;
            document.getElementById('range_organisation').value = lsv;

            const rates = getRates(dcsv);
            
            // --- LOGIQUE BUILDING & LEADING ---
            let bRate = 0;
            if (bsv >= 3000) bRate = 0.10;
            else if (bsv >= 2000) bRate = 0.05;

            const isBuildingActive = bRate > 0;
            const isLeadingUnlocked = bsv >= 3000;

            const selling = dcsv * rates.s * COEF.sell;
            const referring = l2sv * rates.r * COEF.ref;
            const building = isBuildingActive ? (bsv * bRate * COEF.build) : 0;
            const leading = isLeadingUnlocked ? (lsv * COEF.lead) : 0;
            const total = selling + referring + building + leading;

            document.getElementById('display-total').innerText = formatVal(total);
            document.getElementById('display-vol').innerText = (bsv + lsv).toLocaleString();

            // Badges
            const tierBadge = document.getElementById('badge-tier');
            tierBadge.innerText = rates.tier || "Débutant";
            tierBadge.className = `px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-md bg-gradient-to-r ${rates.color}`;
            tierBadge.style.opacity = rates.tier ? "1" : "0.5";

            const refBadge = document.getElementById('badge-ref');
            if (rates.r > 0) {
                refBadge.classList.remove('hidden');
                refBadge.innerText = (rates.r * 100) + "% Com.";
            } else {
                refBadge.classList.add('hidden');
            }

            const cercBadge = document.getElementById('badge-cercle');
            if (isLeadingUnlocked) {
                cercBadge.className = "flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500 bg-emerald-700 text-white shadow-md font-black text-[10px] uppercase transition-all";
                cercBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Validé 10%</span>';
            } else if (isBuildingActive) {
                cercBadge.className = "flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-400 bg-emerald-500 text-white shadow-sm font-black text-[10px] uppercase transition-all";
                cercBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Activé 5%</span>';
            } else {
                cercBadge.className = "flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm font-black text-[10px] uppercase transition-all";
                cercBadge.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><span>Seuil 2000</span>';
            }

            // Cards
            updateCard('selling', dcsv > 0, false, selling, 'indigo', `${rates.s * 100}% × 1.2`);
            updateCard('referring', rates.r > 0, false, referring, 'blue', `${rates.r * 100}% × 1.2`);
            updateCard('building', isBuildingActive, bsv > 0 && !isBuildingActive, building, 'emerald', isBuildingActive ? (bRate*100) + "% Validé" : "Seuil 2000 SV");
            updateCard('leading', isLeadingUnlocked && lsv > 0, lsv > 0 && !isLeadingUnlocked, leading, 'violet', isLeadingUnlocked ? "Leading 5%" : "Verrouillé (Cercle < 3k)");

            // Alert Box
            const alertBox = document.getElementById('alert-cercle');
            const alertText = document.getElementById('alert-text');
            const alertTitle = document.getElementById('alert-title');
            
            if (bsv > 0 && bsv < 3000) {
                alertBox.classList.remove('hidden');
                if (bsv < 2000) {
                    alertTitle.innerText = "Accès Bonus";
                    alertText.innerHTML = `Encore <span class="text-amber-950 font-black">${(2000 - bsv).toLocaleString()} SV</span> pour débloquer les 5%.`;
                } else {
                    alertTitle.innerText = "Accès Leader";
                    alertText.innerHTML = `Encore <span class="text-amber-950 font-black">${(3000 - bsv).toLocaleString()} SV</span> pour débloquer le 10% et l'Organisation.`;
                }
            } else {
                alertBox.classList.add('hidden');
            }
        }

        updateAll();
    </script>
</body>
</html>