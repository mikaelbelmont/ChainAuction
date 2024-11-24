import React, { useState, useEffect } from 'react';
import { getContract, formatEther } from '../utils/contractConfig';

const FeaturedAuctions = ({ signer }) => {
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchFeaturedAuctions = async () => {
      if (!signer) return;
      
      try {
        setLoading(true);
        setError(null);

        const contract = getContract(signer);
        const provider = signer.provider;
        
        // Esperar o provider sincronizar
        const currentBlock = await provider.getBlockNumber();
        console.log('Current block:', currentBlock);

        const auctionCount = await contract.auctionCounter();
        console.log('Total de leilões:', auctionCount.toString());
        
        if (!mounted) return;

        if (auctionCount.toNumber() === 0) {
          setFeaturedAuctions([]);
          return;
        }

        const featuredArray = [];
        const count = Math.min(auctionCount.toNumber(), 3);
        
        for (let i = 0; i < count; i++) {
          try {
            const index = auctionCount.toNumber() - 1 - i;
            const auction = await contract.getAuction(index, { blockTag: currentBlock });
            
            featuredArray.push({
              id: index,
              title: auction.title,
              imageUrl: auction.imageUrl,
              currentBid: auction.currentHighestBid,
              endTime: new Date(auction.endTime.toNumber() * 1000)
            });
          } catch (error) {
            console.error(`Error fetching featured auction ${i}:`, error);
          }
        }

        if (mounted) {
          setFeaturedAuctions(featuredArray);
        }
      } catch (err) {
        console.error('Erro ao carregar leilões:', err);
        if (mounted) {
          setError('Falha ao carregar leilões');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (signer) {
      fetchFeaturedAuctions();
    }

    return () => {
      mounted = false;
    };
}, [signer]);

  // useEffect(() => {
  //   let mounted = true;

  //   const fetchFeaturedAuctions = async () => {
  //     if (!signer) return;
      
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const contract = getContract(signer);
  //       const provider = signer.provider;
        
  //       // Esperar o provider sincronizar
  //       const currentBlock = await provider.getBlockNumber();
  //       console.log('Current block:', currentBlock);

  //       const auctionCount = await contract.auctionCounter();
  //       console.log('Total de leilões:', auctionCount.toString());
        
  //       if (!mounted) return;

  //       if (auctionCount.toNumber() === 0) {
  //         setFeaturedAuctions([]);
  //         return;
  //       }

  //       const featuredArray = [];
  //       const count = Math.min(auctionCount.toNumber(), 3);
        
  //       for (let i = 0; i < count; i++) {
  //         try {
  //           const index = auctionCount.toNumber() - 1 - i;
  //           const auction = await contract.getAuction(index, { blockTag: currentBlock });
            
  //           featuredArray.push({
  //             id: index,
  //             title: auction.title,
  //             imageUrl: auction.imageUrl,
  //             currentBid: auction.currentHighestBid,
  //             endTime: new Date(auction.endTime.toNumber() * 1000)
  //           });
  //         } catch (error) {
  //           console.error(`Error fetching featured auction ${i}:`, error);
  //         }
  //       }

  //       if (mounted) {
  //         setFeaturedAuctions(featuredArray);
  //       }
  //     } catch (err) {
  //       console.error('Erro ao carregar leilões:', err);
  //       if (mounted) {
  //         setError('Falha ao carregar leilões');
  //       }
  //     } finally {
  //       if (mounted) {
  //         setLoading(false);
  //       }
  //     }
  //   };

  //   if (signer) {
  //     fetchFeaturedAuctions();
  //     const interval = setInterval(fetchFeaturedAuctions, 10000);
  //     return () => {
  //       mounted = false;
  //       clearInterval(interval);
  //     };
  //   }
  // }, [signer]);
  
  const nextSlide = () => {
    if (featuredAuctions.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredAuctions.length);
  };

  const prevSlide = () => {
    if (featuredAuctions.length <= 1) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + featuredAuctions.length) % featuredAuctions.length
    );
  };

  const formatTimeLeft = (endTime) => {
    const timeLeft = endTime.getTime() - Date.now();
    if (timeLeft <= 0) return 'Finalizado';
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (!signer) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Auctions</h2>
        
        {loading ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : featuredAuctions.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No auction available yet. Be the first to create!</p>
          </div>
        ) : (
          <div className="relative">
            {featuredAuctions.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={prevSlide}
                  aria-label="Previous auction"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={nextSlide}
                  aria-label="Next Auction"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {featuredAuctions.map((auction) => (
                  <div key={auction.id} className="flex-shrink-0 w-full">
                    <div className="bg-gray-800 rounded-lg overflow-hidden mx-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                        {auction.imageUrl ? (
                            <img
                                src={auction.imageUrl}
                                alt={auction.title}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    // Mostrar div de fallback quando a imagem falhar
                                    const fallback = document.createElement('div');
                                    fallback.className = "w-full h-64 bg-gray-900 flex items-center justify-center";
                                    fallback.innerHTML = '<span class="text-gray-400">No Image/span>';
                                    e.target.parentNode.appendChild(fallback);
                                }}
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">{auction.title}</h3>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-2xl font-bold text-purple-400">
                                        {formatEther(auction.currentBid)} ETH
                                    </p>
                                    <p className="text-sm text-gray-400">Current Bid</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-400">Ends in:</p>
                                    <p className="text-lg text-yellow-400">{formatTimeLeft(auction.endTime)}</p>
                                </div>
                            </div>
                            {/* <button 
                                onClick={async () => {
                                    try {
                                        const contract = getContract(signer);
                                        const currentBid = auction.currentBid;
                                        const newBid = parseEther((parseFloat(formatEther(currentBid)) + 0.01).toString());
                                        
                                        const tx = await contract.placeBid(auction.id, { value: newBid });
                                        await tx.wait();
                                        
                                        // Atualizar os leilões após o lance
                                        fetchFeaturedAuctions();
                                    } catch (error) {
                                        console.error('Erro ao dar lance:', error);
                                    }
                                }}
                                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors transform hover:scale-105 duration-200"
                            >
                                Dar Lance
                            </button> */}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedAuctions;