const { ethers } = require('@nomiclabs/buidler');
const { deployContract, getWallets, solidity } = require('ethereum-waffle');
const chai = require('chai');
const BurnerRoleArtifact = require('../../../artifacts/BurnerRoleMock.json');

chai.use(solidity);

const { expect } = chai;

async function createBurnerRole(wallet) {
  return deployContract(wallet, BurnerRoleArtifact, []);
}

describe('Burner Role', async () => {
  const provider = ethers.provider;
  const [owner, wallet1, wallet2] = getWallets(provider);

  describe('Constructor', () => {
    it('Should set the owner as burner on contract creation', async () => {
      const burnerRole = await createBurnerRole(owner);

      const currentBurners = await burnerRole.burners();
      expect(currentBurners).to.deep.equal([owner.address]);
    });
  });

  describe('isBurner', () => {
    it('Should return false when account is not a burner', async () => {
      const burnerRole = await createBurnerRole(owner);

      const result = await burnerRole.isBurner(wallet1.address);
      expect(result).to.eq(false);
    });

    it('Should return true when account is a burner', async () => {
      const burnerRole = await createBurnerRole(owner);

      const result = await burnerRole.isBurner(owner.address);
      expect(result).to.eq(true);
    });
  });

  describe('Burner management', () => {
    it('Should add a burner when caller has the AdminRole', async () => {
      const deployedBurnerRole = await createBurnerRole(owner);
      await deployedBurnerRole.addAdmin(wallet1.address);
      const burnerRole = deployedBurnerRole.connect(wallet1);

      await burnerRole.addBurner(wallet2.address);

      const result = await burnerRole.burners();
      expect(result).to.contain(wallet2.address);
    });

    it('Should revert when trying to add a burner with an account which does not have AdminRole', async () => {
      const deployedBurnerRole = await createBurnerRole(owner);
      const burnerRole = deployedBurnerRole.connect(wallet1);

      await expect(burnerRole.addBurner(wallet1.address)).to.be.reverted;
    });

    it('Should be able to remove a burner when caller has AdminRole', async () => {
      const deployedBurnerRole = await createBurnerRole(owner);
      await deployedBurnerRole.addAdmin(wallet1.address);
      const burnerRole = deployedBurnerRole.connect(wallet1);
      await burnerRole.addBurner(wallet2.address);

      await burnerRole.removeBurner(wallet2.address);

      const result = await burnerRole.burners();
      expect(result).not.to.contain(wallet2.address);
    });

    it('Should revert when trying to remove a burner with an account which does not have AdminRole', async () => {
      const deployedBurnerRole = await createBurnerRole(owner);
      const burnerRole = deployedBurnerRole.connect(wallet1);

      await expect(burnerRole.removeBurner(owner.address)).to.be.reverted;
    });
  });
});
