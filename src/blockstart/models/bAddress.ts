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

import { Observable } from 'rxjs';
import { AccountHttp } from '../../infrastructure/AccountHttp';
import { ConfirmedTransactionListener } from '../../infrastructure/ConfirmedTransactionListener';
import { UnconfirmedTransactionListener } from '../../infrastructure/UnconfirmedTransactionListener';
import { Address } from '../../models/account/Address';
import { Mosaic } from '../../models/mosaic/Mosaic';
import { MosaicTransferable } from '../../models/mosaic/MosaicTransferable';
import { TransferTransaction } from '../../models/transaction/TransferTransaction';
import { mapTransfer, transferFilter } from '../utilities/TransactionUtilities';
import { BMosaic } from './bMosaic';
import { BTransferTransaction } from './bTransferTransaction';

export class BAddress extends Address {

  constructor(address: string) {
    super(address)
  }
  /**
   * Get mosaics for given address
   * @returns {Promise<Array<MosaicTransferable>>}
   */
  public mosaics = (): Promise<MosaicTransferable[]> => {
    return new Promise<MosaicTransferable[]>((resolve, reject) => {
      try {
        new AccountHttp().getMosaicOwnedByAddress(this).subscribe(async (mosaics) => {
          resolve(await Promise.all(mosaics.map(async (mosaic: Mosaic) => {
            const bMosaic = new BMosaic(mosaic.mosaicId, mosaic.quantity);
            return await bMosaic.getMosaicDetails();
          })));
        }, err => {
         reject(err)
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  /**
   * Start listening new confirmed transactions
   * @returns {Observable<Array<TransferTransaction>>}
   */
  public confirmedTxObserver = (): Observable<BTransferTransaction> => {
    return new ConfirmedTransactionListener().given(this).filter(transferFilter).map(mapTransfer);
  };

  /**
   * Start listening new unconfirmed transactions
   * @returns {Observable<Array<TransferTransaction>>}
   */
  public unconfirmedTxObserver = (): Observable<BTransferTransaction> => {
    return new UnconfirmedTransactionListener().given(this).filter(transferFilter).map(mapTransfer);
  };

  /**
   * Create a Address from object
   * @param addressValue - Address object from outside source
   * @returns {Address}
   */
  public static castToAddress = (addressValue: any): Address => {
    return new Address(addressValue.value);
  }
}