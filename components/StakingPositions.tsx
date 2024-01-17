import React from "react";
import { TStakingPosition } from "../types";

type Props = {
  positions: (TStakingPosition | undefined)[];
};

export const StakingPositions = ({ positions }: Props) => {
  return (
    <div className="p-8 mt-6 mx-32 bg-[#444657] rounded rounded-lg mt-2">
      <h2 className="font-bold text-2xl">Your Staking Positions</h2>
      <ul className="mt-4">
        {positions.map((position) => (
          <li key={position?.name} className="mt-2">
            <div className="flex justify-between items-center">
              <div className="flex">
                <span>Name:</span>
                <span className="ml-2 font-bold">{position?.name}</span>
              </div>
              <div className="flex ml-4">
                <span>Description:</span>
                <span className="ml-2">{position?.description}</span>
              </div>
              <img src={position?.image} className="h-12 w-12 rounded-md" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
