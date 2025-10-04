// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract JNR is ERC20,AccessControl{

    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    address public Admin; 

    event Burn(address from, address to, uint256 amount);
    event Mint(address from, address to, uint256 amount);
    

    constructor(address adminAddress) ERC20("JNR","JNR"){ 
        _grantRole(ADMIN_ROLE,adminAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, adminAddress);
        Admin = adminAddress;
    }

    function mint(address reciver,uint256 amount) public onlyRole(CONTROLLER_ROLE) {
        require(amount > 0, "JNR: INVALID value");
        _mint(reciver, amount);
        emit Mint(address(0), reciver, amount);
        
    }

    function burn(uint256 amount) public onlyRole(CONTROLLER_ROLE){
        require(amount > 0, "JNR: INVALID value");
        _burn(msg.sender, amount);
        emit Burn(msg.sender, address(0), amount);
    }

    
}