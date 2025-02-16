import type { Metadata } from 'next';
import { Inter_Tight } from 'next/font/google';
import './globals.css';

const inter = Inter_Tight({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Graphs - NSP',
  description: 'NSP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
