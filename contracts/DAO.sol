// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC4626, ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IDAO} from "./IDAO.sol";
import {Vote, IVote} from "./Vote.sol";
import {IDealClient, DealRequest} from "./IDealClient.sol";

contract DAO is ERC4626, IDAO{
    IVote public immutable voteToken;
    IDealClient immutable dealClient;
    uint public proposalCount;

    mapping(uint256 => Proposal) public proposals;

    constructor(IERC20 asset_, IDealClient _dealClient) ERC4626(asset_) ERC20("Contribution Token","DAO"){
        voteToken = IVote(new Vote());
        dealClient = _dealClient;
    }

    error VotingError(uint proposalId, uint amount);

    event ProposalSubmitted(uint proposalId, address patron);

    function donate(uint amount) external{
        IERC20(asset()).transferFrom(msg.sender ,address(this), amount);
        voteToken.mint(msg.sender, amount);
    }

    function submitProposal(DealRequest calldata dealRequest, uint amountOfVotes) external override returns(uint proposalId){
        unchecked {
            proposalId = ++proposalCount;
        }

        proposals[proposalId] = Proposal({votes: 0, dealRequest: dealRequest});

        if(amountOfVotes > 0){
            vote(proposalId, amountOfVotes);
        }
    }

    function vote(uint proposalId, uint amount) public override{
        if(amount == 0){
            revert VotingError(proposalId, 0);
        }
        voteToken.burn(msg.sender, amount);
        proposals[proposalId].votes += amount;
    }

    function fundProposal(uint proposalId) external override{
        Proposal memory proposal = proposals[proposalId];
        delete proposals[proposalId];
        
        // do the thing
        dealClient.makeDealProposal(proposal.dealRequest);

        
        emit ProposalSubmitted(proposalId, msg.sender);

        // mint contributor the number of shares the proposal had
        _mint(msg.sender, proposal.votes);
    }

}