'use client';
import React from 'react';

export default function RootLayout({ children }) {
  
  // Fonction de déconnexion ultra-simple
  const handleLogout = () => {
    // On vide le stockage local (ce qui déconnecte Supabase)
    localStorage.clear();
    // On redirige vers l'accueil pour forcer le rafraîchissement
    window.location.href = "/";
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>

         {/* CONFIGURATION WHATSAPP - NE PAS TOUCHER */}
        <meta property="og:title" content="Business NSK Premium" />
        <meta property="og:description" content="Accédez à votre espace Business NSK Premium" />
        <meta property="og:image" content="https://business-nsk-premium.com/opengraph-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image" content="https://business-nsk-premium.com/opengraph-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,900;1,900&display=swap');
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif !important;
            background-color: #f8fafc !important;
          }
          .font-black { font-weight: 900 !important; }
          .italic { font-style: italic !important; }
          .uppercase { text-transform: uppercase !important; }
        `}} />
      </head>
      <body className="antialiased font-black italic uppercase relative">
        
        {/* BOUTON DÉCONNEXION DISCRET */}
        <button 
          onClick={handleLogout}
          style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, backgroundColor: 'black', color: 'white', fontSize: '10px', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', border: 'none' }}
        >
          DÉCONNEXION
        </button>

        {children}
      </body>
    </html>
  );
}