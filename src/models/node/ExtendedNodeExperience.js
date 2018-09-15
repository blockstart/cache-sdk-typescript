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
var Node_1 = require("./Node");
/**
 * When exchanging data with other nodes the result of the communication is divided into three
 * different outcomes: success, neutral and failure.
 * In the cases of success and failure the result is saved to be able to judge the quality of a node.
 * This has influence on the probability that a certain node is selected as partner.
 */
var ExtendedNodeExperience = /** @class */ (function () {
    /**
     * @internal
     * @param node
     * @param syncs
     * @param experience
     */
    function ExtendedNodeExperience(node, syncs, experience) {
        this.node = node;
        this.syncs = syncs;
        this.experience = experience;
    }
    /**
     * @internal
     * @param dto
     * @returns {ExtendedNodeExperience}
     */
    ExtendedNodeExperience.createFromExtendedNodeExperiencePairDTO = function (dto) {
        return new ExtendedNodeExperience(Node_1.Node.createFromNodeDTO(dto.node), dto.syncs, ExtendedNodeExperienceData.createFromExtendedNodeExperienceDataDTO(dto.experience));
    };
    return ExtendedNodeExperience;
}());
exports.ExtendedNodeExperience = ExtendedNodeExperience;
/**
 * Node experience data
 */
var ExtendedNodeExperienceData = /** @class */ (function () {
    /**
     * constructor
     * @internal
     * @param s
     * @param f
     */
    function ExtendedNodeExperienceData(s, f) {
        this.s = s;
        this.f = f;
    }
    /**
     * @internal
     * @param dto
     * @returns {ExtendedNodeExperienceData}
     */
    ExtendedNodeExperienceData.createFromExtendedNodeExperienceDataDTO = function (dto) {
        return new ExtendedNodeExperienceData(dto.s, dto.f);
    };
    return ExtendedNodeExperienceData;
}());
exports.ExtendedNodeExperienceData = ExtendedNodeExperienceData;
