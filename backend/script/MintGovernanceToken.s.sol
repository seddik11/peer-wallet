// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {MintGovernanceToken} from "src/MintGovernanceToken.sol";
import {PeerGovernanceToken} from "../src/PeerGovernanceToken.sol";

contract DeployAirdrop is Script {
  function run() public {
    vm.startBroadcast();
    MintGovernanceToken mintToken = new MintGovernanceToken();
    PeerGovernanceToken peerToken = new PeerGovernanceToken();

    console.log("PeerGovernanceToken Contract deployed at", address(peerToken));
    console.log("MintGovernanceToken Contract deployed at", address(mintToken));

    vm.stopBroadcast();
  }
}
