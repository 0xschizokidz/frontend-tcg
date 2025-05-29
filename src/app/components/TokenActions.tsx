// components/TokenActions.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { 
  TCG_TOKEN_ADDRESS, 
  MARKETPLACE_ADDRESS, 
  tcgTokenAbi, 
  marketplaceAbi,
  Listing
} from '../constant/constant';

type TokenActionsProps = {
  listing: Listing;
  onBought: () => void;
};

export default function TokenActions({ listing, onBought }: TokenActionsProps) {
  const { address, isConnected } = useAccount();
  const [approved, setApproved] = useState(false);

  // Check token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: TCG_TOKEN_ADDRESS,
    abi: tcgTokenAbi,
    functionName: 'allowance',
    args: [address || '0x0', MARKETPLACE_ADDRESS],
    query: { enabled: isConnected && Boolean(address) }
  });

  // Approve tokens
  const { 
    writeContractAsync: approveAsync, 
    isPending: isApproving,
    data: approveTxHash
  } = useWriteContract();

  // Buy NFT
  const { 
    writeContractAsync: buyAsync, 
    isPending: isBuying,
    data: buyTxHash
  } = useWriteContract();

  // Track approval transaction
  const { isSuccess: approvalConfirmed } = useWaitForTransactionReceipt({ 
    hash: approveTxHash 
  });

  // Track buy transaction
  const { isSuccess: purchaseConfirmed } = useWaitForTransactionReceipt({ 
    hash: buyTxHash 
  });

  // Update approval status
  useEffect(() => {
    if (allowance !== undefined && allowance !== null && listing.price !== undefined) {
      setApproved(BigInt(allowance.toString()) >= listing.price);
    }
  }, [allowance, listing.price]);

  // Refresh allowance after approval
  useEffect(() => {
    if (approvalConfirmed) {
      refetchAllowance();
    }
  }, [approvalConfirmed]);

  // Handle successful purchase
  useEffect(() => {
    if (purchaseConfirmed) {
      onBought();
    }
  }, [purchaseConfirmed]);

  const handleApprove = async () => {
    try {
      await approveAsync({
        address: TCG_TOKEN_ADDRESS,
        abi: tcgTokenAbi,
        functionName: 'approve',
        args: [MARKETPLACE_ADDRESS, listing.price],
      });
    } catch (error) {
      console.error('Approval error:', error);
    }
  };

  const handleBuy = async () => {
    try {
      await buyAsync({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'buyNFT',
        args: [listing.listingId],
      });
    } catch (error) {
      console.error('Buy error:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center text-sm py-2 text-gray-500">
        Connect wallet to buy
      </div>
    );
  }

  if (address?.toLowerCase() === listing.seller.toLowerCase()) {
    return (
      <div className="text-center text-sm py-2 text-gray-500">
        Your listing
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {!approved ? (
        <button
          onClick={handleApprove}
          disabled={isApproving}
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium px-3 py-1.5 rounded disabled:opacity-50 flex justify-center items-center"
        >
          {isApproving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Approving...
            </>
          ) : 'Approve Tokens'}
        </button>
      ) : (
        <button
          onClick={handleBuy}
          disabled={isBuying}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-1.5 rounded disabled:opacity-50 flex justify-center items-center"
        >
          {isBuying ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buying...
            </>
          ) : 'Buy Now'}
        </button>
      )}
    </div>
  );
}