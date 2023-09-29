// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20("TestToken","TST"){

    constructor(){
        _mint(msg.sender, 100 ether);
    }
    
    function mint(address receiver, uint amount) external{
        _mint(receiver, amount);
    }

    function burn(address account, uint amount) external{
        _burn(account, amount);
    }
}
