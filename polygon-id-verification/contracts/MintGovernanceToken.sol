// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// SISMO IMPORTS
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "sismo-connect-onchain-verifier/src/SismoConnectLib.sol"; // <--- add a Sismo Connect import
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";



interface IMintableERC20 is IERC20 {
    function mint(address _to, uint256 _amount) external returns (bool);
}

/*
 * @title Airdrop
 * @author Sismo
 * @dev Simple Airdrop contract that mints ERC20 tokens to the msg.sender
 * This contract is used for tutorial purposes only
 * It will be used to demonstrate how to integrate Sismo Connect
 */
contract MintGovernanceToken is SismoConnect, ERC2771Context {

    // SISMO
    error AlreadyClaimed();
    using SismoConnectHelper for SismoConnectVerifiedResult;
    mapping(uint256 => bool) public claimed;

    // add your appId
    bytes16 private _appId = 0xf4977993e52606cfd67b7a1cde717069;
    // use impersonated mode for testing
    bool private _isImpersonationMode = true;
    //PeerGovernanceToken public peerToken;

    IMintableERC20 public token;

    // Results of the verification of the Sismo Connect response.
    VerifiedAuth[] internal _verifiedAuths;
    VerifiedClaim[] internal _verifiedClaims;
    bytes internal _verifiedSignedMessage;


    constructor( address trustedForwarder, IMintableERC20 _token) SismoConnect(buildConfig(_appId, _isImpersonationMode)) ERC2771Context(trustedForwarder) // <--- Sismo Connect constructor
    {
        //peerToken = PeerGovernanceToken(0x95bA523Ea0bC13179829d2CAc727061e10b97567); //0x68ce82d73eE26c37d1325aCF69AdcBFe5427E7C0
        token = _token;
    }

// SISMO
    function claimWithSismo(bytes memory response) public {
        AuthRequest[] memory authRequests = new AuthRequest[](2);

        authRequests[0] = buildAuth({authType: AuthType.VAULT});
        authRequests[1] = buildAuth({authType: AuthType.EVM_ACCOUNT});

        // Request users to prove ownership of a Github account
        // this request is optional

        ClaimRequest[] memory claimRequests = new ClaimRequest[](2);
        claimRequests[0] = buildClaim({groupId: 0x95ab1dc5092706c18b43a36a40df0871});

        claimRequests[1] = buildClaim({groupId: 0xa4ff29395199edcc63221e5b9b5c202d});




        SismoConnectVerifiedResult memory result = verify({
            responseBytes: response,
        // we want the user to prove that he owns a Sismo Vault
        // we are recreating the auth request made in the frontend to be sure that
        // the proofs provided in the response are valid with respect to this auth request

            auths: authRequests,
            claims: claimRequests,


        //claims: claimRequests,


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
        (token.mint(_msgSender(), airdropAmount), "Minting failed");
    }

    function _msgSender() internal view virtual override(ERC2771Context) returns (address sender) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view virtual override(ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }
}
