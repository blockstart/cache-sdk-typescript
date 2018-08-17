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
import {PublicAccount} from "../../../src/models/account/PublicAccount";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {
  ImportanceMode,
  ImportanceTransferTransaction,
} from "../../../src/models/transaction/ImportanceTransferTransaction";
import {TimeWindow} from "../../../src/models/transaction/TimeWindow";
import {NEMLibrary} from "../../../src/NEMLibrary";

describe("ImportanceTransferTransaction", () => {
  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });
  const publicKey = "a4f9d42cf8e1f7c6c3216ede81896c4fa9f49071ee4aee2a4843e2711899b23a";

  it("should be created with Activation Mode", () => {
    const transaction = new ImportanceTransferTransaction(
      TimeWindow.createWithDeadline(),
      1234,
      ImportanceMode.Activate,
      PublicAccount.createWithPublicKey(publicKey),
      343434);
    expect(transaction.mode).to.be.equal(ImportanceMode.Activate);
    expect(transaction.mode).to.be.equal(1);
    expect(transaction.fee).to.be.equal(343434);
  });

  it("should be created with Deactivate Mode", () => {
    const transaction = new ImportanceTransferTransaction(
      TimeWindow.createWithDeadline(),
      1234,
      ImportanceMode.Deactivate,
      PublicAccount.createWithPublicKey(publicKey),
      343434);
    expect(transaction.mode).to.be.equal(ImportanceMode.Deactivate);
    expect(transaction.mode).to.be.equal(2);
    expect(transaction.fee).to.be.equal(343434);
  });

  it("should be create by named constructor", () => {
    const transaction = ImportanceTransferTransaction.create(
      TimeWindow.createWithDeadline(),
      ImportanceMode.Deactivate,
      PublicAccount.createWithPublicKey(publicKey),
    );
    expect(transaction.mode).to.be.equal(ImportanceMode.Deactivate);
    expect(transaction.mode).to.be.equal(2);
  });

  it("should have the fee calculated for TEST_NET", () => {
    const transaction = ImportanceTransferTransaction.create(
      TimeWindow.createWithDeadline(),
      ImportanceMode.Deactivate,
      PublicAccount.createWithPublicKey(publicKey),
    );
    // 150000 = 3 * 0.05 * 1000000
    expect(transaction.fee).to.be.equal(150000);
  });
});
