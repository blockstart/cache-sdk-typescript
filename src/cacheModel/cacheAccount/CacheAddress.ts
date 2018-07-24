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
import { mapTransfer, transferFilter } from "../../cacheServices/CacheTransactionService";
import { WebSocketConfig } from "../../infrastructure/Listener";
import { ConfirmedTransactionListener } from "../../infrastructure/ConfirmedTransactionListener";
import { Address } from "../../models/account/Address";
import { NetworkTypes } from '../../models/node/NetworkTypes';
import { NEMLibrary } from '../../NEMLibrary';
import { CacheTransferTransaction } from '../cacheTransaction/CacheTransferTransaction';

export class CacheAddress extends Address {

  constructor(address: string) {
    super(address);
  }

  /**
   * Start listening new confirmed cache transactions
   * @returns {Observable<Array<CacheTransferTransaction>>}
   */
  public addObserver = (): Observable<CacheTransferTransaction> => {
    let NODE_Endpoint: Array<WebSocketConfig>;
    if (NEMLibrary.getNetworkType() === NetworkTypes.MAIN_NET) {
      NODE_Endpoint = [{ domain:'alice7.nem.ninja' }]
    } else {
      NODE_Endpoint = [{ domain: '50.3.87.123' }]
    }

    return new ConfirmedTransactionListener(NODE_Endpoint).given(this).filter(transferFilter).map(mapTransfer);
  }
}