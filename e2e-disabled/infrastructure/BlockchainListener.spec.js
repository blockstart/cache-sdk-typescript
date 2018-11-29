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
var BlockchainListener_1 = require("../../src/infrastructure/BlockchainListener");
var TransactionHttp_1 = require("../../src/infrastructure/TransactionHttp");
var Account_1 = require("../../src/models/account/Account");
var Address_1 = require("../../src/models/account/Address");
var XEM_1 = require("../../src/models/mosaic/XEM");
var NetworkTypes_1 = require("../../src/models/node/NetworkTypes");
var PlainMessage_1 = require("../../src/models/transaction/PlainMessage");
var TimeWindow_1 = require("../../src/models/transaction/TimeWindow");
var TransferTransaction_1 = require("../../src/models/transaction/TransferTransaction");
var NEMLibrary_1 = require("../../src/NEMLibrary");
var Observable_1 = require("rxjs/Observable");
describe("BlockchainListener", function () {
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
    it("should listen the new block", function (done) {
        var address = new Address_1.Address("TDM3DO-ZM5WJ3-ZRBPSM-YRU6JS-WKUCAH-5VIPOF-4W7K");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(TimeWindow_1.TimeWindow.createWithDeadline(), address, new XEM_1.XEM(0), PlainMessage_1.EmptyMessage);
        var subscriber = new BlockchainListener_1.BlockchainListener().newBlock().subscribe(function (x) {
            console.log(x);
            subscriber.unsubscribe();
            done();
        }, function (err) {
            console.log(err);
        });
        var transaction = account.signTransaction(transferTransaction);
        Observable_1.Observable.of(1)
            .delay(1000)
            .flatMap(function (ignored) { return transactionHttp.announceTransaction(transaction); })
            .subscribe(function (x) {
            console.log(x);
        });
    });
    it("should listen the new block", function (done) {
        var address = new Address_1.Address("TBUAUC-3VYKPP-3PJPOH-7A7BCB-2C4I64-XZAAOZ-BO6N");
        var transferTransaction = TransferTransaction_1.TransferTransaction.create(TimeWindow_1.TimeWindow.createWithDeadline(), address, new XEM_1.XEM(0), PlainMessage_1.EmptyMessage);
        var subscriber = new BlockchainListener_1.BlockchainListener().newHeight().subscribe(function (x) {
            console.log(x);
            done();
            subscriber.unsubscribe();
        }, function (err) {
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
});
