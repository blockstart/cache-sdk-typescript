"use strict";
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
exports.__esModule = true;
var XEM_1 = require("../../models/mosaic/XEM");
var TransactionTypes_1 = require("../../models/transaction/TransactionTypes");
var bTransferTransaction_1 = require("../models/bTransferTransaction");
/**
 * Filters a list of Transactions and only returns transactions of type Transfer
 * @param {Transaction} transaction
 * @returns {boolean} isTransferTransaction
 */
exports.transferFilter = function (transaction) {
    if (transaction.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
        return true;
    }
    else if (transaction.type == TransactionTypes_1.TransactionTypes.MULTISIG && transaction.otherTransaction.type == TransactionTypes_1.TransactionTypes.TRANSFER) {
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
exports.mapTransfer = function (transaction) {
    var mosaics = [];
    var xem = new XEM_1.XEM(1);
    if (transaction.type === TransactionTypes_1.TransactionTypes.TRANSFER) {
        var transferTX = transaction;
        if (transferTX.containsMosaics()) {
            mosaics = transferTX.mosaics();
        }
        else {
            xem = transferTX.xem();
        }
        var transactionInfo = void 0;
        if (transferTX.isConfirmed()) {
            transactionInfo = transferTX.getTransactionInfo();
        }
        return new bTransferTransaction_1.BTransferTransaction(transferTX.recipient, xem, transferTX.timeWindow, transferTX.version, transferTX.fee, transferTX.message, transferTX.signature, mosaics, transferTX.signer, transactionInfo);
    }
    else if (transaction.type === TransactionTypes_1.TransactionTypes.MULTISIG && transaction.otherTransaction.type === TransactionTypes_1.TransactionTypes.TRANSFER) {
        var transferTX = transaction.otherTransaction;
        if (transferTX.containsMosaics()) {
            mosaics = transferTX.mosaics();
        }
        else {
            xem = transferTX.xem();
        }
        var transactionInfo = void 0;
        if (transferTX.isConfirmed()) {
            transactionInfo = transferTX.getTransactionInfo();
        }
        return new bTransferTransaction_1.BTransferTransaction(transferTX.recipient, xem, transferTX.timeWindow, transferTX.version, transferTX.fee, transferTX.message, transferTX.signature, mosaics, transferTX.signer, transactionInfo);
    }
    throw new Error("Transaction does not contain TransferTransaction");
};
