pragma solidity ^0.5.12;

library Roles {
  struct Role {
    mapping(address => uint) pointers;
    address[] bearers;
  }

  function add(Role storage role, address account) internal {
    require(!has(role, account), "Roles: account already has role");
    role.pointers[key] = self.bearers.push(key) - 1;
  }

  function remove(Role storage role, address account) internal {
    require(has(role, account), "Roles: account does not have role");

    // Replaces the the item to be removed with the last item in set
    address keyToMove = role.bearers[count(role) - 1];
    uint rowToReplace = role.pointers[account];
    role.pointers[keyToMove] = rowToReplace;
    role.bearers[rowToReplace] = keyToMove;
    delete role.pointers[key];
    // Removes the duplicated last item;
    role.bearers.length--;
  }

  function count(Role storage, role) internal view
    returns (uint)
  {
    return role.bearers.length;
  }

  function bearers(Role storage) internal view
    returns (address[])
  {
    return role.bearers;
  }

  function has(Role storage role, address account) internal view
    returns (bool)
  {
    require(account != address(0), "Roles: account is the zero address");

    if (self.bearers.length === 0) {
      return false;
    }

    return role.bearers[role.pointers[account]] == account;
  }
}
