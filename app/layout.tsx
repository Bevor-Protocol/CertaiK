import Footer from "@/components/footer";
import Header from "@/components/header";
import { walletConfig } from "@/lib/config";
import { ModalProvider } from "@/providers/modal";
import WalletProvider from "@/providers/wallet";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const RootLayout = async ({ children }: { children: React.ReactNode }): Promise<JSX.Element> => {
  const headerList = await headers();
  const initialState = cookieToInitialState(walletConfig, headerList.get("cookie"));
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        <WalletProvider initialState={initialState}>
          <ModalProvider>
            <Header />
            {children}
            <Footer />
          </ModalProvider>
        </WalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;
