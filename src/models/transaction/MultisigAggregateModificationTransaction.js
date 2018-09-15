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
 * Multisig aggregate modification transactions are part of the NEM's multisig account system.
 * A multisig aggregate modification transaction holds an array of multisig cosignatory modifications and a single multisig minimum cosignatories modification inside the transaction.
 * A multisig aggregate modification transaction can be wrapped by a multisig transaction.
 */
var MultisigAggregateModificationTransaction = /** @class */ (function (_super) {
    __extends(MultisigAggregateModificationTransaction, _super);
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
    function MultisigAggregateModificationTransaction(timeWindow, version, modifications, fee, signature, relativeChange, sender, transactionInfo) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.MULTISIG_AGGREGATE_MODIFICATION, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.relativeChange = relativeChange;
        _this.modifications = modifications;
        _this.fee = fee;
        return _this;
    }
    /**
     * Create DTO of MultisigAggregateModificationTransaction
     * @returns {MultisigAggregateModificationTransactionDTO}
     */
    MultisigAggregateModificationTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            signer: this.signer ? this.signer.publicKey : undefined,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            type: this.type,
            version: version,
            signature: this.signature,
            fee: this.fee,
            minCosignatories: this.relativeChange === undefined ? undefined : {
                relativeChange: this.relativeChange
            },
            modifications: this.modifications.map(function (modification) {
                return {
                    cosignatoryAccount: modification.cosignatoryAccount.publicKey,
                    modificationType: modification.action
                };
            })
        });
    };
    /**
     * Create a MultisigAggregateModificationTransaction object
     * @param timeWindow
     * @param modifications
     * @param relativeChange
     * @returns {MultisigAggregateModificationTransaction}
     */
    MultisigAggregateModificationTransaction.create = function (timeWindow, modifications, relativeChange) {
        var fee = Math.floor(10 * 0.05 * 1000000);
        var version = relativeChange ? 2 : 1;
        return new MultisigAggregateModificationTransaction(timeWindow, version, modifications, fee, undefined, relativeChange);
    };
    return MultisigAggregateModificationTransaction;
}(Transaction_1.Transaction));
exports.MultisigAggregateModificationTransaction = MultisigAggregateModificationTransaction;
/**
 * The type of modification. Possible values are:
 * 1: Add a new cosignatory.
 * 2: Delete an existing cosignatory.
 */
var CosignatoryModificationAction;
(function (CosignatoryModificationAction) {
    CosignatoryModificationAction[CosignatoryModificationAction["ADD"] = 1] = "ADD";
    CosignatoryModificationAction[CosignatoryModificationAction["DELETE"] = 2] = "DELETE";
})(CosignatoryModificationAction = exports.CosignatoryModificationAction || (exports.CosignatoryModificationAction = {}));
var CosignatoryModification = /** @class */ (function () {
    /**
     * constructor
     * @param cosignatoryAccount
     * @param action
     */
    function CosignatoryModification(cosignatoryAccount, action) {
        this.cosignatoryAccount = cosignatoryAccount;
        this.action = action;
    }
    return CosignatoryModification;
}());
exports.CosignatoryModification = CosignatoryModification;
