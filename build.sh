#!/bin/bash

# get the abi
ABI=`solc --abi nottario.sol | tail -n 1`

# get the bin
BIN=`solc --bin nottario.sol | tail -n 1` 

echo "var abi=$ABI; var bin='$BIN';" > js/solidity.js
