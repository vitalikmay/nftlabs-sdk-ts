import { AddressZero } from "@ethersproject/constants";
import { BigNumber, ethers } from "ethers";
import { readFileSync } from "fs";
import ClaimConditionFactory from "../src/factories/ClaimConditionFactory";
import { DropModule, ThirdwebSDK } from "../src/index";

global.fetch = require("node-fetch");

const RPC_URL = "http://localhost:8545";

describe("Drop Module", async () => {
  let sdk: ThirdwebSDK;
  let dropModule: DropModule;

  let factory: ClaimConditionFactory;

  const phaseOneStartTimeInSeconds =
    Date.parse("01 Dec 2021 00:00:00 GMT") / 1000;
  const phaseOneStartDate = new Date(phaseOneStartTimeInSeconds * 1000);
  const phaseOneCurency = AddressZero;
  const phaseOnePrice: BigNumber = ethers.utils.parseUnits("10", 18);
  const phaseOneMaxQuantity = 10;

  const phaseTwoStartTimeInSeconds =
    Date.parse("10 Dec 2021 00:00:00 GMT") / 1000;
  const phaseTwoStartDate = new Date(phaseTwoStartTimeInSeconds * 1000);
  const phaseTwoCurrency = "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72";
  const phaseTwoPrice: BigNumber = ethers.utils.parseUnits("100", 18);

  beforeEach(async () => {
    sdk = new ThirdwebSDK(
      new ethers.Wallet(process.env.PKEY, ethers.getDefaultProvider(RPC_URL)),
      {
        ipfsGatewayUrl: "https://ipfs.io/ipfs/",
      },
    );
    /**
     * This contract address *should* exist forever on mumbai
     * It contains some test data with burned tokens and some tokens owned by
     * the test address starting with 0xE79
     */
    dropModule = sdk.getDropModule(
      "0x671BB1a6371cC9aCd4B1D9994181ff6426936Ddf",
    );
    // This will get the factory of an existing drop
    factory = await dropModule.getMintConditionsFactory();

    // You can also instantiate the factory and import a modules existing
    // mint conditions like this:
    // const newFactory = new ClaimConditionFactory();
    // newFactory.fromPublicMintConditions(
    //   await dropModule.getAllMintConditions(),
    // );

    // These conditions will apply on December 10th
    // You need 100 ENS tokens to claim a token
    factory
      .newClaimPhase({
        startTime: phaseTwoStartTimeInSeconds,
      })
      .setPrice(phaseTwoPrice, phaseTwoCurrency);

    // These conditions will apply on December 1st
    // You need 100 NATIVE tokens to claim a token
    // There is a maximum of 10 tokens in this phase
    factory
      .newClaimPhase({
        startTime: phaseOneStartDate,
        maxQuantity: phaseOneMaxQuantity,
      })
      .setPrice(phaseOnePrice);
  });

  it.skip("should contain all claim conditions", async () => {
    const converted = factory.buildConditions();
    console.log(converted);
    await dropModule.setMintConditions(factory);
  });

  it.skip("should allow you to mint 10k tokens", async () => {
    const image = readFileSync("test/3510820011_4f558b6dea_b.jpg");
    const imageUri = await sdk.getStorage().upload(image);

    const metadata = {
      name: "Test",
      description: "Test",
      image: imageUri,
    };

    console.log("assembling tokens");
    const tokens = [];
    for (let i = 0; i < 100; i++) {
      tokens.push({
        ...metadata,
      });
    }

    console.log("minting batch");
    // await dropModule.mintBatch(tokens);
  });

  it("should return the newly minted token ids", async () => {
    // await dropModule.lazyMintAmount(100);
    await dropModule.claim(2);
  });
});
