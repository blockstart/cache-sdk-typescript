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
var EncryptedPrivateKey_1 = require("../../models/wallet/EncryptedPrivateKey");
var SimpleWallet_1 = require("../../models/wallet/SimpleWallet");
var bAddress_1 = require("./bAddress");
var BSimpleWallet = /** @class */ (function (_super) {
    __extends(BSimpleWallet, _super);
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    function BSimpleWallet(name, network, address, creationDate, encryptedPrivateKey) {
        return _super.call(this, name, network, address, creationDate, encryptedPrivateKey) || this;
    }
    /**
     * Create a SimpleWallet from object
     * @param wallet - wallet object from outside source
     * @returns {SimpleWallet}
     */
    BSimpleWallet.castToSimpleWallet = function (wallet) {
        var newEncryptedPrivateKey = new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.encryptedPrivateKey.encryptedKey, wallet.encryptedPrivateKey.iv);
        return new SimpleWallet_1.SimpleWallet(wallet.name, wallet.network, bAddress_1.BAddress.castToAddress(wallet.address), wallet.creationDate, newEncryptedPrivateKey);
    };
    return BSimpleWallet;
}(SimpleWallet_1.SimpleWallet));
exports.BSimpleWallet = BSimpleWallet;
