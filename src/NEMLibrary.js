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
var NEMLibrary = /** @class */ (function () {
    function NEMLibrary() {
    }
    NEMLibrary.bootstrap = function (networkType) {
        if (this.networkType !== undefined) {
            throw new Error("NEMLibrary should only be initialized once");
        }
        this.networkType = networkType;
    };
    /**
     *
     *
     */
    NEMLibrary.reset = function () {
        this.networkType = undefined;
    };
    /**
     *
     */
    NEMLibrary.getNetworkType = function () {
        if (this.networkType) {
            return this.networkType;
        }
        throw new Error("NEMLibrary should be initialized using NEMLibrary.bootstrap(NetworkType.TEST_NET)");
    };
    /**
     * Gets the current runtime environment (Node or Browser)
     */
    NEMLibrary.getEnvironment = function () {
        var isBrowser = new Function("try {return this===window;}catch(e){ return false;}");
        if (isBrowser()) {
            return Environment.Browser;
        }
        return Environment.Node;
    };
    return NEMLibrary;
}());
exports.NEMLibrary = NEMLibrary;
/**
 * Environment enumeration fer getEnvironment() call
 */
var Environment;
(function (Environment) {
    Environment[Environment["Browser"] = 0] = "Browser";
    Environment[Environment["Node"] = 1] = "Node";
})(Environment = exports.Environment || (exports.Environment = {}));
