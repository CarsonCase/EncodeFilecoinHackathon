// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {DealRequest} from "./IDealClient.sol";

interface IDAO is IERC4626{

    struct Proposal{
        DealRequest dealRequest;
        uint votes;
    }
    function donate(uint amount) external;
    
    function submitProposal(DealRequest calldata dealRequest, uint amountOfVotes) external returns(uint proposalId);

    function vote(uint proposalId, uint amount) external;

    function fundProposal(uint proposalId) external;
}