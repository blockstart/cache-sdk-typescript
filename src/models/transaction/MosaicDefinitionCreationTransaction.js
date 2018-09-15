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
 * Before a mosaic can be created or transferred, a corresponding definition of the mosaic has to be created and published to the network.
 * This is done via a mosaic definition creation transaction.
 */
var MosaicDefinitionCreationTransaction = /** @class */ (function (_super) {
    __extends(MosaicDefinitionCreationTransaction, _super);
    /**
     * @internal
     * @param timeWindow
     * @param version
     * @param creationFee
     * @param creationFeeSink
     * @param mosaicDefinition
     * @param fee
     * @param signature
     * @param sender
     * @param transactionInfo
     */
    function MosaicDefinitionCreationTransaction(timeWindow, version, creationFee, creationFeeSink, mosaicDefinition, fee, signature, sender, transactionInfo) {
        var _this = _super.call(this, TransactionTypes_1.TransactionTypes.MOSAIC_DEFINITION_CREATION, version, timeWindow, signature, sender, transactionInfo) || this;
        _this.creationFeeSink = creationFeeSink;
        _this.creationFee = creationFee;
        _this.mosaicDefinition = mosaicDefinition;
        _this.fee = fee;
        return _this;
    }
    /**
     * Create DTO of MosaicDefinitionCreationTransaction
     * @returns {MosaicDefinitionCreationTransactionDTO}
     */
    MosaicDefinitionCreationTransaction.prototype.toDTO = function () {
        var version = this.networkVersion ? this.networkVersion : this.version;
        return this.serializeDTO({
            type: this.type,
            fee: this.fee,
            version: version,
            signer: this.signer ? this.signer.publicKey : undefined,
            signature: this.signature,
            deadline: this.timeWindow.deadlineToDTO(),
            timeStamp: this.timeWindow.timeStampToDTO(),
            creationFee: this.creationFee,
            creationFeeSink: this.creationFeeSink.plain(),
            mosaicDefinition: this.mosaicDefinition.toDTO()
        });
    };
    /**
     * Create a MosaicDefinitionCreationTransaction object
     * @param timeWindow
     * @param mosaicDefinition
     * @returns {MosaicDefinitionCreationTransaction}
     */
    MosaicDefinitionCreationTransaction.create = function (timeWindow, mosaicDefinition) {
        var fee = Math.floor(3 * 0.05 * 1000000);
        var creationFeeSink;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            creationFeeSink = new Address_1.Address("TBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSJBR-5OLC");
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            creationFeeSink = new Address_1.Address("NBMOSA-ICOD4F-54EE5C-DMR23C-CBGOAM-2XSIUX-6TRS");
        }
        var creationFee = Math.floor(10 * 1000000);
        return new MosaicDefinitionCreationTransaction(timeWindow, 1, creationFee, creationFeeSink, mosaicDefinition, fee);
    };
    return MosaicDefinitionCreationTransaction;
}(Transaction_1.Transaction));
exports.MosaicDefinitionCreationTransaction = MosaicDefinitionCreationTransaction;
