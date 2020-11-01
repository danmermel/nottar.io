pragma solidity ^0.5.10;

contract nottario {

  bytes32 public hash;
  bytes32 public name;
  address public owner;
  bytes32 public mime_type;
  uint public size;
  uint public file_timestamp;
  uint public timestamp;

  constructor (bytes32 _hash, bytes32 _name, bytes32 _mime_type, uint _size, uint _file_timestamp) public payable {
    assert (msg.value >= 10000000000000000);
    owner = msg.sender;
    name = _name;
    hash = _hash;
    mime_type = _mime_type;
    size = _size;
    file_timestamp = _file_timestamp;
    timestamp = now;
    address payable bank = 0xC122Ca236edf7B33fb73Fbb459A08f7935e6C96B;
    require(bank.send(msg.value/2), "Failed to send ether to bank");
    address payable bank2 = 0x39267EC3f4e1610cd871D3545e01918F1dBa7B84;
    require (bank2.send(msg.value/2), "Failed to send ether to bank");
  }
}

