// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// SISMO IMPORTS
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "forge-std/console.sol";
import "sismo-connect-solidity/SismoConnectLib.sol"; // <--- add a Sismo Connect import
import "./PeerGovernanceToken.sol";

//POLYGON ID IMPORTS
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../lib/tutorial-examples/on-chain-verification/contracts/lib/GenesisUtils.sol";
import "../lib/tutorial-examples/on-chain-verification/contracts/interfaces/ICircuitValidator.sol";
import "../lib/tutorial-examples/on-chain-verification/contracts/verifiers/ZKPVerifier.sol";


/*
 * @title Airdrop
 * @author Sismo
 * @dev Simple Airdrop contract that mints ERC20 tokens to the msg.sender
 * This contract is used for tutorial purposes only
 * It will be used to demonstrate how to integrate Sismo Connect
 */
contract MintGovernanceToken is SismoConnect, ZKPVerifier {

  // SISMO
  error AlreadyClaimed();
  using SismoConnectHelper for SismoConnectVerifiedResult;
  mapping(uint256 => bool) public claimed;

  // add your appId
  bytes16 private _appId = 0xf4977993e52606cfd67b7a1cde717069;
  // use impersonated mode for testing
  bool private _isImpersonationMode = true;
  PeerGovernanceToken public peerToken;

  //POLYGON
  uint64 public constant TRANSFER_REQUEST_ID = 1;
  // define the amount of token to be airdropped per user
  uint256 public TOKEN_AMOUNT_FOR_AIRDROP_PER_ID = 100 * 10 ** 18;

  mapping(uint256 => address) public idToAddress;
  mapping(address => uint256) public addressToId;

  constructor(
  )
    SismoConnect(buildConfig(_appId, _isImpersonationMode)) // <--- Sismo Connect constructor
  {
    peerToken = PeerGovernanceToken(0x95bA523Ea0bC13179829d2CAc727061e10b97567); //0x68ce82d73eE26c37d1325aCF69AdcBFe5427E7C0

  }

// SISMO
  function claimWithSismo(bytes memory response) public {
    SismoConnectVerifiedResult memory result = verify({
      responseBytes: response,
      // we want the user to prove that he owns a Sismo Vault
      // we are recreating the auth request made in the frontend to be sure that
      // the proofs provided in the response are valid with respect to this auth request
      auth: buildAuth({authType: AuthType.VAULT}),
      // we also want to check if the signed message provided in the response is the signature of the user's address
      signature: buildSignature({message: abi.encode(msg.sender)})
    });

    // if the proofs and signed message are valid, we take the userId from the verified result
    // in this case the userId is the vaultId (since we used AuthType.VAULT in the auth request),
    // it is the anonymous identifier of a user's vault for a specific app
    // --> vaultId = hash(userVaultSecret, appId)
    uint256 vaultId = result.getUserId(AuthType.VAULT);

    // we check if the user has already claimed the airdrop
    if (claimed[vaultId]) {
      revert AlreadyClaimed();
    }
    // each vaultId can claim 100 tokens
    uint256 airdropAmount = 100 * 10 ** 18;

    // we mark the user as claimed. We could also have stored more user airdrop information for a more complex airdrop system. But we keep it simple here.
    claimed[vaultId] = true;

    // we mint the tokens to the user
    peerToken.mint(msg.sender, airdropAmount);
  }

  //POLYGON
  function _beforeProofSubmit(
    uint64, /* requestId */
    uint256[] memory inputs,
    ICircuitValidator validator
    ) internal view override {
        // check that the challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
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

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // execute the airdrop
        if (idToAddress[id] == address(0)) {
            peerToken.mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
  }
  // Disabled to suport Sismo

  // function _beforeTokenTransfer(
  //       address, /* from */
  //       address to,
  //       uint256 /* amount */
  //   ) internal view override {
  //       require(
  //           proofs[to][TRANSFER_REQUEST_ID] == true,
  //           "only identities who provided proof are allowed to receive tokens"
  //       );
  //   }

}
