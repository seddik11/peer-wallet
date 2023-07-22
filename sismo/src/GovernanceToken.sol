// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PeerGovernanceToken is ERC20 {
    constructor() ERC20("PeerGovernanceToken", "PGT") {
        _mint(msg.sender, 0);
    }
    function mint(address to, uint256 amount) public  {
        _mint(to, amount);
    }
}
