// components/Marketplace.tsx
import React, { useState, useEffect } from 'react';
import { parseEther } from 'viem';
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { toast } from 'react-hot-toast';
import { MARKETPLACE_ADDRESS, marketplaceAbi } from '../constant/constant';

export function Marketplace() {
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { 
    writeContractAsync, 
    isPending: listPending,
    data: txHash
  } = useWriteContract();
  
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  // Track transaction confirmation
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash: txHash 
  });

  // Handle confirmation status
  useEffect(() => {
    if (isConfirmed) {
      toast.success('NFT listed successfully!');
      setTokenId('');
      setPrice('');
      setIsConfirming(false);
    }
  }, [isConfirmed]);

  const handleListNFT = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!tokenId || !price) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsConfirming(true);
      toast.loading('Sending transaction...');
      
      const hash = await writeContractAsync({
        address: MARKETPLACE_ADDRESS,
        abi: marketplaceAbi,
        functionName: 'listNFT',
        args: [BigInt(tokenId), parseEther(price)],
      });

      toast.dismiss();
      if (publicClient) {
        toast.promise(
          publicClient.waitForTransactionReceipt({ hash }),
          {
            loading: 'Waiting for confirmation...',
            success: 'Transaction confirmed!',
            error: (err) => `Transaction failed: ${err.message}`,
          }
        );
      } else {
        toast.error('Public client is not available.');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Error: ${error.shortMessage || error.message}`);
      setIsConfirming(false);
    }
  };

  const isProcessing = listPending || isConfirming;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">List Your NFT</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Token ID
          </label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter token ID"
            disabled={isProcessing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (ETH)
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter price in ETH"
            disabled={isProcessing}
          />
        </div>
        
        <button
          onClick={handleListNFT}
          disabled={isProcessing}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isConfirming ? 'Confirming...' : 'Listing...'}
            </>
          ) : 'List NFT for Sale'}
        </button>
      </div>
    </div>
  );
}