import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Viral Bargarh', template: '%s | Viral Bargarh' },
  description: 'Fast, reliable, ground-level news from Bargarh and across Odisha.',
  openGraph: { title: 'Viral Bargarh', description: 'Bargarh\'s voice. Beyond the headlines.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
