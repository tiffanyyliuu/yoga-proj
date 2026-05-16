import './globals.css';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Sequence',
  description: 'AI-powered yoga sequence planning for instructors',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t=localStorage.getItem('theme');
            if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){
              document.documentElement.classList.add('dark');
            }
          })();
        ` }} />
      </head>
      <body className="font-sans bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen antialiased transition-colors">
        {children}
      </body>
    </html>
  );
}
