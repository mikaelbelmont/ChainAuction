// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransparentAuction {
    struct Auction {
        uint256 id;
        string title;
        string description;
        string imageUrl;
        uint256 startingPrice;
        uint256 currentHighestBid;
        address highestBidder;
        uint256 endTime;
        bool ended;
        address owner;
    }

    struct Bid {
        address bidder;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(uint256 => mapping(address => uint256)) public pendingReturns;
    
    uint256 public auctionCounter;
    
    event AuctionCreated(uint256 indexed auctionId, string title, uint256 startingPrice, address owner);
    event NewBid(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
    event WithdrawReturn(uint256 indexed auctionId, address indexed bidder, uint256 amount);

    modifier onlyBeforeEnd(uint256 _auctionId) {
        require(block.timestamp < auctions[_auctionId].endTime, "Auction already ended");
        _;
    }

    modifier onlyAfterEnd(uint256 _auctionId) {
        require(block.timestamp >= auctions[_auctionId].endTime, "Auction not yet ended");
        _;
    }

    modifier onlyAuctionOwner(uint256 _auctionId) {
        require(msg.sender == auctions[_auctionId].owner, "Not the auction owner");
        _;
    }

    function createAuction(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _startingPrice,
        uint256 _duration
    ) public {
        require(_duration > 0, "Duration must be greater than 0");
        require(_startingPrice > 0, "Starting price must be greater than 0");

        uint256 auctionId = auctionCounter;
        
        Auction storage newAuction = auctions[auctionId];
        newAuction.id = auctionId;
        newAuction.title = _title;
        newAuction.description = _description;
        newAuction.imageUrl = _imageUrl;
        newAuction.startingPrice = _startingPrice;
        newAuction.endTime = block.timestamp + _duration;
        newAuction.owner = msg.sender;
        
        emit AuctionCreated(auctionId, _title, _startingPrice, msg.sender);
        auctionCounter++;
    }

    function placeBid(uint256 _auctionId) public payable onlyBeforeEnd(_auctionId) {
        require(msg.value > 0, "Bid must be greater than 0");
        require(msg.sender != auctions[_auctionId].owner, "Owner cannot bid");
        
        uint256 currentBid = msg.value;
        
        if (auctions[_auctionId].highestBidder != address(0)) {
            require(currentBid > auctions[_auctionId].currentHighestBid, "Bid not high enough");
            // Return funds to previous highest bidder
            pendingReturns[_auctionId][auctions[_auctionId].highestBidder] += auctions[_auctionId].currentHighestBid;
        } else {
            require(currentBid >= auctions[_auctionId].startingPrice, "Bid below starting price");
        }

        auctions[_auctionId].highestBidder = msg.sender;
        auctions[_auctionId].currentHighestBid = currentBid;
        
        auctionBids[_auctionId].push(Bid({
            bidder: msg.sender,
            amount: currentBid,
            timestamp: block.timestamp
        }));
        
        emit NewBid(_auctionId, msg.sender, currentBid);
    }

    function endAuction(uint256 _auctionId) public onlyAfterEnd(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended, "Auction already ended");
        
        auction.ended = true;
        
        if (auction.highestBidder != address(0)) {
            payable(auction.owner).transfer(auction.currentHighestBid);
        }
        
        emit AuctionEnded(_auctionId, auction.highestBidder, auction.currentHighestBid);
    }

    function withdrawReturn(uint256 _auctionId) public {
        uint256 amount = pendingReturns[_auctionId][msg.sender];
        require(amount > 0, "No returns to withdraw");
        
        pendingReturns[_auctionId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        emit WithdrawReturn(_auctionId, msg.sender, amount);
    }

    function getAuction(uint256 _auctionId) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        string memory imageUrl,
        uint256 startingPrice,
        uint256 currentHighestBid,
        address highestBidder,
        uint256 endTime,
        bool ended,
        address owner
    ) {
        Auction storage auction = auctions[_auctionId];
        return (
            auction.id,
            auction.title,
            auction.description,
            auction.imageUrl,
            auction.startingPrice,
            auction.currentHighestBid,
            auction.highestBidder,
            auction.endTime,
            auction.ended,
            auction.owner
        );
    }

    function getAuctionBids(uint256 _auctionId) public view returns (Bid[] memory) {
        return auctionBids[_auctionId];
    }
}