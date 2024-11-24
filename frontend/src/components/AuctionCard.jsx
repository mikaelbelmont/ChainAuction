import React, { useState, useEffect } from 'react';
import { formatEther, parseEther, getContract } from '../utils/contractConfig';

const AuctionCard = ({ auction, signer, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      if (signer && auction) {
        const address = await signer.getAddress();
        setIsOwner(address.toLowerCase() === auction.owner.toLowerCase());
      }
    };
    checkOwner();
  }, [signer, auction]);

  useEffect(() => {
    if (!auction.ended) {
      const timer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const endTime = parseInt(auction.endTime);
        
        if (now >= endTime) {
          setTimeLeft('Ended');
          clearInterval(timer);
        } else {
          const diff = endTime - now;
          const days = Math.floor(diff / (24 * 60 * 60));
          const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((diff % (60 * 60)) / 60);
          const seconds = diff % 60;
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [auction.endTime]);

  const handleBid = async (e) => {
    e.preventDefault();
    if (isOwner) {
      setError('Você não pode dar lance no seu próprio leilão');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const contract = getContract(signer);
      const bidValue = parseEther(bidAmount);
      
      // Verificar se o lance é maior que o atual
      if (bidValue.lte(auction.currentHighestBid)) {
        throw new Error('O lance deve ser maior que o atual');
      }

      const tx = await contract.placeBid(auction.id, { value: bidValue });
      await tx.wait();
      
      if (onBidPlaced) {
        onBidPlaced();
      }
      
      setBidAmount('');
      setShowBidForm(false);
    } catch (err) {
      let errorMessage = 'Erro ao dar lance. Tente novamente.';
      if (err.message.includes('Owner cannot bid')) {
        errorMessage = 'Você não pode dar lance no seu próprio leilão';
      } else if (err.message.includes('Bid not high enough')) {
        errorMessage = 'O lance deve ser maior que o atual';
      }
      setError(errorMessage);
      console.error('Bid error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-500/50">
      <div className="relative">
          {auction.imageUrl ? (
              <img
                  src={auction.imageUrl}
                  alt={auction.title}
                  className="w-full h-48 object-cover"
              />
          ) : (
              <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem</span>
              </div>
          )}
          {timeLeft === 'Ended' && (
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full text-sm">
                  Finalizado
              </div>
          )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
        <p className="text-gray-400 mb-4 h-12 overflow-hidden">{auction.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Lance Atual</p>
            <p className="text-lg font-bold text-green-400">
              {formatEther(auction.currentHighestBid)} ETH
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Tempo Restante</p>
            <p className="text-lg font-bold text-yellow-400">{timeLeft}</p>
          </div>
        </div>

        {auction.highestBidder !== '0x0000000000000000000000000000000000000000' && (
          <div className="mb-4">
            <p className="text-sm text-gray-400">Maior Lance por</p>
            <p className="text-sm font-mono">
              {`${auction.highestBidder.slice(0, 6)}...${auction.highestBidder.slice(-4)}`}
            </p>
          </div>
        )}

        {!auction.ended && timeLeft !== 'Ended' && (
          <div className="space-y-4">
            {isOwner ? (
              <div className="text-center py-2 px-4 bg-gray-700 rounded-lg">
                Você é o dono deste leilão
              </div>
            ) : showBidForm ? (
              <form onSubmit={handleBid}>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Valor do lance (ETH)"
                    className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowBidForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processando...' : 'Confirmar Lance'}
                </button>
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </form>
            ) : (
              <button
                onClick={() => setShowBidForm(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Dar Lance
              </button>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>ID: #{auction.id}</span>
            <span>Criador: {`${auction.owner.slice(0, 6)}...${auction.owner.slice(-4)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;