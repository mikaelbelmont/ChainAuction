import React, { useState, useEffect } from 'react';
import { getContract } from '../utils/contractConfig';
import AuctionCard from './AuctionCard';

const AuctionList = ({ signer }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const contract = getContract(signer);
      const provider = signer.provider;

      // Esperar o provider sincronizar
      const currentBlock = await provider.getBlockNumber();
      console.log('Current block:', currentBlock);

      // Buscar contador de leilões
      const auctionCount = await contract.auctionCounter();
      console.log('Auction count:', auctionCount.toString());
      
      if (auctionCount.toNumber() === 0) {
        setAuctions([]);
        return;
      }

      // Buscar leilões um por um
      const auctionsArray = [];
      for (let i = 0; i < auctionCount.toNumber(); i++) {
        try {
          const auction = await contract.getAuction(i, { blockTag: currentBlock });
          auctionsArray.push({
            id: i,
            title: auction.title,
            description: auction.description,
            imageUrl: auction.imageUrl,
            startingPrice: auction.startingPrice,
            currentHighestBid: auction.currentHighestBid,
            highestBidder: auction.highestBidder,
            endTime: auction.endTime.toString(),
            ended: auction.ended,
            owner: auction.owner
          });
        } catch (error) {
          console.error(`Error fetching auction ${i}:`, error);
        }
      }

      setAuctions(auctionsArray);
    } catch (err) {
      console.error('Error loading auctions:', err);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (signer) {
      fetchAuctions();
    }
  }, [signer]);

  // // Atualizar periodicamente
  // useEffect(() => {
  //   if (signer) {
  //     const interval = setInterval(fetchAuctions, 10000);
  //     return () => clearInterval(interval);
  //   }
  // }, [signer]


  const filterAuctions = (auctionList) => {
    // First apply search filter
    let filtered = auctionList;
    if (searchTerm) {
      filtered = filtered.filter(auction => 
        auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Then apply status filter
    switch (filter) {
      case 'active':
        return filtered.filter(auction => !auction.ended && auction.endTime > (Date.now() / 1000));
      case 'ended':
        return filtered.filter(auction => auction.ended || auction.endTime <= (Date.now() / 1000));
      default:
        return filtered;
    }
  };

  const sortAuctions = (auctionList) => {
    switch (sort) {
      case 'ending-soon':
        return [...auctionList].sort((a, b) => a.endTime - b.endTime);
      case 'price-high':
        return [...auctionList].sort((a, b) => b.currentHighestBid - a.currentHighestBid);
      case 'price-low':
        return [...auctionList].sort((a, b) => a.currentHighestBid - b.currentHighestBid);
      case 'newest':
      default:
        return [...auctionList].sort((a, b) => b.id - a.id);
    }
  };

  const filteredAndSortedAuctions = sortAuctions(filterAuctions(auctions));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-400">Loading auctions...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold">Explore Auctions</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Auctions</option>
              <option value="active">Active Only</option>
              <option value="ended">Ended Only</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="ending-soon">Ending Soon</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
            </select>
          </div>
        </div>

        {filteredAndSortedAuctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No auctions found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-400 hover:text-purple-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedAuctions.map((auction) => (
              <AuctionCard
                key={auction.id}
                auction={auction}
                signer={signer}
                onBidPlaced={fetchAuctions}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AuctionList;