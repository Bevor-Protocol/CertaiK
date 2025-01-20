/* eslint-disable max-len */
"use client";

import { FileTextIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import NavBar from "./nav-bar";

const Footer: React.FC = () => {
  // const { isConnected } = useWs();
  return (
    <footer className="absolute bottom-0 left-0 right-0 w-full text-white z-[80] p-4">
      <NavBar className="md:hidden flex mb-2 w-full px-[20%]" />
      <div className="max-w-[1200px] justify-between m-auto md:flex hidden">
        <div className="flex flex-grow gap-8 items-center *:cursor-pointer z-10">
          <Link
            href="https://x.com/CertaiK_Agent"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="white">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </Link>
          <Link
            href="https://t.me/CertaiKVirtuals"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
              version="1.1"
              preserveAspectRatio="xMidYMid"
            >
              <g>
                <path
                  d="M128,0 C57.307,0 0,57.307 0,128 L0,128 C0,198.693 57.307,256 128,256 L128,256 C198.693,256 256,198.693 256,128 L256,128 C256,57.307 198.693,0 128,0 L128,0 Z"
                  fill="#40B3E0"
                ></path>
                <path
                  d="M190.2826,73.6308 L167.4206,188.8978 C167.4206,188.8978 164.2236,196.8918 155.4306,193.0548 L102.6726,152.6068 L83.4886,143.3348 L51.1946,132.4628 C51.1946,132.4628 46.2386,130.7048 45.7586,126.8678 C45.2796,123.0308 51.3546,120.9528 51.3546,120.9528 L179.7306,70.5928 C179.7306,70.5928 190.2826,65.9568 190.2826,73.6308"
                  fill="#FFFFFF"
                ></path>
                <path
                  d="M98.6178,187.6035 C98.6178,187.6035 97.0778,187.4595 95.1588,181.3835 C93.2408,175.3085 83.4888,143.3345 83.4888,143.3345 L161.0258,94.0945 C161.0258,94.0945 165.5028,91.3765 165.3428,94.0945 C165.3428,94.0945 166.1418,94.5735 163.7438,96.8115 C161.3458,99.0505 102.8328,151.6475 102.8328,151.6475"
                  fill="#D2E5F1"
                ></path>
                <path
                  d="M122.9015,168.1154 L102.0335,187.1414 C102.0335,187.1414 100.4025,188.3794 98.6175,187.6034 L102.6135,152.2624"
                  fill="#B5CFE4"
                ></path>
              </g>
            </svg>
          </Link>
          <Link
            href="https://app.virtuals.io/virtuals/9776"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ background: "rgb(68 188 195)", borderRadius: "12px" }}
            >
              <rect width="24" height="24" rx="12" fill="white" fillOpacity="0.1" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.6477 12.3451C15.7992 11.9433 16.8844 11.2578 17.7138 10.5134L17.7144 10.5147C17.7467 10.4845 17.7667 10.4434 17.7704 10.3994C17.7742 10.3555 17.7614 10.3117 17.7347 10.2765C17.708 10.2413 17.6691 10.2172 17.6256 10.2088C17.5821 10.2004 17.537 10.2084 17.4991 10.2312C16.6671 10.7286 15.7489 11.1224 14.8077 11.3627C14.8358 11.0048 14.8299 10.6445 14.7836 10.2864C14.6772 9.49101 14.4071 8.6963 13.8455 8.09101C13.2234 7.40292 12.2022 7.14575 11.3208 7.42111C10.2618 7.73599 9.37904 8.69002 9.34505 9.82846C9.30223 11.3276 10.6987 12.5494 12.1197 12.6868C12.2855 12.7049 12.4527 12.7138 12.6208 12.714C12.3588 13.2866 12.0188 13.8337 11.655 14.3402C10.5377 12.4972 8.86284 10.9878 6.87195 10.1622C6.40828 9.966 5.92756 9.81252 5.43581 9.70364C5.26834 9.66915 5.10905 9.63841 4.93213 9.61897C4.88917 9.61491 4.84617 9.6263 4.81091 9.65108C4.77565 9.67586 4.75046 9.71239 4.73988 9.75407C4.72931 9.79575 4.73406 9.83982 4.75327 9.87832C4.77247 9.91681 4.80488 9.94719 4.84461 9.96395C5.95614 10.5136 6.97558 11.2313 7.86673 12.0916C9.02156 13.2026 9.93137 14.5411 10.5381 16.0218C10.8057 16.6598 11.645 16.8931 12.2066 16.4829C12.2928 16.4193 12.3716 16.3463 12.4415 16.2652C12.945 15.7194 13.3882 15.1214 13.7636 14.4813C14.1472 13.8273 14.4631 13.1008 14.6477 12.3451ZM12.1561 15.2669L12.1562 15.2673L12.1707 15.2968C12.1661 15.2867 12.1612 15.2767 12.1561 15.2669ZM13.0133 11.5895C13.1012 11.2139 13.1449 10.832 13.1309 10.4476C13.0937 9.75759 12.828 8.78285 12.0077 8.7678C11.3012 8.75965 10.6515 9.42703 10.8536 10.1358C11.1527 11.1702 12.0461 11.5475 13.0133 11.5895Z"
                fill="white"
              />
              <path
                d="M18.2597 9.80965C18.3321 10.1471 18.4435 10.361 18.769 10.3177C19.0485 10.2807 19.279 10.0003 19.279 9.71995C19.279 9.43957 19.0473 9.2583 18.769 9.3022C18.4158 9.35803 18.2005 9.53554 18.2597 9.80965Z"
                fill="white"
              />
            </svg>
          </Link>
          <Link href="https://docs.certaik.xyz" className="hover:opacity-80 transition-opacity">
            <FileTextIcon height="24" width="24" />
          </Link>
        </div>
        {/* <div className="text-sm flex items-center">
          {isConnected ? (
            <p>
              <span className="h-1 w-1 rounded-full bg-green-400 inline-block align-middle mr-1 animate-pulse" />
              connected
            </p>
          ) : (
            <p>
              <span className="h-1 w-1 rounded-full bg-red-400 inline-block align-middle mr-1" />
              disconnected
            </p>
          )}
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
