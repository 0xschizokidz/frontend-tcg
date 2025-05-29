// components/ListingsList.tsx
import React from 'react';
import { Listing } from '../constant/constant';

export function ListingsList({ listings }: { listings: Listing[] }) {
  if (listings.length === 0) {
    return <div className="text-gray-500 text-center py-4">No active listings</div>;
  }

  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div key={listing.listingId.toString()} className="p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Token #{Number(listing.tokenId)}</h3>
              <p className="text-sm text-gray-600">
                Seller: {listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{Number(listing.price) / 10**18} ETH</p>
              <span className={`text-xs px-2 py-1 rounded-full ${listing.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {listing.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}