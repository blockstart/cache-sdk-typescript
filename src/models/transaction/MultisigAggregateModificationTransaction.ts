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

import {
  MultisigAggregateModificationMinCosignatoriesDTO,
  MultisigAggregateModificationTransactionDTO,
} from "../../infrastructure/transaction/MultisigAggregateModificationTransactionDTO";
import {MultisigCosignatoryModificationDTO} from "../../infrastructure/transaction/MultisigCosignatoryModificationDTO";
import {TransactionDTO} from "../../infrastructure/transaction/TransactionDTO";
import {PublicAccount} from "../account/PublicAccount";
import {TimeWindow} from "./TimeWindow";
import {Transaction} from "./Transaction";
import {TransactionInfo} from "./TransactionInfo";
import {TransactionTypes} from "./TransactionTypes";

/**
 * Multisig aggregate modification transactions are part of the NEM's multisig account system.
 * A multisig aggregate modification transaction holds an array of multisig cosignatory modifications and a single multisig minimum cosignatories modification inside the transaction.
 * A multisig aggregate modification transaction can be wrapped by a multisig transaction.
 */
export class MultisigAggregateModificationTransaction extends Transaction {
  /**
   * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
   */
  public fee: number;

  /**
   * Value indicating the relative change of the minimum cosignatories.
   */
  public readonly relativeChange?: number;

  /**
   * The JSON array of multisig modifications.
   */
  public readonly modifications: CosignatoryModification[];

  /**
   * @internal
   * @param timeWindow
   * @param version
   * @param relativeChange
   * @param modifications
   * @param fee
   * @param signature
   * @param sender
   * @param transactionInfo
   */
  constructor(timeWindow: TimeWindow,
              version: number,
              modifications: CosignatoryModification[],
              fee: number,
              signature?: string,
              relativeChange?: number,
              sender?: PublicAccount,
              transactionInfo?: TransactionInfo) {
    super(TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION, version, timeWindow, signature, sender, transactionInfo);
    this.relativeChange = relativeChange;
    this.modifications = modifications;
    this.fee = fee;
  }

  /**
   * Create DTO of MultisigAggregateModificationTransaction
   * @returns {MultisigAggregateModificationTransactionDTO}
   */
  public toDTO(): TransactionDTO {
    const version = this.networkVersion ? this.networkVersion : this.version;
    return this.serializeDTO({
      signer: this.signer ? this.signer.publicKey : undefined,
      deadline: this.timeWindow.deadlineToDTO(),
      timeStamp: this.timeWindow.timeStampToDTO(),
      type: this.type,
      version,
      signature: this.signature,
      fee: this.fee,
      minCosignatories: this.relativeChange === undefined ? undefined : {
        relativeChange: this.relativeChange,
      } as MultisigAggregateModificationMinCosignatoriesDTO,
      modifications: this.modifications.map((modification): MultisigCosignatoryModificationDTO => {
        return {
          cosignatoryAccount: modification.cosignatoryAccount.publicKey,
          modificationType: modification.action,
        };
      }),
    } as MultisigAggregateModificationTransactionDTO);
  }

  /**
   * Create a MultisigAggregateModificationTransaction object
   * @param timeWindow
   * @param modifications
   * @param relativeChange
   * @returns {MultisigAggregateModificationTransaction}
   */
  public static create(timeWindow: TimeWindow,
                       modifications: CosignatoryModification[],
                       relativeChange?: number): MultisigAggregateModificationTransaction {
    const fee = Math.floor(10 * 0.05 * 1000000);
    const version = relativeChange ? 2 : 1;
    return new MultisigAggregateModificationTransaction(timeWindow, version, modifications, fee, undefined, relativeChange);
  }
}

/**
 * The type of modification. Possible values are:
 * 1: Add a new cosignatory.
 * 2: Delete an existing cosignatory.
 */
export enum CosignatoryModificationAction {
  ADD = 1,
  DELETE = 2,
}

export class CosignatoryModification {
  public readonly cosignatoryAccount: PublicAccount;
  public readonly action: CosignatoryModificationAction;

  /**
   * constructor
   * @param cosignatoryAccount
   * @param action
   */
  constructor(cosignatoryAccount: PublicAccount, action: CosignatoryModificationAction) {
    this.cosignatoryAccount = cosignatoryAccount;
    this.action = action;
  }
}
