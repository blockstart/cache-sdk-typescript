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
 * The supply type. Supported supply types are:
 * 1: Increase in supply.
 * 2: Decrease in supply.
 */
var MosaicSupplyType;
(function (MosaicSupplyType) {
    MosaicSupplyType[MosaicSupplyType["Increase"] = 1] = "Increase";
    MosaicSupplyType[MosaicSupplyType["Decrease"] = 2] = "Decrease";
})(MosaicSupplyType = exports.MosaicSupplyType || (exports.MosaicSupplyType = {}));
/**
 * In case a mosaic definition has the property 'supplyMutable' set to true, the creator of the mosaic definition can change the supply, i.e. increase or decrease the supply.
 */
var MosaicSupplyChangeTransaction = /** @class */ (function (_super) {
    __extends(MosaicSupplyChangeTransaction, _super);
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param mosaicId
     * @param supplyType
     * @param delta
     * @param fee
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    function MosaicSupplyChangeTransaction(timeWindow, version, mosaicId, supplyType, delta, fee, signature, sender, transactionInfo) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.MOSAIC_SUPPLY_CHANGE, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.mosaicId = mosaicId;
        _this.supplyType = supplyType;
        _this.delta = delta;
        _this.fee = fee;
        return _this;
    }
    /**
     * Create DTO of MosaicSupplychangeTransaction
     * @returns TransactionDTO
     */
    MosaicSupplyChangeTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            signer: this.signer ? this.signer.publicKey : undefined,
            type: this.type,
            version: version,
            signature: this.signature,
            fee: this.fee,
            mosaicId: this.mosaicId.toDTO(),
            delta: this.delta,
            supplyType: this.supplyType
        });
    };
    /**
     * Create a MosaicSupplyChangeTransaction object
     * @param timeWindow
     * @param mosaicId
     * @param supplyType
     * @param delta
     * @returns {MosaicSupplyChangeTransaction}
     */
    MosaicSupplyChangeTransaction.create = function (timeWindow, mosaicId, supplyType, delta) {
        var fee = Math.floor(3.0 * 0.05 * 1000000);
        return new MosaicSupplyChangeTransaction(timeWindow, 1, mosaicId, supplyType, delta, fee);
    };
    return MosaicSupplyChangeTransaction;
}(Transaction_1.Transaction));
exports.MosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction;
