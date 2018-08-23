/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 NEM
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {AccountInfoDTO} from "../../infrastructure/account/AccountInfoDTO";
import {AccountMetaDataDTO} from "../../infrastructure/account/AccountMetaDataDTO";
import {AccountMetaDataPairDTO} from "../../infrastructure/account/AccountMetaDataPairDTO";
import {Balance} from "./Balance";
import {PublicAccount} from "./PublicAccount";

export enum RemoteStatus {
  REMOTE = "REMOTE",
  ACTIVATING = "ACTIVATING",
  ACTIVE = "ACTIVE",
  DEACTIVATING = "DEACTIVATING",
  INACTIVE = "INACTIVE",
}

export enum Status {
  UNKNOWN = "UNKNOWN",
  LOCKED = "LOCKED",
  UNLOCKED = "UNLOCKED",
}
/**
 * The account structure describes basic information for an account.
 */
export class AccountInfo {

  /**
   * The balance of the account in micro NEM.
   */
  public readonly balance: Balance;

  /**
   * The importance of the account.
   */
  public readonly importance: number;

  /**
   * The public key of the account.
   */
  public readonly publicAccount?: PublicAccount;

  /**
   * The number blocks that the account already harvested.
   */
  public readonly harvestedBlocks: number;

  /**
   * Total number of cosignatories
   */
  public readonly cosignatoriesCount?: number;

  /**
   * Minimum number of cosignatories needed for a transaction to be processed
   */
  public readonly minCosignatories?: number;

  /**
   * @internal
   * @param balance
   * @param vestedBalance
   * @param importance
   * @param publicKey
   * @param harvestedBlocks
   * @param cosignatoriesCount
   * @param minCosignatories
   */
  constructor(balance: number,
              vestedBalance: number,
              importance: number,
              publicKey: string,
              harvestedBlocks: number,
              cosignatoriesCount?: number,
              minCosignatories?: number) {
    this.balance = new Balance(balance, vestedBalance);
    this.importance = importance;
    if (publicKey != null) {
      this.publicAccount = PublicAccount.createWithPublicKey(publicKey);
    }
    this.harvestedBlocks = harvestedBlocks;
    this.cosignatoriesCount = cosignatoriesCount;
    this.minCosignatories = minCosignatories;
  }

  /**
   * @internal
   * @param dto
   * @returns {AccountInfo}
   */
  public static createFromAccountInfoDTO(dto: AccountInfoDTO): AccountInfo {
    return new AccountInfo(
      dto.balance,
      dto.vestedBalance,
      dto.importance,
      dto.publicKey,
      dto.harvestedBlocks,
    );
  }
}

export class AccountInfoWithMetaData extends AccountInfo {

  /**
   * The harvesting status of a queried account
   */
  public readonly status: Status;

  /**
   * The status of remote harvesting of a queried account
   */
  public readonly remoteStatus: RemoteStatus;

  /**
   * JSON array of AccountInfo structures. The account is cosignatory for each of the accounts in the array.
   */
  public readonly cosignatoryOf: AccountInfo[];

  /**
   * JSON array of AccountInfo structures. The array holds all accounts that are a cosignatory for this account.
   */
  public readonly cosignatories: AccountInfo[];

  /**
   * @internal
   * @param status
   * @param remoteStatus
   * @param cosignatoryOf
   * @param cosignatories
   * @param balance
   * @param vestedBalance
   * @param importance
   * @param publicKey
   * @param harvestedBlocks
   * @param cosignatoriesCount
   * @param minCosignatories
   */
  private constructor(status: Status,
                      remoteStatus: RemoteStatus,
                      cosignatoryOf: AccountInfo[],
                      cosignatories: AccountInfo[],
                      balance: number,
                      vestedBalance: number,
                      importance: number,
                      publicKey: string,
                      harvestedBlocks: number,
                      cosignatoriesCount?: number,
                      minCosignatories?: number) {
    super(balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories);
    this.status = status;
    this.remoteStatus = remoteStatus;
    this.cosignatoryOf = cosignatoryOf;
    this.cosignatories = cosignatories;
  }

  /**
   * @internal
   * @param dto
   * @returns {AccountInfoWithMetaData}
   */
  public static createFromAccountMetaDataPairDTO(dto: AccountMetaDataPairDTO): AccountInfoWithMetaData {
    return new AccountInfoWithMetaData(
      Status[dto.meta.status],
      RemoteStatus[dto.meta.remoteStatus],
      dto.meta.cosignatoryOf.map((accountInfoDTO: AccountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)),
      dto.meta.cosignatories.map((accountInfoDTO: AccountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)),
      dto.account.balance,
      dto.account.vestedBalance,
      dto.account.importance,
      dto.account.publicKey,
      dto.account.harvestedBlocks,
      dto.account.multisigInfo.cosignatoriesCount,
      dto.account.multisigInfo.minCosignatories,
    );
  }
}

// TODO: Solve this, issue with AccountHttp.status(address: Address)
export class AccountStatus {
  /**
   * The harvesting status of a queried account
   */
  public readonly status: Status;

  /**
   * The status of remote harvesting of a queried account
   */
  public readonly remoteStatus: RemoteStatus;

  /**
   * JSON array of AccountInfo structures. The account is cosignatory for each of the accounts in the array.
   */
  public readonly cosignatoryOf: AccountInfo[];

  /**
   * JSON array of AccountInfo structures. The array holds all accounts that are a cosignatory for this account.
   */
  public readonly cosignatories: AccountInfo[];

  /**
   * @internal
   */
  constructor(status: Status,
              remoteStatus: RemoteStatus,
              cosignatoryOf: AccountInfo[],
              cosignatories: AccountInfo[]) {
    this.status = status;
    this.remoteStatus = remoteStatus;
    this.cosignatoryOf = cosignatoryOf;
    this.cosignatories = cosignatories;
  }

  /**
   * @internal
   * @param dto
   * @returns {AccountInfoWithMetaData}
   */
  public static createFromAccountMetaDataDTO(dto: AccountMetaDataDTO): AccountStatus {
    return new AccountStatus(
      Status[dto.status],
      RemoteStatus[dto.remoteStatus],
      dto.cosignatoryOf.map((accountInfoDTO: AccountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)),
      dto.cosignatories.map((accountInfoDTO: AccountInfoDTO) => AccountInfo.createFromAccountInfoDTO(accountInfoDTO)),
    );
  }
}
