import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Link-App",
  description: "Aplicativo de Catálogo Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
