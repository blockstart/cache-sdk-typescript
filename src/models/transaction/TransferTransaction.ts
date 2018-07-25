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

import { mosaicDetails, xemDetails } from '../../utilities/TransactionUtilities';
import {TransactionDTO} from "../../infrastructure/transaction/TransactionDTO";
import {TransferTransactionDTO} from "../../infrastructure/transaction/TransferTransactionDTO";
import {Address} from "../account/Address";
import {PublicAccount} from "../account/PublicAccount";
import { CACHE } from '../mosaic/CACHE';
import {Mosaic} from "../mosaic/Mosaic";
import {MosaicDefinition} from "../mosaic/MosaicDefinition";
import {MosaicId} from "../mosaic/MosaicId";
import {MosaicTransferable} from "../mosaic/MosaicTransferable";
import {XEM} from "../mosaic/XEM";
import {EncryptedMessage} from "./EncryptedMessage";
import {Message} from "./Message";
import {PlainMessage} from "./PlainMessage";
import {TimeWindow} from "./TimeWindow";
import {Transaction} from "./Transaction";
import {TransactionInfo} from "./TransactionInfo";
import {TransactionTypes} from "./TransactionTypes";

export enum ExpirationType {
  oneHour = 1,
  twoHour = 2,
  sixHour = 6,
  twelveHour = 12
}

export enum TxType {
  xem = "XEM",
  cache = "CACHE",
  other = "OTHER",
}

/**
 * Transfer transactions contain data about transfers of XEM or mosaics to another account.
 */
export class TransferTransaction extends Transaction {
  /**
   * The fee for the transaction. The higher the fee, the higher the priority of the transaction. Transactions with high priority get included in a block before transactions with lower priority.
   */
  public readonly fee: number;

  /**
   * The address of the recipient.
   */
  public readonly recipient: Address;

  /**
   * The xem of XEM that is transferred from sender to recipient.
   */
  private readonly _xem: XEM;

  /**
   * Optionally a transaction can contain a message. In this case the transaction contains a message substructure. If not the field is null.
   */
  public readonly message: PlainMessage | EncryptedMessage;

  /**
   * The array of Mosaic objects.
   */
  private readonly _mosaics?: Mosaic[];

  /**
   * @internal
   * @param recipient
   * @param amount
   * @param timeWindow
   * @param version
   * @param fee
   * @param message
   * @param signature
   * @param mosaic
   * @param sender
   * @param transactionInfo
   */
  constructor(recipient: Address,
              amount: XEM,
              timeWindow: TimeWindow,
              version: number,
              fee: number,
              message: PlainMessage | EncryptedMessage,
              signature?: string,
              mosaic?: Mosaic[],
              sender?: PublicAccount,
              transactionInfo?: TransactionInfo) {
    super(TransactionTypes.TRANSFER, version, timeWindow, signature, sender, transactionInfo);
    this.fee = fee;
    this.recipient = recipient;
    this._xem = amount;
    this.message = message;
    this._mosaics = mosaic;
  }

  /**
   * in case that the transfer transaction contains mosaics, it throws an error
   * @returns {XEM}
   */
  public xem(): XEM {
    if (this.containsMosaics()) { throw new Error("contain mosaics"); }
    return this._xem;
  }

  /**
   * in case that the transfer transaction does not contain mosaics, it throws an error
   * @returns {Mosaic[]}
   */
  public mosaics(): Mosaic[] {
    if (this.containsMosaics()) { return this._mosaics!
      .map(x =>
        new Mosaic(x.mosaicId, (x.quantity * (this._xem.quantity() / 1e6)))
      )}
    throw new Error("Does not contain mosaics");
  }

  /**
   *
   * @returns {boolean}
   */
  public containsMosaics() {
    return this._mosaics !== undefined && this._mosaics.length > 0;
  }

  /**
   * all the Mosaic Identifiers of the attached mosaics
   * @returns {MosaicId[]}
   */
  public mosaicIds(): MosaicId[] {
    if (!this.containsMosaics()) { throw new Error("does not contain mosaics"); }
    return this._mosaics!.map((_) => _.mosaicId);
  }

  /**
   * returns mosaic details without sorting through array
   * @returns MosaicTransferable
   */
  public mosaicDetails = (): XEM | CACHE | MosaicTransferable => {
    if (this.containsMosaics()) {
      return mosaicDetails(this);
    } else {
      return xemDetails(this);
    }
  };

  /**
   * Create a CacheTransferTransaction object
   * @param txType - TxType.xem, .cache, .other
   * @param recipient
   * @param mosaic
   * @param message
   * @param expiration? - 2 hours default, can't exceed 23 hours
   * @returns {TransferTransaction}
   */
  public static create = (recipient: Address,
                            txType: TxType,
                            mosaic: MosaicTransferable,
                            message: PlainMessage | EncryptedMessage,
                            expiration?: ExpirationType): TransferTransaction => {
    if (txType === TxType.xem) {
      const xem = mosaic as XEM;
      return TransferTransaction.createWithXem(recipient, xem, message, expiration);
    } else {
      return  TransferTransaction.createWithMosaics(recipient, [mosaic], message, expiration);
    }
  };

  /**
   * Create DTO of TransferTransaction
   * @returns {TransferTransactionDTO}
   */
  public toDTO(): TransactionDTO {
    const version = this.networkVersion ? this.networkVersion : this.version;
    return this.serializeDTO({
      signer: this.signer ? this.signer.publicKey : undefined,
      deadline: this.timeWindow.deadlineToDTO(),
      timeStamp: this.timeWindow.timeStampToDTO(),
      signature: this.signature,
      type: this.type,
      version,
      mosaics: this._mosaics === undefined ? undefined : this._mosaics.map((mosaic) => new Mosaic(mosaic.mosaicId, mosaic.quantity)),
      fee: this.fee,
      recipient: this.recipient.plain(),
      amount: this._xem.quantity(),
      message: this.message.toDTO(),
    } as TransferTransactionDTO);
  }

  /**
   * Create a TransferTransaction object
   * @param recipient
   * @param xem
   * @param message
   * @param expiration?
   * @returns {TransferTransaction}
   */
  private static createWithXem(recipient: Address,
                               xem: XEM,
                               message: PlainMessage | EncryptedMessage,
                               expiration?: ExpirationType): TransferTransaction {
    if (message instanceof EncryptedMessage && recipient.plain() !== message.recipientPublicAccount!.address.plain()) { throw new Error("Recipient address and recipientPublicAccount don't match"); }
    let fee = Math.floor(0.05 * this.calculateMinimum(xem.quantity() / 1000000) * 1000000);
    if (message.payload.length !== 0) {
      fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
    }
    return new TransferTransaction(recipient, xem, TimeWindow.createWithDeadline(expiration), 1, fee, message, undefined, undefined);
  }

  /**
   * @internal
   * @param amount
   * @returns {number}
   */
  private static calculateMinimum(amount): number {
    const fee = Math.floor(Math.max(1, amount / 10000));
    return fee > 25 ? 25 : fee;
  }

  /**
   * Create a TransferTransaction object
   * @param recipient
   * @param mosaics
   * @param message
   * @param expiration?
   * @returns {TransferTransaction}
   */
  public static createWithMosaics(recipient: Address,
                                  mosaics: MosaicTransferable[],
                                  message: PlainMessage | EncryptedMessage,
                                   expiration?: ExpirationType): TransferTransaction {
    if (message instanceof EncryptedMessage && recipient.plain() !== message.recipientPublicAccount!.address.plain()) { throw new Error("Recipient address and recipientPublicAccount don't match"); }
    const multiplier = new XEM(1);
    let fee = 0;
    mosaics.map((mosaic) => {
      if (mosaic.properties.divisibility === 0 && mosaic.properties.initialSupply <= 10000) { fee += 0.05 * 1000000; } else {
        const quantity = mosaic.amount;

        const maxMosaicQuantity = 9000000000000000;
        const totalMosaicQuantity = mosaic.properties.initialSupply * Math.pow(10, mosaic.properties.divisibility);
        const supplyRelatedAdjustment = Math.floor(0.8 * Math.log(maxMosaicQuantity / totalMosaicQuantity));

        const xemFee = Math.min(25, quantity * 900000 / mosaic.properties.initialSupply);
        fee += 0.05 * Math.max(1, xemFee - supplyRelatedAdjustment) * 1000000;
      }
    });
    if (message.payload.length !== 0) {
      fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
    }
    return new TransferTransaction(recipient,
      multiplier,
      TimeWindow.createWithDeadline(expiration),
      2,
      fee,
      message,
      undefined,
      mosaics.map((_) => new Mosaic(_.mosaicId, _.quantity())));
  }
}
