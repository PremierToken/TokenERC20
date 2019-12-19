const {ethers} = require('@nomiclabs/buidler');
const {deployContract, getWallets, solidity} = require('ethereum-waffle');
const chai = require('chai');
const OwnableArtifact = require('../artifacts/PremierToken.json');

chai.use(solidity);

const {expect} = chai;

async function createPremierToken(
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
      const premierToken = await createPremierToken(owner);

      await premierToken.mintTo(client.address, 1000);

      const clientBalance = await premierToken.balanceOf(client.address);
      const totalSupply = await premierToken.totalSupply();

      expect(clientBalance).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });

    it('should allow minter to mint to client address', async () => {
      const contractAsOwner = await createPremierToken(owner);
      await contractAsOwner.addMinter(minter.address);

      const contractAsMinter = contractAsOwner.connect(minter);

      await contractAsMinter.mintTo(client.address, 1000);

      const clientBalnce = await contractAsMinter.balanceOf(client.address);
      const totalSupply = await contractAsMinter.totalSupply();

      expect(clientBalnce).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });
  });

  describe('Burn', () => {
    it.todo('should allow owner to mint to client address');

    it.todo('should allow minter to mint to client address');
  });
});
