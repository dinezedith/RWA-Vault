// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interface.sol";

contract RwaVault {
    using SafeERC20 for IERC20;

    IERC20 public usdc;
    TOKENISSUEINTERFACE public seniorToken;
    TOKENISSUEINTERFACE public juniorToken;

    uint256 public totalDeposits;


    mapping(address => depositInfo) internal usersInvestment;

    uint256 public constant BASIS_POINTS = 10000;

    uint256 public depositFeeBP = 200; // 2%
    uint256 public seniorFeeBP = 100;  // 1% on redeem in USDC
    uint256 public juniorFeeBP = 200;  // 2% on redeem in USDC

    address public feeRecipient;

    constructor(address _usdc, address _feeRecipient, TOKENISSUEINTERFACE SNRtoken, TOKENISSUEINTERFACE JNRtoken) {
        usdc = IERC20(_usdc);
        seniorToken = SNRtoken;
        juniorToken = JNRtoken;
        feeRecipient = _feeRecipient;
    }


    function getUserInvestment(address user) external view returns (depositInfo memory) {
        return usersInvestment[user];
    }

    /// @notice Deposit USDC, issue Senior/Junior tokens
    function deposit(uint256 amount) external {
        require(amount > 0, "Zero deposit");

        usdc.safeTransferFrom(msg.sender, address(this), amount);


        // Split in underlying decimals (USDC = 6)
        uint256 seniorUnderlying = (amount * 70) / 100;
        uint256 juniorUnderlying = amount - seniorUnderlying;

        // Scale to 18 decimals for tranche tokens
        uint256 seniorMint = seniorUnderlying * 1e12;
        uint256 juniorMint = juniorUnderlying * 1e12;

        seniorToken.mint(msg.sender, seniorMint);
        juniorToken.mint(msg.sender, juniorMint);  

        PoolInfo memory pool = PoolInfo({
            amounts: amount,
            SNRAlloc: seniorMint,
            JNRAlloc: juniorMint,
            timestamp: block.timestamp,
            isActive: true
        });

        usersInvestment[msg.sender].pool.push(pool);  

        totalDeposits += amount;
    }

    /// @notice Redeem tokens for USDC with separate USDC fees
    function redeem(redeemParams calldata params) public returns(bool){
        require(params.index < usersInvestment[msg.sender].pool.length, "vault: invalid pool index");
        require(usersInvestment[msg.sender].pool[params.index].isActive, "vault: pool is inactive");

        require(params.seniorAmount > 0 || params.juniorAmount > 0, "Zero redeem");

        uint256 usdcBalance = usdc.balanceOf(address(this));

        // Total amount to pay user after fees
        uint256 totalRedeem = (params.seniorAmount + params.juniorAmount)/1e12 ; // Scale down to USDC decimals

        uint256 totalFee = totalRedeem * depositFeeBP / BASIS_POINTS;
        totalRedeem -= totalFee;
        require(usersInvestment[msg.sender].pool[params.index].amounts >= totalRedeem , "Not Enough shares");
        require(usdcBalance >= totalRedeem + totalFee, "Not enough USDC");

        // Burn tokens
        if (params.seniorAmount > 0) seniorToken.burn(params.seniorAmount);
        if (params.juniorAmount > 0) juniorToken.burn(params.juniorAmount);

        // Transfer fees to feeRecipient
        if(totalFee > 0) usdc.safeTransfer(feeRecipient, totalFee);

        // Transfer net amount to user
        usdc.safeTransfer(msg.sender, totalRedeem);

        totalDeposits -= totalRedeem;

        usersInvestment[msg.sender].pool[params.index].amounts -= totalRedeem + totalFee;

        if (usersInvestment[msg.sender].pool[params.index].amounts == 0) {
            usersInvestment[msg.sender].pool[params.index].isActive = false;
        }

        return true;
    }

    /// @notice Update fees
    function setFees(uint256 _depositFeeBP, uint256 _seniorFeeBP, uint256 _juniorFeeBP) external {
        depositFeeBP = _depositFeeBP;
        seniorFeeBP = _seniorFeeBP;
        juniorFeeBP = _juniorFeeBP;
    }

    function balance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    function setFeeRecipient(address _feeRecipient) external {
        feeRecipient = _feeRecipient;
    }
}
