export default function RootLayout({ children }) {
  return (
    <div className="antialiased italic bg-slate-50 text-slate-900 min-h-screen">
      {/* Chargement de Tailwind et des Polices via CDN pour l'aperçu */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" 
        rel="stylesheet" 
      />
      <script src="https://cdn.tailwindcss.com"></script>
      
      <style>
        {`
          /* Simulation des styles de globals.css */
          :root {
            --foreground-rgb: 30, 41, 59;
            --background-start-rgb: 248, 250, 252;
            --background-end-rgb: 255, 255, 255;
          }
          
          body, .font-inter {
            font-family: 'Inter', sans-serif;
          }

          .italic {
            font-style: italic;
          }

          /* Reset de base pour l'aperçu */
          main {
            min-height: 100vh;
          }
        `}
      </style>

      {/* Structure du site */}
      <main className="font-inter">
        {children}
      </main>
    </div>
  );
}

// Métadonnées (utilisées par Next.js en production)
export const metadata = {
  title: 'Business NSK - Portail Stratégique',
  description: 'Plateforme de pilotage premium pour leaders Nu Skin',
};