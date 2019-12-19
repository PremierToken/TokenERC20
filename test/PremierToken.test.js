const {ethers} = require('@nomiclabs/buidler');
const {deployContract, getWallets, solidity} = require('ethereum-waffle');
const chai = require('chai');
const OwnableArtifact = require('../artifacts/PremierToken.json');

chai.use(solidity);

const {expect} = chai;

async function createContract(
  wallet,
  {name = 'Premier Token', symbol = 'PTK', decimals = 18} = {}
) {
  return deployContract(wallet, OwnableArtifact, [name, symbol, decimals]);
}

describe('Premier Token', () => {
  const provider = ethers.provider;
  const [owner, admin, minter, burner, client] = getWallets(provider);

  describe('Mint', () => {
    it('should allow owner to mint to client address', async () => {
      const PremierToken = await createContract(owner);

      await PremierToken.mintTo(client.address, 1000);

      const clientBalance = await PremierToken.balanceOf(client.address);
      const totalSupply = await PremierToken.totalSupply();

      expect(clientBalance).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });

    it('should allow minter to mint to client address', async () => {
      const contractAsOwner = await createContract(owner);
      await contractAsOwner.addMinter(minter.address);

      const contractAsMinter = contractAsOwner.connect(minter);

      await contractAsMinter.mintTo(client.address, 1000);

      const clientBalance = await contractAsMinter.balanceOf(client.address);
      const totalSupply = await contractAsMinter.totalSupply();

      expect(clientBalance).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });
  });

  describe('Burn', () => {
    it('should allow owner to burn to client address', async () => {
      const PremierToken = await createContract(owner);
      await PremierToken.mintTo(client.address, 1000);
      await PremierToken.burnFrom(client.address, 800);

      const clientBalance = await PremierToken.balanceOf(client.address);
      const totalSupply = await PremierToken.totalSupply();

      expect(clientBalance).to.equal(200);
      expect(totalSupply).to.equal(200);
    });

    it('should allow minter to burn to client address', async () => {
      const contractAsOwner = await createContract(owner);
      await contractAsOwner.addBurner(burner.address);

      const contractAsBurner = contractAsOwner.connect(owner);
      await contractAsBurner.mintTo(client.address, 1000);

      contractAsOwner.connect(burner);
      await contractAsBurner.burnFrom(client.address, 800);

      const clientBalance = await contractAsBurner.balanceOf(client.address);
      const totalSupply = await contractAsBurner.totalSupply();

      expect(clientBalance).to.equal(200);
      expect(totalSupply).to.equal(200);
    });
  });
});
