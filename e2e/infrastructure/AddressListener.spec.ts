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

import { Observable } from "rxjs/Observable";
import { CACHE } from '../../src/models/mosaic/CACHE';
import { ConfirmedTransactionListener } from "../../src/infrastructure/ConfirmedTransactionListener";
import { TransactionHttp } from "../../src/infrastructure/TransactionHttp";
import { Account } from '../../src/models/account/Account';
import { Address } from '../../src/models/account/Address';
import { XEM } from "../../src/models/mosaic/XEM";
import { NetworkTypes } from "../../src/models/node/NetworkTypes";
import { EmptyMessage } from "../../src/models/transaction/PlainMessage";
import { ExpirationType, TransferTransaction, TxType } from '../../src/models/transaction/TransferTransaction';
import { NEMLibrary } from "../../src/NEMLibrary";

declare let process: any;

describe("ConfirmedTransactionListener", () => {
  const privateKey: string = process.env.PRIVATE_KEY;
  let transactionHttp: TransactionHttp;
  let account: Account;

  before(() => {
    // Initialize NEMLibrary for TEST_NET Network
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    account = Account.createWithPrivateKey(privateKey);
    transactionHttp = new TransactionHttp();
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should listen to xem transaction", (done) => {
    const address = new Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");

    const transferTransaction = TransferTransaction.create(
      address,
      TxType.xem,
      new XEM(2),
      EmptyMessage,
      ExpirationType.twoHour
    );

    const subscriber = account.address.confirmedTxObserver().subscribe((x) => {
      console.log(x);
      subscriber.unsubscribe();
      done();
    }, (err) => {
      console.log(err);
    });

    const transaction = account.signTransaction(transferTransaction);

    Observable.of(1)
      .delay(3000)
      .flatMap((ignored) => transactionHttp.announceTransaction(transaction))
      .subscribe((x) => {
        console.log(x);
      });
  });

  it("should listen to cache transaction", (done) => {
    const address = new Address("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
    const transferTransaction = TransferTransaction.create(
      address,
      TxType.cache,
      new CACHE(3),
      EmptyMessage,
      ExpirationType.twoHour
    );

    const subscriber = account.address.confirmedTxObserver().subscribe((x) => {
      console.log(x);
      subscriber.unsubscribe();
      done();
    }, (err) => {
      console.log(err);
    });

    const transaction = account.signTransaction(transferTransaction);

    Observable.of(1)
      .delay(3000)
      .flatMap((ignored) => transactionHttp.announceTransaction(transaction))
      .subscribe((x) => {
        console.log(x);
      });
  });
});
