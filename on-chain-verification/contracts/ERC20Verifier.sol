// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "sismo-connect-onchain-verifier/src/SismoConnectLib.sol"; // <--- add a Sismo Connect import
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "./lib/GenesisUtils.sol";
import "./interfaces/ICircuitValidator.sol";
import "./verifiers/ZKPVerifier.sol";

contract ERC20Verifier is ERC20, ZKPVerifier, ERC20Permit, ERC20Votes, SismoConnect {

    /**
    SISMO
    **/
    error AlreadyClaimed();
    using SismoConnectHelper for SismoConnectVerifiedResult;
    mapping(uint256 => bool) public claimed;

    // add your appId
    bytes16 private _appId = 0xf4977993e52606cfd67b7a1cde717069;
    // use impersonated mode for testing
    bool private _isImpersonationMode = true;

    /**
    polygon-id
    **/
    uint64 public constant TRANSFER_REQUEST_ID = 1;

    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    uint256 public TOKEN_AMOUNT_FOR_AIRDROP_PER_ID =
    5 * 10 ** uint256(decimals());

    constructor(string memory name_, string memory symbol_)
    ERC20(name_, symbol_)
    ERC20Permit(name_)
    SismoConnect(buildConfig(_appId, _isImpersonationMode)) // <--- Sismo Connect constructor
    {}
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

        _mint(msg.sender, airdropAmount);
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
        // this is linking between msg.sender and
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
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

        // get user id
        uint256 id = inputs[1];
        // additional check didn't get airdrop tokens before
        if (idToAddress[id] == address(0) && addressToId[_msgSender()] == 0 ) {
            super._mint(_msgSender(), TOKEN_AMOUNT_FOR_AIRDROP_PER_ID);
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }

    function _beforeTokenTransfer(
        address, /* from */
        address to,
        uint256 /* amount */
    ) internal view override {}

    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal virtual override(ERC20, ERC20Votes) {
        super._mint(account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }

}
