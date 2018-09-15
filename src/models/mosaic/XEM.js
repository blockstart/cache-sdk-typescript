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
var MosaicDefinition_1 = require("./MosaicDefinition");
var MosaicId_1 = require("./MosaicId");
var MosaicTransferable_1 = require("./MosaicTransferable");
/**
 * XEM mosaic transferable
 */
var XEM = /** @class */ (function (_super) {
    __extends(XEM, _super);
    /**
     * constructor
     * @param quantity - Relative quantity
     */
    function XEM(quantity) {
        return _super.call(this, XEM.MOSAICID, new MosaicDefinition_1.MosaicProperties(XEM.DIVISIBILITY, XEM.INITIALSUPPLY, XEM.TRANSFERABLE, XEM.SUPPLYMUTABLE), quantity * Math.pow(10, XEM.DIVISIBILITY)) || this;
    }
    /**
     * Create XEM with an absolute quantity
     * @param quantity
     * @returns {MosaicTransferable}
     */
    XEM.fromAbsolute = function (quantity) {
        return new XEM(quantity / Math.pow(10, XEM.DIVISIBILITY));
    };
    /**
     * Create XEM with an relative quantity
     * @param quantity
     * @returns {MosaicTransferable}
     */
    XEM.fromRelative = function (quantity) {
        return new XEM(quantity);
    };
    /**
     * Divisiblity
     * @type {number}
     */
    XEM.DIVISIBILITY = 6;
    /**
     * Initial supply
     * @type {number}
     */
    XEM.INITIALSUPPLY = 8999999999;
    /**
     * Is tranferable
     * @type {boolean}
     */
    XEM.TRANSFERABLE = true;
    /**
     * Is mutable
     * @type {boolean}
     */
    XEM.SUPPLYMUTABLE = false;
    /**
     * mosaicId
     * @type {MosaicId}
     */
    XEM.MOSAICID = new MosaicId_1.MosaicId("nem", "xem");
    return XEM;
}(MosaicTransferable_1.MosaicTransferable));
exports.XEM = XEM;
