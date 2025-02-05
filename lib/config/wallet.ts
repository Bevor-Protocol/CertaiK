import { cookieStorage, createConfig, createStorage } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

import { fallback, http } from "viem";
import { anvil, base, sepolia, type Chain } from "wagmi/chains";

let chains: readonly [Chain, ...Chain[]];
const alchemyTransports = {
  /// base
  [base.id]: http(
    `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  ),
  // sepolia
  [sepolia.id]: http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  ),
};

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
  chains = [anvil];
} else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  chains = [sepolia];
} else {
  chains = [base];
}

const walletConfig = createConfig({
  chains,
  transports: {
    [base.id]: fallback([alchemyTransports[base.id], http()]),
    [sepolia.id]: fallback([alchemyTransports[sepolia.id], http()]),
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

declare module "wagmi" {
  interface Register {
    config: typeof walletConfig;
  }
}

export default walletConfig;
