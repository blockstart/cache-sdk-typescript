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
var Pageable_1 = require("./Pageable");
/**
 * @internal
 */
var IncomingTransactionsPageable = /** @class */ (function (_super) {
    __extends(IncomingTransactionsPageable, _super);
    function IncomingTransactionsPageable(source, address, params) {
        var _this = _super.call(this) || this;
        _this.resource = source;
        _this.address = address;
        _this.params = params;
        return _this;
    }
    IncomingTransactionsPageable.prototype.nextPage = function () {
        var _this = this;
        this.resource.incomingTransactions(this.address, this.params).subscribe(function (next) {
            if (next.length != 0) {
                _this.params.id = next[next.length - 1].getTransactionInfo().id;
                _this.next(next);
            }
            else {
                _this.complete();
            }
        }, function (err) {
            _this.error(err);
        });
    };
    return IncomingTransactionsPageable;
}(Pageable_1.Pageable));
exports.IncomingTransactionsPageable = IncomingTransactionsPageable;
