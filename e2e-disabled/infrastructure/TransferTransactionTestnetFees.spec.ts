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
import {TransactionHttp} from "../../src/infrastructure/TransactionHttp";
import {Account} from "../../src/models/account/Account";
import {Address} from "../../src/models/account/Address";
import {XEM} from "../../src/models/mosaic/XEM";
import {NetworkTypes} from "../../src/models/node/NetworkTypes";
import {EmptyMessage, PlainMessage} from "../../src/models/transaction/PlainMessage";
import {TimeWindow} from "../../src/models/transaction/TimeWindow";
import {TransferTransaction} from "../../src/models/transaction/TransferTransaction";
import {NEMLibrary} from "../../src/NEMLibrary";
import {TestVariables} from "../../test/config/TestVariables.spec";

declare let process: any;

describe("TransferTransactionTestnetFees", () => {
  const recipientAccount: string = "TBV7LE4TFDEMGVOON5MYOK2P7TU2KEKLMHOLHQT6";
  const privateKey: string = process.env.PRIVATE_KEY;
  let account: Account;
  let transactionHttp: TransactionHttp;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    account = Account.createWithPrivateKey(privateKey);
    transactionHttp = new TransactionHttp([{domain: TestVariables.DEFAULT_TEST_DOMAIN}]);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should be SUCCESS if the transaction sends 0 XEM and NoMessage", async () => {
    const transaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address(recipientAccount),
      new XEM(0),
      EmptyMessage);
    const signedTransaction = account.signTransaction(transaction);

    const result = await transactionHttp.announceTransaction(signedTransaction).toPromise();
    expect(result.message).to.equal("SUCCESS");
    expect(result.transactionHash.data).to.not.null;
  });

  it("should be SUCCESS if the transaction sends 0 XEM and a little message", async () => {
    const transaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      new Address(recipientAccount),
      new XEM(0),
      PlainMessage.create("simple"));
    const signedTransaction = account.signTransaction(transaction);

    const result = await transactionHttp.announceTransaction(signedTransaction).toPromise();
    expect(result.message).to.equal("SUCCESS");
    expect(result.transactionHash.data).to.not.null;
  });
});
