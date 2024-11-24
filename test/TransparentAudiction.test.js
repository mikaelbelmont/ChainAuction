const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TransparentAuction", function () {
  let TransparentAuction;
  let auction;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    TransparentAuction = await ethers.getContractFactory("TransparentAuction");
    [owner, addr1, addr2] = await ethers.getSigners();
    auction = await TransparentAuction.deploy();
    await auction.deployed();
  });

  it("Should create a new auction", async function () {
    const tx = await auction.createAuction(
      "Test Auction",
      "Test Description",
      "image.jpg",
      ethers.utils.parseEther("1"),
      3600 // 1 hour
    );
    await tx.wait();

    const [id, title, description, imageUrl, startingPrice] = await auction.getAuction(0);
    
    expect(title).to.equal("Test Auction");
    expect(description).to.equal("Test Description");
    expect(imageUrl).to.equal("image.jpg");
    expect(startingPrice).to.equal(ethers.utils.parseEther("1"));
  });
});