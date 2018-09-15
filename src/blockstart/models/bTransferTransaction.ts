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

import { Address } from '../../models/account/Address';
import { PublicAccount } from '../../models/account/PublicAccount';
import { Mosaic } from '../../models/mosaic/Mosaic';
import { MosaicTransferable } from '../../models/mosaic/MosaicTransferable';
import { XEM } from '../../models/mosaic/XEM';
import { EncryptedMessage } from '../../models/transaction/EncryptedMessage';
import { PlainMessage } from '../../models/transaction/PlainMessage';
import { TimeWindow } from '../../models/transaction/TimeWindow';
import { TransactionInfo } from '../../models/transaction/TransactionInfo';
import { TransactionTypes } from '../../models/transaction/TransactionTypes';
import { TransferTransaction } from '../../models/transaction/TransferTransaction';
import { BAddress } from './bAddress';

export enum ExpirationType {
  oneHour = 1,
  twoHour = 2,
  sixHour = 6,
  twelveHour = 12
}

export class BTransferTransaction extends TransferTransaction{
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

  /**
   * Create a CacheTransferTransaction object
   * @param recipient
   * @param mosaic
   * @param message
   * @param expiration? - 2 hours default, can't exceed 23 hours
   * @returns {TransferTransaction}
   */
  public static createTX = (recipient: BAddress,
                          mosaic: MosaicTransferable,
                          message: PlainMessage | EncryptedMessage,
                          expiration?: ExpirationType): TransferTransaction => {
    if (mosaic.mosaicId.namespaceId === 'nem' && mosaic.mosaicId.name === 'xem') {
      return TransferTransaction.create(TimeWindow.createWithDeadline(expiration), recipient, mosaic, message);
    } else {
      return  TransferTransaction.createWithMosaics(TimeWindow.createWithDeadline(expiration), recipient, [mosaic], message);
    }
  };
}