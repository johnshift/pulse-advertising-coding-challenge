import './globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { QueryProvider } from '@/components/providers/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pulse Advertising - Coding Challenge',
  description: 'Coding challenge for frontend engineers.',
  icons: {
    icon: [
      {
        url: 'https://www.pulse-advertising.com/wp-content/uploads/2020/03/cropped-PA-logo-honeycomb-black-01-32x32.png',
        sizes: '32x32',
      },
      {
        url: 'https://www.pulse-advertising.com/wp-content/uploads/2020/03/cropped-PA-logo-honeycomb-black-01-192x192.png',
        sizes: '192x192',
      },
    ],
    apple: [
      {
        url: 'https://www.pulse-advertising.com/wp-content/uploads/2020/03/cropped-PA-logo-honeycomb-black-01-180x180.png',
        sizes: '180x180',
      },
    ],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang='en' className='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
