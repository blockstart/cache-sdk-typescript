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
var _this = this;
exports.__esModule = true;
var Observable_1 = require("rxjs/Observable");
var TransactionHttp_1 = require("../../src/infrastructure/TransactionHttp");
var Account_1 = require("../../src/models/account/Account");
var Address_1 = require("../../src/models/account/Address");
var MosaicDefinition_1 = require("../../src/models/mosaic/MosaicDefinition");
var MosaicId_1 = require("../../src/models/mosaic/MosaicId");
var MosaicTransferable_1 = require("../../src/models/mosaic/MosaicTransferable");
var XEM_1 = require("../../src/models/mosaic/XEM");
var NetworkTypes_1 = require("../../src/models/node/NetworkTypes");
var PlainMessage_1 = require("../../src/models/transaction/PlainMessage");
var TransferTransaction_1 = require("../../src/models/transaction/TransferTransaction");
var NEMLibrary_1 = require("../../src/NEMLibrary");
describe("AddressTransactionListener", function () {
    var privateKey = process.env.PRIVATE_KEY;
    var transactionHttp;
    var account;
    before(function () {
        // Initialize NEMLibrary for TEST_NET Network
        NEMLibrary_1.NEMLibrary.bootstrap(NetworkTypes_1.NetworkTypes.TEST_NET);
        account = Account_1.Account.createWithPrivateKey(privateKey);
        transactionHttp = new TransactionHttp_1.TransactionHttp();
    });
    after(function () {
        NEMLibrary_1.NEMLibrary.reset();
    });
    it("should listen to confirmed xem transaction", function (done) {
        var address = new Address_1.Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(address, new XEM_1.XEM(1), PlainMessage_1.EmptyMessage, TransferTransaction_1.ExpirationType.twoHour);
        var subscriber = account.address.confirmedTxObserver().subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
            var mt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, x.mosaicDetails()];
                    case 1:
                        mt = _a.sent();
                        console.log(mt[0]);
                        subscriber.unsubscribe();
                        done();
                        return [2 /*return*/];
                }
            });
        }); }, function (err) {
            console.log(err);
        });
        var transaction = account.signTransaction(transferTransaction);
        Observable_1.Observable.of(1)
            .delay(3000)
            .flatMap(function (ignored) { return transactionHttp.announceTransaction(transaction); })
            .subscribe(function (x) {
            console.log(x);
        });
    });
    it("should listen to confirmed cache transaction", function (done) {
        var address = new Address_1.Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(address, new MosaicTransferable_1.MosaicTransferable(new MosaicId_1.MosaicId('cache', 'cache'), new MosaicDefinition_1.MosaicProperties(6, 1000000000, true, false), 1), PlainMessage_1.EmptyMessage, TransferTransaction_1.ExpirationType.twoHour);
        var subscriber = account.address.confirmedTxObserver().subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
            var mt, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, x.mosaicDetails()];
                    case 1:
                        mt = _a.sent();
                        console.log(mt[0]);
                        subscriber.unsubscribe();
                        done();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }, function (err) {
            console.log(err);
        });
        var transaction = account.signTransaction(transferTransaction);
        Observable_1.Observable.of(1)
            .delay(3000)
            .flatMap(function (ignored) { return transactionHttp.announceTransaction(transaction); })
            .subscribe(function (x) {
            console.log(x);
        });
    });
    it("should listen to unconfirmed xem transaction", function (done) {
        var address = new Address_1.Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(address, new XEM_1.XEM(2), PlainMessage_1.EmptyMessage, TransferTransaction_1.ExpirationType.twoHour);
        var subscriber = account.address.unconfirmedTxObserver().subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
            var mt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, x.mosaicDetails()];
                    case 1:
                        mt = _a.sent();
                        console.log(mt[0]);
                        subscriber.unsubscribe();
                        done();
                        return [2 /*return*/];
                }
            });
        }); }, function (err) {
            console.log(err);
        });
        var transaction = account.signTransaction(transferTransaction);
        Observable_1.Observable.of(1)
            .delay(3000)
            .flatMap(function (ignored) { return transactionHttp.announceTransaction(transaction); })
            .subscribe(function (x) {
            console.log(x);
        });
    });
    it("should listen to unconfirmed cache transaction", function (done) {
        var address = new Address_1.Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(address, new MosaicTransferable_1.MosaicTransferable(new MosaicId_1.MosaicId('cache', 'cache'), new MosaicDefinition_1.MosaicProperties(6, 1000000000, true, false), 1), PlainMessage_1.EmptyMessage, TransferTransaction_1.ExpirationType.twoHour);
        var subscriber = account.address.unconfirmedTxObserver().subscribe(function (x) { return __awaiter(_this, void 0, void 0, function () {
            var mt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, x.mosaicDetails()];
                    case 1:
                        mt = _a.sent();
                        console.log(mt[0]);
                        subscriber.unsubscribe();
                        done();
                        return [2 /*return*/];
                }
            });
        }); }, function (err) {
            console.log(err);
        });
        var transaction = account.signTransaction(transferTransaction);
        Observable_1.Observable.of(1)
            .delay(3000)
            .flatMap(function (ignored) { return transactionHttp.announceTransaction(transaction); })
            .subscribe(function (x) {
            console.log(x);
        });
    });
    it("should return Mosaic Transferable Array for address", function (done) {
        try {
            var address = new Address_1.Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
            address.mosaics().then(function (mosaics) {
                console.log(mosaics);
                done();
            });
        }
        catch (err) {
            console.log(err);
        }
    });
});
