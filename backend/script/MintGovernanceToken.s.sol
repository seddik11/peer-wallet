// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {MintGovernanceToken} from "src/MintGovernanceToken.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//import {PeerGovernanceToken} from "../src/PeerGovernanceToken.sol";

interface IMintableERC20 is IERC20 {
    function mint(address _to, uint256 _amount) external returns (bool);
}
contract DeployAirdrop is Script {
  function run() public {
    vm.startBroadcast();
    MintGovernanceToken mintToken = MintGovernanceToken(0xEa412a48E2EDFB3771aa61aFc14E203828D1e237);
    //PeerGovernanceToken peerToken = new PeerGovernanceToken();

    //console.log("PeerGovernanceToken Contract deployed at", address(peerToken));
    console.log("MintGovernanceToken Contract deployed at", address(mintToken));

    vm.stopBroadcast();
  }
}
