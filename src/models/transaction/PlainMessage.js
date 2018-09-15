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
var Message_1 = require("./Message");
/**
 * Plain Message model
 */
var PlainMessage = /** @class */ (function (_super) {
    __extends(PlainMessage, _super);
    /**
     * @internal
     * @param payload
     */
    function PlainMessage(payload) {
        return _super.call(this, payload) || this;
    }
    /**
     * Create new constructor
     * @returns {boolean}
     */
    PlainMessage.create = function (message) {
        return new PlainMessage(this.encodeHex(message));
    };
    PlainMessage.prototype.isEncrypted = function () {
        return false;
    };
    PlainMessage.prototype.isPlain = function () {
        return true;
    };
    /**
     * @internal
     */
    PlainMessage.createFromDTO = function (payload) {
        return new PlainMessage(payload);
    };
    /**
     * @internal
     * @returns {MessageDTO}
     */
    PlainMessage.prototype.toDTO = function () {
        return {
            payload: this.payload,
            type: 1
        };
    };
    /**
     * Message string
     * @returns {string}
     */
    PlainMessage.prototype.plain = function () {
        return Message_1.Message.decodeHex(this.payload);
    };
    return PlainMessage;
}(Message_1.Message));
exports.PlainMessage = PlainMessage;
exports.EmptyMessage = PlainMessage.create("");
