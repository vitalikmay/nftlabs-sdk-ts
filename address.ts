import { ChainId, SUPPORTED_CHAIN_ID } from "./chain";

export const FORWARDER_ADDRESS = "0x97f8e938fcE6b846D4d2C7260091F5485c6F0b42";
export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  Record<"registry", string>
> = {
  [ChainId.Mainnet]: {
    registry: "",
  },
  [ChainId.Rinkeby]: {
    registry: "",
  },
  [ChainId.Polygon]: {
    registry: "",
  },
  [ChainId.Mumbai]: {
    registry: "0xAf8b9e277A7B9D97A5ca7DbdDe80e6C9218Cb227",
  },
  [ChainId.Avalanche]: {
    registry: "",
  },
  [ChainId.AvalancheFujiTestnet]: {
    registry: "",
  },
  [ChainId.Fantom]: {
    registry: "",
  },
  [ChainId.FantomTestnet]: {
    registry: "",
  },
  [ChainId.Hardhat]: {
    registry: "",
  },
};

export function getContractAddressByChainId(
  chainId: ChainId,
): string | undefined {
  return CONTRACT_ADDRESSES[chainId as SUPPORTED_CHAIN_ID]["registry"];
}
