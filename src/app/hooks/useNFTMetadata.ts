// hooks/useNFTMetadata.ts
import { useQueries } from '@tanstack/react-query';
import { useReadContract } from 'wagmi';
import { HERO_CARD_ADDRESS, heroCardAbi, Listing } from '../constant/constant';

export type NFTMetadata = {
  name?: string;
  description?: string;
  image?: string;
};

const fetchMetadata = async (uri: string): Promise<NFTMetadata> => {
  try {
    const response = await fetch(uri);
    return await response.json();
  } catch (error) {
    return { name: 'Unnamed NFT', description: 'No description available' };
  }
};

export function useNFTMetadatas(listings: Listing[]) {
  const tokenURIs = useQueries({
    queries: listings.map((listing) => ({
      queryKey: ['tokenURI', listing.tokenId],
      queryFn: async () => {
        const result = await useReadContract({
          address: HERO_CARD_ADDRESS,
          abi: heroCardAbi,
          functionName: 'tokenURI',
          args: [listing.tokenId],
        });
        return result.data as string;
      },
      enabled: !!listing.tokenId,
    })),
  });

  const metadatas = useQueries({
    queries: tokenURIs.map((uriResult, index) => ({
      queryKey: ['metadata', listings[index].tokenId],
      queryFn: () => fetchMetadata(uriResult.data || ''),
      enabled: !!uriResult.data,
    })),
  });

  return metadatas.map(m => m.data || {});
}