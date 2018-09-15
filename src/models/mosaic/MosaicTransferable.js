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
/**
 * Mosaic transferable model
 */
var MosaicTransferable = /** @class */ (function () {
    /**
     * constructor
     * @param mosaicId
     * @param properties
     * @param quantity
     * @param levy
     */
    function MosaicTransferable(mosaicId, properties, quantity, levy) {
        this.mosaicId = mosaicId;
        this.properties = properties;
        this.levy = levy;
        this.quantity = quantity;
    }
    /**
     * Create a MosaicTransferable object with mosaic definition
     * @param mosaicDefinition
     * @param amount
     * @returns {MosaicTransferable}
     */
    MosaicTransferable.createWithMosaicDefinition = function (mosaicDefinition, amount) {
        return new MosaicTransferable(mosaicDefinition.id, mosaicDefinition.properties, amount, mosaicDefinition.levy);
    };
    /**
     * Create MosaicTransferable with an absolute quantity
     * @param mosaicId
     * @param properties
     * @param quantity
     * @param levy
     * @returns {MosaicTransferable}
     */
    MosaicTransferable.createAbsolute = function (mosaicId, properties, quantity, levy) {
        return new MosaicTransferable(mosaicId, properties, quantity, levy);
    };
    /**
     * Create MosaicTransferable with an relative quantity
     * @param mosaicId
     * @param properties
     * @param quantity
     * @param levy
     * @returns {MosaicTransferable}
     */
    MosaicTransferable.createRelative = function (mosaicId, properties, quantity, levy) {
        return new MosaicTransferable(mosaicId, properties, quantity * Math.pow(10, properties.divisibility), levy);
    };
    /**
     * @returns {number}
     */
    MosaicTransferable.prototype.relativeQuantity = function () {
        return this.quantity / Math.pow(10, this.properties.divisibility);
    };
    /**
     * @returns {number}
     */
    MosaicTransferable.prototype.absoluteQuantity = function () {
        return this.quantity;
    };
    return MosaicTransferable;
}());
exports.MosaicTransferable = MosaicTransferable;
