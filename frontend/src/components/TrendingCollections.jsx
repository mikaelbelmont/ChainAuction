import React from 'react';

const trendingCollections = [
  { id: 1, name: "CryptoPunks", floor: 5.5, volume: 1200 },
  { id: 2, name: "Bored Ape Yacht Club", floor: 8.2, volume: 980 },
  { id: 3, name: "Art Blocks", floor: 0.5, volume: 750 },
  { id: 4, name: "Doodles", floor: 2.1, volume: 620 }
];

const TrendingCollections = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Trending Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCollections.map((collection) => (
            <div key={collection.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-bold mb-4">{collection.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">Floor Price</p>
                    <p className="text-lg font-bold">{collection.floor} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">24h Volume</p>
                    <p className="text-lg font-bold">{collection.volume} ETH</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCollections;