"use strict";
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
var Message_1 = require("./Message");
var HexMessage = /** @class */ (function (_super) {
    __extends(HexMessage, _super);
    /**
     * @internal
     * @param payload
     */
    function HexMessage(payload) {
        return _super.call(this, payload) || this;
    }
    /**
     * Create new constructor
     * @param message
     */
    HexMessage.create = function (message) {
        var msg = "fe" + message;
        return new HexMessage(msg);
    };
    HexMessage.prototype.isEncrypted = function () {
        return false;
    };
    HexMessage.prototype.isPlain = function () {
        return true;
    };
    /**
     * @internal
     */
    HexMessage.prototype.toDTO = function () {
        return {
            payload: this.payload,
            type: 1
        };
    };
    return HexMessage;
}(Message_1.Message));
exports.HexMessage = HexMessage;
