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
import {NamespaceHttp} from "../../../src/infrastructure/NamespaceHttp";
import {Namespace} from "../../../src/models/namespace/Namespace";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../../test/config/TestVariables.spec";

describe("NamespaceHttp", () => {

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should get all root namespaces", (done) => {
    const namespaceHttp = new NamespaceHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const id = 12344;

    namespaceHttp.getRootNamespaces(id)
      .subscribe((namespaces) => {
        expect(namespaces[0]).to.be.instanceOf(Namespace);
        expect(namespaces[0].name).to.not.be.undefined;
        expect(namespaces[0].owner).to.not.be.undefined;
        expect(namespaces[0].height).to.not.be.undefined;
        expect(namespaces[0].id).to.not.be.undefined;
        expect(namespaces.length).to.be.equal(25);
        done();
    });
  });

  it("should get all root namespaces setting pageSize", (done) => {
    const namespaceHttp = new NamespaceHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const id = 12344;
    const pageSize = "15";

    namespaceHttp.getRootNamespaces(id, pageSize)
      .subscribe((namespaces) => {
        expect(namespaces[0]).to.be.instanceOf(Namespace);
        expect(namespaces[0].name).to.not.be.undefined;
        expect(namespaces[0].owner).to.not.be.undefined;
        expect(namespaces[0].height).to.not.be.undefined;
        expect(namespaces[0].id).to.not.be.undefined;
        expect(namespaces.length).to.be.equal(15);
        done();
      });
  });

  it("should get namespace information", (done) => {
    const namespaceHttp = new NamespaceHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    const namespace = "server";
    namespaceHttp.getNamespace(namespace)
      .subscribe((namespace) => {
        expect(namespace).to.be.instanceOf(Namespace);
        expect(namespace.name).to.not.be.undefined;
        expect(namespace.owner).to.not.be.undefined;
        expect(namespace.height).to.not.be.undefined;
        expect(namespace.id).to.be.undefined;
        done();
    });
  });

  it("uses the default testnet server when no argument is passed in constructor", () => {
    const namespaceHttp = new NamespaceHttp();
    expect(namespaceHttp.nextNode()).to.be.equals("http://bigalice2.nem.ninja:7890/namespace/");
  });

  it("uses a specific domain when it is passed in constructor", () => {
    const namespaceHttp = new NamespaceHttp([{domain: "bob.nem.ninja"}]);
    expect(namespaceHttp.nextNode()).to.contain("bob.nem.ninja");
  });

});
