import { DataStore, DataStore__factory } from "@3rdweb/contracts";
import { keccak256 } from "@ethersproject/keccak256";
import { TransactionReceipt } from "@ethersproject/providers";
import { BigNumberish } from "ethers";
import { ModuleType, Role, RolesMap } from "../common";
import { ModuleWithRoles } from "../core/module";

/**
 * Access this module by calling {@link ThirdwebSDK.getDatastoreModule}
 * @beta
 */
export class DatastoreModule extends ModuleWithRoles {
  public static moduleType: ModuleType = ModuleType.DATASTORE;

  public static roles = [RolesMap.admin, RolesMap.editor] as const;

  /**
   * @override
   * @internal
   */
  protected getModuleRoles(): readonly Role[] {
    return DatastoreModule.roles;
  }

  private __contract: DataStore | null = null;
  /**
   * @internal - This is a temporary way to access the underlying contract directly and will likely become private once this module implements all the contract functions.
   */
  public get contract(): DataStore {
    return this.__contract || this.connectContract();
  }
  private set contract(value: DataStore) {
    this.__contract = value;
  }

  /**
   * @internal
   */
  protected connectContract(): DataStore {
    return (this.contract = DataStore__factory.connect(
      this.address,
      this.providerOrSigner,
    ));
  }

  /**
   * @internal
   */
  protected getModuleType(): ModuleType {
    return DatastoreModule.moduleType;
  }

  public async getUint(key: string): Promise<BigNumberish | undefined> {
    const keyHash = keccak256(key.toString());
    return await this.contract.getUint(keyHash);
  }

  // write functions
  public async setUint(
    key: string,
    value: BigNumberish,
  ): Promise<TransactionReceipt> {
    const keyHash = keccak256(key.toString());
    return await this.sendTransaction("setUint", [keyHash, value]);
  }
}
