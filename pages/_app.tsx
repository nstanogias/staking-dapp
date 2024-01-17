import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  Chain,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import type { AppProps } from "next/app";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const meld: Chain = {
  id: 222000222,
  name: "MELD Kanazawa",
  network: "MELD Kanazawa",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "Meld",
    symbol: "gMELD",
  },
  rpcUrls: {
    public: { http: ["https://testnet-rpc.meld.com"] },
    default: { http: ["https://testnet-rpc.meld.com"] },
  },
  blockExplorers: {
    default: { name: "Meld", url: "https://testnet.meldscan.io" },
  },
  testnet: true,
};
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [meld],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Meld Staking Dapp",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
