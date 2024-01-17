import React from "react";
import { TActivePool } from "../types";

type Props = {
  activePools: (TActivePool | undefined)[];
  stake: (numTokens: string | null, nodeId: `0x${string}`) => void;
};

const AvailablePools = ({ activePools, stake }: Props) => {
  return (
    <div className="p-8 mt-32 mx-32 bg-[#444657] rounded rounded-lg">
      <h2 className="font-bold text-2xl">Active Staking Pools</h2>
      <ul className="mt-4">
        {activePools.map((pool) => (
          <li key={pool?.nodeId} className="mt-2">
            <div className="flex justify-between items-center">
              <div className="flex">
                <span>Name:</span>
                <span className="ml-2 font-bold">{pool?.nodeName}</span>
              </div>
              <div className="flex ml-4">
                <span>NodeId:</span>
                <span className="ml-2">{pool?.nodeId}</span>
              </div>
              <button
                onClick={() =>
                  stake(
                    prompt("How many tokens do you want to stake?", ""),
                    (pool?.nodeId as `0x${string}`) ?? `0x${""}`
                  )
                }
                className="flex px-6  py-2 bg-[#FC1C4A] rounded-md rounded"
              >
                Stake
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailablePools;
