// app/marketplace/page.tsx

'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { HERO_CARD_ADDRESS } from '../constant/constant';
import { useListings } from '../hooks/useListings';
import { useNFTMetadatas } from '../hooks/useNFTMetadata';
import NftCard from '../components/NftCard';
import TokenActions from '../components/TokenActions';
import { Listing } from '../constant/constant';

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const tokenCount = 10;
  const [refreshCount, setRefreshCount] = useState(0);

  // Fetch listings with refresh capability
  const listingsQuery = useListings(HERO_CARD_ADDRESS, tokenCount);
  const activeListings: Listing[] = listingsQuery
    .map(q => q.data)
    .filter((listing): listing is Listing => !!listing && listing.active);

  // Fetch metadata for active listings
  const metadatas = useNFTMetadatas(activeListings);

  const refreshListings = () => {
    setRefreshCount(prev => prev + 1);
    listingsQuery.forEach(q => q.refetch());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NFT Marketplace</h1>
        <button
          onClick={refreshListings}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Listings
        </button>
      </div>

      {!isConnected ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Connect your wallet to view NFTs
          </h2>
          <p className="text-gray-500">
            Please connect your wallet to browse and purchase NFTs
          </p>
        </div>
      ) : activeListings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            No active listings
          </h2>
          <p className="text-gray-500 mt-2">
            Check back later or list your own NFTs
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeListings.map((listing, index) => (
            <NftCard
              key={`${listing.tokenId}-${refreshCount}`}
              listing={listing}
              metadata={metadatas[index] || {}}
            >
              <TokenActions 
                listing={listing} 
                onBought={refreshListings} 
              />
            </NftCard>
          ))}
        </div>
      )}
    </div>
  );
}