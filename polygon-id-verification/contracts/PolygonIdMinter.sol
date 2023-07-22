// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

interface IMintableERC20 is IERC20 {
    function mint(address _to, uint256 _amount) external returns (bool);
}

contract PolygonIdMinter is ZKPVerifier {
    uint64 public constant TRANSFER_REQUEST_ID = 1;

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    uint256 public TOKEN_AMOUNT_FOR_AIRDROP_PER_ID = 5 * 10**18; // Modify if the decimals of ERC20 token are not 18

    IMintableERC20 public token;

    constructor(IMintableERC20 _token){
        token = _token;
    }

    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        // check that  challenge input is address of sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        /*// this is linking between msg.sender and
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );*/
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        // get user id
        uint256 id = inputs[1];
        // additional check didn't get airdrop tokens before
        if (idToAddress[id] == address(0) && addressToId[_msgSender()] == 0 ) {
            require(token.mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID), "Minting failed"); // Replace _mint with token.mint
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }
}
