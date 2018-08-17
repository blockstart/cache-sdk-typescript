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

import nock = require("nock");
import {TestVariables} from "../../../test/config/TestVariables.spec";

describe("AccountHttp Response Mapping", () => {
  const address = "TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA";

  after(() => {
    nock.cleanAll();
  });

  it("unconfirmedTransactions with a TransferTransaction returns the TransferTransaction instance", (done) => {
    const httpMock = nock(TestVariables.DEFAULT_TEST_URL)
      .get("/account/unconfirmedTransactions?address=" + address)
      .reply(200, {
        data: [
          {
            meta: {
              data: null,
            },
            transaction: {
              timeStamp: 71227796,
              amount: 0,
              signature: "dce92cf9683f0eb9ecb712e2a6c440aef7dfe6af624cfc200c83f44e91c48b0f524a2338a20dd4982eb32b1bdf37a5ec8aab8a948c8281d62e47a88e2fcbed0d",
              fee: 1000000,
              recipient: "TCFFOMQ2SBX77E2FZC3VX43ZTRV4ZNTXTCGWBM5J",
              type: 257,
              deadline: 71231396,
              message: {},
              version: -1744830463,
              signer: "0414fe7647ec008e533aac98a4bf1c5fbf1d236c75b81fdadf1f5d1042fdd2ff",
            },
          },
        ],
      });
    /*
     TODO
    const accountHttp = new AccountHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    accountHttp.unconfirmedTransactions(address).subscribe(unconfirmedTransactions => {
      expect(unconfirmedTransactions).to.be.length(1);
      expect(unconfirmedTransactions[0].transaction).to.be.instanceOf(TransferTransaction);
    });
     */
    done();

  });

  it("unconfirmedTransactions with a MultisigTransaction returns the MultisigTransaction instance", (done) => {
    const httpMock = nock(TestVariables.DEFAULT_TEST_URL)
      .get("/account/unconfirmedTransactions?address=" + address)
      .reply(200, {
        data: [
          {
            meta: {
              data: "de1f8740c32267520563407f3b6d70201e81e920fcd22d3a121cd18e27bb38dd",
            },
            transaction: {
              timeStamp: 71227795,
              signature: "3c13f66516e4c178e8d9ffb93ddaa2902bd3ddc0d8e2dafca868ae85a0503917658df234e3789c52a12b42f9a00acd10800fee56a0e6312972b6e27172c06405",
              fee: 6000000,
              type: 4100,
              deadline: 71231395,
              version: -1744830463,
              signatures: [],
              signer: "0414fe7647ec008e533aac98a4bf1c5fbf1d236c75b81fdadf1f5d1042fdd2ff",
              otherTrans: {
                timeStamp: 71227795,
                amount: 0,
                fee: 1000000,
                recipient: "TCFFOMQ2SBX77E2FZC3VX43ZTRV4ZNTXTCGWBM5J",
                type: 257,
                deadline: 71231395,
                message: {},
                version: -1744830463,
                signer: "0a4dcc50b3c61677ff9b0b04717e1e9268611acb7cd0a8343e1b60ca3583ec2e",
              },
            },
          },
        ],
      });

    /**
     TODO:
    const accountHttp = new AccountHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
    accountHttp.unconfirmedTransactions(address).subscribe(unconfirmedTransactions => {
      expect(unconfirmedTransactions).to.be.length(1);
      expect(unconfirmedTransactions[0]).to.be.instanceOf(MultisigUnconfirmedTransaction);
      expect((<MultisigUnconfirmedTransaction>unconfirmedTransactions[0]).unconfirmedTransactionMetaData)
        .to.be.deep.equal({
        "data": "de1f8740c32267520563407f3b6d70201e81e920fcd22d3a121cd18e27bb38dd"
      });
      expect(unconfirmedTransactions[0].transaction).to.be.instanceOf(MultisigSignatureTransaction);
    });*/
    done();
  });
});
