// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface TOKENISSUEINTERFACE is IERC20 {
    function mint(address reciver,uint256 amount) external;
    function burn(uint256 amount) external;

}



struct PoolInfo {
    uint256 amounts;// [seniorAmount, juniorAmount]
    uint256 SNRAlloc;
    uint256 JNRAlloc;
    uint256 timestamp;
    bool isActive;
}


struct redeemParams{
    uint256 index;
    uint256 seniorAmount;
    uint256 juniorAmount;
}

struct depositInfo {
    PoolInfo[] pool;
}