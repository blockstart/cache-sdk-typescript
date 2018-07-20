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

import {expect} from "chai";
import {Observable} from "rxjs/Observable";
import {MosaicHttp} from "../../../src/infrastructure/MosaicHttp";
import {MosaicId} from "../../../src/models/mosaic/MosaicId";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("TransactionWithMosaics", () => {
  let mosaicHttp: MosaicHttp;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    mosaicHttp = new MosaicHttp();
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("Create runtime MosaicTransferable with a server:mosaic", (done) => {
    mosaicHttp.getMosaicTransferableWithAmount(new MosaicId("server", "mosaic"), 1)
      .subscribe((mosaicTransferable) => {
        expect(mosaicTransferable.quantity()).to.be.equal(1);
        done();
      });
  });

  it("Create runtime MosaicTransferable with a server:other", (done) => {
    mosaicHttp.getMosaicTransferableWithAmount(new MosaicId("server", "other"), 1)
      .subscribe((mosaicTransferable) => {
        expect(mosaicTransferable.quantity()).to.be.equal(1000000);
        done();
      });
  });

  it("Fetch different mosaics and add the xem", (done) => {
    Observable.from([
      {namespace: "server", mosaic: "mosaic", amount: 1},
      {namespace: "server", mosaic: "alexis", amount: 1},
    ]).flatMap((_) => mosaicHttp.getMosaicTransferableWithAmount(new MosaicId(_.namespace, _.mosaic), _.amount))
      .toArray()
      .subscribe((x) => {
        expect(x).to.have.length(2);
        done();
      });
  });
});
