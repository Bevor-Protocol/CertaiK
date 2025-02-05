// import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

import { type SessionOptions } from "iron-session";

const sessionOptions: SessionOptions = {
  password: process.env.COOKIE_PSWD as string,
  cookieName: "siwe",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// export { config, projectId };
export default sessionOptions;
