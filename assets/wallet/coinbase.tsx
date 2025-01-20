/* eslint-disable max-len */
import Script from "next/script";
import React, { SVGProps } from "react";

const Coinbase: React.FC<SVGProps<SVGSVGElement>> = (props): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <Script src="chrome-extension://pdgbckgdncnhihllonhnjbdoighgpimk/js/vendor.js" />
      <Script src="chrome-extension://pdgbckgdncnhihllonhnjbdoighgpimk/js/injected/injectWalletGuard.js" />
      <g clipPath="url(#clip0_13571_129878)">
        <rect width="40" height="40" fill="#0052FF" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.3312 0H31.6672C36.2704 0 40 4.0128 40 8.9632V31.0368C40 35.9872 36.2704 40 31.6688 40H8.3312C3.7296 40 0 35.9872 0 31.0368V8.9632C0 4.0128 3.7296 0 8.3312 0Z"
          fill="#0052FF"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.9989 5.79443C27.8453 5.79443 34.2053 12.1544 34.2053 20.0008C34.2053 27.8472 27.8453 34.2072 19.9989 34.2072C12.1525 34.2072 5.79254 27.8472 5.79254 20.0008C5.79254 12.1544 12.1525 5.79443 19.9989 5.79443Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.5005 15.459H23.4973C24.0733 15.459 24.5389 15.9614 24.5389 16.579V23.419C24.5389 24.0382 24.0717 24.539 23.4973 24.539H16.5005C15.9245 24.539 15.4589 24.0366 15.4589 23.419V16.579C15.4589 15.9614 15.9261 15.459 16.5005 15.459Z"
          fill="#0052FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_13571_129878">
          <rect width="40" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Coinbase;
