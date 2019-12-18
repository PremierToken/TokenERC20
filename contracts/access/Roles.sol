pragma solidity ^0.5.12;

library Roles {
  struct Role {
    mapping(address => uint256) _pointers;
    address[] _bearers;
  }

  function add(Role storage role, address account) internal {
    require(!has(role, account), "Roles: account already has role");
    role._pointers[account] = role._bearers.push(account) - 1;
  }

  function remove(Role storage role, address account) internal {
    require(has(role, account), "Roles: account does not have role");

    // Replaces the the item to be removed with the last item in set
    address keyToMove = role._bearers[count(role) - 1];
    uint256 rowToReplace = role._pointers[account];
    role._pointers[keyToMove] = rowToReplace;
    role._bearers[rowToReplace] = keyToMove;
    delete role._pointers[account];
    // Removes the duplicated last item;
    role._bearers.length--;
  }

  function count(Role storage role) internal view returns (uint256) {
    return role._bearers.length;
  }

  function bearers(Role storage role) internal view returns (address[] memory) {
    return role._bearers;
  }

  function has(Role storage role, address account)
    internal
    view
    returns (bool)
  {
    require(account != address(0), "Roles: account is the zero address");

    if (role._bearers.length == 0) {
      return false;
    }

    return role._bearers[role._pointers[account]] == account;
  }
}
