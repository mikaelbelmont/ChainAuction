import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ChainAuction</h3>
            <p className="text-gray-400">Exclusive digital asset auctions for discerning collectors.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-purple-400 transition-colors">FAQ</a></li>
              <li><a href="#terms" className="text-gray-400 hover:text-purple-400 transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: support@chainauction.com</p>
            <p className="text-gray-400">Phone: +1 (888) 123-4567</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  aria-label={social}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {social === 'Facebook' && (
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    )}
                    {social === 'Twitter' && (
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    )}
                    {social === 'Instagram' && (
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5V7.5A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z" />
                    )}
                    {social === 'LinkedIn' && (
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M2 4a2 2 0 114 0 2 2 0 01-4 0" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 ChainAuction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;