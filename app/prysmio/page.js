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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    
    <!-- META POUR MODE APPLICATION (PWA) -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="PRYSM io">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#4f46e5">

    <title>PRYSM io Simulateur</title>
    
    <!-- CHARGEMENT DES RESSOURCES EXTERNES -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            -webkit-tap-highlight-color: transparent;
            overscroll-behavior-y: contain;
            background-color: #f1f5f9;
        }
        .font-black-italic { font-weight: 900; font-style: italic; text-transform: uppercase; }
        
        /* Animations */
        @keyframes move-stripe { from { background-position: 0 0; } to { background-position: 80px 0; } }
        .animate-stripe { 
            background-size: 40px 40px; 
            background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); 
            animation: move-stripe 4s linear infinite; 
        }
        
        /* Custom Inputs */
        input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type='range'] { -webkit-appearance: none; background: transparent; }
        input[type='range']::-webkit-slider-thumb { 
            -webkit-appearance: none; height: 36px; width: 36px; border-radius: 50%; background: #ef4444; 
            box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3); cursor: pointer; border: 5px solid white; margin-top: -14px; 
        }
        input[type='range']::-webkit-slider-runnable-track { width: 100%; height: 8px; background: #e2e8f0; border-radius: 10px; }
        
        /* Navigation Tabs */
        .tab-active { background-color: #4f46e5; color: white; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3); }
        .tab-inactive { color: #94a3b8; }
        .tab-inactive:hover { color: #4f46e5; background-color: #ffffff; }
        .btn-reset { color: #ef4444; border: 2px solid transparent; transition: all 0.3s ease; }
        .btn-reset:hover { background-color: #fef2f2; border-color: #fecaca; transform: scale(1.05); }
        
        .hidden-section { display: none; }
        
        /* Affichage Chiffres Dynamiques */
        .impact-text-size { font-size: clamp(1.5rem, 5vw, 4rem); line-height: 1.1; }
        .no-wrap { white-space: nowrap; }
    </style>
</head>
<body class="text-slate-900 tracking-tight font-black-italic p-4 md:p-8 lg:p-12">

    <div class="max-w-7xl mx-auto">
        <!-- HEADER PRINCIPAL -->
        <header class="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div class="space-y-6">
                <div class="flex items-center gap-4">
                    <div class="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl rotate-3">
                        <i data-lucide="zap" class="w-8 h-8"></i>
                    </div>
                    <div>
                        <h1 class="text-4xl md:text-5xl tracking-tighter leading-none italic font-black uppercase">
                            PRYSM io <span class="text-indigo-600">Simulateur</span>
                        </h1>
                        <p class="text-[10px] text-slate-400 tracking-[0.4em] mt-2 uppercase italic">Business Strategic Engine v4.7</p>
                    </div>
                </div>
                
                <nav class="flex p-1.5 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white w-fit overflow-x-auto gap-1">
                    <button onclick="switchTab('simulator')" id="btn-simulator" class="tab-active flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all duration-300 no-wrap">
                        <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Simulateur
                    </button>
                    <button onclick="switchTab('roadmap')" id="btn-roadmap" class="tab-inactive flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all duration-300 no-wrap">
                        <i data-lucide="target" class="w-4 h-4"></i> Objectifs
                    </button>
                    <button onclick="switchTab('impact')" id="btn-impact" class="tab-inactive flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] transition-all duration-300 no-wrap">
                        <i data-lucide="trending-up" class="w-4 h-4"></i> Impact
                    </button>
                    <button onclick="resetAll()" class="btn-reset flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] no-wrap font-black">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i> Reset
                    </button>
                </nav>
            </div>

            <!-- CARTE SCORE GLOBAL -->
            <div class="relative group min-w-[320px] md:min-w-[400px]">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 blur-[60px] opacity-20 scale-110"></div>
                <div class="relative bg-slate-950 p-8 rounded-[4rem] shadow-2xl border border-slate-800 text-center overflow-hidden">
                    <p class="text-[10px] text-indigo-400 tracking-[0.5em] mb-4 opacity-70 italic font-black uppercase">Net Global Estimé</p>
                    <p id="display-total-gain" class="text-5xl md:text-6xl text-white tracking-tighter italic font-black">0,00 €</p>
                    <div class="mt-6 flex items-center justify-center gap-3 bg-white/5 border border-white/10 py-2 px-6 rounded-full mx-auto w-fit font-black italic">
                        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span class="text-[9px] text-white/70 tracking-widest uppercase italic font-black">Calcul PRYSM temps réel</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- SECTION 1 : SIMULATEUR -->
        <main id="section-simulator" class="grid grid-cols-1 xl:grid-cols-3 gap-10">
            <div class="xl:col-span-2 space-y-10">
                <!-- VENTES NIVEAU 1 -->
                <div class="bg-white rounded-[3.5rem] shadow-sm border border-white overflow-hidden">
                    <div class="p-8 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between bg-slate-50/30 gap-4">
                        <h2 class="text-slate-800 text-[11px] tracking-[0.3em] flex items-center gap-4 underline decoration-indigo-300 underline-offset-8 font-black uppercase">
                            <i data-lucide="package" class="w-5 h-5 text-indigo-600"></i> Inventaire Niveau 1
                        </h2>
                        <div class="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] tracking-widest shadow-lg uppercase italic font-black" id="badge-direct-sv">0 SV</div>
                    </div>
                    <div class="overflow-x-auto font-black-italic">
                        <table class="w-full text-left text-[11px] tracking-widest min-w-[500px]">
                            <thead class="bg-slate-50/80 text-slate-400 font-black">
                                <tr>
                                    <th class="px-10 py-8 uppercase">Désignation</th>
                                    <th class="px-6 py-8 text-center uppercase">SV</th>
                                    <th class="px-6 py-8 text-center w-32 uppercase">Qté</th>
                                    <th class="px-10 py-8 text-right uppercase">Marge HT</th>
                                </tr>
                            </thead>
                            <tbody id="products-tbody"></tbody>
                        </table>
                    </div>
                    <div class="bg-indigo-50/50 p-10 flex justify-between items-center border-t border-indigo-100 font-black italic">
                        <span class="text-indigo-900/40 text-[10px] tracking-widest uppercase">Total Marges Directes</span>
                        <span id="display-total-margin" class="text-indigo-600 text-3xl md:text-4xl tracking-tighter font-black italic uppercase">0,00 €</span>
                    </div>
                </div>

                <!-- PERFORMANCE RESEAU -->
                <div class="bg-slate-950 rounded-[3.5rem] p-8 md:p-14 shadow-2xl border border-slate-800 text-white relative overflow-hidden group font-black-italic">
                    <div class="relative z-10 space-y-12">
                        <div class="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-8 gap-4">
                            <h2 class="uppercase text-[10px] tracking-[0.4em] text-indigo-400 flex items-center gap-5">
                                <i data-lucide="layers" class="w-5 h-5"></i> Performance Réseau
                            </h2>
                            <div class="bg-indigo-600/20 text-indigo-400 px-6 py-2 rounded-full text-[9px] tracking-widest border border-indigo-600/30 italic font-black" id="badge-cumul-direct">CUMUL N1+N2 : 0 SV</div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-10 uppercase italic font-black">
                            <div class="space-y-6">
                                <label class="text-[10px] text-slate-500 tracking-widest ml-4 uppercase">Niveau 2 (Affiliés)</label>
                                <input type="number" id="input-n2" oninput="calculate()" class="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center focus:border-purple-500 focus:bg-white/10 italic font-black" placeholder="0">
                            </div>
                            <div class="space-y-6 relative">
                                <div class="flex items-center justify-between ml-4">
                                    <label class="text-[10px] text-slate-500 tracking-widest uppercase">Volume Groupe</label>
                                    <div id="lock-group"><i data-lucide="lock" class="w-3 h-3 text-red-500"></i></div>
                                </div>
                                <div class="relative">
                                    <input type="number" id="input-group" oninput="calculate()" class="w-full bg-white/5 border-2 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center italic font-black" placeholder="0" disabled>
                                    <div id="overlay-group" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span class="bg-red-600/90 text-white text-[8px] px-3 py-1 rounded-full tracking-tighter uppercase font-black">2k Direct requis</span>
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-6 relative">
                                <div class="flex items-center justify-between ml-4">
                                    <label class="text-[10px] text-slate-500 tracking-widest uppercase">Volume Équipe</label>
                                    <div id="lock-equipe"><i data-lucide="lock" class="w-3 h-3 text-red-500"></i></div>
                                </div>
                                <div class="relative">
                                    <input type="number" id="input-equipe" oninput="calculate()" class="w-full bg-white/5 border-2 rounded-[2rem] px-6 py-8 text-4xl outline-none transition-all text-white text-center italic font-black" placeholder="0" disabled>
                                    <div id="overlay-equipe" class="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
                                        <span class="bg-red-600/90 text-white text-[8px] px-3 py-1 rounded-full tracking-tighter uppercase font-black">3k Groupe requis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SIDEBAR RECAPITULATIF -->
            <div class="space-y-10 uppercase italic font-black">
                <div class="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white sticky top-8">
                    <h2 class="text-xl mb-12 flex items-center gap-4 border-b border-slate-100 pb-10 tracking-[0.1em] text-slate-950 underline decoration-indigo-200 decoration-[4px] underline-offset-[12px]">
                        <i data-lucide="star" class="w-8 h-8 text-indigo-600"></i> Récapitulatif
                    </h2>
                    
                    <div class="space-y-8">
                        <!-- SECTION MARGES -->
                        <div class="space-y-4">
                            <span class="text-[9px] text-slate-400 tracking-[0.3em] font-black uppercase">Bénéfice Ventes</span>
                            <div class="flex justify-between items-center px-4 py-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 font-black italic">
                                <span class="text-[10px]">Marges Directes</span>
                                <span id="sidebar-total-margin" class="text-xl text-indigo-600 font-black">0,00 €</span>
                            </div>
                        </div>

                        <!-- SECTION COMMISSIONS -->
                        <div class="space-y-4 border-t border-slate-50 pt-8">
                            <span class="text-[9px] text-slate-400 tracking-[0.3em] font-black uppercase">Commissions Points</span>
                            <div class="space-y-6 text-[10px] tracking-[0.1em]">
                                <div class="flex justify-between items-center">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-slate-400 font-black">Selling Bonus</span>
                                        <span id="meta-selling" class="text-[8px] bg-slate-100 px-2 py-0.5 rounded font-black w-fit uppercase text-slate-600">4%</span>
                                    </div>
                                    <span id="com-selling" class="text-base text-slate-950 font-black italic">0,00 €</span>
                                </div>
                                <div id="row-referring" class="flex justify-between items-center opacity-20 grayscale transition-all">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-slate-400 font-black">Referring Bonus</span>
                                        <span id="meta-referring" class="text-[8px] bg-slate-100 px-2 py-0.5 rounded font-black w-fit uppercase text-slate-600">Off</span>
                                    </div>
                                    <span id="com-referring" class="text-base text-slate-950 font-black italic">0,00 €</span>
                                </div>
                                <div id="row-group" class="flex justify-between items-center opacity-20 grayscale transition-all">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-slate-400 font-black">Groupe Bonus</span>
                                        <span id="meta-group" class="text-[8px] bg-slate-100 px-2 py-0.5 rounded font-black w-fit uppercase text-slate-600">Bloqué</span>
                                    </div>
                                    <span id="com-group" class="text-base text-slate-950 font-black italic">0,00 €</span>
                                </div>
                                <div id="row-equipe" class="flex justify-between items-center opacity-20 grayscale transition-all">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-slate-400 font-black">Équipe Bonus</span>
                                        <span id="meta-equipe" class="text-[8px] bg-slate-100 px-2 py-0.5 rounded font-black w-fit uppercase text-slate-600">Bloqué</span>
                                    </div>
                                    <span id="com-equipe" class="text-base text-slate-950 font-black italic">0,00 €</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pt-16 border-t-4 border-slate-50 text-center">
                        <p class="text-slate-400 text-[11px] uppercase tracking-[0.4em] mb-10 opacity-40 italic font-black">Versement Net Total</p>
                        <div class="bg-slate-950 p-10 rounded-[3rem] shadow-xl border-4 border-indigo-600/30 font-black italic uppercase">
                            <p id="sidebar-total-gain" class="text-5xl text-white tracking-tighter font-black italic">0,00 €</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- SECTION 2 : ROADMAP -->
        <main id="section-roadmap" class="hidden-section animate-in fade-in italic uppercase font-black">
            <div class="bg-white rounded-[4rem] shadow-2xl border border-white p-10 md:p-16 space-y-16">
                <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-12 gap-8 font-black uppercase italic">
                    <div>
                        <h2 class="text-4xl md:text-5xl font-black tracking-tighter mb-4 uppercase no-wrap italic">Roadmap Points SV</h2>
                        <p class="text-base text-slate-400 tracking-widest border-l-8 border-indigo-500 pl-6 uppercase font-black">Synthèse Performance Globale</p>
                    </div>
                    <div class="p-10 bg-slate-950 rounded-[3rem] text-center min-w-[300px] shadow-xl border-b-8 border-indigo-600 font-black italic">
                        <p class="text-[10px] text-indigo-400 tracking-[0.5em] mb-2 opacity-70 uppercase font-black">Volume Cumulé (N+E)</p>
                        <p id="display-cumul-global" class="text-5xl text-white tracking-tighter font-black italic">0 SV</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-12 font-black italic uppercase">
                    <div class="bg-slate-50/50 p-10 md:p-12 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group font-black italic uppercase">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                            <h3 class="text-2xl md:text-3xl tracking-tight no-wrap font-black uppercase">
                                <span class="underline decoration-indigo-200 decoration-4 underline-offset-8">Groupe</span>
                                <span class="text-lg opacity-30 ml-2 italic font-black">: Objectif 3k SV</span>
                            </h3>
                            <div class="text-right no-wrap flex items-center justify-end font-black italic uppercase">
                                <span id="progress-group-current" class="text-5xl md:text-6xl text-indigo-600 tracking-tighter font-black">0</span>
                                <span class="text-slate-300 mx-4 text-2xl font-black">/</span>
                                <span class="text-xl text-slate-400 tracking-widest font-black uppercase italic">3 000 SV</span>
                            </div>
                        </div>
                        <div class="relative h-10 w-full bg-slate-200 rounded-[2rem] overflow-hidden shadow-inner p-1.5 border-4 border-white font-black">
                            <div id="progress-group-bar" class="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-[1.5rem] transition-all duration-[2000ms] animate-stripe font-black italic" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="bg-slate-50/50 p-10 md:p-16 rounded-[4rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group font-black italic uppercase">
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6 font-black uppercase italic">
                            <h3 class="text-2xl md:text-3xl tracking-tight no-wrap font-black uppercase">
                                <span class="underline decoration-indigo-200 decoration-4 underline-offset-8">Équipe</span>
                                <span class="text-lg opacity-30 ml-2 italic font-black">: Objectif 10k SV</span>
                            </h3>
                            <div class="text-right no-wrap flex items-center justify-end font-black italic uppercase">
                                <span id="progress-equipe-current" class="text-5xl md:text-7xl text-indigo-600 tracking-tighter font-black italic">0</span>
                                <span class="text-slate-300 mx-4 text-2xl font-black italic">/</span>
                                <span class="text-xl md:text-2xl text-slate-400 tracking-widest italic font-black uppercase">10 000 SV</span>
                            </div>
                        </div>
                        <div class="relative h-10 w-full bg-slate-200 rounded-[2rem] overflow-hidden shadow-inner p-1.5 border-4 border-white font-black">
                            <div id="progress-equipe-bar" class="h-full bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[1.5rem] transition-all duration-[2500ms] animate-stripe font-black italic" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- SECTION 3 : ANALYSE IMPACT -->
        <main id="section-impact" class="hidden-section animate-in fade-in uppercase font-black italic">
            <div class="bg-white rounded-[4rem] shadow-2xl border border-white p-8 md:p-16 space-y-16 font-black italic uppercase">
                <div class="flex items-center gap-6 md:gap-10 border-b border-slate-100 pb-12 uppercase font-black italic">
                    <div class="h-20 w-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center shadow-inner">
                        <i data-lucide="alert-triangle" class="w-10 h-10"></i>
                    </div>
                    <div>
                        <h2 class="text-3xl md:text-5xl tracking-tighter mb-2 italic uppercase whitespace-nowrap font-black">Levier Déblocage</h2>
                        <p class="text-sm md:text-lg text-slate-400 tracking-widest border-l-8 border-red-500 pl-6 uppercase italic font-black">Seuil 3 000 SV = Profits Maximisés</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 italic font-black uppercase">
                    <div class="space-y-12 font-black italic uppercase">
                        <div class="bg-slate-50/80 p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-inner font-black uppercase italic">
                            <div class="flex justify-between items-center mb-10">
                                <h3 class="text-lg font-black tracking-widest text-slate-800 uppercase font-black italic">Volume Groupe (GSV)</h3>
                                <div id="impact-group-badge" class="px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black italic shadow-lg bg-red-500 text-white font-black uppercase">0 SV</div>
                            </div>
                            <div class="relative pt-8 pb-6 px-2 font-black uppercase italic">
                                <input type="range" id="slider-impact-group" min="0" max="5000" step="50" value="0" oninput="syncImpactSlider(this.value)" class="w-full h-8 bg-slate-200 rounded-full appearance-none cursor-pointer accent-red-600 font-black">
                                <div class="absolute top-0 left-0 w-full flex justify-between text-[9px] tracking-[0.2em] text-slate-400 font-black uppercase italic">
                                    <span>Base</span>
                                    <span class="text-indigo-600 font-black underline decoration-indigo-200 uppercase italic">CIBLE : 3 000 SV</span>
                                    <span>Elite</span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-slate-950 rounded-[3rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden group uppercase font-black italic">
                            <div class="flex items-center gap-4 mb-10 text-indigo-400 tracking-widest font-black uppercase italic">
                                <i data-lucide="users" class="w-6 h-6"></i>
                                <h4 class="text-xl md:text-2xl font-black uppercase italic">Volume Équipe (Org)</h4>
                            </div>
                            <div class="relative flex items-center justify-center min-h-[120px] font-black uppercase px-2">
                                <input type="number" id="input-impact-org" oninput="syncImpactOrg(this.value)" class="bg-white/5 border-2 border-white/10 rounded-[2rem] px-4 py-8 text-4xl md:text-5xl text-center text-white italic outline-none focus:border-indigo-500 transition-all w-full tracking-tighter font-black uppercase" placeholder="0">
                            </div>
                        </div>
                    </div>

                    <div id="impact-result-card" class="flex flex-col gap-10 font-black italic uppercase font-black"></div>
                </div>
            </div>
        </main>

        <footer class="mt-16 pb-12 border-t border-slate-200 pt-16 flex flex-col md:flex-row justify-between items-center gap-10 text-[11px] font-black uppercase text-slate-400 tracking-[0.5em] italic">
            <div class="flex items-center gap-6 font-black italic uppercase">
                <div class="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981] animate-pulse"></div>
                <span>PRYSM io Platinum Engine v4.7</span>
            </div>
            <span class="opacity-30 uppercase font-black italic uppercase">Strategic Intelligence System © Strategy Partners Global</span>
        </footer>
    </div>

    <script>
        // --- CONFIGURATION CONSTANTES ---
        const REFERRING_BA_FACTOR = 1.20; 
        const TEAM_YIELD_PER_SV = 0.045863;    
        const GROUP_YIELD_10_PER_SV = 0.0934733; 
        const GROUP_YIELD_5_PER_SV = GROUP_YIELD_10_PER_SV / 2;
        const VVC_RATE = 0.82;
        const LEADING_RATE = 0.05;

        const PRODUCTS = [
            { id: 1, name: "Beauty Focus (ADR)", clientHT: 52.32, baHT: 40.25, sv: 36.19 },
            { id: 2, name: "Collagene (ADR)", clientHT: 76.71, baHT: 58.99, sv: 50.80 },
            { id: 3, name: "LifePack", clientHT: 102.96, baHT: 79.04, sv: 67.45 },
            { id: 4, name: "JVI (Gibi)", clientHT: 103.27, baHT: 79.49, sv: 66.50 }, 
            { id: 5, name: "Beauty Duo ADR", clientHT: 123.79, baHT: 95.22, sv: 76.48 }, 
            { id: 6, name: "LifePack MarinOmega ADR", clientHT: 130.22, baHT: 100.05, sv: 67.45 }, 
            { id: 7, name: "Pack Essentiel ADR", clientHT: 211.81, baHT: 162.84, sv: 126.70 },
        ];

        let quantities = {};
        PRODUCTS.forEach(p => quantities[p.id] = 0);

        function formatEuro(val) {
            return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
        }
        function formatSV(val) {
            return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(val) + ' SV';
        }

        // RESET COMPLET ROBUSTE
        function resetAll() {
            // Remise à zéro des données internes
            PRODUCTS.forEach(p => quantities[p.id] = 0);
            
            // Vidage de tous les inputs de l'application
            document.querySelectorAll('input').forEach(input => {
                if (input.type === "number") {
                    input.value = "";
                } else if (input.type === "range") {
                    input.value = 0;
                }
            });

            // Recalcul immédiat
            calculate();
            
            // Retour forcé au premier onglet
            switchTab('simulator');
        }

        // NAVIGATION TABS + RESET SCROLL
        function switchTab(tabId) {
            document.querySelectorAll('main').forEach(el => el.classList.add('hidden-section'));
            document.getElementById('section-' + tabId).classList.remove('hidden-section');
            
            document.querySelectorAll('nav button').forEach(el => {
                el.classList.remove('tab-active');
                el.classList.add('tab-inactive');
            });
            const activeBtn = document.getElementById('btn-' + tabId);
            if(activeBtn) {
                activeBtn.classList.remove('tab-inactive');
                activeBtn.classList.add('tab-active');
            }
            
            // SAUT DE PAGE : Retour immédiat au sommet
            window.scrollTo({ top: 0, behavior: 'instant' });
            lucide.createIcons();
        }

        // RENDER TABLE
        const tbody = document.getElementById('products-tbody');
        PRODUCTS.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-indigo-50/10 transition-all group duration-300 uppercase italic font-black";
            tr.innerHTML = `
                <td class="px-8 md:px-10 py-8">
                    <p class="text-slate-950 text-base mb-1 font-black group-hover:text-indigo-700 uppercase italic font-black">${p.name}</p>
                    <p class="text-[9px] text-slate-400 uppercase font-black italic">BA HT: ${formatEuro(p.baHT)}</p>
                </td>
                <td class="px-6 py-8 text-center text-indigo-600 font-black italic">${p.sv}</td>
                <td class="px-6 py-8 text-center">
                    <input type="number" oninput="updateQty(${p.id}, this.value)" class="product-input w-20 md:w-24 bg-slate-100/50 border-2 border-transparent rounded-[1.5rem] px-4 py-3 text-center font-black text-lg focus:bg-white focus:border-indigo-600 outline-none shadow-inner transition-all italic font-black" placeholder="0">
                </td>
                <td id="margin-${p.id}" class="px-8 md:px-10 py-8 text-right text-emerald-600 text-lg font-black italic">0,00 €</td>
            `;
            tbody.appendChild(tr);
        });

        function updateQty(id, val) {
            quantities[id] = val === "" ? 0 : parseInt(val);
            calculate();
        }

        function syncImpactSlider(val) {
            document.getElementById('input-group').value = val;
            calculate();
        }
        function syncImpactOrg(val) {
            document.getElementById('input-equipe').value = val;
            calculate();
        }

        function calculate() {
            let directSV = 0;
            let totalMargin = 0;
            let totalBaHTDirect = 0;
            let buildingRate = 0;

            PRODUCTS.forEach(p => {
                const q = quantities[p.id];
                const margin = (p.clientHT - p.baHT) * q;
                const svTotal = p.sv * q;
                const baHTTotal = p.baHT * q;
                const marginCell = document.getElementById(`margin-${p.id}`);
                if(marginCell) marginCell.innerText = formatEuro(margin);
                directSV += svTotal;
                totalMargin += margin;
                totalBaHTDirect += baHTTotal;
            });

            const n2SV = parseFloat(document.getElementById('input-n2').value) || 0;
            const groupSV = parseFloat(document.getElementById('input-group').value) || 0;
            const orgSV = parseFloat(document.getElementById('input-equipe').value) || 0;

            const totalVolumeDirect = directSV + n2SV;
            const isGroupUnlocked = totalVolumeDirect >= 2000;
            const canLead = isGroupUnlocked && groupSV >= 3000;

            const inputGroup = document.getElementById('input-group');
            const inputEquipe = document.getElementById('input-equipe');
            
            if (isGroupUnlocked) {
                inputGroup.disabled = false;
                inputGroup.classList.remove('opacity-30');
                document.getElementById('overlay-group').style.display = 'none';
                document.getElementById('lock-group').innerHTML = '<i data-lucide="unlock" class="w-3 h-3 text-emerald-500"></i>';
                buildingRate = (groupSV >= 3000) ? 0.10 : 0.05;
            } else {
                inputGroup.disabled = true;
                inputGroup.classList.add('opacity-30');
                document.getElementById('overlay-group').style.display = 'flex';
                document.getElementById('lock-group').innerHTML = '<i data-lucide="lock" class="w-3 h-3 text-red-500"></i>';
                buildingRate = 0;
            }

            if (canLead) {
                inputEquipe.disabled = false;
                inputEquipe.classList.remove('opacity-30');
                document.getElementById('overlay-equipe').style.display = 'none';
                document.getElementById('lock-equipe').innerHTML = '<i data-lucide="unlock" class="w-3 h-3 text-emerald-500"></i>';
            } else {
                inputEquipe.disabled = true;
                inputEquipe.classList.add('opacity-30');
                document.getElementById('overlay-equipe').style.display = 'flex';
                document.getElementById('lock-equipe').innerHTML = '<i data-lucide="lock" class="w-3 h-3 text-red-500"></i>';
            }

            let sellRate = 0.04;
            let refRate = 0;
            if (directSV >= 10000) { sellRate = 0.20; refRate = 0.24; }
            else if (directSV >= 2500) { sellRate = 0.16; refRate = 0.20; }
            else if (directSV >= 500) { sellRate = 0.08; refRate = 0.12; }
            else if (directSV >= 250) { sellRate = 0.04; refRate = 0.04; }

            const sellingBonus = directSV * REFERRING_BA_FACTOR * sellRate;
            const referringBonus = n2SV * REFERRING_BA_FACTOR * refRate;
            const buildingBonus = groupSV * (buildingRate === 0.10 ? GROUP_YIELD_10_PER_SV : (buildingRate === 0.05 ? GROUP_YIELD_5_PER_SV : 0));
            const leadingBonus = canLead ? (orgSV * TEAM_YIELD_PER_SV) : 0;
            const totalGains = totalMargin + sellingBonus + referringBonus + buildingBonus + leadingBonus;

            // UI
            document.getElementById('badge-direct-sv').innerText = formatSV(directSV);
            document.getElementById('display-total-margin').innerText = formatEuro(totalMargin);
            document.getElementById('sidebar-total-margin').innerText = formatEuro(totalMargin);
            document.getElementById('display-total-gain').innerText = formatEuro(totalGains);
            document.getElementById('sidebar-total-gain').innerText = formatEuro(totalGains);
            document.getElementById('badge-cumul-direct').innerText = "CUMUL N1+N2 : " + formatSV(totalVolumeDirect);

            document.getElementById('meta-selling').innerText = (sellRate * 100) + "%";
            document.getElementById('com-selling').innerText = formatEuro(sellingBonus);
            
            const rowRef = document.getElementById('row-referring');
            if (refRate > 0) {
                rowRef.classList.remove('opacity-20', 'grayscale');
                document.getElementById('meta-referring').innerText = (refRate * 100) + "%";
            } else {
                rowRef.classList.add('opacity-20', 'grayscale');
                document.getElementById('meta-referring').innerText = "Off";
            }
            document.getElementById('com-referring').innerText = formatEuro(referringBonus);

            const rowGrp = document.getElementById('row-group');
            if (buildingRate > 0) {
                rowGrp.classList.remove('opacity-20', 'grayscale');
                document.getElementById('meta-group').innerText = (buildingRate * 100) + "%";
            } else {
                rowGrp.classList.add('opacity-20', 'grayscale');
                document.getElementById('meta-group').innerText = "Bloqué";
            }
            document.getElementById('com-group').innerText = formatEuro(buildingBonus);

            const rowLd = document.getElementById('row-equipe');
            if (canLead) {
                rowLd.classList.remove('opacity-20', 'grayscale');
                document.getElementById('meta-equipe').innerText = "Lead 5%";
            } else {
                rowLd.classList.add('opacity-20', 'grayscale');
                document.getElementById('meta-equipe').innerText = "Bloqué";
            }
            document.getElementById('com-equipe').innerText = formatEuro(leadingBonus);

            document.getElementById('display-cumul-global').innerText = formatSV(groupSV + orgSV);
            document.getElementById('progress-group-current').innerText = Math.round(groupSV);
            document.getElementById('progress-equipe-current').innerText = Math.round(orgSV);
            document.getElementById('progress-group-bar').style.width = Math.min((groupSV / 3000) * 100, 100) + "%";
            document.getElementById('progress-equipe-bar').style.width = Math.min((orgSV / 10000) * 100, 100) + "%";

            document.getElementById('slider-impact-group').value = groupSV;
            const impactBadge = document.getElementById('impact-group-badge');
            impactBadge.innerText = formatSV(groupSV);
            if (canLead) impactBadge.className = "px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black italic shadow-lg transition-all bg-emerald-500 text-white italic font-black uppercase";
            else if (buildingRate > 0) impactBadge.className = "px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black italic shadow-lg transition-all bg-orange-500 text-white italic font-black uppercase";
            else impactBadge.className = "px-6 py-3 rounded-2xl text-2xl md:text-3xl font-black italic shadow-lg transition-all bg-red-500 text-white italic font-black uppercase";

            document.getElementById('input-impact-org').value = orgSV || "";
            const impactResultCard = document.getElementById('impact-result-card');
            
            if (!canLead) {
                const potLead = orgSV * TEAM_YIELD_PER_SV;
                const upgradeGrp = groupSV * (GROUP_YIELD_10_PER_SV - GROUP_YIELD_5_PER_SV);
                const totalLoss = potLead + upgradeGrp;
                const missing = Math.max(0, 3000 - groupSV);
                impactResultCard.innerHTML = `
                    <div class="flex-1 bg-red-50 border-4 border-red-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center animate-pulse shadow-xl uppercase italic font-black">
                        <i data-lucide="trending-down" class="w-12 h-12 text-red-500 mb-6"></i>
                        <h4 class="text-lg md:text-xl font-black mb-4 italic uppercase">Perte Potentielle</h4>
                        <p class="text-red-950 impact-text-size font-black tracking-tighter mb-10 drop-shadow-md leading-none italic font-black">-${formatEuro(totalLoss)}</p>
                        <div class="w-full space-y-4 pt-8 border-t border-red-200/50 text-[11px] uppercase italic font-black">
                            <div class="flex justify-between text-red-700 tracking-widest italic font-black">
                                <span>Upgrade (10%) :</span>
                                <span class="text-red-900">-${formatEuro(upgradeGrp)}</span>
                            </div>
                            <div class="flex justify-between text-red-700 tracking-widest italic font-black">
                                <span>Équipe (5%) :</span>
                                <span class="text-red-900">-${formatEuro(potLead)}</span>
                            </div>
                        </div>
                        <p class="mt-10 text-[9px] text-red-500 tracking-[0.3em] font-black underline uppercase italic font-black">IL MANQUE ${formatSV(missing)} DANS LE GROUPE</p>
                    </div>
                `;
            } else {
                impactResultCard.innerHTML = `
                    <div class="flex-1 bg-emerald-50 border-4 border-emerald-100 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-xl transform scale-105 font-black italic uppercase">
                        <i data-lucide="arrow-up-circle" class="w-12 h-12 text-emerald-500 mb-6 animate-bounce font-black italic uppercase"></i>
                        <h4 class="text-lg md:text-xl font-black mb-4 uppercase italic font-black">Gain Actif</h4>
                        <p class="text-emerald-950 impact-text-size font-black tracking-tighter mb-10 drop-shadow-md leading-none font-black uppercase italic">+${formatEuro(buildingBonus + leadingBonus)}</p>
                        <div class="flex items-center gap-4 bg-emerald-500 text-white px-8 py-3 rounded-[2rem] text-[12px] tracking-[0.4em] shadow-lg italic font-black uppercase italic font-black">
                            <i data-lucide="check-circle-2" class="w-5 h-5 italic font-black uppercase"></i> 3 000 SV ATTEINTS
                        </div>
                    </div>
                `;
            }
            lucide.createIcons();
        }

        window.onload = () => {
            lucide.createIcons();
            calculate();
        };
    </script>
</body>
</html>
