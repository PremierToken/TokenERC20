const {ethers} = require('@nomiclabs/buidler');
const {deployContract, getWallets, solidity} = require('ethereum-waffle');
const chai = require('chai');
const MinterRoleArtifact = require('../../../artifacts/MinterRoleMock.json');

chai.use(solidity);

const {expect} = chai;

async function createMinterRole(wallet) {
  return deployContract(wallet, MinterRoleArtifact, []);
}

describe('Minter Role', async () => {
  const provider = ethers.provider;
  const [owner, wallet1, wallet2] = getWallets(provider);

  describe('Constructor', () => {
    it('Should set the owner as minter on contract creation', async () => {
      const minterRole = await createMinterRole(owner);

      const currentMinters = await minterRole.minters();
      expect(currentMinters).to.deep.equal([owner.address]);
    });
  });

  describe('isMinter', () => {
    it('Should return false when account is not a minter', async () => {
      const minterRole = await createMinterRole(owner);

      const result = await minterRole.isMinter(wallet1.address);
      expect(result).to.eq(false);
    });

    it('Should return true when account is a minter', async () => {
      const minterRole = await createMinterRole(owner);

      const result = await minterRole.isMinter(owner.address);
      expect(result).to.eq(true);
    });
  });

  describe('Minter management', () => {
    it('Should add a minter when caller has the AdminRole', async () => {
      const deployedMinterRole = await createMinterRole(owner);
      await deployedMinterRole.addAdmin(wallet1.address);
      const minterRole = deployedMinterRole.connect(wallet1);

      await minterRole.addMinter(wallet2.address);

      const result = await minterRole.minters();
      expect(result).to.contain(wallet2.address);
    });

    it('Should revert when trying to add a minter with an account which does not have AdminRole', async () => {
      const deployedMinterRole = await createMinterRole(owner);
      const minterRole = deployedMinterRole.connect(wallet1);

      await expect(minterRole.addMinter(wallet1.address)).to.be.reverted;
    });

    it('Should be able to remove a minter when caller has AdminRole', async () => {
      const deployedMinterRole = await createMinterRole(owner);
      await deployedMinterRole.addAdmin(wallet1.address);
      const minterRole = deployedMinterRole.connect(wallet1);
      await minterRole.addMinter(wallet2.address);

      await minterRole.removeMinter(wallet2.address);

      const result = await minterRole.minters();
      expect(result).not.to.contain(wallet2.address);
    });

    it('Should revert when trying to remove a minter with an account which does not have AdminRole', async () => {
      const deployedMinterRole = await createMinterRole(owner);
      const minterRole = deployedMinterRole.connect(wallet1);

      await expect(minterRole.removeMinter(owner.address)).to.be.reverted;
    });
  });
});
