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

import { CACHE } from "../cacheMosaic/CACHE";
import { cacheDetails, xemDetails } from "../../cacheServices/CacheTransactionService";
import { Address } from "../../models/account/Address";
import { PublicAccount } from "../../models/account/PublicAccount";
import { Mosaic } from "../../models/mosaic/Mosaic";
import { XEM } from "../../models/mosaic/XEM";
import { EncryptedMessage } from "../../models/transaction/EncryptedMessage";
import { PlainMessage } from "../../models/transaction/PlainMessage";
import { TimeWindow } from "../../models/transaction/TimeWindow";
import { TransactionInfo } from "../../models/transaction/TransactionInfo";
import { TransferTransaction } from "../../models/transaction/TransferTransaction";

export class CacheTransferTransaction extends TransferTransaction {
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
    super(recipient, amount, timeWindow, version, fee, message, signature, mosaic, sender, transactionInfo);
  }

  public mosaicDetails = (): XEM | CACHE => {
    if (this.containsMosaics()) {
      return cacheDetails(this);
    } else {
      return xemDetails(this);
    }
  };

  /**
   * Create a Xem TransferTransaction object
   * @param timeWindow
   * @param recipient
   * @param xem
   * @param message
   * @returns {TransferTransaction}
   */
  public static createWithXem = (timeWindow: TimeWindow,
                                 recipient: Address,
                                 xem: XEM,
                                 message: PlainMessage | EncryptedMessage): CacheTransferTransaction => {

    const transferTransaction: TransferTransaction = TransferTransaction.create(timeWindow, recipient, xem, message);

    return new CacheTransferTransaction(transferTransaction.recipient,
      transferTransaction.xem(),
      transferTransaction.timeWindow,
      1,
      transferTransaction.fee,
      transferTransaction.message,
      undefined,
      undefined);
  };

  /**
   * Create a Cache TransferTransaction object
   * @param timeWindow
   * @param recipient
   * @param cache
   * @param message
   * @returns {TransferTransaction}
   */
  public static createWithCache = (timeWindow: TimeWindow,
                                   recipient: Address,
                                   cache: CACHE,
                                   message: PlainMessage | EncryptedMessage): CacheTransferTransaction => {

    const transferTransaction: TransferTransaction = TransferTransaction.createWithMosaics(timeWindow, recipient, [cache], message);
    return new CacheTransferTransaction(transferTransaction.recipient,
      new XEM(1),
      transferTransaction.timeWindow,
      2,
      transferTransaction.fee,
      transferTransaction.message,
      undefined,
      transferTransaction.mosaics().map((_) => new Mosaic(_.mosaicId, _.quantity)));
  };
}