import '../styles/globals.css';
import { Inter, Lora } from 'next/font/google';
import type { Metadata } from 'next';
import DesktopBlocker from '../components/DesktopBlocker';
import TopBanner from '../components/TopBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: 'The Data Alchemy Codex',
  description: 'Elite insights, esoteric data patterns, and high-signal essays.',
  manifest: '/manifest.json',
  themeColor: '#2C2C2C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-background text-text-main font-sans antialiased selection:bg-primary/30 selection:text-white">
        <DesktopBlocker />
        <TopBanner />
        {children}
      </body>
    </html>
  );
}
