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
    address payable bank = 0xBCCC1872B596Aec362BD3fBa9Fa4961fD73225aA;
    require(bank.send(msg.value/2), "Failed to send ether to bank");
    address payable bank2 = 0xf203aD6CC9AD6d9289b7518a0Be28CC8d42eC91E;
    require (bank2.send(msg.value/2), "Failed to send ether to bank");
  }
}

