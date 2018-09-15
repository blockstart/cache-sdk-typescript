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
var Mosaic_1 = require("../mosaic/Mosaic");
var XEM_1 = require("../mosaic/XEM");
var EncryptedMessage_1 = require("./EncryptedMessage");
var Transaction_1 = require("./Transaction");
var TransactionTypes_1 = require("./TransactionTypes");
/**
 * Transfer transactions contain data about transfers of XEM or mosaics to another account.
 */
var TransferTransaction = /** @class */ (function (_super) {
    __extends(TransferTransaction, _super);
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
    function TransferTransaction(recipient, amount, timeWindow, version, fee, message, signature, mosaic, sender, transactionInfo) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.TRANSFER, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.fee = fee;
        _this.recipient = recipient;
        _this._xem = amount;
        _this.message = message;
        _this._mosaics = mosaic;
        return _this;
    }
    /**
     * in case that the transfer transaction contains mosaics, it throws an error
     * @returns {XEM}
     */
    TransferTransaction.prototype.xem = function () {
        if (this.containsMosaics()) {
            throw new Error("contain mosaics");
        }
        return this._xem;
    };
    /**
     * in case that the transfer transaction does not contain mosaics, it throws an error
     * @returns {Mosaic[]}
     */
    TransferTransaction.prototype.mosaics = function () {
        var _this = this;
        if (this.containsMosaics()) {
            return this._mosaics.map(function (mosaic) {
                return new Mosaic_1.Mosaic(mosaic.mosaicId, (mosaic.quantity * (_this._xem.relativeQuantity())));
            });
        }
        throw new Error("Does not contain mosaics");
    };
    /**
     *
     * @returns {boolean}
     */
    TransferTransaction.prototype.containsMosaics = function () {
        return this._mosaics !== undefined && this._mosaics.length > 0;
    };
    /**
     * all the Mosaic Identifiers of the attached mosaics
     * @returns {MosaicId[]}
     */
    TransferTransaction.prototype.mosaicIds = function () {
        if (!this.containsMosaics()) {
            throw new Error("does not contain mosaics");
        }
        return this._mosaics.map(function (_) { return _.mosaicId; });
    };
    /**
     * Create DTO of TransferTransaction
     * @returns {TransferTransactionDTO}
     */
    TransferTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            signer: this.signer ? this.signer.publicKey : undefined,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            signature: this.signature,
            type: this.type,
            version: version,
            mosaics: this._mosaics === undefined ? undefined : this._mosaics.map(function (mosaic) { return new Mosaic_1.Mosaic(mosaic.mosaicId, mosaic.quantity); }),
            fee: this.fee,
            recipient: this.recipient.plain(),
            amount: this._xem.absoluteQuantity(),
            message: this.message.toDTO()
        });
    };
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param xem
     * @param message
     * @returns {TransferTransaction}
     */
    TransferTransaction.create = function (timeWindow, recipient, xem, message) {
        if (message instanceof EncryptedMessage_1.EncryptedMessage && recipient.plain() !== message.recipientPublicAccount.address.plain()) {
            throw new Error("Recipient address and recipientPublicAccount don't match");
        }
        var fee = Math.floor(0.05 * this.calculateMinimum(xem.relativeQuantity()) * 1000000);
        if (message.payload.length !== 0) {
            fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
        }
        return new TransferTransaction(recipient, xem, timeWindow, 1, fee, message, undefined, undefined);
    };
    /**
     * @internal
     * @param amount
     * @returns {number}
     */
    TransferTransaction.calculateMinimum = function (amount) {
        var fee = Math.floor(Math.max(1, amount / 10000));
        return fee > 25 ? 25 : fee;
    };
    /**
     * Create a TransferTransaction object
     * @param timeWindow
     * @param recipient
     * @param mosaics
     * @param message
     * @returns {TransferTransaction}
     */
    // tslint:disable-next-line:member-ordering
    TransferTransaction.createWithMosaics = function (timeWindow, recipient, mosaics, message) {
        if (message instanceof EncryptedMessage_1.EncryptedMessage && recipient.plain() !== message.recipientPublicAccount.address.plain()) {
            throw new Error("Recipient address and recipientPublicAccount don't match");
        }
        var multiplier = new XEM_1.XEM(1);
        var fee = 0;
        mosaics.map(function (mosaic) {
            if (mosaic.properties.divisibility === 0 && mosaic.properties.initialSupply <= 10000) {
                fee += 0.05 * 1000000;
            }
            else {
                var maxMosaicQuantity = 9000000000000000;
                var totalMosaicQuantity = mosaic.properties.initialSupply * Math.pow(10, mosaic.properties.divisibility);
                var supplyRelatedAdjustment = Math.floor(0.8 * Math.log(Math.floor(maxMosaicQuantity / totalMosaicQuantity)));
                var quantity = mosaic.quantity;
                var xemFee = Math.min(25, Math.floor((8999999999 * quantity) / (totalMosaicQuantity * 10000)));
                var unweightFee = Math.max(1, xemFee - supplyRelatedAdjustment);
                fee += 0.05 * 1e6 * unweightFee;
            }
        });
        if (message.payload.length !== 0) {
            fee += 0.05 * (Math.floor((message.payload.length / 2) / 32) + 1) * 1000000;
        }
        return new TransferTransaction(recipient, multiplier, timeWindow, 2, fee, message, undefined, mosaics.map(function (_) { return new Mosaic_1.Mosaic(_.mosaicId, _.absoluteQuantity()); }));
    };
    return TransferTransaction;
}(Transaction_1.Transaction));
exports.TransferTransaction = TransferTransaction;
