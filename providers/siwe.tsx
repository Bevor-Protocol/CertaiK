"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { authAction } from "@/actions";
import RequestAccountChange from "@/components/Modal/account-change";
import SignIn from "@/components/Modal/signin";
import * as Modal from "@/components/ui/modal";
import { createSiweMessage } from "@/utils/helpers";
import { SiweStateI } from "@/utils/types";
import { Address } from "viem";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

export const SiweContext = createContext<SiweStateI>({
  isSuccess: false,
  isPending: false,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const SiweProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // controls user Auth UI, and controls a non-toggleable Modal.
  // Similar to what's used in the ModalProvider, but we don't allow for close
  // unless a specific action is taken.
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const logout = (): void => {
    authAction.logout().then(() => {
      disconnect();
      setIsAuthenticated(false);
      router.refresh();
    });
  };

  const requireSigning = (
    addressUse: Address | undefined,
    chainIdUse: number | undefined,
  ): void => {
    if (!addressUse || !chainIdUse) return;
    let messageParsed = "";
    setIsPending(true);
    setIsSuccess(false);
    authAction
      .nonce()
      .then((nonce) => {
        messageParsed = createSiweMessage(addressUse, chainIdUse, nonce);
        return signMessageAsync({
          message: messageParsed,
        });
      })
      .then((signature) => {
        return authAction.verify(messageParsed, signature);
      })
      .then(() => {
        setIsAuthenticated(true);
        setIsSuccess(true);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        setIsAuthenticated(false);
        logout();
      })
      .finally(() => setIsPending(false));
  };

  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-show");
    } else {
      document.body.classList.remove("modal-show");
    }
  }, [open]);
  useEffect(() => {
    /*
    check if ANY user is authenticated.
    If not, present them a sign in.
    If yes
      - if authed user == connected user, do nothing
      - else, allow them to disconnect, or prompt to change account.
    */
    let timer: ReturnType<typeof setTimeout>;
    const handleChange = async (): Promise<void> => {
      await authAction.getCurrentUser().then((user) => {
        const userAddress = user?.address;
        const ANY_USER_AUTHED = !!userAddress; // authenticated address
        const ANY_WALLET_CONNECTED = !!address; // existing connected address

        if (ANY_USER_AUTHED && !ANY_WALLET_CONNECTED) {
          return logout();
        }
        if (!ANY_USER_AUTHED && !ANY_WALLET_CONNECTED) {
          // no action to take here, safely skip and reset states.
          setOpen(false);
          setIsAuthenticated(false);
          setIsPending(false);
          return;
        } // can safely skip all actions.
        const PROMPT_SIGNIN = !ANY_USER_AUTHED && ANY_WALLET_CONNECTED;
        const PROMPT_CHANGE = ANY_USER_AUTHED && ANY_WALLET_CONNECTED && address != userAddress;

        if (PROMPT_SIGNIN) {
          // this will not trigger a re-fire, because address doesn't change.
          // we'll need to explicitly mark a user as authenticated.
          setIsPending(false);
          setContent(<SignIn />);
          setOpen(true);
        } else if (PROMPT_CHANGE) {
          // once changed, then this gets re-fired, and isAuthenticated becomes true.
          // automatically set the pending state, to reflect that we're waiting on some action.
          setIsPending(true);
          setContent(<RequestAccountChange verifiedAddress={userAddress} />);
          setOpen(true);
        } else {
          // authenticated user.
          setIsPending(false);
          setIsAuthenticated(true);
          timer = setTimeout(() => {
            setOpen(false);
          }, 1000);
        }
      });
    };

    handleChange();

    return (): void => {
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isAuthenticated]);

  const login = (): void => requireSigning(address, chainId);

  const value = {
    isSuccess,
    isPending,
    login,
    logout,
    isAuthenticated,
    setIsAuthenticated,
  };

  return (
    <SiweContext.Provider value={value}>
      {children}
      <Modal.Wrapper isOpen={open} className={isAuthenticated ? "animate-modal-reverse" : ""}>
        <Modal.Content isOpen={open}>{content}</Modal.Content>
      </Modal.Wrapper>
    </SiweContext.Provider>
  );
};

export default SiweProvider;
