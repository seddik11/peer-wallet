// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {MintGovernance} from "src/MintGovernance.sol";
import "src/GovernanceToken.sol"; // <--- Import the GovernanceToken contract


contract DeployAirdrop is Script {

  //GovernanceToken governanceToken = GovernanceToken(0xD84683511C82e8d124112D69b7BfF2D277e75167);

  function run() public {
    vm.startBroadcast();

    // Deploy the GovernanceToken contract
    PeerGovernanceToken governanceToken = new PeerGovernanceToken();
    console.log("GovernanceToken Contract deployed at", address(governanceToken));

    // Use the deployed token address to create the MintGovernance contract
    MintGovernance governanceMint = new MintGovernance(governanceToken);
    console.log("Airdrop Contract deployed at", address(governanceMint));
    
    vm.stopBroadcast();
  }
}
