import Footer from "@/components/footer";
import Header from "@/components/header";
import sessionOptions from "@/lib/config/session";
import walletConfig from "@/lib/config/wallet";
import ModalProvider from "@/providers/modal";
import SiweProvider from "@/providers/siwe";
import WalletProvider from "@/providers/wallet";
import { SessionData } from "@/utils/types";
import { getIronSession } from "iron-session";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { cookies, headers } from "next/headers";
import React from "react";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"] });

const baseURL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: "BevorAI",
  description: "AI Agent Smart Contract Auditor",
  keywords: ["AI Agent", "Auditor", "Smart Contract", "web3", "Ethereum", "Solana"],
  openGraph: {
    title: "BevorAI",
    description: "AI Agent Smart Contract Auditor",
    type: "website",
    url: baseURL,
    siteName: "BevorAI",
    locale: "en_US",
    images: [`${baseURL}/opengraph.png`],
  },
  twitter: {
    title: "BevorAI",
    description: "AI Agent Smart Contract Auditor",
    card: "summary_large_image",
    site: "@CertaiK_Agent",
    creator: "@CertaiK_Agent",
    images: [`${baseURL}/opengraph.png`],
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }): Promise<JSX.Element> => {
  const headerList = await headers();
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  const address = session.siwe ? session.siwe.address : null;
  const initialState = cookieToInitialState(walletConfig, headerList.get("cookie"));
  return (
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        <WalletProvider initialState={initialState}>
          <SiweProvider>
            <ModalProvider>
              <div className="background-container">
                <Header address={address} />
                {children}
                <Footer />
              </div>
            </ModalProvider>
          </SiweProvider>
        </WalletProvider>
      </body>
    </html>
  );
};

export default RootLayout;
