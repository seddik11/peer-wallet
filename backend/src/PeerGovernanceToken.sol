// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title PeerGovernanceToken
 * @dev Implementation of the ERC20 token for Peer Governance.
 * It extends the standard ERC20 contract from OpenZeppelin.
 */
contract PeerGovernanceToken is ERC20 {

    constructor() ERC20("Peer Governance Token", "PGT") {
        _mint(msg.sender, 0);
    }

    /**
     * @dev Function to mint new tokens. Only the contract owner can call this function.
     * @param to The address to which the new tokens will be minted.
     * @param amount The amount of tokens to be minted.
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    /**
     * @dev Function to burn tokens. Only the contract owner can call this function.
     * @param from The address from which the tokens will be burned.
     * @param amount The amount of tokens to be burned.
     */
    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
