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

import {Base64} from "js-base64";
import {LocalDateTime} from "js-joda";
import * as nemSdk from "nem-sdk";
import { Address } from "../../models/account/Address";
import { NetworkTypes } from "../../models/node/NetworkTypes";
import { EncryptedPrivateKey } from "../../models/wallet/EncryptedPrivateKey";
import { Password } from "../../models/wallet/Password";
import { SimpleWallet } from "../../models/wallet/SimpleWallet";
import {NEMLibrary} from "../../NEMLibrary";
import { CacheAccount } from "../cacheAccount/CacheAccount";
import { CacheAddress } from "../cacheAccount/CacheAddress";

/**
 * Cache Simple wallet model generates a private key from a PRNG
 */
export class CacheSimpleWallet extends SimpleWallet {

  /**
   * @internal
   * @param name
   * @param network
   * @param address
   * @param creationDate
   * @param encryptedPrivateKey
   */
  constructor(name: string, network: NetworkTypes, address: CacheAddress, creationDate: LocalDateTime, encryptedPrivateKey: EncryptedPrivateKey) {
    super(name, network, new Address(address.plain()), creationDate, encryptedPrivateKey);
  }

  /**
   * Create a CacheSimpleWallet
   * @param name
   * @param password
   * @returns {CacheSimpleWallet}
   */
  public static create(name: string, password: Password): CacheSimpleWallet {
    const network = NEMLibrary.getNetworkType();
    const wallet = nemSdk.default.model.wallet.createPRNG(name, password.value, SimpleWallet.networkTypesSDKAdapter(network));
    return new CacheSimpleWallet(
      name,
      network,
      new CacheAddress(wallet.accounts["0"].address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv),
    );
  }

  /**
   * Create a CacheSimpleWallet from private key
   * @param name
   * @param password
   * @param privateKey
   * @returns {CacheSimpleWallet}
   */
  public static createWithPrivateKey(name: string, password: Password, privateKey: string): CacheSimpleWallet {
    const network = NEMLibrary.getNetworkType();
    const wallet = nemSdk.default.model.wallet.importPrivateKey(name, password.value, privateKey, SimpleWallet.networkTypesSDKAdapter(network));
    return new CacheSimpleWallet(
      name,
      network,
      new CacheAddress(wallet.accounts["0"].address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv),
    );
  }

  /**
   * Open a wallet and generate an Account
   * @param password
   * @returns {CacheAccount}
   */
  public open(password: Password): CacheAccount {
    const account = CacheAccount.createWithPrivateKey(this.encryptedPrivateKey.decrypt(password));
    if (account.address.equals(this.address)) {
      return account;
    }
    throw new Error("wrong password");
  }

  /**
   * Reads the WLT content and converts it into a SimpleWallet
   * @param {string} wlt
   * @returns {CacheSimpleWallet}
   */
  public static readFromWLT(wlt: string): CacheSimpleWallet {
    const wallet = JSON.parse(Base64.decode(wlt));
    if (wallet.type !== "simple") {
      throw new Error("ERROR WLT TYPE");
    }
    return new CacheSimpleWallet(
      wallet.name,
      wallet.network,
      new CacheAddress(wallet.address),
      LocalDateTime.parse(wallet.creationDate),
      new EncryptedPrivateKey(wallet.encryptedPrivateKey, wallet.iv),
    );
  }

  public static readFromNanoWalletWLF(wlt: string): CacheSimpleWallet {
    const wallet = JSON.parse(Base64.decode(wlt));
    // TODO: Check the encrypted and iv fields, if they aren"t null, it"s a simple wallet
    const account = wallet.accounts[0];
    const network = account.network;
    return new CacheSimpleWallet(
      wallet.name,
      network < 0 ? NetworkTypes.TEST_NET : NetworkTypes.MAIN_NET,
      new CacheAddress(account.address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(account.encrypted, account.iv)
    )
  }
}
