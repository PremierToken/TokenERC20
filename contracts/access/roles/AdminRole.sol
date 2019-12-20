pragma solidity ^0.5.12;

import "../Roles.sol";
import "../../ownership/Ownable.sol";

contract AdminRole is Ownable {
  using Roles for Roles.Role;

  event AdminAdded(address indexed account);
  event AdminRemoved(address indexed account);

  Roles.Role private _admins;

  constructor() internal {
    _internalAddAdmin(msg.sender);
  }

  modifier onlyAdmin() {
    require(
      isAdmin(msg.sender),
      "AdminRole: caller does not have the Admin role"
    );
    _;
  }

  function isAdmin(address account) public view returns (bool) {
    return _admins.has(account);
  }

  function admins() public view returns (address[] memory) {
    return _admins.bearers();
  }

  function addAdmin(address account) public onlyAdmin {
    _internalAddAdmin(account);
  }

  function removeAdmin(address account) public onlyAdmin {
    _internalRemoveAdmin(account);
  }

  function _internalAddAdmin(address account) internal {
    _admins.add(account);
    emit AdminAdded(account);
  }

  function _internalRemoveAdmin(address account) internal {
    require(account != msg.sender, "AdminRole: caller can not renounce itself");
    _admins.remove(account);
    emit AdminRemoved(account);
  }
}
