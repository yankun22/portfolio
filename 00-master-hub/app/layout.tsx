import type { Metadata, Viewport } from 'next';
import { 
  Cinzel, 
  Italiana, 
  Syne, 
  Plus_Jakarta_Sans, 
  Inter, 
  JetBrains_Mono 
} from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#050505',
};

export const metadata: Metadata = {
  title: 'Alok Vishwakarma — Principal Full-Stack Web Architect & Creative Technologist',
  description: 'An exclusive digital gallery of 15 live production systems engineered by Alok Vishwakarma across Web3D, In-Browser WASM Databases, Web Audio DAW, and High-Impact Enterprise Architecture.',
  keywords: ['Alok Vishwakarma', 'Principal Web Architect', 'Creative Technologist', 'Three.js', 'WebGL', 'Next.js', 'Web Audio API', 'WASM', 'React', 'TypeScript', 'Vercel'],
  authors: [{ name: 'Alok Vishwakarma' }],
  openGraph: {
    title: 'Alok Vishwakarma — Principal Full-Stack Web Architect',
    description: 'Exhibition of 15 live production web applications spanning Web3D, Fintech, Developer Tooling, and Enterprise Systems.',
    url: 'https://alokvishwa-studio.vercel.app',
    siteName: 'Alok Vishwakarma Master Architecture Hub',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`dark scroll-smooth ${cinzel.variable} ${italiana.variable} ${syne.variable} ${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#050505] text-[#f9fafb] font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
