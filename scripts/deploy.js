const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    console.log("Starting deployment process...");

    // Aguarda um pouco para garantir que a rede está pronta
    await hre.network.provider.ready;

    // Deploy do contrato
    const TransparentAuction = await ethers.getContractFactory("TransparentAuction");
    console.log("Deploying TransparentAuction...");
    
    const transparentAuction = await TransparentAuction.deploy();
    await transparentAuction.deployed();
    
    console.log("TransparentAuction deployed to:", transparentAuction.address);

    // Aguarda um pouco antes de criar o leilão demo
    await new Promise(resolve => setTimeout(resolve, 2000));

    // leilão de teste
    try {
        const oneHour = 3600;
        console.log("Creating demo auction...");
        
        const createTx = await transparentAuction.createAuction(
            "Demo Auction",
            "This is a demonstration auction",
            "https://bit.ly/3Gp7HWx", // URL curta e estável
            ethers.utils.parseEther("0.1"),
            oneHour,
            {
                gasLimit: 500000 // Gas limit fixo para garantir
            }
        );

        console.log("Waiting for demo auction transaction...");
        await createTx.wait();
        console.log("Demo auction created successfully!");

        // Verificar se o leilão foi criado
        const auctionCount = await transparentAuction.auctionCounter();
        console.log("Current auction count:", auctionCount.toString());

        const demoAuction = await transparentAuction.getAuction(0);
        console.log("Demo auction details:", {
            title: demoAuction.title,
            description: demoAuction.description,
            startingPrice: ethers.utils.formatEther(demoAuction.startingPrice),
            endTime: demoAuction.endTime.toString()
        });

    } catch (error) {
        console.error("Error creating demo auction:", error);
        // Continua a execução mesmo se houver erro no leilão demo
    }

    console.log("Deployment and setup completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Deployment failed:", error);
        process.exit(1);
    });