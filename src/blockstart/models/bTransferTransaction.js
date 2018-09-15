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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var TimeWindow_1 = require("../../models/transaction/TimeWindow");
var TransferTransaction_1 = require("../../models/transaction/TransferTransaction");
var ExpirationType;
(function (ExpirationType) {
    ExpirationType[ExpirationType["oneHour"] = 1] = "oneHour";
    ExpirationType[ExpirationType["twoHour"] = 2] = "twoHour";
    ExpirationType[ExpirationType["sixHour"] = 6] = "sixHour";
    ExpirationType[ExpirationType["twelveHour"] = 12] = "twelveHour";
})(ExpirationType = exports.ExpirationType || (exports.ExpirationType = {}));
var BTransferTransaction = /** @class */ (function (_super) {
    __extends(BTransferTransaction, _super);
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
    function BTransferTransaction(recipient, amount, timeWindow, version, fee, message, signature, mosaic, sender, transactionInfo) {
        var _this = _super.call(this, recipient, amount, timeWindow, version, fee, message, signature, mosaic, sender, transactionInfo) || this;
        /**
         * returns mosaic array of received mosaics
         * @returns {MosaicTransferable[]}
         */
        _this.mosaicDetails = function () {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var _a, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            if (!this.containsMosaics()) return [3 /*break*/, 2];
                            _a = resolve;
                            return [4 /*yield*/, Promise.all(this.mosaics().map(function (mosaic) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, mosaic.getMosaicDetails()];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                }); }))];
                        case 1:
                            _a.apply(void 0, [_b.sent()]);
                            return [3 /*break*/, 3];
                        case 2:
                            resolve([this.xem()]);
                            _b.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            err_1 = _b.sent();
                            reject(err_1);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            }); });
        };
        return _this;
    }
    /**
     * Create a CacheTransferTransaction object
     * @param recipient
     * @param mosaic
     * @param message
     * @param expiration? - 2 hours default, can't exceed 23 hours
     * @returns {TransferTransaction}
     */
    BTransferTransaction.createTX = function (recipient, mosaic, message, expiration) {
        if (mosaic.mosaicId.namespaceId === 'nem' && mosaic.mosaicId.name === 'xem') {
            return TransferTransaction_1.TransferTransaction.create(TimeWindow_1.TimeWindow.createWithDeadline(expiration), recipient, mosaic, message);
        }
        else {
            return TransferTransaction_1.TransferTransaction.createWithMosaics(TimeWindow_1.TimeWindow.createWithDeadline(expiration), recipient, [mosaic], message);
        }
    };
    return BTransferTransaction;
}(TransferTransaction_1.TransferTransaction));
exports.BTransferTransaction = BTransferTransaction;
