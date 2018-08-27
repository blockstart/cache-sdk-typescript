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

import { Observable } from 'rxjs/Observable';
import { AccountHttp } from '../../infrastructure/AccountHttp';
import { UnconfirmedTransactionListener } from '../../infrastructure/UnconfirmedTransactionListener';
import { mapTransfer, transferFilter } from '../../utilities/TransactionUtilities';
import { ConfirmedTransactionListener } from '../../infrastructure/ConfirmedTransactionListener';
import { nodeEndpoints } from '../../utilities/NodeEndpointUtilities';
import { Mosaic } from '../mosaic/Mosaic';
import {NetworkTypes} from "../node/NetworkTypes";
import { Transaction } from '../transaction/Transaction';
import { TransferTransaction } from '../transaction/TransferTransaction';

/**
 * Address model
 */
export class Address {
  private readonly value: string;
  private readonly networkType: NetworkTypes;

  constructor(address: string) {
    this.value = address.replace(/-/g, "").trim().toUpperCase();
    if (this.value.charAt(0) == "T") {
      this.networkType = NetworkTypes.TEST_NET;
    } else if (this.value.charAt(0) == "N") {
      this.networkType = NetworkTypes.MAIN_NET;
    } else if (this.value.charAt(0) == "M") {
      this.networkType = NetworkTypes.MIJIN_NET;
    } else {
      throw new Error("NetworkType invalid");
    }
  }

  /**
   * Get address in plain format ex: TALICEROONSJCPHC63F52V6FY3SDMSVAEUGHMB7C
   * @returns {string}
   */
  public plain(): string {
    return this.value;
  }

  /**
   * Get address in pretty format ex: TALICE-ROONSJ-CPHC63-F52V6F-Y3SDMS-VAEUGH-MB7C
   * @returns {string}
   */
  public pretty(): string {
    return this.value.match(/.{1,6}/g)!.join("-");
  }

  /**
   * Address network
   * @returns {number}
   */
  public network(): NetworkTypes {
    if (this.value.charAt(0) == "T") {
      return NetworkTypes.TEST_NET;
    } else if (this.value.charAt(0) == "N") {
      return NetworkTypes.MAIN_NET;
    } else {
      return NetworkTypes.MIJIN_NET;
    }
  }

  public equals(otherAddress: Address) {
    return this.plain() == otherAddress.plain();
  };

  /**
   * Get mosaics for given address
   * @returns {Promise<Array<Mosaic>>}
   */
  public mosaics = (): Promise<Array<Mosaic>> => {
    return new Promise<Array<Mosaic>>((resolve, reject) => {
      const accountHttp = new AccountHttp();
      accountHttp.getMosaicOwnedByAddress(this).subscribe((mosaics: Array<Mosaic>) => {
        resolve(mosaics);
      }, err => {
        reject(err);
      });
    });
  };

  /**
   * Start listening new confirmed transactions
   * @returns {Observable<Array<TransferTransaction>>}
   */
  public confirmedTxObserver = (): Observable<TransferTransaction> => {
    return new ConfirmedTransactionListener(nodeEndpoints()).given(this).filter(transferFilter).map(mapTransfer);
  };

  /**
   * Start listening new unconfirmed transactions
   * @returns {Observable<Array<TransferTransaction>>}
   */
  public unconfirmedTxObserver = (): Observable<TransferTransaction> => {
    return new UnconfirmedTransactionListener(nodeEndpoints()).given(this).filter(transferFilter).map(mapTransfer);
  };

}
