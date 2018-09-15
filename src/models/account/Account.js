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
var nemSdk = require("nem-sdk");
var NEMLibrary_1 = require("../../NEMLibrary");
var NetworkTypes_1 = require("../node/NetworkTypes");
var EncryptedMessage_1 = require("../transaction/EncryptedMessage");
var Address_1 = require("./Address");
var PublicAccount_1 = require("./PublicAccount");
/**
 * Account model
 */
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    /**
     * Constructor
     * @internal
     * @param address
     * @param publicKey
     * @param privateKey
     */
    function Account(address, publicKey, privateKey) {
        var _this = _super.call(this, address, publicKey) || this;
        _this.privateKey = privateKey;
        return _this;
    }
    /**
     * Sign a transaction
     * @param transaction
     * @returns {{data: any, signature: string}}
     */
    Account.prototype.signTransaction = function (transaction) {
        transaction.signer = PublicAccount_1.PublicAccount.createWithPublicKey(this.publicKey);
        transaction.setNetworkType(this.address.network());
        var dto = transaction.toDTO();
        var keyPair = nemSdk["default"].crypto.keyPair.create(nemSdk["default"].utils.helpers.fixPrivateKey(this.privateKey));
        var result = nemSdk["default"].utils.serialization.serializeTransaction(dto);
        var signature = keyPair.sign(result);
        return {
            data: nemSdk["default"].utils.convert.ua2hex(result),
            signature: signature.toString()
        };
    };
    /**
     * Sign string
     * @param messagestring
     * @returns signatureString
     */
    Account.prototype.signMessage = function (message) {
        var keyPair = nemSdk["default"].crypto.keyPair.create(nemSdk["default"].utils.helpers.fixPrivateKey(this.privateKey));
        return keyPair.sign(message);
    };
    /**
     * verify message
     * @param signedMessage
     * @param signature
     * @returns true/false
     */
    Account.prototype.verifySignedMessage = function (signedMessage, signature) {
        return nemSdk["default"].crypto.verifySignature(this.publicKey, signedMessage, signature);
    };
    /**
     * constructor with private key
     * @param privateKey
     * @returns {Account}
     */
    Account.createWithPrivateKey = function (privateKey) {
        if (privateKey == undefined) {
            throw new Error("Private Key is undefined");
        }
        var network;
        if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MAIN_NET) {
            network = nemSdk["default"].model.network.data.mainnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.TEST_NET) {
            network = nemSdk["default"].model.network.data.testnet.id;
        }
        else if (NEMLibrary_1.NEMLibrary.getNetworkType() == NetworkTypes_1.NetworkTypes.MIJIN_NET) {
            network = nemSdk["default"].model.network.data.mijin.id;
        }
        var keyPair = nemSdk["default"].crypto.keyPair.create(nemSdk["default"].utils.helpers.fixPrivateKey(privateKey));
        var publicKey = keyPair.publicKey.toString();
        var address = nemSdk["default"].model.address.toAddress(publicKey, network);
        return new Account(new Address_1.Address(address), publicKey, privateKey);
    };
    /**
     * generate new account
     * @param walletName
     * @param passphrase
     * @param networkType
     * @returns {Account}
     */
    Account.generateAccount = function (walletName, passphrase, networkType) {
        // Generate a random private key
        // Note: we DON'T want to derivate the private key from the passphrase, since everytime the password is the same,
        //   the same key pair would be generated (brain wallet).
        //   Brain wallets are great, if the user can remember the password in his BRAIN and the
        //   password is still complex enough to be secure and unique.
        //   Hence, brain wallets are not the right choice for most users
        var privateKey = nemSdk["default"].crypto.js.lib.WordArray.random(32).toString();
        var keyPair = nemSdk["default"].crypto.keyPair.create(privateKey);
        var address = PublicAccount_1.PublicAccount.createWithPublicKey(keyPair.publicKey.toString()).address;
        return new Account(address, keyPair.publicKey.toString(), privateKey.toString());
    };
    /**
     * Create a new encrypted Message
     * @param message
     * @param recipientPublicAccount
     * @returns {EncryptedMessage}
     */
    Account.prototype.encryptMessage = function (message, recipientPublicAccount) {
        return EncryptedMessage_1.EncryptedMessage.create(message, recipientPublicAccount, this.privateKey);
    };
    /**
     * Decrypts an encrypted message
     * @param encryptedMessage
     * @param recipientPublicAccount
     * @returns {PlainMessage}
     */
    Account.prototype.decryptMessage = function (encryptedMessage, recipientPublicAccount) {
        return EncryptedMessage_1.EncryptedMessage.decrypt(encryptedMessage, this.privateKey, recipientPublicAccount);
    };
    return Account;
}(PublicAccount_1.PublicAccount));
exports.Account = Account;
