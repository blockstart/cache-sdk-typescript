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

import {deepEqual} from "assert";
import {expect} from "chai";
import {AccountInfoDTO} from "../../../src/infrastructure/account/AccountInfoDTO";
import {AccountMetaDataDTO} from "../../../src/infrastructure/account/AccountMetaDataDTO";
import {AccountMetaDataPairDTO} from "../../../src/infrastructure/account/AccountMetaDataPairDTO";
import {AccountInfo, AccountInfoWithMetaData} from "../../../src/models/account/AccountInfo";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("AccountInfo", () => {
  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  const address = "TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA";
  const publicKey = "a4f9d42cf8e1f7c6c3216ede81896c4fa9f49071ee4aee2a4843e2711899b23a";

  it("should create an AccountInfo object", (done) => {
    const accountInfoDTO = {
      address,
      publicKey,
      balance: 10000,
      harvestedBlocks: 1,
      importance: 0.5,
      label: null,
      vestedBalance: 5000,
      multisigInfo: {},
    } as AccountInfoDTO;

    const accountInfo = AccountInfo.createFromAccountInfoDTO(accountInfoDTO);
    expect(accountInfo.publicAccount!!.publicKey).to.be.equal(publicKey);
    expect(accountInfo.publicAccount!!.address.plain()).to.be.equal(address);
    expect(accountInfo.balance.balance).to.be.equal(10000);
    expect(accountInfo.balance.vestedBalance).to.be.equal(5000);
    expect(accountInfo.harvestedBlocks).to.be.equal(1);
    expect(accountInfo.importance).to.be.equal(0.5);
    expect(accountInfo.cosignatoriesCount).to.be.equal(undefined);
    expect(accountInfo.minCosignatories).to.be.equal(undefined);
    done();
  });

  it("should create an AccountInfoWithMetaData object", (done) => {
    const accountInfoDTO = {
      address,
      publicKey,
      balance: 10000,
      harvestedBlocks: 1,
      importance: 0.5,
      label: null,
      vestedBalance: 5000,
      multisigInfo: {
        cosignatoriesCount: 3,
        minCosignatories: 2
      },
    } as AccountInfoDTO;

    const accountInfoWithMetaDataDTO = {
      account: accountInfoDTO,
      meta: {
        cosignatoryOf: [accountInfoDTO],
        cosignatories: [accountInfoDTO],
        status: "UNKNOWN",
        remoteStatus: "REMOTE",
      } as AccountMetaDataDTO,
    } as AccountMetaDataPairDTO;

    const accountInfoWithMetaData = AccountInfoWithMetaData.createFromAccountMetaDataPairDTO(accountInfoWithMetaDataDTO);
    const accountInfo = AccountInfo.createFromAccountInfoDTO(accountInfoDTO);

    expect(accountInfoWithMetaData.publicAccount!!.publicKey).to.be.equal(publicKey);
    expect(accountInfoWithMetaData.publicAccount!!.address.plain()).to.be.equal(address);
    expect(accountInfoWithMetaData.balance.balance).to.be.equal(10000);
    expect(accountInfoWithMetaData.balance.vestedBalance).to.be.equal(5000);
    expect(accountInfoWithMetaData.harvestedBlocks).to.be.equal(1);
    expect(accountInfoWithMetaData.importance).to.be.equal(0.5);
    deepEqual(accountInfoWithMetaData.cosignatoryOf, [accountInfo]);
    deepEqual(accountInfoWithMetaData.cosignatories, [accountInfo]);
    expect(accountInfoWithMetaData.status).to.be.equal("UNKNOWN");
    expect(accountInfoWithMetaData.remoteStatus).to.be.equal("REMOTE");
    expect(accountInfoWithMetaData.cosignatoriesCount).to.be.equal(3);
    expect(accountInfoWithMetaData.minCosignatories).to.be.equal(2);
    done();
  });

});
