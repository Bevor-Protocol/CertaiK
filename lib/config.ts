import { cookieStorage, createConfig, createStorage, http } from "wagmi";
// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { injected } from "wagmi/connectors";

import { createClient } from "viem";
import { base, sepolia, type Chain } from "wagmi/chains";

// const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string;

// if (!projectId) throw new Error("Project ID is not defined");

let chains: readonly [Chain, ...Chain[]];

if (process.env.NODE_ENV === "development") {
  chains = [sepolia];
} else {
  chains = [base];
}

const walletConfig = createConfig({
  chains,
  // transports,
  client: ({ chain }) => createClient({ chain, transport: http() }),
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
