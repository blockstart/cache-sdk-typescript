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
var Pageable_1 = require("./Pageable");
/**
 * @internal
 */
var HarvestInfoPageable = /** @class */ (function (_super) {
    __extends(HarvestInfoPageable, _super);
    function HarvestInfoPageable(source, address, id) {
        var _this = _super.call(this) || this;
        _this.resource = source;
        _this.address = address;
        _this.id = id;
        return _this;
    }
    HarvestInfoPageable.prototype.nextPage = function () {
        var _this = this;
        this.resource.getHarvestInfoDataForAnAccount(this.address, this.id).subscribe(function (next) {
            if (next.length != 0) {
                _this.id = (next[next.length - 1].id).toString();
                _this.next(next);
            }
            else {
                _this.complete();
            }
        }, function (err) {
            _this.error(err);
        });
    };
    return HarvestInfoPageable;
}(Pageable_1.Pageable));
exports.HarvestInfoPageable = HarvestInfoPageable;
