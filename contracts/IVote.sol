// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IVote is IERC20{

    function mint(address receiver, uint amount) external;

    function burn(address account, uint amount) external;
}
