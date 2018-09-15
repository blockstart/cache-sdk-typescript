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
var PublicAccount_1 = require("../account/PublicAccount");
var MosaicId_1 = require("./MosaicId");
var MosaicLevy_1 = require("./MosaicLevy");
/**
 * A mosaic definition describes an asset class. Some fields are mandatory while others are optional.
 * The properties of a mosaic definition always have a default value and only need to be supplied if they differ from the default value.
 */
var MosaicDefinition = /** @class */ (function () {
    /**
     * constructor
     * @param creator
     * @param id
     * @param description
     * @param properties
     * @param levy
     * @param metaId
     */
    function MosaicDefinition(creator, id, description, properties, levy, metaId) {
        this.creator = creator;
        this.id = id;
        this.description = description;
        this.properties = properties;
        this.levy = levy;
        this.metaId = metaId;
    }
    /**
     * @internal
     * @param dto
     * @returns {MosaicDefinition}
     */
    MosaicDefinition.createFromMosaicDefinitionDTO = function (dto) {
        var levy = dto.levy;
        return new MosaicDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(dto.creator), MosaicId_1.MosaicId.createFromMosaicIdDTO(dto.id), dto.description, MosaicProperties.createFromMosaicProperties(dto.properties), levy.mosaicId === undefined ? undefined : MosaicLevy_1.MosaicLevy.createFromMosaicLevyDTO(levy));
    };
    /**
     * @internal
     * @param dto
     * @returns {MosaicDefinition}
     */
    MosaicDefinition.createFromMosaicDefinitionMetaDataPairDTO = function (dto) {
        var levy = dto.mosaic.levy;
        return new MosaicDefinition(PublicAccount_1.PublicAccount.createWithPublicKey(dto.mosaic.creator), MosaicId_1.MosaicId.createFromMosaicIdDTO(dto.mosaic.id), dto.mosaic.description, MosaicProperties.createFromMosaicProperties(dto.mosaic.properties), levy.mosaicId === undefined ? undefined : MosaicLevy_1.MosaicLevy.createFromMosaicLevyDTO(levy), dto.meta.id);
    };
    /**
     * @internal
     * @returns {{description: string, id: MosaicId, levy: (MosaicLevyDTO|{}), properties: MosaicProperty[], creator: string}}
     */
    MosaicDefinition.prototype.toDTO = function () {
        return {
            description: this.description,
            id: this.id,
            levy: this.levy != undefined ? this.levy.toDTO() : null,
            properties: this.properties.toDTO(),
            creator: this.creator.publicKey
        };
    };
    return MosaicDefinition;
}());
exports.MosaicDefinition = MosaicDefinition;
/**
 * Each mosaic definition comes with a set of properties.
 * Each property has a default value which will be applied in case it was not specified.
 * Future release may add additional properties to the set of available properties
 */
var MosaicProperties = /** @class */ (function () {
    /**
     * constructor
     * @param divisibility
     * @param initialSupply
     * @param supplyMutable
     * @param transferable
     */
    function MosaicProperties(divisibility, initialSupply, transferable, supplyMutable) {
        if (divisibility === void 0) { divisibility = 0; }
        if (initialSupply === void 0) { initialSupply = 1000; }
        if (transferable === void 0) { transferable = true; }
        if (supplyMutable === void 0) { supplyMutable = false; }
        this.initialSupply = initialSupply;
        this.supplyMutable = supplyMutable;
        this.transferable = transferable;
        this.divisibility = divisibility;
    }
    /**
     * @internal
     */
    MosaicProperties.prototype.toDTO = function () {
        return [
            {
                name: "divisibility",
                value: this.divisibility.toString()
            },
            {
                name: "initialSupply",
                value: this.initialSupply.toString()
            },
            {
                name: "supplyMutable",
                value: this.supplyMutable.toString()
            },
            {
                name: "transferable",
                value: this.transferable.toString()
            },
        ];
    };
    /**
     * @internal
     * @param dto
     * @returns {MosaicProperty}
     */
    MosaicProperties.createFromMosaicProperties = function (mosaicProperties) {
        return new MosaicProperties(Number(mosaicProperties[0].value), Number(mosaicProperties[1].value), (mosaicProperties[3].value == "true"), (mosaicProperties[2].value == "true"));
    };
    return MosaicProperties;
}());
exports.MosaicProperties = MosaicProperties;
