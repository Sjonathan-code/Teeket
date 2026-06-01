import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Teeket',
  description: 'Support informatique intelligent pour les équipes modernes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
