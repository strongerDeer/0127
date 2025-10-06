import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';

import { Layout } from '@/widgets/Layout/ui/Layout';

import { pretendard } from '@/shared/font';
import { META } from '@/shared/lib/meta';

import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(META.baseUrl),
  title: META.title,
  description: META.description,
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    title: META.title,
    description: META.description,
    locale: 'ko_KR',
    siteName: META.title,
    images: [META.ogImage],
  },
  twitter: {
    card: 'summary',
    title: META.title,
    description: META.description,
    images: [META.ogImage],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${pretendard.className} ${outfit.className} antialiased`}>
        <Layout> {children}</Layout>
      </body>
    </html>
  );
}
