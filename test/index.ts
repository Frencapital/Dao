import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import { Frencapital, Frencapital__factory } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

let accounts: Signer[];

describe("Frencapital", function () {
  
  let frencapital: Frencapital;
	let owner: SignerWithAddress;
	let addr1: SignerWithAddress;
	let addr2: SignerWithAddress;
  let addrs: SignerWithAddress[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const Frencapital = await ethers.getContractFactory("Frencapital");
    frencapital = await Frencapital.deploy();
    await frencapital.deployed();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
  });

  it("Should deploy and set an owner", async function () {
    expect(await frencapital.owner()).to.equal(owner.address);
  });

  it("Should increase participants when minting", async function() {
    const mintTx = await frencapital.mint(addr1.address,1000);
    // wait until the transaction is mined
    await mintTx.wait();
    expect(await frencapital.participants()).to.equal(1);
  });

  it("Should increase the balance of participant after minting", async function() {
    const mint = 1000;
    const mintTx = await frencapital.mint(addr1.address,mint);
    // wait until the transaction is mined
    await mintTx.wait();
    expect(await frencapital.balanceOf(addr1.address,0)).to.equal(mint * 1.05);
    expect(await frencapital.balanceOf(addr1.address,1)).to.equal(1);
  });

  it("Should increase the balance of participant after minting", async function() {
    const mint = 1000;
    const mintTx = await frencapital.mint(addr1.address,mint);
    // wait until the transaction is mined
    await mintTx.wait();
    expect(await frencapital.balanceOf(addr1.address,0)).to.equal(mint * 1.05);
    expect(await frencapital.balanceOf(addr1.address,1)).to.equal(1);
  });

  it("Should increase the balance of participant after minting", async function() {
    const mint = 1000;
    const mintTx = await frencapital.mint(addr1.address,mint);
    // wait until the transaction is mined
    await mintTx.wait();
    expect(await frencapital.balanceOf(addr1.address,0)).to.equal(mint * 1.05);
    expect(await frencapital.balanceOf(addr1.address,1)).to.equal(1);
  });

  it("Should only increase base balance after four participants", async function() {
    const mint = 1000;
    
    let tx;
    for(let i = 0; i<4; i++) {
      tx = await frencapital.mint(addr1.address,mint);
      // wait until the transaction is mined
      await tx.wait();
    }
    const mintTx = await frencapital.mint(addr2.address,mint);
    // wait until the transaction is mined
    await mintTx.wait();

    expect(await frencapital.balanceOf(addr2.address,0)).to.equal(mint);
    expect(await frencapital.balanceOf(addr2.address,1)).to.equal(1);
    expect(await frencapital.balanceOf(addr1.address,1)).to.equal(4);
  });
});
