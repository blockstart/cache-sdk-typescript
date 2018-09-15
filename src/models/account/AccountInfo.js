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
var Balance_1 = require("./Balance");
var PublicAccount_1 = require("./PublicAccount");
var RemoteStatus;
(function (RemoteStatus) {
    RemoteStatus["REMOTE"] = "REMOTE";
    RemoteStatus["ACTIVATING"] = "ACTIVATING";
    RemoteStatus["ACTIVE"] = "ACTIVE";
    RemoteStatus["DEACTIVATING"] = "DEACTIVATING";
    RemoteStatus["INACTIVE"] = "INACTIVE";
})(RemoteStatus = exports.RemoteStatus || (exports.RemoteStatus = {}));
var Status;
(function (Status) {
    Status["UNKNOWN"] = "UNKNOWN";
    Status["LOCKED"] = "LOCKED";
    Status["UNLOCKED"] = "UNLOCKED";
})(Status = exports.Status || (exports.Status = {}));
/**
 * The account structure describes basic information for an account.
 */
var AccountInfo = /** @class */ (function () {
    /**
     * @internal
     * @param balance
     * @param vestedBalance
     * @param importance
     * @param publicKey
     * @param harvestedBlocks
     * @param cosignatoriesCount
     * @param minCosignatories
     */
    function AccountInfo(balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories) {
        this.balance = new Balance_1.Balance(balance, vestedBalance);
        this.importance = importance;
        if (publicKey != null) {
            this.publicAccount = PublicAccount_1.PublicAccount.createWithPublicKey(publicKey);
        }
        this.harvestedBlocks = harvestedBlocks;
        this.cosignatoriesCount = cosignatoriesCount;
        this.minCosignatories = minCosignatories;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfo}
     */
    AccountInfo.createFromAccountInfoDTO = function (dto) {
        return new AccountInfo(dto.balance, dto.vestedBalance, dto.importance, dto.publicKey, dto.harvestedBlocks);
    };
    return AccountInfo;
}());
exports.AccountInfo = AccountInfo;
var AccountInfoWithMetaData = /** @class */ (function (_super) {
    __extends(AccountInfoWithMetaData, _super);
    /**
     * @internal
     * @param status
     * @param remoteStatus
     * @param cosignatoryOf
     * @param cosignatories
     * @param balance
     * @param vestedBalance
     * @param importance
     * @param publicKey
     * @param harvestedBlocks
     * @param cosignatoriesCount
     * @param minCosignatories
     */
    function AccountInfoWithMetaData(status, remoteStatus, cosignatoryOf, cosignatories, balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories) {
        var _this = _super.call(this, balance, vestedBalance, importance, publicKey, harvestedBlocks, cosignatoriesCount, minCosignatories) || this;
        _this.status = status;
        _this.remoteStatus = remoteStatus;
        _this.cosignatoryOf = cosignatoryOf;
        _this.cosignatories = cosignatories;
        return _this;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfoWithMetaData}
     */
    AccountInfoWithMetaData.createFromAccountMetaDataPairDTO = function (dto) {
        return new AccountInfoWithMetaData(Status[dto.meta.status], RemoteStatus[dto.meta.remoteStatus], dto.meta.cosignatoryOf.map(function (accountInfoDTO) { return AccountInfo.createFromAccountInfoDTO(accountInfoDTO); }), dto.meta.cosignatories.map(function (accountInfoDTO) { return AccountInfo.createFromAccountInfoDTO(accountInfoDTO); }), dto.account.balance, dto.account.vestedBalance, dto.account.importance, dto.account.publicKey, dto.account.harvestedBlocks, dto.account.multisigInfo.cosignatoriesCount, dto.account.multisigInfo.minCosignatories);
    };
    return AccountInfoWithMetaData;
}(AccountInfo));
exports.AccountInfoWithMetaData = AccountInfoWithMetaData;
// TODO: Solve this, issue with AccountHttp.status(address: Address)
var AccountStatus = /** @class */ (function () {
    /**
     * @internal
     */
    function AccountStatus(status, remoteStatus, cosignatoryOf, cosignatories) {
        this.status = status;
        this.remoteStatus = remoteStatus;
        this.cosignatoryOf = cosignatoryOf;
        this.cosignatories = cosignatories;
    }
    /**
     * @internal
     * @param dto
     * @returns {AccountInfoWithMetaData}
     */
    AccountStatus.createFromAccountMetaDataDTO = function (dto) {
        return new AccountStatus(Status[dto.status], RemoteStatus[dto.remoteStatus], dto.cosignatoryOf.map(function (accountInfoDTO) { return AccountInfo.createFromAccountInfoDTO(accountInfoDTO); }), dto.cosignatories.map(function (accountInfoDTO) { return AccountInfo.createFromAccountInfoDTO(accountInfoDTO); }));
    };
    return AccountStatus;
}());
exports.AccountStatus = AccountStatus;
