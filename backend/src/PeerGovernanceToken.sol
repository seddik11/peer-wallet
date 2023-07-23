// SPDX-License-Identifier: MIT


// TOKEN USED FOR THE GOVERNANCE, COMENTED TO ONLY BE DEPLOYED ONCE


/*pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract PeerGovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    constructor() ERC20("Peer Governance Token", "PGT") ERC20Permit("PeerVoteToken") {}

    // The functions below are overrides required by Solidity.
    function _afterTokenTransfer(address from, address to, uint256 amount) internal virtual{
        // Instead of calling _afterTokenTransfer directly, call a custom function
        _customAfterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal virtual override(ERC20, ERC20Permit) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal virtual override(ERC20, ERC20Permit) {
        super._burn(account, amount);
    }

    // We define _update here to avoid conflicts with the base contracts
    function _update(address from, address to, uint256 amount) internal virtual override(ERC20Votes) {
        super._update(from, to, amount);
    }

    // We define nonces here to avoid conflicts with the base contracts
    function nonces(address owner) public view virtual override returns (uint256) {
        return ERC20Permit.nonces(owner);
    }

    // Custom function for handling token transfers
    function _customAfterTokenTransfer(address from, address to, uint256 amount) internal {
        // Add your custom logic here if needed
        // For example, emit events, update state, etc.
        // This function will be called after every token transfer
    }

    function mint(uint256 amount, address receiver) public {
        _mint(receiver, amount);
    }
}*/
