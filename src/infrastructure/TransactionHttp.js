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
var requestPromise = require("request-promise-native");
var rxjs_1 = require("rxjs");
var NemAnnounceResult_1 = require("../models/transaction/NemAnnounceResult");
var HttpEndpoint_1 = require("./HttpEndpoint");
var CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
var TransactionHttp = /** @class */ (function (_super) {
    __extends(TransactionHttp, _super);
    function TransactionHttp(nodes) {
        return _super.call(this, "transaction", nodes) || this;
    }
    /**
     * Send the signed transaction
     * @param transaction
     * @returns Observable<NemAnnounceSuccessResult>
     */
    TransactionHttp.prototype.announceTransaction = function (transaction) {
        var _this = this;
        return rxjs_1.Observable.of("announce")
            .flatMap(function (url) { return requestPromise.post({
            uri: _this.nextNode() + url,
            body: transaction,
            json: true
        }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (nemAnnonceResultDTO) {
            if (nemAnnonceResultDTO.message != "SUCCESS") {
                throw new Error(nemAnnonceResultDTO.message);
            }
            return NemAnnounceResult_1.NemAnnounceResult.createFromNemAnnounceResultDTO(nemAnnonceResultDTO);
        });
    };
    /**
     * Receive a transaction by its hash
     * @param {string} hash - transaction hash
     * @returns Observable<Transaction>
     */
    TransactionHttp.prototype.getByHash = function (hash) {
        var _this = this;
        return rxjs_1.Observable.of("get?hash=" + hash)
            .flatMap(function (url) { return requestPromise.get({
            uri: _this.nextNode() + url,
            json: true
        }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (transactionDTO) { return CreateTransactionFromDTO_1.CreateTransactionFromDTO(transactionDTO); });
    };
    return TransactionHttp;
}(HttpEndpoint_1.HttpEndpoint));
exports.TransactionHttp = TransactionHttp;
