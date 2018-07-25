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

import { CACHE } from "../models/mosaic/CACHE";
import { MosaicTransferable } from '../models/mosaic/MosaicTransferable';
import { XEM } from "../models/mosaic/XEM";
import { MultisigTransaction } from "../models/transaction/MultisigTransaction";
import { Mosaic } from "../models/mosaic/Mosaic";
import { Transaction } from "../models/transaction/Transaction";
import { TransactionTypes } from "../models/transaction/TransactionTypes";
import { TransferTransaction } from "../models/transaction/TransferTransaction";
import { MosaicProperties } from "../models/mosaic/MosaicDefinition";

/**
 * Filters a list of Transactions and only returns transactions of type Transfer
 * @param {Transaction} transaction
 * @returns {boolean} isTransferTransaction
 */
export const transferFilter = (transaction: Transaction): boolean => {
  if (transaction.type == TransactionTypes.TRANSFER) {
    return true;
  } else if (transaction.type == TransactionTypes.MULTISIG && (transaction as MultisigTransaction).otherTransaction.type == TransactionTypes.TRANSFER) {
    return true;
  }
  return false;
};

/**
 * Parses through list of transactions and casts them to CacheTransferTransaction so we
 * can have access to important transfer details
 * @param {Transaction} transaction
 * @returns {TransferTransaction}
 */
export const mapTransfer = (transaction: Transaction): TransferTransaction => {
  let mosaics: Array<Mosaic> = [];
  let xem: XEM = new XEM(1);
  if (transaction.type == TransactionTypes.TRANSFER) {
    const transferTX = transaction as TransferTransaction;
    if (transferTX.containsMosaics()) {
      mosaics = transferTX.mosaics();
    } else {
      xem = xemDetails(transferTX);
    }
    return new TransferTransaction(transferTX.recipient, xem, transferTX.timeWindow,
      transferTX.version, transferTX.fee, transferTX.message, transferTX.signature, mosaics,
      transferTX.signer, transferTX.getTransactionInfo()
    );
  } else if (transaction.type == TransactionTypes.MULTISIG && (transaction as MultisigTransaction).otherTransaction.type == TransactionTypes.TRANSFER) {
    const transferTX = (transaction as MultisigTransaction).otherTransaction as TransferTransaction;
    if (transferTX.containsMosaics()) {
      mosaics = transferTX.mosaics();
    } else {
      xem = xemDetails(transferTX);
    }
    return new TransferTransaction(transferTX.recipient, xem, transferTX.timeWindow,
      transferTX.version, transferTX.fee, transferTX.message, transferTX.signature, mosaics,
      transferTX.signer, transferTX.getTransactionInfo()
    );
  }
  throw new Error("Transaction does not contain TransferTransaction");
};

/**
 * Verifies that mosaic received is cache and returns amount
 * @param {TransferTransaction} transaction
 * @returns {boolean}
 */
export const mosaicDetails = (transaction: TransferTransaction): MosaicTransferable | CACHE => {
  const mosaics = transaction.mosaics();
    if (mosaics[0].mosaicId.namespaceId === CACHE.MOSAICID.namespaceId && mosaics[0].mosaicId.name === CACHE.MOSAICID.name) {
      return new CACHE(mosaics[0].quantity / Math.pow(10, CACHE.DIVISIBILITY));
    }
    else {
      return new MosaicTransferable(mosaics[0].mosaicId, new MosaicProperties(), mosaics[0].quantity)
    }
  };

/**
 * Verifies that mosaic received is xem and returns amount
 * @param {TransferTransaction} transaction
 * @returns {boolean}
 */
export const xemDetails = (transaction: TransferTransaction): XEM => {
  if (!transaction.containsMosaics()) {
      return new XEM(transaction.xem().amount);
  }
  return new XEM(0);
};