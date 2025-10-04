import { run } from "hardhat";

async function main() {
  try {
const ADMIN = "0x0e200447E85e104d82E839D57Ce998740F0c1535";
const USDT = "0xB725Bf9F000229AE53587C201a1570B3Fc92ffD1";
const JNR = "0xe7C1387BC5849643aED4EBbF3eb86213601D0519";
const SNR = "0x3fC944Cd530927b94240b13B3eC0eC19660373C7";
const Vault = "0xb84d07fe7C0f8538A3cb7515DCdEd5BF52B43C07";



    // //USDT
    // await run("verify:verify", {
    //   address: USDT,
    //   constructorArguments: [],
    // });

    // GORA
    // await run("verify:verify", {
    //   address: JNR,
    //   constructorArguments: [ADMIN],
    // });

    // // GORA LP
    // await run("verify:verify", {
    //   address: SNR,
    //   constructorArguments: [ADMIN],
    // });

    // GORA purchase
    await run("verify:verify", {
      address: Vault,
      constructorArguments: [USDT, ADMIN, JNR, SNR],
    });


    console.log("Contract successfully verified on Etherscan!");
  } catch (error) {
    console.error(" Verification failed:", error);
    process.exit(1);
  }
}

main();
