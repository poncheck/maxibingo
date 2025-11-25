import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://babybingo.online'),
  title: "BabyBingo - Zakłady na datę urodzenia dziecka",
  description: "Stwórz pulę zakładów na datę urodzenia Twojego dziecka. Zaproś rodzinę i przyjaciół do zabawy - zwycięzca zgarnia pulę!",
  openGraph: {
    title: "BabyBingo - Zakłady na datę urodzenia dziecka",
    description: "Kiedy urodzi się maluch? Obstaw datę, wygraj pulę! Świetna zabawa dla rodziny i przyjaciół.",
    url: 'https://babybingo.online',
    siteName: 'BabyBingo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BabyBingo - Zakłady na datę urodzenia',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BabyBingo - Zakłady na datę urodzenia dziecka",
    description: "Kiedy urodzi się maluch? Obstaw datę, wygraj pulę!",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${inter.className} min-h-screen antialiased bg-slate-50 text-slate-900`}>{children}</body>
    </html>
  );
}
