## Project Description

This is a simple project created with [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) that allows basic interaction with the MELD staking protocol.

The following functionalities are in place:

- List of current avaialbe staking pools is shown.
- List of staking positions of a user is shown.
- User can create a new staking position.

## Run the project

1. The contracts are deployed in the MELD testnet network (Kanazawa), which you will have to add to your list of available networks.

```bash
Network name : MELD Kanazawa
RPC URL : testnet-rpc.meld.com
Chain ID : 222000222
Symbol : gMELD
Block explorer : https://testnet.meldscan.io
```

2. After that, you would need to obtain testnet tokens, which can be minted in https://faucet.meld.com

3. Import MELD TOKEN for testnet to your wallet: 0x22200025a5bc2c7da9c8ed6c051a58e12efa7501

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
