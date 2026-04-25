import React from 'react';

/**
 * FICHIER : app/layout.js
 * REMPLACEZ TOUT LE CONTENU DE VOTRE FICHIER PAR CE CODE.
 * Ce fichier force le design "Bulle Premium" et la police Inter 900.
 */

export const metadata = {
  title: 'BUSINESS NSK | Master Premium',
  description: 'Portail stratégique Invest In Your Future',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Chargement forcé de Tailwind CSS via CDN pour garantir le visuel sur votre Mac */}
        <script src="https://cdn.tailwindcss.com"></script>
        
        {/* Configuration des polices et styles globaux Business NSK */}
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,900;1,900&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif !important;
            background-color: #f8fafc !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Classes d'identité visuelle Master */
          .font-black { font-weight: 900 !important; }
          .italic { font-style: italic !important; }
          .uppercase { text-transform: uppercase !important; }

          /* Masquage de la scrollbar pour un look épuré */
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}} />
      </head>
      <body className="antialiased font-black italic uppercase">
        {children}
      </body>
    </html>
  );
}