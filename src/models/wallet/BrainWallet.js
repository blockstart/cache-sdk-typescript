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
var js_base64_1 = require("js-base64");
var js_joda_1 = require("js-joda");
var nemSdk = require("nem-sdk");
var NEMLibrary_1 = require("../../NEMLibrary");
var Account_1 = require("../account/Account");
var Address_1 = require("../account/Address");
var Wallet_1 = require("./Wallet");
/**
 * Brain wallet derived the private key from the brainPassword, hashing the brainPassword multiple times, therefore it's crucial to select a SAFE brainPassword.
 */
var BrainWallet = /** @class */ (function (_super) {
    __extends(BrainWallet, _super);
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     */
    function BrainWallet(name, network, address, creationDate) {
        return _super.call(this, name, network, address, creationDate, 1) || this;
    }
    /**
     * Create a BrainWallet
     * @param name
     * @param password
     * @returns {BrainWallet}
     */
    BrainWallet.create = function (name, password) {
        var network = NEMLibrary_1.NEMLibrary.getNetworkType();
        var wallet = nemSdk["default"].model.wallet.createBrain(name, password.value, Wallet_1.Wallet.networkTypesSDKAdapter(network));
        return new BrainWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now());
    };
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    BrainWallet.prototype.open = function (password) {
        var common = nemSdk["default"].model.objects.create("common")(password.value, "");
        nemSdk["default"].crypto.helpers.passwordToPrivatekey(common, {}, "pass:6k");
        return Account_1.Account.createWithPrivateKey(common.privateKey);
    };
    BrainWallet.prototype.unlockPrivateKey = function (password) {
        var common = nemSdk["default"].model.objects.create("common")(password.value, "");
        nemSdk["default"].crypto.helpers.passwordToPrivatekey(common, {}, "pass:6k");
        return common.privateKey;
    };
    /**
     * Converts BrainWallet into writable string to persist into a file
     * @returns {string}
     */
    BrainWallet.prototype.writeWLTFile = function () {
        return js_base64_1.Base64.encode(JSON.stringify({
            name: this.name,
            network: this.network.toString(),
            address: this.address.plain(),
            creationDate: this.creationDate.toString(),
            schema: this.schema,
            type: "brain"
        }));
    };
    /**
     * Reads the WLT content and converts it into a BrainWallet
     * @param {string} wlt
     * @returns {BrainWallet}
     */
    BrainWallet.readFromWLT = function (wlt) {
        var wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        if (wallet.type != "brain") {
            throw new Error("ERROR WLT TYPE");
        }
        return new BrainWallet(wallet.name, wallet.network, new Address_1.Address(wallet.address), js_joda_1.LocalDateTime.parse(wallet.creationDate));
    };
    return BrainWallet;
}(Wallet_1.Wallet));
exports.BrainWallet = BrainWallet;
