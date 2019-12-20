pragma solidity ^0.5.12;

import "../Roles.sol";
import "./AdminRole.sol";

contract MinterRole is AdminRole {
  using Roles for Roles.Role;

  event MinterAdded(address indexed account);
  event MinterRemoved(address indexed account);

  Roles.Role private _minters;

  constructor() internal {
    _internalAddMinter(msg.sender);
  }

  modifier onlyMinter() {
    require(
      isMinter(msg.sender),
      "MinterRole: caller does not have the Minter role"
    );
    _;
  }

  function isMinter(address account) public view returns (bool) {
    return _minters.has(account);
  }

  function minters() public view returns (address[] memory) {
    return _minters.bearers();
  }

  function addMinter(address account) public onlyAdmin {
    _internalAddMinter(account);
  }

  function removeMinter(address account) public onlyAdmin {
    _internalRemoveMinter(account);
  }

  function _internalAddMinter(address account) internal {
    _minters.add(account);
    emit MinterAdded(account);
  }

  function _internalRemoveMinter(address account) internal {
    _minters.remove(account);
    emit MinterRemoved(account);
  }
}
