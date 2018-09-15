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
var NEMLibrary_1 = require("../../NEMLibrary");
var Address_1 = require("../account/Address");
var NetworkTypes_1 = require("../node/NetworkTypes");
var Transaction_1 = require("./Transaction");
var TransactionTypes_1 = require("./TransactionTypes");
/**
 * Accounts can rent a namespace for one year and after a year renew the contract. This is done via a ProvisionNamespaceTransaction.
 */
var ProvisionNamespaceTransaction = /** @class */ (function (_super) {
    __extends(ProvisionNamespaceTransaction, _super);
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param rentalFeeSink
     * @param rentalFee
     * @param newPart
     * @param fee
     * @param signature
     * @param parent
     * @param sender
     * @param transactionInfo
     */
    function ProvisionNamespaceTransaction(timeWindow, version, rentalFeeSink, rentalFee, newPart, fee, signature, parent, sender, transactionInfo) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.PROVISION_NAMESPACE, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.rentalFee = rentalFee;
        _this.rentalFeeSink = rentalFeeSink;
        _this.newPart = newPart;
        _this.parent = parent;
        _this.fee = fee;
        return _this;
    }
    /**
     * Create DTO of ProvisionNamespaceTransaction
     * @returns {TransactionDTO}
     */
    ProvisionNamespaceTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            version: version,
            fee: this.fee,
            type: this.type,
            signer: this.signer ? this.signer.publicKey : undefined,
            parent: this.parent === undefined ? null : this.parent,
            signature: this.signature,
            rentalFee: this.rentalFee,
            rentalFeeSink: this.rentalFeeSink.plain(),
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            newPart: this.newPart
        });
    };
    /**
     * Create a ProvisionNamespaceTransaction object
     * @param timeWindow
     * @param newPart
     * @param parent
     * @returns {ProvisionNamespaceTransaction}
     */
    ProvisionNamespaceTransaction.create = function (timeWindow, newPart, parent) {
        var subnamespaceFee = 10 * 1000000;
        var RootNamespaceFee = 100 * 1000000;
        var rentalFeeSink;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            rentalFeeSink = new Address_1.Address("TAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTDJE-YP35");
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            rentalFeeSink = new Address_1.Address("NAMESP-ACEWH4-MKFMBC-VFERDP-OOP4FK-7MTBXD-PZZA");
        }
        var fee = Math.floor(3 * 0.05 * 1000000);
        return new ProvisionNamespaceTransaction(timeWindow, 1, rentalFeeSink, parent === undefined ? RootNamespaceFee : subnamespaceFee, newPart, fee, undefined, parent);
    };
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string} namespaceName - Root namespace provision
     * @returns {ProvisionNamespaceTransaction}
     */
    ProvisionNamespaceTransaction.createRoot = function (timeWindow, namespaceName) {
        return ProvisionNamespaceTransaction.create(timeWindow, namespaceName);
    };
    /**
     *
     * @param {TimeWindow} timeWindow
     * @param {string }parentNamespace
     * @param {string} newNamespaceName
     * @returns {ProvisionNamespaceTransaction}
     */
    ProvisionNamespaceTransaction.createSub = function (timeWindow, parentNamespace, newNamespaceName) {
        return ProvisionNamespaceTransaction.create(timeWindow, newNamespaceName, parentNamespace);
    };
    return ProvisionNamespaceTransaction;
}(Transaction_1.Transaction));
exports.ProvisionNamespaceTransaction = ProvisionNamespaceTransaction;
