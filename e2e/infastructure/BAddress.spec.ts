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
import { BAddress } from '../../src/blockstart/models/bAddress';
import { BTransferTransaction, ExpirationType } from '../../src/blockstart/models/bTransferTransaction';
import { TransactionHttp } from "../../src/infrastructure/TransactionHttp";
import { Account } from '../../src/models/account/Account';
import { MosaicProperties } from '../../src/models/mosaic/MosaicDefinition';
import { MosaicId } from '../../src/models/mosaic/MosaicId';
import { MosaicTransferable } from '../../src/models/mosaic/MosaicTransferable';
import { XEM } from "../../src/models/mosaic/XEM";
import { NetworkTypes } from "../../src/models/node/NetworkTypes";
import { EmptyMessage } from "../../src/models/transaction/PlainMessage";
import { NEMLibrary } from "../../src/NEMLibrary";

declare let process: any;

describe("AddressTransactionListener", () => {
  const privateKey = process.env.PRIVATE_KEY;
  let transactionHttp: TransactionHttp;
  let account: Account;
  let bAddress: BAddress;

  before(() => {
    // Initialize NEMLibrary for TEST_NET Network
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    account = Account.createWithPrivateKey(privateKey);
    bAddress = new BAddress(account.address.plain());
    transactionHttp = new TransactionHttp();
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should listen to confirmed xem transaction", (done) => {
    const address = new BAddress("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");

    const transferTransaction = BTransferTransaction.createTX(
      address,
      XEM.fromAbsolute(1000000),
      EmptyMessage,
      ExpirationType.twoHour
    );
    const subscriber = bAddress.confirmedTxObserver().subscribe(async (x) => {
      const mt: Array<MosaicTransferable> = await x.mosaicDetails();
      console.log(mt[0]);
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

  it("should listen to confirmed cache transaction", (done) => {
    const address = new BAddress("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
    const transferTransaction = BTransferTransaction.createTX(
      address,
      new MosaicTransferable(new MosaicId('cache', 'cache'), new MosaicProperties(6, 1000000000, true, false), 1000000),
      EmptyMessage,
      ExpirationType.twoHour
    );

    const subscriber = bAddress.confirmedTxObserver().subscribe(async (x) => {
      try {
        const mt: Array<MosaicTransferable> = await x.mosaicDetails();
        console.log(mt[0]);
        subscriber.unsubscribe();
        done();
      } catch (err) {
        console.log(err)
      }
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

  it("should listen to unconfirmed xem transaction", (done) => {
    const address = new BAddress("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
    const transferTransaction = BTransferTransaction.createTX(
      address,
      XEM.fromAbsolute(2000000),
      EmptyMessage,
      ExpirationType.twoHour
    );

    const subscriber = bAddress.unconfirmedTxObserver().subscribe(async (x) => {
      const mt: Array<MosaicTransferable> = await x.mosaicDetails();
      console.log(mt[0]);
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

  it("should listen to unconfirmed cache transaction", (done) => {
    const address = new BAddress("TDU225EF2XRJTDXJZOWPNPKE3K4NYR277EQPOPZD");
    const transferTransaction = BTransferTransaction.createTX(
      address,
      new MosaicTransferable(new MosaicId('cache', 'cache'), new MosaicProperties(6, 1000000000, true, false), 1000000),
      EmptyMessage,
      ExpirationType.twoHour
    );

    const subscriber = bAddress.unconfirmedTxObserver().subscribe(async (x) => {
      const mt: Array<MosaicTransferable> = await x.mosaicDetails();
      console.log(mt[0]);
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

  it("should return Mosaic Transferable Array for address", (done) => {
    try {
      const address = new BAddress("TCXECVMH7XV6XERR7IBJX7RZTEAHPK6SOGRVGUCE");
      address.mosaics().then((mosaics) => {
        console.log(mosaics);
        done();
      });
    } catch (err) {
      console.log(err);
    }
  });
});
