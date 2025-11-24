import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MaxiBingo - Zakłady na datę urodzenia dziecka",
  description: "Stwórz pulę zakładów na datę urodzenia Twojego dziecka. Przyjaciele i rodzina typują datę, a zwycięzca zgarnia całą pulę!",
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
