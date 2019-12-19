pragma solidity ^0.5.12;

import "./ownership/Ownable.sol";
import "./access/roles/AdminRole.sol";
import "./access/roles/MinterRole.sol";
import "./access/roles/BurnerRole.sol";
import "./math/SafeMath.sol";

contract PremierToken is Ownable, AdminRole, MinterRole, BurnerRole {
  using SafeMath for uint256;

  string private _name;
  string private _symbol;
  uint8 private _decimals;

  uint256 private _totalSupply;
  mapping(address => uint256) private _balances;

  event Mint(address indexed minter, address indexed account, uint256 amount);
  event Burn(address indexed burner, address indexed account, uint256 amount);

  constructor(string memory name, string memory symbol, uint8 decimals) public {
    _name = name;
    _symbol = symbol;
    _decimals = decimals;
  }

  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function decimals() public view returns (uint8) {
    return _decimals;
  }

  function totalSupply() public view returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }

  function mintTo(address account, uint256 amount) public onlyMinter {
    require(account != address(0), "PremierToken: minting to the zero address");

    _totalSupply = _totalSupply.add(amount);
    _balances[account] = _balances[account].add(amount);

    emit Mint(msg.sender, account, amount);
  }

  function burnFrom(address account, uint256 amount) public onlyBurner {
    require(
      account != address(0),
      "PremierToken: burning from the zero address"
    );

    _balances[account] = _balances[account].sub(amount);
    _totalSupply = _totalSupply.sub(amount);

    emit Burn(msg.sender, account, amount);
  }
}
