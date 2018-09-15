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
var NetworkTypes_1 = require("../node/NetworkTypes");
var EncryptedPrivateKey_1 = require("./EncryptedPrivateKey");
var Wallet_1 = require("./Wallet");
/**
 * Simple wallet model generates a private key from a PRNG
 */
var SimpleWallet = /** @class */ (function (_super) {
    __extends(SimpleWallet, _super);
    /**
     * @internal
     * @param name
     * @param network
     * @param address
     * @param creationDate
     * @param encryptedPrivateKey
     */
    function SimpleWallet(name, network, address, creationDate, encryptedPrivateKey) {
        var _this = _super.call(this, name, network, address, creationDate, 1) || this;
        _this.encryptedPrivateKey = encryptedPrivateKey;
        return _this;
    }
    /**
     * Create a SimpleWallet
     * @param name
     * @param password
     * @returns {SimpleWallet}
     */
    SimpleWallet.create = function (name, password) {
        var network = NEMLibrary_1.NEMLibrary.getNetworkType();
        var wallet = nemSdk["default"].model.wallet.createPRNG(name, password.value, SimpleWallet.networkTypesSDKAdapter(network));
        return new SimpleWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv));
    };
    /**
     * Create a SimpleWallet from private key
     * @param name
     * @param password
     * @param privateKey
     * @returns {SimpleWallet}
     */
    SimpleWallet.createWithPrivateKey = function (name, password, privateKey) {
        var network = NEMLibrary_1.NEMLibrary.getNetworkType();
        var wallet = nemSdk["default"].model.wallet.importPrivateKey(name, password.value, privateKey, SimpleWallet.networkTypesSDKAdapter(network));
        return new SimpleWallet(name, network, new Address_1.Address(wallet.accounts["0"].address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv));
    };
    /**
     * Open a wallet and generate an Account
     * @param password
     * @returns {Account}
     */
    SimpleWallet.prototype.open = function (password) {
        var account = Account_1.Account.createWithPrivateKey(this.encryptedPrivateKey.decrypt(password));
        if (account.address.equals(this.address)) {
            return account;
        }
        throw new Error("wrong password");
    };
    SimpleWallet.prototype.unlockPrivateKey = function (password) {
        var privateKey = this.encryptedPrivateKey.decrypt(password);
        if (privateKey === "" || (privateKey.length !== 64 && privateKey.length !== 66)) {
            throw new Error("Invalid password");
        }
        var account = Account_1.Account.createWithPrivateKey(privateKey);
        if (!account.address.equals(this.address)) {
            throw new Error("Invalid password");
        }
        return privateKey;
    };
    /**
     * Converts SimpleWallet into writable string to persist into a file
     * @returns {string}
     */
    SimpleWallet.prototype.writeWLTFile = function () {
        return js_base64_1.Base64.encode(JSON.stringify({
            name: this.name,
            network: this.network.toString(),
            address: this.address.plain(),
            creationDate: this.creationDate.toString(),
            schema: this.schema,
            type: "simple",
            encryptedPrivateKey: this.encryptedPrivateKey.encryptedKey,
            iv: this.encryptedPrivateKey.iv
        }));
    };
    /**
     * Reads the WLT content and converts it into a SimpleWallet
     * @param {string} wlt
     * @returns {SimpleWallet}
     */
    SimpleWallet.readFromWLT = function (wlt) {
        var wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        if (wallet.type !== "simple") {
            throw new Error("ERROR WLT TYPE");
        }
        return new SimpleWallet(wallet.name, wallet.network, new Address_1.Address(wallet.address), js_joda_1.LocalDateTime.parse(wallet.creationDate), new EncryptedPrivateKey_1.EncryptedPrivateKey(wallet.encryptedPrivateKey, wallet.iv));
    };
    SimpleWallet.readFromNanoWalletWLF = function (wlt) {
        var wallet = JSON.parse(js_base64_1.Base64.decode(wlt));
        // TODO: Check the encrypted and iv fields, if they aren't null, it's a simple wallet
        var account = wallet.accounts[0];
        var network;
        if (account.network < 0) {
            network = NetworkTypes_1.NetworkTypes.TEST_NET;
        }
        else if (account.network == 104) {
            network = NetworkTypes_1.NetworkTypes.MAIN_NET;
        }
        else {
            network = NetworkTypes_1.NetworkTypes.MIJIN_NET;
        }
        return new SimpleWallet(wallet.name, network, new Address_1.Address(account.address), js_joda_1.LocalDateTime.now(), new EncryptedPrivateKey_1.EncryptedPrivateKey(account.encrypted, account.iv));
    };
    return SimpleWallet;
}(Wallet_1.Wallet));
exports.SimpleWallet = SimpleWallet;
