#!/bin/sh

# This script generates the ABI files for the contracts in the project.
# It is intended to be run from the project root directory
# the generated ABI will be used to call the contracts from the frontend
mkdir -p ./abi/
touch ./../abi/MintGovernanceToken.json
touch ./../abi/PeerGovernanceToken.json


echo "{
  \"abi\": $(forge inspect MintGovernanceToken abi)
}" >| ./../abi/MintGovernanceToken.json

echo "{
  \"abi\": $(forge inspect PeerGovernanceToken abi)
}" >| ./../abi/PeerGovernanceToken.json