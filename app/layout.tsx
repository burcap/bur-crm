import './styles/globals.css';
import MainNav from '@/components/navigation/MainNav';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Bur CRM',
  description: 'Next.js Email Marketing Tool'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 text-gray-900">
        <MainNav />
        <main className="container mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}