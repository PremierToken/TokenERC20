const { ethers } = require('@nomiclabs/buidler');
const { deployContract, getWallets, solidity } = require('ethereum-waffle');
const chai = require('chai');
const AdminRoleArtifact = require('../../../artifacts/AdminRoleMock.json');

chai.use(solidity);

const { expect } = chai;

async function createAdminRole(wallet) {
  return deployContract(wallet, AdminRoleArtifact, []);
}

describe('Admin Role', async () => {
  const provider = ethers.provider;
  const [owner, wallet1] = getWallets(provider);

  describe('Constructor', () => {
    it('Should set the owner as admin on contract creation', async () => {
      const adminRole = await createAdminRole(owner);

      const currentAdmins = await adminRole.admins();
      expect(currentAdmins).to.deep.equal([owner.address]);
    });
  });

  describe('isAdmin', () => {
    it('Should return false when account is not a admin', async () => {
      const adminRole = await createAdminRole(owner);

      const result = await adminRole.isAdmin(wallet1.address);
      expect(result).to.eq(false);
    });

    it('Should return true when account is a admin', async () => {
      const adminRole = await createAdminRole(owner);

      const result = await adminRole.isAdmin(owner.address);
      expect(result).to.eq(true);
    });
  });

  describe('Admin management', () => {
    it('Should add a admin when caller is the owner', async () => {
      const adminRole = await createAdminRole(owner);

      await adminRole.addAdmin(wallet1.address);

      const result = await adminRole.admins();
      expect(result).to.contain(wallet1.address);
    });

    it('Should revert when trying to add a admin with an account which is not the owner', async () => {
      const deployedAdminRole = await createAdminRole(owner);
      const adminRole = deployedAdminRole.connect(wallet1);

      await expect(adminRole.addAdmin(wallet1.address)).to.be.reverted;
    });

    it('Should be able to remove a admin when caller is the owner', async () => {
      const adminRole = await createAdminRole(owner);
      await adminRole.addAdmin(wallet1.address);

      await adminRole.removeAdmin(wallet1.address);

      const result = await adminRole.admins();
      expect(result).not.to.contain(wallet1.address);
    });

    it('Should revert when trying to remove a admin with an account which is not the owner', async () => {
      const deployedAdminRole = await createAdminRole(owner);
      const adminRole = deployedAdminRole.connect(wallet1);

      await expect(adminRole.removeAdmin(owner.address)).to.be.reverted;
    });
  });
});
