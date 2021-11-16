// contracts/Frencapital.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Frencapital is Ownable, ERC1155 {
    uint256 public constant FREN = 0;
    uint256 public constant FOUN = 1;

    uint8 public participants = 0;

    constructor() ERC1155("https://frencapital.com/api/token/{id}.json") {
        //Pass some tokens to contract to fund work
        _mint(msg.sender, FREN, 1000**18, "");
    }

    //
    function mint(address a, uint256 amount) public onlyOwner {
        //First 4 get five percent bonus tokens for founding costs
        if(participants < 4) {
            amount = (amount * 105) / 100;
        }

        //First ten get a founder nft NFT
        if(participants < 10) {
            _mint(a, FOUN, 1, "");
        }

        participants++;
        _mint(a, FREN, amount, "");
    }
}