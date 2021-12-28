import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BundleDropModule } from "../src/index";
import { appModule, sdk, signers } from "./before.test";
import { ethers } from "hardhat";
import { expect, assert } from "chai";
import { BigNumber } from "ethers";

global.fetch = require("node-fetch");

describe("Bundle Module (aka Collection Module)", async () => {
  let bundleDropModule: BundleDropModule;

  let adminWallet: SignerWithAddress;
  let testSigners: SignerWithAddress[];
  before(() => {
    [adminWallet] = signers;
    testSigners = [];
    console.time("wallet");
    for (let i = 0; i < 100; i++) {
      testSigners.push(new ethers.Wallet.createRandom());
      console.log(`${testSigners[i].address} was created`);
    }
    console.log("===WALLETS CREATED===");
    console.timeEnd("wallet");
  });

  it("should be able to claim using 15000 addresses", async () => {
    const token = await appModule.deployCurrencyModule({
      name: "Test Token",
      symbol: "TST",
    });

    console.log("testSigners", testSigners.length);
    const allowList = [];
    testSigners.forEach((signer) => {
      try {
        allowList.push(signer.address);
      } catch (e) {
        console.log(signer);
      }
    });
    bundleDropModule = await appModule.deployBundleDropModule({
      name: "test",
      description: "test",
      primarySaleRecipientAddress: "0x0000000000000000000000000000000000000000",
    });
    await bundleDropModule.lazyMintBatch([{ name: "test" }]);

    console.log("bundleDropModule", bundleDropModule.address);

    const factory = bundleDropModule.getClaimConditionFactory();
    const claimPhase = factory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 15000,
      maxQuantityPerTransaction: 1,
    });
    claimPhase.setPrice(1, token.address);
    await claimPhase.setSnapshot(allowList);

    await bundleDropModule.setClaimCondition("0", factory);
    for (let i = 0; i < testSigners.length; i++) {
      assert(adminWallet.address !== testSigners[i].address);
      console.log(testSigners[i].address);
      await adminWallet.sendTransaction({
        from: adminWallet.address,
        to: testSigners[i].address,
        value: ethers.utils.parseEther("1.0"),
      });
      sdk.setProviderOrSigner(testSigners[i].connect(adminWallet.provider));
      await bundleDropModule.claim(0, 1);
      console.log("claimed successfully for ", i);
    }
  });
});
