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

  context("When minting", () => {

    it("Should increase participants when minting", async function () {
      const mintTx = await frencapital.mint(addr1.address, 1000);
      // wait until the transaction is mined
      await mintTx.wait();
      expect(await frencapital.participants()).to.equal(1);
    });
  
    context("FREN tokens", () => {
      it("Should increase the balance of participant and owner after minting", async function () {
        const mint = 1000;
        const fee = 3;
        const mintTx = await frencapital.mint(addr1.address, mint);
        // wait until the transaction is mined
        await mintTx.wait();
        expect(await frencapital.balanceOf(addr1.address, 0)).to.equal(mint - fee);
        expect(await frencapital.balanceOf(owner.address, 0)).to.equal(fee);
      });
    })
  
    context("FOUN tokens", () => {
      it("Should add a token for the first 10 participants", async function () {
        const mintTx = await frencapital.mint(addr1.address, 1000);
        // wait until the transaction is mined
        await mintTx.wait();
        expect(await frencapital.balanceOf(addr1.address, 1)).to.equal(1);
      });

      it("Should only add a single FOUN token for every founder", async function () {
        const mintTxA = await frencapital.mint(addr1.address, 1000);
        const mintTxB = await frencapital.mint(addr1.address, 1000);
        // wait until all transactions are mined
        await Promise.all([mintTxA.wait(), mintTxB.wait()]);
        expect(await frencapital.balanceOf(addr1.address, 1)).to.equal(1);
      });
    })

  });

  context("When burning", () => {
    it("Should reduce the FOUN balance of an address when called", async function () {
      const burn = 500;
      const mint = 1000;
      let mintTx = await frencapital.mint(addr1.address, mint);
      await mintTx.wait();
  
      let burnTx = await frencapital.burn(addr1.address, burn);
      await burnTx.wait();
  
      expect(await frencapital.balanceOf(addr1.address, 0)).to.equal(497);
    });

    it("Should decrease the amount of participants when balance is zero", async function () {
      const burn = 997;
      const mint = 1000;
      let mintTx = await frencapital.mint(addr1.address, mint);
      await mintTx.wait();
  
      let burnTx = await frencapital.burn(addr1.address, burn);
      await burnTx.wait();
  
      expect(await frencapital.participants()).to.equal(0);
    });
  });
  
});
