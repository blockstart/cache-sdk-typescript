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
var models_1 = require("../models");
var AccountHarvestInfo_1 = require("../models/account/AccountHarvestInfo");
var AccountHistoricalInfo_1 = require("../models/account/AccountHistoricalInfo");
var AccountImportanceInfo_1 = require("../models/account/AccountImportanceInfo");
var AccountInfo_1 = require("../models/account/AccountInfo");
var NodeHarvestInfo_1 = require("../models/account/NodeHarvestInfo");
var Mosaic_1 = require("../models/mosaic/Mosaic");
var MosaicDefinition_1 = require("../models/mosaic/MosaicDefinition");
var Namespace_1 = require("../models/namespace/Namespace");
var AllTransactionsPageable_1 = require("./AllTransactionsPageable");
var HarvestInfoPageable_1 = require("./HarvestInfoPageable");
var HttpEndpoint_1 = require("./HttpEndpoint");
var IncomingTransactionsPageable_1 = require("./IncomingTransactionsPageable");
var OutgoingTransactionsPageable_1 = require("./OutgoingTransactionsPageable");
var CreateTransactionFromDTO_1 = require("./transaction/CreateTransactionFromDTO");
var CreateUnconfirmedTransactionFromDTO_1 = require("./transaction/CreateUnconfirmedTransactionFromDTO");
/**
 *
 */
var AccountHttp = /** @class */ (function (_super) {
    __extends(AccountHttp, _super);
    function AccountHttp(nodes) {
        return _super.call(this, "account", nodes) || this;
    }
    /**
     * Gets an AccountInfoWithMetaData for an account.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    AccountHttp.prototype.getFromAddress = function (address) {
        var _this = this;
        return rxjs_1.Observable.of("get?address=" + address.plain())
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (accountMetaDataPairDTO) {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        });
    };
    /**
     * Gets an AccountInfoWithMetaData for an account with publicKey
     * @param publicKey - NEM
     * @return Observable<AccountInfoWithMetaData>
     */
    AccountHttp.prototype.getFromPublicKey = function (publicKey) {
        var _this = this;
        return rxjs_1.Observable.of("get/from-public-key?publicKey=" + publicKey)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (accountMetaDataPairDTO) {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        });
    };
    /**
     * Given a delegate (formerly known as remote) account's address, gets the AccountMetaDataPair for the account for which the given account is the delegate account.
     * If the given account address is not a delegate account for any account, the request returns the AccountMetaDataPair for the given address.
     * @param address - Address
     * @return Observable<AccountInfoWithMetaData>
     */
    AccountHttp.prototype.getOriginalAccountDataFromDelegatedAccountAddress = function (address) {
        var _this = this;
        return rxjs_1.Observable.of("get/forwarded?address=" + address.plain())
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (accountMetaDataPairDTO) {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        });
    };
    /**
     * retrieve the original account data by providing the public key of the delegate account.
     * @param publicKey - string
     * @return Observable<AccountInfoWithMetaData>
     */
    AccountHttp.prototype.getOriginalAccountDataFromDelegatedAccountPublicKey = function (publicKey) {
        var _this = this;
        return rxjs_1.Observable.of("get/forwarded/from-public-key?publicKey=" + publicKey)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (accountMetaDataPairDTO) {
            return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
        });
    };
    /**
     * Gets the AccountMetaData from an account.
     * @param address - NEM Address
     * @return Observable<AccountStatus>
     */
    AccountHttp.prototype.status = function (address) {
        var _this = this;
        return rxjs_1.Observable.of("status?address=" + address.plain())
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (result) { return models_1.AccountStatus.createFromAccountMetaDataDTO(result); });
    };
    /**
     * A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction.
     * In the same way outgoing transaction are the transactions where the account is the sender of the transaction.
     * Unconfirmed transactions are those transactions that have not yet been included in a block.
     * Unconfirmed transactions are not guaranteed to be included in any block
     * @param address - The address of the account.
     * @param params
     */
    AccountHttp.prototype.incomingTransactions = function (address, params) {
        var _this = this;
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        var url = "transfers/incoming?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (transactions) { return transactions.data.map(function (dto) { return CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto); }); });
    };
    /**
     * Paginaged version of incomingTransactions request
     * @param address
     * @param params
     */
    AccountHttp.prototype.incomingTransactionsPaginated = function (address, params) {
        if (params === undefined)
            params = {};
        return new IncomingTransactionsPageable_1.IncomingTransactionsPageable(this, address, params);
    };
    /**
     * Gets an array of transaction meta data pairs where the recipient has the address given as parameter to the request.
     * A maximum of 25 transaction meta data pairs is returned. For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    AccountHttp.prototype.outgoingTransactions = function (address, params) {
        var _this = this;
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        var url = "transfers/outgoing?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (transactions) { return transactions.data.map(function (dto) { return CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto); }); });
    };
    /**
     * Paginaged version of outgoingTransactions request
     * @param address
     * @param params
     * @param params
     */
    AccountHttp.prototype.outgoingTransactionsPaginated = function (address, params) {
        if (params === undefined)
            params = {};
        return new OutgoingTransactionsPageable_1.OutgoingTransactionsPageable(this, address, params);
    };
    /**
     * Gets an array of transaction meta data pairs for which an account is the sender or receiver.
     * A maximum of 25 transaction meta data pairs is returned.
     * For details about sorting and discussion of the second parameter see Incoming transactions.
     * @param address - The address of the account.
     * @param params
     */
    AccountHttp.prototype.allTransactions = function (address, params) {
        var _this = this;
        if (params == undefined)
            params = {};
        params.pageSize = params.pageSize && (params.pageSize >= 5 && params.pageSize <= 100) ? params.pageSize : 10;
        var url = "transfers/all?address=" + address.plain() +
            (params.hash === undefined ? "" : "&hash=" + params.hash) +
            (params.id === undefined ? "" : "&id=" + params.id) +
            (params.pageSize === undefined ? "" : "&pageSize=" + params.pageSize);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (transactions) { return transactions.data.map(function (dto) { return CreateTransactionFromDTO_1.CreateTransactionFromDTO(dto); }); });
    };
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param params
     */
    AccountHttp.prototype.allTransactionsPaginated = function (address, params) {
        if (params === undefined)
            params = {};
        return new AllTransactionsPageable_1.AllTransactionsPageable(this, address, params);
    };
    /**
     * Gets the array of transactions for which an account is the sender or receiver and which have not yet been included in a block
     * @param address - NEM Address
     * @return Observable<Transaction[]>
     */
    AccountHttp.prototype.unconfirmedTransactions = function (address) {
        var _this = this;
        return rxjs_1.Observable.of("unconfirmedTransactions?address=" + address.plain())
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (unconfirmedTransactions) {
            return unconfirmedTransactions.data.map(function (unconfirmedTransaction) {
                return CreateUnconfirmedTransactionFromDTO_1.CreateUnconfirmedTransactionFromDTO(unconfirmedTransaction);
            });
        });
    };
    /**
     * Gets an array of harvest info objects for an account.
     * @param address - Address
     * @param id - string (optional)
     * @return Observable<AccountHarvestInfo[]>
     */
    AccountHttp.prototype.getHarvestInfoDataForAnAccount = function (address, id) {
        var _this = this;
        var url = "harvests?address=" + address.plain() +
            (id === undefined ? "" : "&id=" + id);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (harvestInfoData) {
            return harvestInfoData.data.map(function (harvestInfoDTO) {
                return AccountHarvestInfo_1.AccountHarvestInfo.createFromHarvestInfoDTO(harvestInfoDTO);
            });
        });
    };
    /**
     * Paginaged version of allTransactions request
     * @param address
     * @param id
     * @returns {HarvestInfoPageable}
     */
    AccountHttp.prototype.getHarvestInfoDataForAnAccountPaginated = function (address, id) {
        return new HarvestInfoPageable_1.HarvestInfoPageable(this, address, id);
    };
    /**
     * Gets an array of account importance view model objects.
     * @return Observable<AccountImportanceInfo[]>
     */
    AccountHttp.prototype.getAccountImportances = function () {
        var _this = this;
        return rxjs_1.Observable.of("importances")
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (importanceData) {
            return importanceData.data.map(function (accountImportanceViewModel) {
                return AccountImportanceInfo_1.AccountImportanceInfo.createFromAccountImportanceViewModelDTO(accountImportanceViewModel);
            });
        });
    };
    /**
     * Gets an array of namespace objects for a given account address.
     * The parent parameter is optional. If supplied, only sub-namespaces of the parent namespace are returned.
     * @param address - Address
     * @param parent - The optional parent namespace id.
     * @param id - The optional namespace database id up to which namespaces are returned.
     * @param pageSize - The (optional) number of namespaces to be returned.
     * @return Observable<Namespace[]>
     */
    AccountHttp.prototype.getNamespaceOwnedByAddress = function (address, parent, pageSize, id) {
        var _this = this;
        var url = "namespace/page?address=" + address.plain() +
            (parent === undefined ? "" : "&parent=" + parent) +
            (id === undefined ? "" : "&id=" + id) +
            (pageSize === undefined ? "" : "&pageSize=" + pageSize);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (namespacesData) {
            return namespacesData.data.map(function (namespaceDTO) {
                return Namespace_1.Namespace.createFromNamespaceDTO(namespaceDTO);
            });
        });
    };
    /**
     * Gets an array of mosaic definition objects for a given account address. The parent parameter is optional.
     * If supplied, only mosaic definitions for the given parent namespace are returned.
     * The id parameter is optional and allows retrieving mosaic definitions in batches of 25 mosaic definitions.
     * @param address - The address of the account.
     * @param parent - The optional parent namespace id.
     * @param id - The optional mosaic definition database id up to which mosaic definitions are returned.
     * @return Observable<MosaicDefinition[]>
     */
    AccountHttp.prototype.getMosaicCreatedByAddress = function (address, parent, id) {
        var _this = this;
        var url = "mosaic/definition/page?address=" + address.plain() +
            (parent === undefined ? "" : "&parent=" + parent) +
            (id === undefined ? "" : "&id=" + id);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (mosaicsData) {
            return mosaicsData.data.map(function (mosaicDefinitionDTO) {
                return MosaicDefinition_1.MosaicDefinition.createFromMosaicDefinitionDTO(mosaicDefinitionDTO);
            });
        });
    };
    /**
     * Gets an array of mosaic objects for a given account address.
     * @param address - Address
     * @return Observable<Mosaic[]>
     */
    AccountHttp.prototype.getMosaicOwnedByAddress = function (address) {
        var _this = this;
        return rxjs_1.Observable.of("mosaic/owned?address=" + address.plain())
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (mosaicsData) {
            return mosaicsData.data.map(function (mosaicDTO) {
                return Mosaic_1.Mosaic.createFromMosaicDTO(mosaicDTO);
            });
        });
    };
    /**
     * Unlocks an account (starts harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    AccountHttp.prototype.unlockHarvesting = function (host, privateKey) {
        return rxjs_1.Observable.fromPromise(requestPromise.post({
            uri: "http://" + host + ":7890/account/unlock",
            body: {
                value: privateKey
            },
            json: true
        }).promise())
            .map(function (x) { return true; });
    };
    /**
     * Locks an account (stops harvesting).
     * @param host - string
     * @param privateKey - string
     * @return Observable<boolean>
     */
    AccountHttp.prototype.lockHarvesting = function (host, privateKey) {
        return rxjs_1.Observable.fromPromise(requestPromise.post({
            uri: "http://" + host + ":7890/account/lock",
            body: {
                value: privateKey
            },
            json: true
        }).promise())
            .map(function (x) { return true; });
    };
    /**
     * Each node can allow users to harvest with their delegated key on that node.
     * The NIS configuration has entries for configuring the maximum number of allowed harvesters and optionally allow harvesting only for certain account addresses.
     * The unlock info gives information about the maximum number of allowed harvesters and how many harvesters are already using the node.
     * @return Observable<NodeHarvestInfo>
     */
    AccountHttp.prototype.unlockInfo = function () {
        var _this = this;
        return rxjs_1.Observable.of("unlocked/info")
            .flatMap(function (url) { return requestPromise.post({
            uri: _this.nextNode() + url,
            json: true
        }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (nodeHarvestInfo) {
            return new NodeHarvestInfo_1.NodeHarvestInfo(nodeHarvestInfo["max-unlocked"], nodeHarvestInfo["num-unlocked"]);
        });
    };
    /**
     * Gets historical information for an account.
     * @param address - The address of the account.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[]>
     */
    AccountHttp.prototype.getHistoricalAccountData = function (address, startHeight, endHeight, increment) {
        var _this = this;
        return rxjs_1.Observable.of("historical/get?address=" + address.plain() + "&startHeight=" + startHeight + "&endHeight=" + endHeight + "&increment=" + increment)
            .flatMap(function (url) { return requestPromise.get(_this.nextHistoricalNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (historicalAccountData) {
            return historicalAccountData.data.map(function (accountHistoricalDataViewModelDTO) {
                return AccountHistoricalInfo_1.AccountHistoricalInfo.createFromAccountHistoricalDataViewModelDTO(accountHistoricalDataViewModelDTO);
            });
        });
    };
    /**
     * Gets historical information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @param startHeight - The block height from which on the data should be supplied.
     * @param endHeight - The block height up to which the data should be supplied. The end height must be greater than or equal to the start height.
     * @param increment - The value by which the height is incremented between each data point. The value must be greater than 0. NIS can supply up to 1000 data points with one request. Requesting more than 1000 data points results in an error.
     * @return Observable<AccountHistoricalInfo[][]>
     */
    AccountHttp.prototype.getBatchHistoricalAccountData = function (addresses, startHeight, endHeight, increment) {
        var _this = this;
        return rxjs_1.Observable.of("historical/get/batch")
            .flatMap(function (url) {
            return requestPromise.post({
                uri: _this.nextHistoricalNode() + url,
                body: {
                    accounts: addresses.map(function (a) {
                        return { account: a.plain() };
                    }),
                    startHeight: (startHeight),
                    endHeight: (endHeight),
                    incrementBy: increment
                },
                json: true
            });
        })
            .retryWhen(this.replyWhenRequestError)
            .map(function (batchHistoricalAccountData) {
            return batchHistoricalAccountData.data.map(function (historicalAccountData) {
                return historicalAccountData.data.map(function (accountHistoricalDataViewModelDTO) {
                    return AccountHistoricalInfo_1.AccountHistoricalInfo.createFromAccountHistoricalDataViewModelDTO(accountHistoricalDataViewModelDTO);
                });
            });
        });
    };
    /**
     * Gets batch information for an array of accounts.
     * @param addresses - The addresses of the accounts as an array of addresses.
     * @return Observable<AccountInfoWithMetadata[]>
     */
    AccountHttp.prototype.getBatchAccountData = function (addresses) {
        var _this = this;
        return rxjs_1.Observable.of("get/batch")
            .flatMap(function (url) {
            var options = {
                uri: _this.nextNode() + url,
                body: {
                    data: addresses.map(function (a) {
                        return { account: a.plain() };
                    })
                },
                json: true
            };
            return requestPromise.post(options);
        })
            .retryWhen(this.replyWhenRequestError)
            .map(function (batchAccountData) {
            return batchAccountData.data.map(function (accountMetaDataPairDTO) {
                return AccountInfo_1.AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountMetaDataPairDTO);
            });
        });
    };
    return AccountHttp;
}(HttpEndpoint_1.HttpEndpoint));
exports.AccountHttp = AccountHttp;
