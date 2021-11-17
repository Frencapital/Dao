// contracts/Frencapital.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Frencapital is Ownable, ERC1155 {
    uint256 public constant FREN = 0;
    uint256 public constant FOUN = 1;

    uint8 public participants = 0;

    uint8 public daoShare = 4;

    constructor() ERC1155("https://frencapital.com/api/token/{id}.json") {
    }

    //Mint new tokens for new participants
    function mint(address a, uint256 amount) public onlyOwner {
        //First ten get a founder nft NFT
        if(participants < 10) {
           _mint(a, FOUN, 1, "");
        }
        if(participants > 5 && participants < 10) {
            daoShare = 5;
        }
        if(participants >= 10 ) {
            daoShare = 6;
        }
        participants++;
        _mint(a, FREN, amount, "");
        _mint(this.owner(), FREN, (amount * (daoShare * 1000)) / 100000, "");
    }

    function burn(address a, uint amount) public onlyOwner {
        _burn(a, FREN, amount);
    }
}