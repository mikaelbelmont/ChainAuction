import { ethers } from 'ethers';

export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Primeiro, tenta adicionar a rede Hardhat
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x7A69',
                        chainName: 'Hardhat Local',
                        nativeCurrency: {
                            name: 'ETH',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['http://127.0.0.1:8545']
                    }]
                });
            } catch (addError) {
                console.log("Rede já pode estar adicionada:", addError);
            }

            // Então, tenta mudar para a rede
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7A69' }],
            });

            // Solicita acesso à conta
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            return provider.getSigner();
        } catch (error) {
            console.error("Erro ao conectar carteira:", error);
            throw error;
        }
    } else {
        throw new Error("MetaMask não encontrada!");
    }
};

export const getContract = (signer) => {
    if (!signer) return null;
    return new ethers.Contract(
        contractAddress,
        [
            "function auctionCounter() view returns (uint256)",
            "function createAuction(string memory _title, string memory _description, string memory _imageUrl, uint256 _startingPrice, uint256 _duration) public",
            "function getAuction(uint256 _auctionId) public view returns (uint256 id, string memory title, string memory description, string memory imageUrl, uint256 startingPrice, uint256 currentHighestBid, address highestBidder, uint256 endTime, bool ended, address owner)",
            "function placeBid(uint256 _auctionId) public payable",
            "function endAuction(uint256 _auctionId) public",
            "function getAuctionBids(uint256 _auctionId) public view returns (tuple(address bidder, uint256 amount, uint256 timestamp)[] memory)"
        ],
        signer
    );
};

export const formatEther = (value) => {
    return ethers.utils.formatEther(value);
};

export const parseEther = (value) => {
    return ethers.utils.parseEther(value.toString());
};