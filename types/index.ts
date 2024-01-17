export type TActivePool = {
  nodeId: string;
  nodeName: string;
};

export type TStakingPosition = {
  name: string;
  description: string;
  external_url: string;
  image: string;
  attributes: {
    display_type: string;
    trait_type: string;
    value: string;
  }[];
};
