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
var rxjs_1 = require("rxjs");
var models_1 = require("../models");
var Listener_1 = require("./Listener");
/**
 * Blockchain listener
 */
var BlockchainListener = /** @class */ (function (_super) {
    __extends(BlockchainListener, _super);
    /**
     * Constructor
     * @param nodes
     */
    function BlockchainListener(nodes) {
        return _super.call(this, nodes) || this;
    }
    /**
     * Start listening new blocks
     * @returns {Observable<Block>}
     */
    BlockchainListener.prototype.newBlock = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var client = _this.createClient();
            client.connect({}, function () {
                client.subscribe("/blocks", function (data) {
                    try {
                        var dto = JSON.parse(data.body);
                        observer.next(models_1.Block.createFromBlockDTO(dto));
                    }
                    catch (e) {
                        observer.error(e);
                    }
                });
            }, function (err) {
                observer.error(err);
            });
            return function () {
                client.unsubscribe();
            };
        }).retry(10);
    };
    /**
     * Start listening new blockchain height
     * @returns {Observable<BlockHeight>}
     */
    BlockchainListener.prototype.newHeight = function () {
        var _this = this;
        return rxjs_1.Observable.create(function (observer) {
            var client = _this.createClient();
            client.connect({}, function () {
                client.subscribe("/blocks/new", function (data) {
                    try {
                        var dto = JSON.parse(data.body);
                        observer.next(dto.height);
                    }
                    catch (e) {
                        observer.error(e);
                    }
                });
            }, function (err) {
                observer.error(err);
            });
            return function () {
                client.unsubscribe();
            };
        }).retry(10);
    };
    return BlockchainListener;
}(Listener_1.Listener));
exports.BlockchainListener = BlockchainListener;
