import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";

const useActiveWagmi = () => {
  const { address, connector, isConnecting, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  const chainId = chain?.id;
  const library = provider;

  return {
    account: address,
    isConnected,
    isConnecting,
    chain,
    chains,
    chainId,
    library,
    signer,
    connector,
    isNetworkSupported: !chain?.unsupported,
  };
};

export default useActiveWagmi;
