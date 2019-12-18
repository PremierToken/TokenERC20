const { ethers } = require('@nomiclabs/buidler');
const { deployContract, getWallets, solidity } = require('ethereum-waffle');
const chai = require('chai');
const OwnableArtifact = require('../../artifacts/OwnableMock.json');

chai.use(solidity);

const { expect } = chai;

async function createOwnable(wallet) {
  return deployContract(wallet, OwnableArtifact, []);
}

describe('Ownable', () => {
  const provider = ethers.provider;
  const [owner, wallet1] = getWallets(provider);

  describe('Constructor', () => {
    it('Should make the contract creator the owner', async () => {
      const ownable = await createOwnable(owner);

      const result = await ownable.owner();

      expect(result).to.equal(owner.address);
    });
  });

  describe('isOwner', () => {
    it('Should return true if the caller is the owner', async () => {
      const ownable = await createOwnable(owner);

      const result = await ownable.isOwner();

      expect(result).to.equal(true);
    });

    it('Should return false if the caller is not the owner', async () => {
      const deployedOwnable = await createOwnable(owner);
      const ownable = deployedOwnable.connect(wallet1);

      const result = await ownable.isOwner();

      expect(result).to.equal(false);
    });
  });
});
