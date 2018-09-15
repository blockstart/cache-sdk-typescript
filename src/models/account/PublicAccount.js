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
var nemSdk = require("nem-sdk");
var NEMLibrary_1 = require("../../NEMLibrary");
var NetworkTypes_1 = require("../node/NetworkTypes");
var Address_1 = require("./Address");
/**
 * Public account model
 */
var PublicAccount = /** @class */ (function () {
    /**
     * @internal
     * @param address
     * @param publicKey
     */
    function PublicAccount(address, publicKey) {
        this.address = address;
        this.publicKey = publicKey;
    }
    /**
     * @returns {boolean}
     */
    PublicAccount.prototype.hasPublicKey = function () {
        return this.publicKey != null && (this.publicKey.length === 64 || this.publicKey.length === 66);
    };
    /**
     * Creates a new PublicAccount from a public key
     * @param publicKey
     * @returns {PublicAccount}
     */
    PublicAccount.createWithPublicKey = function (publicKey) {
        if (publicKey == null || (publicKey.length !== 64 && publicKey.length !== 66)) {
            throw new Error("Not a valid public key");
        }
        var network;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.MAIN_NET) {
            network = nemSdk["default"].model.network.data.mainnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() === NetworkTypes_1.NetworkTypes.TEST_NET) {
            network = nemSdk["default"].model.network.data.testnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            network = nemSdk["default"].model.network.data.mijin.id;
        }
        var address = nemSdk["default"].model.address.toAddress(publicKey, network);
        return new PublicAccount(new Address_1.Address(address), publicKey);
    };
    return PublicAccount;
}());
exports.PublicAccount = PublicAccount;
