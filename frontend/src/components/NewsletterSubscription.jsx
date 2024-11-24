import React, { useState } from 'react';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de subscrição
    console.log("Subscribing email:", email);
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-400 mb-6">
            Subscribe to our newsletter for exclusive drops and auction alerts.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <div className="mt-4 text-green-400 animate-fade-in">
              You've successfully subscribed to our newsletter!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;