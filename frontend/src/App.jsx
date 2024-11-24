import { useState, useCallback, useEffect } from 'react';
import WalletConnection from './components/WalletConnection';
import CreateAuction from './components/CreateAuction';
import AuctionList from './components/AuctionList';
import FeaturedAuctions from './components/FeaturedAuctions';
import TrendingCollections from './components/TrendingCollections';
import NewsletterSubscription from './components/NewsletterSubscription';
import Footer from './components/Footer';

function App() {
  const [signer, setSigner] = useState(null);
  const [view, setView] = useState('home');
  const [isInitialized, setIsInitialized] = useState(false);

  const handleConnect = useCallback(async (newSigner) => {
    console.log("=== handleConnect chamado ===");
    if (newSigner !== signer) {
      setSigner(newSigner);
      setIsInitialized(true);
    }
  }, [signer]);

  const handleAuctionCreated = useCallback(() => {
    setView('home');
  }, []);

  // Hero Section Component
  const Hero = () => (
    <section className="py-20 text-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
          Discover Exclusive Digital Assets
        </h1>
        <p className="text-xl mb-8 text-gray-300">
          Join the future of digital collecting. Bid, own, and trade unique digital assets on the most secure blockchain auction platform.
        </p>
        <div className="flex justify-center">
          <WalletConnection onConnect={handleConnect} />
        </div>
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-3xl font-bold text-purple-400">$10M+</p>
            <p className="text-sm text-gray-400">Total Value Locked</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-3xl font-bold text-purple-400">500+</p>
            <p className="text-sm text-gray-400">Active Auctions</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-3xl font-bold text-purple-400">10K+</p>
            <p className="text-sm text-gray-400">Verified Users</p>
          </div>
        </div>
      </div>
    </section>
  );

  const MainContent = () => {
    if (!isInitialized) return null;

    if (view === 'create') {
      return <CreateAuction signer={signer} onAuctionCreated={handleAuctionCreated} />;
    }
    if (view === 'explore') {
      return <AuctionList signer={signer} />;
    }
    return (
      <>
        <FeaturedAuctions key="featured" signer={signer} />
        <AuctionList key="list" signer={signer} />
        <TrendingCollections />
        <NewsletterSubscription />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text cursor-pointer"
                onClick={() => setView('home')}
              >
                ChainAuction
              </h1>
              {signer && (
                <nav className="hidden md:flex ml-8 space-x-6">
                  <button 
                    onClick={() => setView('home')}
                    className={`text-gray-300 hover:text-purple-400 transition-colors ${view === 'home' ? 'text-purple-400' : ''}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => setView('explore')}
                    className={`text-gray-300 hover:text-purple-400 transition-colors ${view === 'explore' ? 'text-purple-400' : ''}`}
                  >
                    Explore
                  </button>
                </nav>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {signer && (
                <button
                  onClick={() => setView('create')}
                  className="hidden md:flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Auction
                </button>
              )}
              <WalletConnection onConnect={handleConnect} />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {!signer ? (
          <>
            <Hero />
            <div className="bg-black bg-opacity-50">
              <TrendingCollections />
              <NewsletterSubscription />
            </div>
          </>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <MainContent />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;