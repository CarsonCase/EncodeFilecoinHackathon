// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IVote} from "./IVote.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Vote is IVote, ERC20("Vote","VTE"), Ownable{

    function mint(address receiver, uint amount) external onlyOwner{
        _mint(receiver, amount);
    }

    function burn(address account, uint amount) external onlyOwner{
        _burn(account, amount);
    }
}
