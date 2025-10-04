// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";



const deploymodule = buildModule("RWA", (m) => 
{

  const adminAddress = "0x0e200447E85e104d82E839D57Ce998740F0c1535";
  const feeAddress = "0x0e200447E85e104d82E839D57Ce998740F0c1535";

  //mock
  const usdc = m.contract("USDC", []);

  // Deploy the JNR contract
    const JNRtoken = m.contract("JNR", [adminAddress]);
  //Deploy the SNR contract
  const SNRtoken = m.contract("SNR", [adminAddress]);
  //Vault contract
  const vault = m.contract("RwaVault", [usdc, feeAddress, SNRtoken, JNRtoken]);

  const nft = m.contract("InvoiceNFT", ["RWA Invoice NFT", "RWA"]);

  const CONTROLLER_ROLE = m.staticCall(JNRtoken, "CONTROLLER_ROLE",[]);
  // Grant CONTROLLER_ROLE to the vault in both tokens
  m.call(JNRtoken, "grantRole", [CONTROLLER_ROLE, vault]);
  m.call(SNRtoken, "grantRole", [CONTROLLER_ROLE, vault]);
  m.call(nft, "grantRole", [CONTROLLER_ROLE, vault]);
  return {usdc, JNRtoken, SNRtoken, vault};
});

export default deploymodule;
