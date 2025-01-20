import { cookieStorage, createConfig, createStorage } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { injected } from "wagmi/connectors";

import { createClient, fallback, FallbackTransport, http, HttpTransport } from "viem";
import { anvil, base, sepolia, type Chain } from "wagmi/chains";

// const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

// if (!projectId) throw new Error("Project ID is not defined");

let chains: readonly [Chain, ...Chain[]];
const alchemyTransports = {
  /// base
  8453: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  // sepolia
  11155111: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
};

if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
  chains = [anvil];
} else if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
  chains = [sepolia];
} else {
  chains = [base];
}

const getTransport = (chain: Chain): HttpTransport | FallbackTransport => {
  if (chain.id === 31337) {
    // anvil, use local RPC provided via anvil
    return http("http://127.0.0.1:8545");
  }
  const alchemy = alchemyTransports[chain.id as keyof typeof alchemyTransports];
  return fallback([alchemy, http()]);
};

const walletConfig = createConfig({
  chains,
  // transports,
  client: ({ chain }) => {
    const transport = getTransport(chain);
    return createClient({
      chain,
      // transport: http(),
      transport,
    });
  },
  connectors: [injected({ shimDisconnect: true })],
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

// export { config, projectId };
export { walletConfig };
