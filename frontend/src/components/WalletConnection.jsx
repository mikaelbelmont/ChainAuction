import React, { useState, useEffect } from 'react';
import { connectWallet } from '../utils/contractConfig';

const WalletConnection = ({ onConnect }) => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        if (isConnecting) return;
        setIsConnecting(true);
        setError('');
        
        try {
            const signer = await connectWallet();
            const address = await signer.getAddress();
            setAddress(address);
            onConnect(signer);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setError('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    useEffect(() => {
        let isMounted = true;  // Corrigido aqui

        const checkConnection = async () => {
            if (window.ethereum && !isConnecting) {
                try {
                    console.log("Verificando conexão...");
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    console.log("Contas encontradas:", accounts);
                    if (accounts.length > 0 && isMounted && !address) {
                        await handleConnect();
                    }
                } catch (err) {
                    console.error("Error checking wallet connection:", err);
                }
            }
        };

        // Event listeners do MetaMask
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    setAddress('');
                    onConnect(null);
                } else if (accounts[0] !== address) {
                    handleConnect();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        checkConnection();

        return () => {
            console.log("=== WalletConnection cleanup ===");
            isMounted = false;  // Corrigido aqui
            if (window.ethereum) {
                window.ethereum.removeAllListeners();
            }
        };
    }, [address, isConnecting, onConnect]);

    if (!address) {
        return (
            <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-50"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
        );
    }

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-200 font-medium">
                    {`${address.slice(0, 6)}...${address.slice(-4)}`}
                </span>
            </div>
            {isHovered && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-700">
                    <p className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        Connected to Hardhat
                    </p>
                    <div className="px-4 py-2 text-xs text-gray-400 break-all">
                        {address}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletConnection;