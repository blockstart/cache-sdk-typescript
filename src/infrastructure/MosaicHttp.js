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
var MosaicDefinition_1 = require("../models/mosaic/MosaicDefinition");
var MosaicTransferable_1 = require("../models/mosaic/MosaicTransferable");
var HttpEndpoint_1 = require("./HttpEndpoint");
var MosaicHttp = /** @class */ (function (_super) {
    __extends(MosaicHttp, _super);
    function MosaicHttp(nodes) {
        return _super.call(this, "namespace", nodes) || this;
    }
    /**
     * Gets the mosaic definitions for a given namespace. The request supports paging.
     * @param namespace
     * @param id - The topmost mosaic definition database id up to which root mosaic definitions are returned. The parameter is optional. If not supplied the most recent mosaic definitiona are returned.
     * @param pageSize - The number of mosaic definition objects to be returned for each request. The parameter is optional. The default value is 25, the minimum value is 5 and hte maximum value is 100.
     * @returns Observable<MosaicDefinition[]>
     */
    MosaicHttp.prototype.getAllMosaicsGivenNamespace = function (namespace, id, pageSize) {
        var _this = this;
        var url = "mosaic/definition/page?namespace=" + namespace +
            (id === undefined ? "" : "&id=" + id) +
            (pageSize === undefined ? "" : "&pageSize=" + pageSize);
        return rxjs_1.Observable.of(url)
            .flatMap(function (url) { return requestPromise.get(_this.nextNode() + url, { json: true }); })
            .retryWhen(this.replyWhenRequestError)
            .map(function (mosaicDefinitionsData) {
            return mosaicDefinitionsData.data.map(function (mosaicDefinitionMetaDataPairDTO) {
                return MosaicDefinition_1.MosaicDefinition.createFromMosaicDefinitionMetaDataPairDTO(mosaicDefinitionMetaDataPairDTO);
            });
        });
    };
    /**
     * Return the Mosaic Definition given a namespace and mosaic. Throw exception if no mosaic is found
     * @param {string} mosaicId
     * @returns {Observable<MosaicDefinition>}
     */
    MosaicHttp.prototype.getMosaicDefinition = function (mosaicId) {
        return this.getAllMosaicsGivenNamespace(mosaicId.namespaceId, undefined, 100)
            .flatMap(function (_) { return _; })
            .filter(function (mosaicDefinition) { return mosaicDefinition.id.equals(mosaicId); })
            .last();
    };
    /**
     * Return a MosaicTransferable
     * @param {string} mosaicId
     * @param {number} quantity
     * @returns {Observable<MosaicTransferable>}
     */
    MosaicHttp.prototype.getMosaicTransferableWithAbsoluteAmount = function (mosaicId, quantity) {
        return this.getMosaicDefinition(mosaicId)
            .map(function (mosaicDefinition) { return MosaicTransferable_1.MosaicTransferable.createAbsolute(mosaicDefinition.id, mosaicDefinition.properties, quantity, mosaicDefinition.levy); });
    };
    /**
     * Return a MosaicTransferable
     * @param {string} mosaicId
     * @param {number} quantity
     * @returns {Observable<MosaicTransferable>}
     */
    MosaicHttp.prototype.getMosaicTransferableWithRelativeAmount = function (mosaicId, quantity) {
        return this.getMosaicDefinition(mosaicId)
            .map(function (mosaicDefinition) { return MosaicTransferable_1.MosaicTransferable.createRelative(mosaicDefinition.id, mosaicDefinition.properties, quantity, mosaicDefinition.levy); });
    };
    return MosaicHttp;
}(HttpEndpoint_1.HttpEndpoint));
exports.MosaicHttp = MosaicHttp;
