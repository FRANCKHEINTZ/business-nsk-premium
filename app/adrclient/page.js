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
    <title>Simulateur ADR - Nu Skin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fcfcfd; -webkit-print-color-adjust: exact; }
        .row-active { transition: all 0.3s ease; }
        .row-locked { opacity: 0.4; filter: grayscale(1); pointer-events: none; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .gradient-main { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
        
        #copy-notification {
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
            transform: translateY(20px);
            opacity: 0;
        }
        #copy-notification.show {
            transform: translateY(0);
            opacity: 1;
        }

        .linear-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 90px;
        }

        @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .max-w-6xl { max-width: 100% !important; }
        }
    </style>
</head>
<body class="p-4 md:p-8 text-slate-900">

    <div class="max-w-6xl mx-auto space-y-6">
        
        <div class="bg-slate-900 text-white px-6 py-3 rounded-2xl text-center shadow-lg text-[10px] font-black uppercase tracking-widest italic">
            🚀 Simulateur de Fidélité ADR - Exclusivement Client au Détail
        </div>

        <header class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center space-y-4">
            <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">VOTRE PLAN CADEAUX ADR</h1>
            <p class="text-slate-500 text-sm font-medium italic">
                Commande minimum requise : <span class="text-blue-600 font-extrabold">79,65 €</span> (soit 50 points SV)
            </p>
            
            <div class="flex flex-wrap justify-center gap-3 pt-2">
                <div class="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-blue-100 shadow-sm">
                    🎯 Seuil : 79,65 € (50 SV) min.
                </div>
                <div class="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-slate-100">🚀 Plafond : 75 Pts / mois</div>
                <div class="bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl text-[9px] font-black uppercase border border-slate-100">💰 Max : 900 Pts / an</div>
            </div>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
            <div class="md:col-span-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex">
                <button onclick="setFreq('mensuel')" id="btn-m" class="flex-1 py-4 rounded-xl font-black text-[10px] transition-all bg-blue-600 text-white shadow-lg uppercase">Mensuel (20-30%)</button>
                <button onclick="setFreq('bimestriel')" id="btn-b" class="flex-1 py-4 rounded-xl font-black text-[10px] transition-all text-slate-400 hover:bg-slate-50 uppercase">Bimestriel (10%)</button>
            </div>
            <button onclick="resetAll()" class="bg-white border border-slate-100 py-4 rounded-2xl text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Réinitialiser
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="gradient-main text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border-b-8 border-blue-600">
                <span class="text-[10px] uppercase font-black opacity-50 tracking-widest italic text-blue-400">Solde Actuel Cagnotte</span>
                <div class="text-6xl font-black mt-2 tracking-tighter" id="display-pts">0.00 <span class="text-lg opacity-30">PTS</span></div>
                <svg class="absolute -right-8 -bottom-8 opacity-10" width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12v10H4V12M2 7h20v5H2V7m10-5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/></svg>
            </div>
            <div class="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 relative overflow-hidden border-b-8 border-emerald-500">
                <span class="text-[10px] uppercase font-black text-slate-400 tracking-widest italic">Valeur Shopping Restante</span>
                <div class="text-5xl font-black mt-2 text-emerald-600 tracking-tighter" id="display-val">0,00 €</div>
                <div id="display-equiv" class="text-[10px] font-black text-slate-400 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-full border border-slate-100 uppercase italic">Equivalent : 0 Pts</div>
                <div class="absolute top-10 right-10 text-emerald-50 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30 no-print">
                <h3 class="font-black uppercase text-[10px] tracking-widest text-slate-500">Flux de vos points produits</h3>
                <button onclick="copySourceCode()" class="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm transition-all flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    Extraire Code HTML
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[950px]">
                    <thead>
                        <tr class="bg-slate-50/50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th class="p-6 w-16 text-center italic">Mois</th>
                            <th class="p-6">Ma Commande (€)</th>
                            <th class="p-6 text-center text-blue-600 bg-blue-50/30">Points Gagnés (+)</th>
                            <th class="p-6 text-center text-orange-600 bg-orange-50/30">Dépenses (-)</th>
                            <th class="p-6 text-center text-slate-900 bg-slate-100/50">Solde Restant (=)</th>
                        </tr>
                    </thead>
                    <tbody id="table-body"></tbody>
                </table>
            </div>
        </div>

        <button onclick="window.print()" class="no-print w-full py-8 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all shadow-2xl text-[10px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 active:scale-95">
            Imprimer mon plan de fidélité personnalisé
        </button>
    </div>

    <div id="copy-notification" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-2xl z-50 pointer-events-none">
        🚀 Code HTML copié ! Prêt à être enregistré.
    </div>

    <script>
        const COEFF = 1.5931; 
        const MIN_SV = 50;
        const MIN_EURO = 79.65;
        const MAX_PTS_M = 75;
        const MAX_PTS_A = 900;
        const MOIS = 15;

        let frequency = 'mensuel';
        let inputsOrder = Array(MOIS).fill('');
        let inputsUsed = Array(MOIS).fill('');

        function init() {
            const tbody = document.getElementById('table-body');
            tbody.innerHTML = '';
            for (let i = 0; i < MOIS; i++) {
                const row = document.createElement('tr');
                row.id = `row-${i}`;
                row.className = "border-b border-slate-50 transition-all";
                row.innerHTML = `
                    <td class="p-6 font-black text-slate-200 text-2xl text-center italic">${i + 1}</td>
                    <td class="p-6">
                        <div class="flex flex-col gap-2">
                            <div id="box-order-${i}" class="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-400 transition-all">
                                <input type="text" inputmode="decimal" oninput="updateOrder(${i}, this.value)" placeholder="0.00" class="w-full bg-transparent font-black text-slate-800 outline-none text-xl">
                                <span class="text-slate-300 font-black">€</span>
                            </div>
                            <div class="flex justify-between px-1 h-3">
                                <span id="sv-${i}" class="text-[9px] font-black text-blue-500 italic uppercase"></span>
                                <span id="err-${i}" class="text-[8px] font-black text-red-500 uppercase"></span>
                            </div>
                        </div>
                    </td>
                    <td class="p-6 bg-blue-50/10">
                        <div class="linear-cell">
                            <span id="gain-${i}" class="text-2xl font-black text-slate-100">—</span>
                            <span id="label-${i}" class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase mt-1 hidden shadow-sm"></span>
                        </div>
                    </td>
                    <td class="p-6 bg-orange-50/10">
                        <div class="linear-cell">
                            <div id="box-used-${i}" class="hidden flex flex-col items-center gap-1">
                                <div class="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-orange-100 bg-white focus-within:border-orange-400 transition-all shadow-sm">
                                    <input type="text" inputmode="decimal" oninput="updateUsed(${i}, this.value)" placeholder="0.0" class="w-14 bg-transparent font-black text-orange-600 outline-none text-lg text-center">
                                    <span class="text-orange-300 font-black text-[10px] uppercase">Pts</span>
                                </div>
                                <span id="max-used-label-${i}" class="text-[8px] font-black text-orange-400 uppercase italic">Libre : 0.0</span>
                            </div>
                            <span id="no-points-msg-${i}" class="text-slate-100 text-2xl font-black">—</span>
                        </div>
                    </td>
                    <td class="p-6 bg-slate-50/30">
                        <div class="linear-cell">
                            <div id="badge-${i}" class="flex flex-col items-center px-4 py-2 rounded-xl font-black transition-all opacity-0">
                                <div id="val-${i}" class="text-2xl leading-none">0.00</div>
                                <div class="text-[8px] uppercase opacity-40 mt-1 font-bold tracking-widest italic">Solde</div>
                            </div>
                            <span id="no-balance-msg-${i}" class="text-slate-100 text-2xl font-black">—</span>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            }
        }

        function updateOrder(idx, val) {
            inputsOrder[idx] = val.replace(',', '.');
            calc();
        }

        function updateUsed(idx, val) {
            inputsUsed[idx] = val.replace(',', '.');
            calc();
        }

        function setFreq(f) {
            frequency = f;
            document.getElementById('btn-m').className = f === 'mensuel' ? "flex-1 py-4 rounded-xl font-black text-[10px] transition-all bg-blue-600 text-white shadow-lg uppercase" : "flex-1 py-4 rounded-xl font-black text-[10px] transition-all text-slate-400 hover:bg-slate-50 uppercase";
            document.getElementById('btn-b').className = f === 'bimestriel' ? "flex-1 py-4 rounded-xl font-black text-[10px] transition-all bg-slate-800 text-white shadow-lg uppercase" : "flex-1 py-4 rounded-xl font-black text-[10px] transition-all text-slate-400 hover:bg-slate-50 uppercase";
            calc();
        }

        function resetAll() {
            inputsOrder = Array(MOIS).fill('');
            inputsUsed = Array(MOIS).fill('');
            const inputs_dom = document.querySelectorAll('input');
            inputs_dom.forEach(i => i.value = '');
            calc();
        }

        function calc() {
            let balance = 0;
            let lastIdxWithData = -1;

            for(let k=0; k<MOIS; k++) {
                if (parseFloat(inputsOrder[k]) > 0) lastIdxWithData = k;
            }

            for (let i = 0; i < MOIS; i++) {
                const monthNum = i + 1;
                const isOff = frequency === 'bimestriel' && monthNum % 2 === 0;
                const valOrder = parseFloat(inputsOrder[i]) || 0;
                const sv = valOrder / COEFF;
                
                const availableBeforeThisMonth = balance;
                let used = parseFloat(inputsUsed[i]) || 0;
                
                if (used > availableBeforeThisMonth) used = availableBeforeThisMonth;
                balance -= used;

                let earned = 0;
                let rate = 0;

                if (!isOff && valOrder > 0) {
                    if (frequency === 'bimestriel') {
                        rate = 0.1;
                        if (sv >= MIN_SV) earned = Math.min(sv * rate, MAX_PTS_M);
                    } else if (sv >= MIN_SV) {
                        rate = monthNum >= 13 ? 0.3 : 0.2;
                        earned = Math.min(sv * rate, MAX_PTS_M);
                    }
                }

                balance += earned;
                if (balance > MAX_PTS_A) balance = MAX_PTS_A;
                if (balance < 0) balance = 0;
                
                const row = document.getElementById(`row-${i}`);
                row.className = `border-b border-slate-50 transition-all ${isOff && inputsOrder[i] === '' ? 'row-locked' : 'row-active'} ${monthNum === 13 && frequency === 'mensuel' ? 'bg-amber-50/20' : ''}`;
                
                const boxOrder = document.getElementById(`box-order-${i}`);
                if (inputsOrder[i] !== '') {
                    boxOrder.className = `flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all bg-white shadow-md ${sv >= MIN_SV ? 'border-blue-600' : 'border-red-400'}`;
                } else {
                    boxOrder.className = "flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 focus-within:border-blue-400 transition-all";
                }

                document.getElementById(`sv-${i}`).innerText = valOrder > 0 ? `${sv.toFixed(2)} SV` : '';
                document.getElementById(`err-${i}`).innerText = (valOrder > 0 && sv < MIN_SV) ? `MINIMUM ${MIN_EURO} € REQUIS` : '';

                // Column Gain
                const g = document.getElementById(`gain-${i}`);
                const l = document.getElementById(`label-${i}`);
                if (earned > 0) {
                    g.innerText = `+${earned.toFixed(2)}`;
                    g.className = "text-2xl font-black text-blue-600";
                    l.innerText = `${(rate*100).toFixed(0)}% RETOUR`;
                    l.className = `px-2 py-0.5 rounded-full text-[8px] font-black uppercase mt-1 block shadow-sm ${rate === 0.3 ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-600'}`;
                    l.classList.remove('hidden');
                } else {
                    g.innerText = '—'; g.className = "text-2xl font-black text-slate-100"; l.classList.add('hidden');
                }

                // Column Used
                const boxUsedContainer = document.getElementById(`box-used-${i}`);
                const noPointsMsg = document.getElementById(`no-points-msg-${i}`);
                if (availableBeforeThisMonth > 0 && i <= lastIdxWithData) {
                    boxUsedContainer.classList.remove('hidden');
                    noPointsMsg.classList.add('hidden');
                    document.getElementById(`max-used-label-${i}`).innerText = `LIBRE : ${availableBeforeThisMonth.toFixed(1)}`;
                } else {
                    boxUsedContainer.classList.add('hidden');
                    noPointsMsg.classList.remove('hidden');
                }

                // Column Balance
                const badge = document.getElementById(`badge-${i}`);
                const noBalanceMsg = document.getElementById(`no-balance-msg-${i}`);
                if (i <= lastIdxWithData && (inputsOrder[i] !== '' || i > 0)) {
                    document.getElementById(`val-${i}`).innerText = balance.toFixed(2);
                    badge.className = `flex flex-col items-center px-4 py-2 rounded-xl font-black transition-all ${balance > 0 ? 'bg-slate-900 text-white shadow-lg border-b-4 border-emerald-500' : 'text-slate-400 border border-slate-100 bg-white'}`;
                    badge.style.opacity = "1";
                    noBalanceMsg.classList.add('hidden');
                } else {
                    badge.style.opacity = "0";
                    noBalanceMsg.classList.remove('hidden');
                }
            }

            document.getElementById('display-pts').innerHTML = `${balance.toFixed(2)} <span class="text-lg opacity-30">PTS</span>`;
            document.getElementById('display-val').innerText = (balance * COEFF).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
            document.getElementById('display-equiv').innerText = `Equivalent : ${balance.toFixed(2)} Pts`;
        }

        function copySourceCode() {
            const code = document.documentElement.outerHTML;
            const tempInput = document.createElement("textarea");
            tempInput.value = code;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            const notif = document.getElementById('copy-notification');
            notif.classList.add('show');
            setTimeout(() => notif.classList.remove('show'), 3000);
        }

        window.onload = init;
    </script>
</body>
</html>
