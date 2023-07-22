#!/bin/sh

# This script generates the ABI files for the contracts in the project.
# It is intended to be run from the project root directory
# the generated ABI will be used to call the contracts from the frontend
mkdir -p ./abi/
touch ./../abi/MintGovernanceToken.json

echo "{\n  \"mintABI\": $(forge inspect MintGovernanceToken abi)\n}" >| ./../abi/MintGovernanceToken.json

touch ./../abi/PeerGovernanceToken.json

echo "{\n  \"tokenABI\": $(forge inspect PeerGovernanceToken abi)\n}" >| ./../abi/PeerGovernanceToken.json