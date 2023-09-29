import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import {Signer} from "ethers";

describe("DAO", function () {
  async function deployDAO() {
    // Contracts are deployed using the first signer/account by default
    const signers = await ethers.getSigners();

    // Create Test Token
    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy();

    const DealClient = await ethers.getContractFactory("DealClient");
    const dealClient = await DealClient.deploy();

    // Create DAO
    const _DAO = await ethers.getContractFactory("DAO");
    const DAO = await _DAO.deploy(token, dealClient);

    return { signers, token, DAO };
  }

  async function proposalFlow(
    donateAmount: string, 
    proposalVal: number, 
    voter: Signer, 
    proposalSumbittor: Signer, 
    patron: Signer, 
    votesWithProposal: string
  ) {
    let votesValid, proposalValid, voteOnProposalValid, submissionValid;

    const { token, DAO } = await loadFixture(deployDAO);

    // const voter = signers[voterSignerIndex];
    // const proposalSumbittor = signers[proposalSumbittorSignerIndex];
    // const patron = signers[patronSignerIndex];

    // mint voter their tokens to donate
    await token.mint(voter, ethers.parseEther(donateAmount));

    // donate to get vote tokens
    await token.connect(voter).approve(DAO, donateAmount);
    await DAO.connect(voter).donate(donateAmount);
    const voteToken = await ethers.getContractAt("Vote", await DAO.voteToken());
    const voteBal = await voteToken.balanceOf(voter);

    votesValid = voteBal.toString() == donateAmount;

    const extraParamsV1 = [
      "https://data-depot.lighthouse.storage/api/download/download_car?fileId=862fb115-d24a-4ff1-a1c8-eadbbbfd19cf.car",
      18445,
      false, // taskArgs.skipIpniAnnounce,
      false, // taskArgs.removeUnsealedCopy
    ];

    const DealRequestStruct = [
      , //cidHex
      32768, //taskArgs.pieceSize,
      false, //taskArgs.verifiedDeal,
      "baga6ea4seaqkp2pjlh6avlvee6ib2maanav5sc35l5glf3zm6rd6hmfgcx5xeji", //taskArgs.label,
      520000, // startEpoch
      1555200, // endEpoch
      0, // taskArgs.storagePricePerEpoch,
      0, // taskArgs.providerCollateral,
      0, // taskArgs.clientCollateral,
      1, //taskArgs.extraParamsVersion,
      extraParamsV1,
    ];

    await DAO.connect(proposalSumbittor).submitProposal(DealRequestStruct, votesWithProposal);
    const x = await DAO.proposals(1);
    proposalValid = proposalVal.toString() == x[0].toString();

    // vote on a proposal
    voteOnProposalValid = voteBal.toString() == donateAmount;

    await DAO.vote(1, donateAmount);

    // fund the proposal
    await DAO.connect(patron).fundProposal(1);
    const daoBal = await DAO.balanceOf(patron);
    submissionValid = daoBal.toString() == donateAmount;

    return {votesValid, proposalValid, voteOnProposalValid, submissionValid}
  }

  describe("Token", function () {
    let signers: Signer[];

    before(async function(){
      signers = await ethers.getSigners(); 
    })
    it("Simple Flow\n-owner as all parties\n-0 votes with submission", async function(){
      // Test with different parameters
      const {votesValid, proposalValid, voteOnProposalValid, submissionValid} = 
      await proposalFlow("10", 7, signers[0], signers[0], signers[0], "0");

      expect(votesValid);
      expect(proposalValid);
      expect(voteOnProposalValid);
      expect(submissionValid);
    });

    it("Failing Flow\n-owner as all parties\n-10 votes with submission", async function(){
      // Test with different parameters
      await expect(proposalFlow("10", 7, signers[0], signers[0], signers[0], "10")).to.be.reverted;
    });
  });
});
