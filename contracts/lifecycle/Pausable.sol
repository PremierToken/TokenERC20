pragma solidity ^0.5.12;

import "../access/roles/AdminRole.sol";

contract Pausable is AdminRole {
  event Paused(address account);
  event Unpaused(address account);

  bool private _paused;

  constructor() internal {}

  function paused() public view returns (bool) {
    return _paused;
  }

  modifier whenNotPaused() {
    require(!_paused, "Pausable: paused");
    _;
  }

  modifier whenPaused() {
    require(_paused, "Pausable: not paused");
    _;
  }

  function pause() public onlyAdmin whenNotPaused {
    _paused = true;
    emit Paused(msg.sender);
  }

  function unpause() public onlyAdmin whenPaused {
    _paused = false;
    emit Unpaused(msg.sender);
  }
}
