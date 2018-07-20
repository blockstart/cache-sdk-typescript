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

import { Account } from '../../models/account/Account';
import { Address } from '../../models/account/Address';
import { NetworkTypes } from '../../models/node/NetworkTypes';
import { CacheAddress } from './Cache-Address';

export class CacheAccount extends Account {
  /**
   * Constructor
   * @internal
   * @param address
   * @param publicKey
   * @param privateKey
   */
  constructor(address: CacheAddress, publicKey: string, public readonly privateKey: string) {
    super(new Address(address.plain()), publicKey, privateKey);
  }

  /**
   * Finds cache address from cache account
   * @returns {CacheAddress}
   */
  public getCacheAddress = (): CacheAddress => {
    return new CacheAddress(this.address.plain());
  };

  /**
   * Creates Cache account with private key
   * @param {string} privateKey
   * @returns {CacheAccount}
   */
  public static createWithPrivateKey = (privateKey: string): CacheAccount => {
    const account: Account = Account.createWithPrivateKey(privateKey);
    return new CacheAccount(new CacheAddress(account.address.plain()), account.publicKey, account.privateKey);
  };

  /**
   * generate new cache account
   * @param walletName
   * @param passphrase
   * @param networkType
   * @returns {CacheAccount}
   */
  public static generateAccount = (walletName: string, passphrase: string, networkType: NetworkTypes): CacheAccount => {
    const account: Account = Account.generateAccount(walletName, passphrase, networkType);
    return new CacheAccount(new CacheAddress(account.address.plain()), account.publicKey, account.privateKey);
  };
}