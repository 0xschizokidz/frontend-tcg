export const HERO_CARD_ADDRESS = '0x7acb65Ff7Dcb71C7FAa9Df1c20abcd7fd5A6A4E2';
export const TCG_TOKEN_ADDRESS = '0x8d4d6fF463BcB42787f0F75d9DFA36C5884D9A06';
export const MARKETPLACE_ADDRESS = '0x2d56710fAe2c00d208CfD43b829fE1D156b87B6e';

export { default as heroCardAbi } from './HeroCard.json';
export { default as marketplaceAbi } from './Marketplace.json';
export { default as tcgTokenAbi } from './TCGToken.json';


export type Listing = {
  listingId: bigint;
  seller: string;
  tokenId: bigint;
  tokenContract: string;
  price: bigint;
  active: boolean;
};