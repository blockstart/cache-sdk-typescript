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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Transaction_1 = require("./Transaction");
var TransactionTypes_1 = require("./TransactionTypes");
/**
 * Multisig transaction are the only way to make transaction from a multisig account to another account.
 * A multisig transaction carries another transaction inside (often referred to as "inner" transaction).
 * The inner transaction can be a transfer, an importance transfer or an aggregate modification transaction.
 * A multisig transaction also has multisig signature transactions from the cosignatories of the multisig account inside.
 */
var MultisigTransaction = /** @class */ (function (_super) {
    __extends(MultisigTransaction, _super);
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param otherTrans
     * @param fee
     * @param signatures
     * @param signature
     * @param sender
     * @param transactionInfo
     * @param hashData
     */
    function MultisigTransaction(timeWindow, version, otherTrans, fee, signatures, signature, sender, transactionInfo, hashData) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.MULTISIG, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.otherTransaction = otherTrans;
        _this.hashData = hashData;
        _this.fee = fee;
        _this.signatures = signatures;
        return _this;
    }
    /**
     * Check if transaction is pending to sign
     * @returns {boolean}
     */
    MultisigTransaction.prototype.isPendingToSign = function () {
        return this.transactionInfo == null && this.hashData != null;
    };
    /**
     * Create a MultisigTransaction object
     * @param timeWindow
     * @param otherTrans
     * @param multisig
     * @returns {MultisigTransaction}
     */
    MultisigTransaction.create = function (timeWindow, otherTrans, multisig) {
        var fee = Math.floor(3 * 0.05 * 1000000);
        otherTrans.signer = multisig;
        return new MultisigTransaction(timeWindow, 1, otherTrans, fee, []);
    };
    /**
     * @internal
     * @param networkType
     */
    MultisigTransaction.prototype.setNetworkType = function (networkType) {
        _super.prototype.setNetworkType.call(this, networkType);
        this.otherTransaction.setNetworkType(networkType);
    };
    // region boilerplate
    /**
     * Create DTO of MultisigTransaction
     * @returns {MultisigTransactionDTO}
     */
    MultisigTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            signer: this.signer ? this.signer.publicKey : undefined,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            type: this.type,
            signature: this.signature,
            signatures: this.signatures.map(function (signature) { return signature.toDTO(); }),
            version: version,
            fee: this.fee,
            otherTrans: this.otherTransaction.toDTO()
        });
    };
    return MultisigTransaction;
}(Transaction_1.Transaction));
exports.MultisigTransaction = MultisigTransaction;
