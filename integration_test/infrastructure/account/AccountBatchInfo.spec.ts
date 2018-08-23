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
import nock = require("nock");
import {AccountHttp} from "../../../src/infrastructure/AccountHttp";
import {Address} from "../../../src/models/account/Address";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("AccountBarchInfo", () => {
  let addresses: Address[];
  let accountHttp: AccountHttp;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
    const addressStrings = [
        "NA2PDM4VPUGA37RYVPGTD6H7G7A2S6HTFRQUI55S",
        "NBRUHCUQNNUUZEDC7HPE2NLXQ37WNZ76QWJAYR7X",
        "NBUB64DLCEX55BEMDKICVCS36SAZG4XEI4M2B5IT",
        "NBX3XORYMEBIMHVWURWPPYUTR4JHGN4ON7OHEBRG",
        "NC7DTK6KIVE3PIOWHDCJHRATDAHBBP6S2HMRYN66",
        "NCIELL3C776X5JM6VVJTRWBM73KRKF2BJM2DG4GO",
        "NCVWYEJQR62AUWF7RQLICCRDZEH2XKJM7X4AJ5WS",
        "ND7YZKRDJAPEFUYOMDA4LT2PCCNL3J7RZOX4YPQO",
        "NDIBC7SQQIPVFIR2FYSZOWCHZ2W4FPTXOA56YFYU",
        "NDIQO2RH64ZRKJHVYBUZLWKAUDDXNDQ77OI4MVS2",
    ];
    addresses = addressStrings.map((s) => new Address(s));
    accountHttp = new AccountHttp();
    nock("http://88.99.192.82:7890")
        .post("/account/get/batch", {
            data: [
                { account: "NA2PDM4VPUGA37RYVPGTD6H7G7A2S6HTFRQUI55S" },
                { account: "NBRUHCUQNNUUZEDC7HPE2NLXQ37WNZ76QWJAYR7X" },
                { account: "NBUB64DLCEX55BEMDKICVCS36SAZG4XEI4M2B5IT" },
                { account: "NBX3XORYMEBIMHVWURWPPYUTR4JHGN4ON7OHEBRG" },
                { account: "NC7DTK6KIVE3PIOWHDCJHRATDAHBBP6S2HMRYN66" },
                { account: "NCIELL3C776X5JM6VVJTRWBM73KRKF2BJM2DG4GO" },
                { account: "NCVWYEJQR62AUWF7RQLICCRDZEH2XKJM7X4AJ5WS" },
                { account: "ND7YZKRDJAPEFUYOMDA4LT2PCCNL3J7RZOX4YPQO" },
                { account: "NDIBC7SQQIPVFIR2FYSZOWCHZ2W4FPTXOA56YFYU" },
                { account: "NDIQO2RH64ZRKJHVYBUZLWKAUDDXNDQ77OI4MVS2" },
            ],
        })
      .once()
      .replyWithFile(200, __dirname + "/responses/account_batch_info.json");
  });

  after(() => {
    NEMLibrary.reset();
    nock.cleanAll();
  });

  it("should receive the account info", (done) => {
    accountHttp.getBatchAccountData(addresses)
      .subscribe(
        (x) => {
          expect(x).to.have.length(addresses.length);
          expect(x[0].publicAccount!!.address.plain()).to.equal("NA2PDM4VPUGA37RYVPGTD6H7G7A2S6HTFRQUI55S");
          done();
        },
      );
  });
});
