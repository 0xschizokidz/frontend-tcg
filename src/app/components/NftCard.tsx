// components/NftCard.tsx
import React from 'react';
import { Listing } from '../constant/constant';
import { NFTMetadata } from '../hooks/useNFTMetadata';

type NftCardProps = {
  listing: Listing;
  metadata: NFTMetadata;
  children?: React.ReactNode;
};

export default function NftCard({ listing, metadata, children }: NftCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="h-48 flex justify-center items-center bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {metadata.image ? (
          <img 
            src={metadata.image} 
            alt={metadata.name} 
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-gray-400">No image available</div>
        )}
      </div>
      
      <h3 className="font-bold text-lg truncate">
        {metadata.name || `NFT #${Number(listing.tokenId)}`}
      </h3>
      
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {metadata.description || 'No description available'}
      </p>
      
      <div className="flex justify-between items-center mt-3">
        <div>
          <p className="font-semibold text-indigo-600">
            {Number(listing.price) / 10**18} TCG
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">
            Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
