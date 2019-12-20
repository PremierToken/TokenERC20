pragma solidity ^0.5.12;

import "../Roles.sol";
import "./AdminRole.sol";

contract BurnerRole is AdminRole {
  using Roles for Roles.Role;

  event BurnerAdded(address indexed account);
  event BurnerRemoved(address indexed account);

  Roles.Role private _burners;

  constructor() internal {
    _internalAddBurner(msg.sender);
  }

  modifier onlyBurner() {
    require(
      isBurner(msg.sender),
      "BurnerRole: caller does not have the Burner role"
    );
    _;
  }

  function isBurner(address account) public view returns (bool) {
    return _burners.has(account);
  }

  function burners() public view returns (address[] memory) {
    return _burners.bearers();
  }

  function addBurner(address account) public onlyAdmin {
    _internalAddBurner(account);
  }

  function removeBurner(address account) public onlyAdmin {
    _internalRemoveBurner(account);
  }

  function _internalAddBurner(address account) internal {
    _burners.add(account);
    emit BurnerAdded(account);
  }

  function _internalRemoveBurner(address account) internal {
    _burners.remove(account);
    emit BurnerRemoved(account);
  }
}
