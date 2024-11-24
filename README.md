# Transparent Auction DApp

Um aplicativo descentralizado (DApp) para criação e participação em leilões usando smart contracts Ethereum.

## Tecnologias Utilizadas

- Solidity
- React
- Hardhat
- Ethers.js
- TailwindCSS

## Configuração

1. Clone o repositório
```bash
git clone [url-do-repositorio]
cd [nome-do-repositorio]
```

2. Instale as dependências
```bash
# Na raiz do projeto
npm install

# Na pasta frontend
cd frontend
npm install
```

3. Configure o ambiente local
```bash
# Terminal 1: Inicie o node Hardhat
npx hardhat node

# Terminal 2: Deploy do contrato
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Inicie o frontend
cd frontend
npm run dev
```

## Configuração do MetaMask

1. Adicione a rede Hardhat Local:
- Nome: Hardhat Local
- RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Símbolo: ETH

2. Importe uma conta do Hardhat:
- Copie uma chave privada do terminal onde está rodando o node Hardhat
- No MetaMask: Importar Conta -> Cole a chave privada

## Funcionalidades

- Conexão com carteira MetaMask
- Criação de leilões
- Visualização de leilões ativos
- Sistema de lances
- Tempo limite para leilões
- Interface responsiva

## Detalhes do Deploy

- Rede: Hardhat Local (desenvolvimento)
- Endereço do Contrato: 0x5FbDB2315678afecb367f032d93F642f64180aa3

## Como Usar

1. Conecte sua carteira usando o botão "Connect Wallet"
2. Para criar um leilão:
   - Clique em "Create Auction"
   - Preencha os detalhes do leilão
   - Confirme a transação no MetaMask

3. Para dar um lance:
   - Encontre o leilão desejado
   - Insira o valor do lance
   - Confirme a transação no MetaMask

Obs.: Caso falhe ao criar um leilão ou conectar a carteira, limpe o cache da carteira, desconecte a rede e exclua a rede. Ao conectar ele ira configurar tudo automaticamente.