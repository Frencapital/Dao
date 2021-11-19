// contracts/Frencapital.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Frencapital is Ownable, ERC1155Supply {

    uint256 public constant FREN = 0;
    uint256 public constant FOUN = 1;
    uint8 public participants = 0;
    uint8 public feePromille = 3;

    constructor() ERC1155("https://frencapital.com/api/token/{id}.json") {
    }

    //Mint new tokens for new participants
    function mint(address a, uint256 amount) public onlyOwner {
        // Only consider users with no existing balance a new participant
        if (this.balanceOf(a, FREN) == 0) {
            participants++;
        }

        // First ten get a founder NFT, prevent double assignment of NFT
        if(participants < 11 && this.balanceOf(a, FOUN) == 0) {
           _mint(a, FOUN, 1, "");
        }

        uint fee = amount * feePromille * 1000 / 1000000;
        _mint(this.owner(), FREN, fee, "");
        _mint(a, FREN, amount - fee, "");
    }

    function burn(address a, uint amount) public onlyOwner {
        _burn(a, FREN, amount);
        if (this.balanceOf(a, FREN) == 0) {
            participants--;
        }
    }
}