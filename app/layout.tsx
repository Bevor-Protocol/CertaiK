import Footer from "@/components/footer";
import Header from "@/components/header";
import { WebSocketProvider } from "@/contexts/websocket";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://app.certaik.xyz"),
  title: "CertaiK",
  description: "AI Agent Smart Contract Auditor",
  openGraph: {
    title: "CertaiK",
    description: "AI Agent Smart Contract Auditor",
    type: "website",
    url: "https://app.certaik.xyz",
    siteName: "CertaiK",
    locale: "en_US",
  },
  twitter: {
    title: "CertaiK",
    description: "AI Agent Smart Contract Auditor",
    card: "summary_large_image",
    site: "@CertaiK_Agent",
    creator: "@CertaiK_Agent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebSocketProvider>
      <html lang="en">
        <body className={`${figtree.className} antialiased`}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </WebSocketProvider>
  );
}
