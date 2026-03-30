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
    <title>Planificateur de Rentabilité ADR</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Inter', sans-serif; 
            background-color: #f8fafc; 
            -webkit-print-color-adjust: exact;
        }
        .no-print { display: block; }
        @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .max-w-6xl { max-width: 100% !important; }
        }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        
        .row-active { transition: background-color 0.3s ease; }
        .row-locked { opacity: 0.4; background-color: #f1f5f9; pointer-events: none; }
        
        .focus-ring:focus-within {
            ring: 4px;
            ring-color: rgba(37, 99, 235, 0.1);
            border-color: #2563eb;
        }

        .table-container {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f8fafc;
        }
    </style>
</head>
<body class="p-4 md:p-10 text-slate-900">

    <div id="main-app" class="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        <!-- HEADER -->
        <header class="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-slate-200 text-center space-y-4 relative">
            <div class="flex justify-center mb-2">
                <span class="bg-blue-600 text-white text-[9px] md:text-[10px] font-black px-4 md:px-5 py-1.5 md:py-2 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 text-center">
                    Espace Brand Affiliate & Membres
                </span>
            </div>
            <h1 class="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter italic text-center">Planificateur de Rentabilité ADR</h1>
            
            <div class="space-y-4">
                <p class="text-slate-500 text-xs md:text-sm font-bold text-center">Mesurez l'accumulation de vos avantages produits avec précision.</p>
                
                <div class="flex flex-wrap justify-center gap-3 md:gap-4 pt-2">
                    <div class="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-[9px] md:text-[10px] font-black uppercase tracking-wider italic">Seuil : 50 SV min (~61.25 €)</div>
                    <div class="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-[9px] md:text-[10px] font-black uppercase tracking-wider italic">Max : 75 pts/mois</div>
                    <div class="bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-[9px] md:text-[10px] font-black uppercase tracking-wider italic">Plafond : 900 pts/an</div>
                </div>
            </div>
        </header>

        <!-- CHOIX DU RYTHME -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 no-print">
            <button onclick="setFrequency('mensuel')" id="btn-mensuel" class="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all text-left border-blue-600 bg-white shadow-xl ring-4 ring-blue-50">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg md:text-2xl font-black uppercase tracking-tighter">Rythme Mensuel</h3>
                    <div class="bg-blue-600 text-white px-3 md:px-5 py-1.5 rounded-xl font-black text-sm md:text-lg text-center">20% ➔ 30%</div>
                </div>
                <p class="text-xs md:text-sm text-slate-500 mt-4 leading-snug">Gagnez 20% pendant 12 mois, puis profitez de <span class="text-blue-600 font-bold underline">30% à vie</span> dès le 13ème mois.</p>
            </button>

            <button onclick="setFrequency('bimestriel')" id="btn-bimestriel" class="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all text-left border-slate-200 bg-white opacity-60 hover:opacity-100">
                <div class="flex justify-between items-start">
                    <h3 class="text-lg md:text-2xl font-black uppercase tracking-tighter text-center text-left">Rythme Bimestriel</h3>
                    <div class="bg-slate-800 text-white px-3 md:px-5 py-1.5 rounded-xl font-black text-sm md:text-lg text-center">10%</div>
                </div>
                <p class="text-xs md:text-sm text-slate-500 mt-4 leading-snug font-bold">Un rythme espacé avec un gain constant de 10% en points cadeaux.</p>
            </button>
        </div>

        <!-- INDICATEURS -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div class="md:col-span-2 bg-slate-900 text-white rounded-[1.5rem] md:rounded-[2.5rem] p-8 shadow-xl border-b-8 border-blue-600 flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
                <div>
                    <span class="text-[9px] md:text-[10px] uppercase font-black text-blue-400 tracking-[0.2em] text-center md:text-left">Cagnotte de Points Restante</span>
                    <div class="text-4xl md:text-6xl font-black mt-1 text-center md:text-left" id="display-solde">0.00 <span class="text-xs md:text-sm opacity-40 font-normal">Pts</span></div>
                </div>
                <div class="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                    <span class="text-[9px] md:text-[10px] uppercase font-black text-emerald-400 tracking-[0.2em] text-center md:text-right">Valeur Estimée en Euros</span>
                    <div class="text-2xl md:text-3xl font-black text-emerald-400 mt-1 text-center md:text-right" id="display-euro-val">≈ 0.00 €</div>
                </div>
            </div>

            <button onclick="resetData()" class="bg-white border-2 border-red-50 text-red-500 rounded-[1.5rem] md:rounded-[2.5rem] p-6 flex flex-col items-center justify-center hover:bg-red-50 transition-all shadow-sm no-print text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-center"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                <span class="text-[10px] font-black uppercase mt-3 tracking-widest text-center">Réinitialiser</span>
            </button>
        </div>

        <!-- TABLEAU -->
        <div class="bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden text-center">
            <div class="overflow-x-auto table-container">
                <table class="w-full text-left border-collapse min-w-[850px] text-center">
                    <thead>
                        <tr class="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 text-center">
                            <th class="p-6 md:p-8 w-20 text-center">Mois</th>
                            <th class="p-6 md:p-8 min-w-[180px] text-center">Commande Payée (€)</th>
                            <th class="p-6 md:p-8 text-center text-blue-600 bg-blue-50/30 text-center">Nouveaux Points</th>
                            <th class="p-6 md:p-8 text-center text-emerald-600 bg-emerald-50/30 text-center">Cadeaux (Pts)</th>
                            <th class="p-6 md:p-8 text-right bg-slate-900 text-white text-right">Stock / Valeur Reçue</th>
                        </tr>
                    </thead>
                    <tbody id="table-body" class="text-sm font-bold text-center">
                        <!-- JS Render -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- FOOTER -->
        <div class="bg-slate-900 p-8 md:p-12 rounded-[1.5rem] md:rounded-[3.5rem] text-white shadow-2xl flex flex-col md:flex-row gap-8 text-left text-left">
           <div class="space-y-4 border-l-4 border-blue-500 pl-6 flex-1 text-left">
              <h4 class="font-black text-blue-400 uppercase text-xs tracking-[0.2em] text-left">Stratégie Mensuelle</h4>
              <ul class="text-xs md:text-sm space-y-2 text-slate-300 text-left">
                <li class="text-left">➔ 20% de retour points (Mois 1-12)</li>
                <li class="font-black text-white underline decoration-amber-500 underline-offset-4 text-left">➔ 30% définitif dès le 13ème mois</li>
              </ul>
           </div>
           <div class="space-y-4 border-l-4 border-slate-500 pl-6 flex-1 text-left">
              <h4 class="font-black text-slate-400 uppercase text-xs tracking-[0.2em] text-left">Option Bimestrielle</h4>
              <ul class="text-xs md:text-sm space-y-2 text-slate-300 text-left">
                <li class="text-left">➔ Souplesse d'achat 1 mois sur 2</li>
                <li class="text-left">➔ Taux constant de 10% sans progression</li>
              </ul>
           </div>
        </div>

    </div>

    <script>
        const COEFF = 1.225;
        const MIN_SV = 50;
        const MAX_PTS_MOIS = 75;
        const MAX_PTS_AN = 900;
        const NB_MOIS = 15;

        let frequency = 'mensuel';
        let monthlyData = { inputs: Array(NB_MOIS).fill(''), spent: Array(NB_MOIS).fill('') };
        let bimestrialData = { inputs: Array(NB_MOIS).fill(''), spent: Array(NB_MOIS).fill('') };

        function initTableStructure() {
            const tbody = document.getElementById('table-body');
            tbody.innerHTML = '';
            for (let i = 0; i < NB_MOIS; i++) {
                const row = document.createElement('tr');
                row.id = `row-${i}`;
                row.className = "border-b border-slate-50 hover:bg-slate-50/50 transition-all text-center";
                row.innerHTML = `
                    <td class="p-4 md:p-8 font-black text-slate-300 text-xl md:text-2xl text-center italic text-center">${i + 1}</td>
                    <td class="p-4 md:p-8 text-center">
                        <div id="container-input-${i}" class="space-y-1 text-center">
                            <div id="box-input-${i}" class="flex items-center gap-2 px-4 py-3 rounded-xl md:rounded-2xl border-2 transition-all border-slate-100 bg-slate-50 focus-ring text-center">
                                <input type="number" step="0.01" inputmode="decimal" id="input-price-${i}" oninput="handleUpdate(${i}, 'inputs')" placeholder="0.00" class="w-full bg-transparent font-black text-slate-800 outline-none text-xl md:text-2xl text-center text-center">
                                <span class="text-slate-300 text-sm md:text-lg font-black text-center text-center">€</span>
                            </div>
                            <div class="flex justify-between px-1 mt-1 text-center">
                                <span id="sv-label-${i}" class="text-[9px] md:text-[10px] text-blue-600 font-black italic text-center"></span>
                                <span id="adr-status-${i}" class="text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center"></span>
                            </div>
                        </div>
                    </td>
                    <td class="p-4 md:p-8 text-center bg-blue-50/5 text-center">
                        <div id="gain-container-${i}" class="flex flex-col items-center gap-1 text-center">
                            <span id="gain-pts-${i}" class="text-2xl md:text-3xl font-black text-blue-600 text-center">—</span>
                            <span id="gain-taux-${i}" class="px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase hidden text-center"></span>
                        </div>
                    </td>
                    <td class="p-4 md:p-8 bg-emerald-50/5 text-center text-center">
                        <div id="spent-container-${i}" class="space-y-2 text-center">
                            <div id="box-spent-${i}" class="flex items-center gap-2 px-4 py-3 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 transition-all focus-ring text-center">
                                <input type="number" step="0.1" inputmode="decimal" id="input-spent-${i}" oninput="handleUpdate(${i}, 'spent')" placeholder="0" class="w-full bg-transparent font-black text-slate-800 outline-none text-center text-xl md:text-2xl text-center">
                            </div>
                            <span id="spent-bonus-${i}" class="text-[9px] md:text-[10px] text-emerald-600 font-black uppercase italic tracking-tighter block text-center mt-1 text-center"></span>
                        </div>
                    </td>
                    <td class="p-4 md:p-8 text-right bg-slate-50/30 text-right">
                        <div class="flex flex-col items-end gap-2 text-right">
                            <div id="colis-info-${i}" class="flex flex-col items-end border-b border-slate-200 pb-1 mb-1 hidden text-right">
                                <span class="text-[9px] uppercase font-black text-slate-400 tracking-widest text-right text-right">Valeur colis</span>
                                <div id="colis-val-${i}" class="text-xl md:text-2xl font-black text-slate-900 leading-none mt-1 italic text-right text-right"></div>
                            </div>
                            <div id="solde-badge-${i}" class="inline-flex flex-col items-end px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black transition-all bg-slate-100 text-slate-300 text-right text-right">
                                <div id="solde-val-${i}" class="text-lg md:text-xl leading-none text-right text-right">—</div>
                                <div class="text-[8px] md:text-[9px] uppercase tracking-wider opacity-50 mt-1 italic font-bold text-right leading-none text-right text-right">Stock<br>Disponible</div>
                            </div>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            }
        }

        function setFrequency(val) {
            frequency = val;
            document.getElementById('btn-mensuel').className = `p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all text-left ${val === 'mensuel' ? 'border-blue-600 bg-white shadow-xl ring-4 ring-blue-50' : 'bg-white opacity-60'}`;
            document.getElementById('btn-bimestriel').className = `p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border-2 transition-all text-left ${val === 'bimestriel' ? 'border-slate-800 bg-white shadow-xl ring-4 ring-slate-100' : 'bg-white opacity-60'}`;
            const data = frequency === 'mensuel' ? monthlyData : bimestrialData;
            for(let i=0; i<NB_MOIS; i++) {
                document.getElementById(`input-price-${i}`).value = data.inputs[i];
                document.getElementById(`input-spent-${i}`).value = data.spent[i];
            }
            calculate();
        }

        function handleUpdate(index, field) {
            const data = frequency === 'mensuel' ? monthlyData : bimestrialData;
            data[field][index] = document.getElementById(field === 'inputs' ? `input-price-${index}` : `input-spent-${index}`).value;
            calculate();
        }

        function resetData() {
            if(frequency === 'mensuel') monthlyData = { inputs: Array(NB_MOIS).fill(''), spent: Array(NB_MOIS).fill('') };
            else bimestrialData = { inputs: Array(NB_MOIS).fill(''), spent: Array(NB_MOIS).fill('') };
            setFrequency(frequency);
        }

        function calculate() {
            const data = frequency === 'mensuel' ? monthlyData : bimestrialData;
            let currentSolde = 0;
            let lastValidSolde = 0;
            let moisVides = 0;

            for (let i = 0; i < NB_MOIS; i++) {
                const moisNum = i + 1;
                const repos = frequency === 'bimestriel' && moisNum % 2 === 0;
                
                const valPrice = data.inputs[i];
                const price = repos ? 0 : parseFloat(valPrice) || 0;
                const sv = price / COEFF;
                const spentRequested = repos ? 0 : parseFloat(data.spent[i]) || 0;

                if (!repos) {
                    if (sv < MIN_SV - 0.005) moisVides++;
                    else moisVides = 0;
                }
                if (moisVides >= 2) currentSolde = 0;

                const soldeStart = currentSolde;
                
                const depenseReelle = Math.min(spentRequested, soldeStart);
                const bonusEuro = depenseReelle * COEFF;
                const soldePostDepense = soldeStart - depenseReelle;

                let taux = frequency === 'mensuel' ? (moisNum >= 13 ? 0.3 : 0.2) : 0.1;
                let gain = (sv >= MIN_SV - 0.005 && !repos) ? Math.min(sv * taux, MAX_PTS_MOIS) : 0;

                currentSolde = soldePostDepense + gain;
                if (currentSolde > MAX_PTS_AN) currentSolde = MAX_PTS_AN;

                if (valPrice !== '' || data.spent[i] !== '') lastValidSolde = currentSolde;

                const row = document.getElementById(`row-${i}`);
                row.className = `border-b border-slate-50 hover:bg-slate-50/50 transition-all ${repos ? 'row-locked' : 'row-active'} ${moisNum === 13 && frequency === 'mensuel' ? 'bg-amber-50/10' : ''}`;
                
                const boxInput = document.getElementById(`box-input-${i}`);
                boxInput.className = `flex items-center gap-2 px-4 py-3 rounded-xl md:rounded-2xl border-2 transition-all ${repos ? 'border-transparent bg-transparent' : (valPrice !== '' ? (sv >= MIN_SV - 0.005 ? 'border-blue-600 bg-white shadow-md ring-2 ring-blue-50' : 'border-red-400 bg-white shadow-sm') : 'border-slate-100 bg-slate-50 focus-ring')}`;
                
                document.getElementById(`sv-label-${i}`).innerText = (!repos && valPrice !== '') ? `${sv.toFixed(2)} SV` : '';
                const adrStatus = document.getElementById(`adr-status-${i}`);
                if (!repos && valPrice !== '') {
                    adrStatus.innerText = sv < MIN_SV - 0.005 ? 'Seuil insuffisant' : 'ADR OK';
                    adrStatus.className = `text-[9px] font-black uppercase tracking-tighter ${sv < MIN_SV - 0.005 ? 'text-red-500' : 'text-emerald-600'}`;
                } else { adrStatus.innerText = ''; }

                const gPts = document.getElementById(`gain-pts-${i}`);
                const gTaux = document.getElementById(`gain-taux-${i}`);
                if (gain > 0) {
                    gPts.innerText = `+${gain.toFixed(2)}`;
                    gTaux.innerText = `${(taux*100).toFixed(0)}% RETOUR`;
                    gTaux.className = `px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${taux === 0.3 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'} block text-center`;
                    gTaux.classList.remove('hidden');
                } else {
                    gPts.innerText = '—';
                    gTaux.classList.add('hidden');
                }

                document.getElementById(`box-spent-${i}`).className = `flex items-center gap-2 px-4 py-3 rounded-xl md:rounded-2xl border-2 transition-all ${repos ? 'border-transparent bg-transparent' : (data.spent[i] !== '' ? 'border-emerald-500 bg-white ring-2 ring-emerald-50 shadow-md' : 'border-slate-100 bg-slate-50 focus-ring')}`;
                document.getElementById(`spent-bonus-${i}`).innerText = depenseReelle > 0 ? `Bonus : +${bonusEuro.toFixed(2)} €` : '';

                const cInfo = document.getElementById(`colis-info-${i}`);
                if (price > 0 || depenseReelle > 0) {
                    cInfo.classList.remove('hidden');
                    document.getElementById(`colis-val-${i}`).innerText = `${(price + bonusEuro).toFixed(2)} €`;
                } else { cInfo.classList.add('hidden'); }

                const sVal = document.getElementById(`solde-val-${i}`);
                const sBadge = document.getElementById(`solde-badge-${i}`);
                if (i > 0 || valPrice !== '' || data.spent[i] !== '') {
                    sVal.innerText = soldeStart.toFixed(2);
                    sBadge.className = `inline-flex flex-col items-end px-4 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl font-black transition-all ${soldeStart > 0 ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-100 text-slate-300'}`;
                } else {
                    sVal.innerText = '—';
                    sBadge.className = `inline-flex flex-col items-end px-5 py-3 rounded-2xl font-black bg-transparent text-slate-100 text-right`;
                }
            }
            document.getElementById('display-solde').innerHTML = `${lastValidSolde.toFixed(2)} <span class="text-sm opacity-40 font-normal">Pts</span>`;
            document.getElementById('display-euro-val').innerText = `≈ ${(lastValidSolde * COEFF).toFixed(2)} €`;
        }

        window.onload = () => {
            initTableStructure();
            setFrequency('mensuel');
        };
    </script>
</body>
</html>

