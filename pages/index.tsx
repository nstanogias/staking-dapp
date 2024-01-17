import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import { useContractRead, useContractWrite } from "wagmi";
import {
  nftContractAddress,
  nftContractAbi,
  meldTokenAddress,
  meldTokenAbi,
  delegatorContractAddress,
  delegatorContractAbi,
  storageContractAbi,
  storageContractAddress,
} from "../contracts";
import { useState, useEffect } from "react";
import useActiveWagmi from "../hooks/useActiveWagmi";
import { writeContract, readContract } from "@wagmi/core";
import { formatUnits } from "viem";
import { TActivePool, TStakingPosition } from "../types";
import { StakingPositions } from "../components/StakingPositions";
import AvailablePools from "../components/AvailablePools";

const Home: NextPage = () => {
  const { account, isConnected } = useActiveWagmi();
  const [activePools, setActivePools] = useState<(TActivePool | undefined)[]>(
    []
  );
  const [positions, setPositions] = useState<(TStakingPosition | undefined)[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>("");
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);

  const { data: allowance } = useContractRead({
    address: meldTokenAddress,
    abi: meldTokenAbi,
    functionName: "allowance",
    args: [account ?? `0x${""}`, nftContractAddress],
  });

  const { data, write } = useContractWrite({
    address: delegatorContractAddress,
    abi: delegatorContractAbi,
    functionName: "stake",
    onError(error) {
      setError(error.message);
    },
    onSuccess(data, variables, context) {
      alert("Success");
    },
  });

  const stakeHandler = async (
    numTokens: string | null,
    nodeId: `0x${string}`
  ) => {
    if (!numTokens || isNaN(+numTokens) || +numTokens < 0) {
      return;
    }
    try {
      if (allowance && Number(BigInt(allowance)) < +numTokens) {
        const result = await writeContract({
          abi: meldTokenAbi,
          address: meldTokenAddress,
          functionName: "approve",
          args: [nftContractAddress, BigInt(1000)],
        });
        if (result.hash) {
          write?.({
            args: [BigInt(+numTokens), nodeId, BigInt(3)],
          });
        }
      } else {
        write?.({
          args: [BigInt(+numTokens), nodeId, BigInt(3)],
        });
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  const fetchPools = async () => {
    setLoading(true);
    try {
      const numNodes = await readContract({
        abi: storageContractAbi,
        address: storageContractAddress,
        functionName: "getNumNodes",
      });

      const activeStakingPools = await Promise.all(
        Array.from({ length: Number(numNodes) }).map(async (_, i) => {
          const nodeId = await readContract({
            abi: storageContractAbi,
            address: storageContractAddress,
            functionName: "nodeIds",
            args: [BigInt(i)],
          });
          const isNodeActive = await readContract({
            abi: storageContractAbi,
            address: storageContractAddress,
            functionName: "isNodeActive",
            args: [nodeId],
          });
          if (isNodeActive) {
            const nodeName = await readContract({
              abi: storageContractAbi,
              address: storageContractAddress,
              functionName: "getNodeName",
              args: [nodeId],
            });
            // const baseStakedAmount = await readContract({
            //   abi: storageContractAbi,
            //   address: storageContractAddress,
            //   functionName: "getNodeBaseStakedAmount",
            //   args: [nodeId],
            // });
            // const maxStakingAmount = await readContract({
            //   abi: storageContractAbi,
            //   address: storageContractAddress,
            //   functionName: "getNodeMaxStakingAmount",
            //   args: [nodeId],
            // });
            return {
              nodeName,
              nodeId,
              // da: formatUnits(maxStakingAmount, 9),
              // das: formatUnits(baseStakedAmount, 9),
              // diff: formatUnits(
              //   BigInt(Number(maxStakingAmount) - Number(baseStakedAmount)),
              //   9
              // ),
            };
          }
        })
      );
      setActivePools(activeStakingPools);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPositions = async () => {
    setLoading(true);
    try {
      const tokens = await readContract({
        abi: nftContractAbi,
        address: nftContractAddress,
        functionName: "getAllTokensByOwner",
        args: [account ?? `0x${""}`],
      });

      const userPositions = await Promise.all(
        tokens.map(async (token, i) => {
          const metadata = await readContract({
            abi: nftContractAbi,
            address: nftContractAddress,
            functionName: "tokenURI",
            args: [BigInt(token)],
          });
          const decoded = JSON.parse(atob(metadata.split(",")[1]));
          return decoded;
        })
      );
      setPositions(userPositions);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  // I am doing this as a fix for: https://github.com/wevm/wagmi/issues/542
  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
      fetchPools();
      fetchUserPositions();
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [account, isConnected]);

  return (
    <div className="bg-[#19191D] text-white">
      <Head>
        <title>MeldStaking</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div className="flex flex-1 flex-col min-h-screen">
        <div className="flex justify-end ">
          <ConnectButton />
        </div>

        {isDefinitelyConnected &&
          (loading ? (
            <div className="text-2xl font-bold text-center">Loading...</div>
          ) : (
            <div className="flex flex-col">
              <AvailablePools activePools={activePools} stake={stakeHandler} />
              <StakingPositions positions={positions} />
            </div>
          ))}
      </div>

      <footer className="flex justify-center">
        <a
          href="https://nstanogias.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Made with ❤️
        </a>
      </footer>
    </div>
  );
};

export default Home;
