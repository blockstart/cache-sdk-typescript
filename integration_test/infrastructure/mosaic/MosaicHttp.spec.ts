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
import {MosaicHttp} from "../../../src/infrastructure/MosaicHttp";
import {MosaicId} from "../../../src/models/mosaic/MosaicId";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../config/TestVariables.spec";
describe("MosaicHttp", () => {
  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should get all root namespaces", (done) => {
    const mosaicHttp = new MosaicHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const namespace = "ashter";

    mosaicHttp.getAllMosaicsGivenNamespace(namespace)
      .subscribe((mosaicDefinitions) => {
        expect(mosaicDefinitions[0].creator).to.not.be.null;
        expect(mosaicDefinitions[0].id).to.not.be.null;
        expect(mosaicDefinitions[0].description).to.not.be.null;
        expect(mosaicDefinitions[0].properties).to.not.be.null;
        expect(mosaicDefinitions[0].metaId).to.not.be.null;
        expect(mosaicDefinitions.length).to.not.be.null;
        done();
    });
  });

  it("should get all root namespaces filter with id", (done) => {
    const mosaicHttp = new MosaicHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const namespace = "ashter";

    mosaicHttp.getAllMosaicsGivenNamespace(namespace, 449)
      .subscribe((mosaicDefinitions) => {
        expect(mosaicDefinitions[0].creator).to.not.be.null;
        expect(mosaicDefinitions[0].id).to.not.be.null;
        expect(mosaicDefinitions[0].description).to.not.be.null;
        expect(mosaicDefinitions[0].properties).to.not.be.null;
        expect(mosaicDefinitions[0].metaId).to.not.be.null;
        done();
      });
  });

  it("should get all root namespaces filter with pageSize", (done) => {
    const mosaicHttp = new MosaicHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const namespace = "ashter";

    mosaicHttp.getAllMosaicsGivenNamespace(namespace, undefined, 5)
      .subscribe((mosaicDefinitions) => {
        expect(mosaicDefinitions[0].creator).to.not.be.null;
        expect(mosaicDefinitions[0].id).to.not.be.null;
        expect(mosaicDefinitions[0].description).to.not.be.null;
        expect(mosaicDefinitions[0].properties).to.not.be.null;
        expect(mosaicDefinitions[0].metaId).to.not.be.null;
        expect(mosaicDefinitions.length).to.be.equal(5);
        done();
      });
  });

  it("uses the default testnet server when no argument is passed in constructor", () => {
    const mosaicHttp = new MosaicHttp();
    expect(mosaicHttp.nextNode()).to.be.equals("http://bigalice2.nem.ninja:7890/namespace/");
  });

  it("uses a specific domain when it is passed in constructor", () => {
    const mosaicHttp = new MosaicHttp([{domain: "bob.nem.ninja"}]);
    expect(mosaicHttp.nextNode()).to.contain("bob.nem.ninja");
  });

  it("should look for an expecific mosaic", (done) => {
    new MosaicHttp().getMosaicDefinition(new MosaicId("server", "mosaic"))
      .subscribe((mosaic) =>  {
        expect(mosaic.id.name).to.be.equal("mosaic");
        done();
      });
  });
});
