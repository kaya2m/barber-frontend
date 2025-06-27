import { Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { NotificationToast } from '@/components/common/notification-toast';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Berber Randevu - Online Randevu Sistemi',
  description: 'Modern berber hizmetleri için online randevu alma sistemi. Hızlı, kolay ve güvenli.',
  keywords: 'berber, randevu, kuaför, saç kesimi, sakal tıraş',
  authors: [{ name: 'Berber Randevu' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Berber Randevu - Online Randevu Sistemi',
    description: 'Modern berber hizmetleri için online randevu alma sistemi.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
            <NotificationToast />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}