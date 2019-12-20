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
  const [owner, admin, minter, burner, client1, client2] = getWallets(provider);

  describe('Constructor', () => {
    it('should deploy the contract in the paused state', async () => {
      const contract = await createContract(owner);

      const result = await contract.paused();

      expect(result).to.equal(true);
    });
  });

  describe('Admin permissions', () => {
    it('should allow an admin to make another account an admin', async () => {
      const contract = await createContract(owner);
      await contract.addAdmin(admin.address);

      const contractAsAdmin = contract.connect(admin);

      await expect(contractAsAdmin.addAdmin(minter.address)).to.not.reverted;
    });

    it('should allow an admin to remove admin privileges from another account', async () => {
      const contract = await createContract(owner);
      await contract.addAdmin(admin.address);
      await contract.addAdmin(minter.address);

      const contractAsAdmin = contract.connect(admin);

      await expect(contractAsAdmin.removeAdmin(minter.address)).to.not.reverted;
    });
  });

  describe('Mint', () => {
    it('should allow owner to mint to client address', async () => {
      const PremierToken = await createContract(owner);

      await PremierToken.mintTo(client1.address, 1000);

      const clientBalance = await PremierToken.balanceOf(client1.address);
      const totalSupply = await PremierToken.totalSupply();

      expect(clientBalance).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });

    it('should allow minter to mint to client address', async () => {
      const contractAsOwner = await createContract(owner);
      await contractAsOwner.addMinter(minter.address);

      const contractAsMinter = contractAsOwner.connect(minter);

      await contractAsMinter.mintTo(client1.address, 1000);

      const clientBalance = await contractAsMinter.balanceOf(client1.address);
      const totalSupply = await contractAsMinter.totalSupply();

      expect(clientBalance).to.equal(1000);
      expect(totalSupply).to.equal(1000);
    });
  });

  describe('Burn', () => {
    it('should allow owner to burn from client address', async () => {
      const PremierToken = await createContract(owner);
      await PremierToken.mintTo(client1.address, 1000);
      await PremierToken.burnFrom(client1.address, 800);

      const clientBalance = await PremierToken.balanceOf(client1.address);
      const totalSupply = await PremierToken.totalSupply();

      expect(clientBalance).to.equal(200);
      expect(totalSupply).to.equal(200);
    });

    it('should allow burner to burn from client address', async () => {
      const contractAsOwner = await createContract(owner);
      await contractAsOwner.addBurner(burner.address);

      const contractAsBurner = contractAsOwner.connect(owner);
      await contractAsBurner.mintTo(client1.address, 1000);

      contractAsOwner.connect(burner);
      await contractAsBurner.burnFrom(client1.address, 800);

      const clientBalance = await contractAsBurner.balanceOf(client1.address);
      const totalSupply = await contractAsBurner.totalSupply();

      expect(clientBalance).to.equal(200);
      expect(totalSupply).to.equal(200);
    });
  });

  describe('Transfer', () => {
    it('should not allow transfers when in paused state', async () => {
      const contract = await createContract(owner);
      await contract.mintTo(client1.address, 1000);
      await contract.mintTo(client2.address, 1000);

      const contractAsClient1 = contract.connect(client1);

      await expect(contractAsClient1.transfer(client2.address, 500)).to.be
        .reverted;
    });
  });
});
