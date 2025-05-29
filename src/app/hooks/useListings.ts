import { useQueries } from '@tanstack/react-query';
import { MARKETPLACE_ADDRESS, marketplaceAbi, Listing } from '../constant/constant';

export function useListings(tokenContract: string, tokenCount: number) {
  const tokenIds = Array.from({ length: tokenCount }, (_, i) => BigInt(i + 1));

  return useQueries({
    queries: tokenIds.map(tokenId => ({
      queryKey: ['listing', tokenContract, tokenId.toString()],
      queryFn: async () => {
        // Simulated contract call - replace with actual contract interaction
        return {
          listingId: BigInt(Math.floor(Math.random() * 1000)),
          seller: `0x${Math.random().toString(36).substring(2, 42)}`,
          tokenId,
          tokenContract,
          price: BigInt(10 ** 18 * (Math.random() * 10 + 1)), // 1-10 ETH
          active: Math.random() > 0.3,
        } as Listing;
      },
    })),
  });
}