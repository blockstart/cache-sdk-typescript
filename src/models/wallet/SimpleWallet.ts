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
import {NEMLibrary} from "../../NEMLibrary";
import {Account} from "../account/Account";
import {Address} from "../account/Address";
import {NetworkTypes} from "../node/NetworkTypes";
import {EncryptedPrivateKey} from "./EncryptedPrivateKey";
import {Password} from "./Password";
import {Wallet} from "./Wallet";

/**
 * Simple wallet model generates a private key from a PRNG
 */
export class SimpleWallet extends Wallet {

  /**
   * The encripted private key and information to decrypt it
   */
  public readonly encryptedPrivateKey: EncryptedPrivateKey;

  /**
   * @internal
   * @param name
   * @param network
   * @param address
   * @param creationDate
   * @param encryptedPrivateKey
   */
  constructor(name: string, network: NetworkTypes, address: Address, creationDate: LocalDateTime, encryptedPrivateKey: EncryptedPrivateKey) {
    super(name, network, address, creationDate, 1);
    this.encryptedPrivateKey = encryptedPrivateKey;
  }

  /**
   * Create a SimpleWallet
   * @param name
   * @param password
   * @returns {SimpleWallet}
   */
  public static create(name: string, password: Password): SimpleWallet {
    const network = NEMLibrary.getNetworkType();
    const wallet = nemSdk.default.model.wallet.createPRNG(name, password.value, SimpleWallet.networkTypesSDKAdapter(network));
    return new SimpleWallet(
      name,
      network,
      new Address(wallet.accounts["0"].address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv),
    );
  }

  /**
   * Create a SimpleWallet from private key
   * @param name
   * @param password
   * @param privateKey
   * @returns {SimpleWallet}
   */
  public static createWithPrivateKey(name: string, password: Password, privateKey: string): SimpleWallet {
    const network = NEMLibrary.getNetworkType();
    const wallet = nemSdk.default.model.wallet.importPrivateKey(name, password.value, privateKey, SimpleWallet.networkTypesSDKAdapter(network));
    return new SimpleWallet(
      name,
      network,
      new Address(wallet.accounts["0"].address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(wallet.accounts["0"].encrypted, wallet.accounts["0"].iv),
    );
  }

  /**
   * Open a wallet and generate an Account
   * @param password
   * @returns {Account}
   */
  public open(password: Password): Account {
    const account = Account.createWithPrivateKey(this.encryptedPrivateKey.decrypt(password));
    if (account.address.equals(this.address)) {
      return account;
    }
    throw new Error("wrong password");
  }

  public unlockPrivateKey(password: Password): string {
    const privateKey = this.encryptedPrivateKey.decrypt(password);
    if (privateKey === "" || (privateKey.length !== 64 && privateKey.length !== 66)) {
      throw new Error("Invalid password");
    }
    const account = Account.createWithPrivateKey(privateKey);
    if (!account.address.equals(this.address)) {
      throw new Error("Invalid password");
    }
    return privateKey;
  }

  /**
   * Converts SimpleWallet into writable string to persist into a file
   * @returns {string}
   */
  public writeWLTFile(): string {
    return Base64.encode(JSON.stringify({
      name: this.name,
      network: this.network.toString(),
      address: this.address.plain(),
      creationDate: this.creationDate.toString(),
      schema: this.schema,
      type: "simple",
      encryptedPrivateKey: this.encryptedPrivateKey.encryptedKey,
      iv: this.encryptedPrivateKey.iv,
    }));
  }

  /**
   * Reads the WLT content and converts it into a SimpleWallet
   * @param {string} wlt
   * @returns {SimpleWallet}
   */
  public static readFromWLT(wlt: string): SimpleWallet {
    const wallet = JSON.parse(Base64.decode(wlt));
    if (wallet.type !== "simple") {
      throw new Error("ERROR WLT TYPE");
    }
    let network;
    if (wallet.network < 0) {
      network = NetworkTypes.TEST_NET;
    } else if (wallet.network == 104) {
      network = NetworkTypes.MAIN_NET;
    } else {
      network = NetworkTypes.MIJIN_NET;
    }
    return new SimpleWallet(
      wallet.name,
      network,
      new Address(wallet.address),
      LocalDateTime.parse(wallet.creationDate),
      new EncryptedPrivateKey(wallet.encryptedPrivateKey, wallet.iv),
    );
  }

  public static readFromNanoWalletWLF(wlt: string): SimpleWallet {
    const wallet = JSON.parse(Base64.decode(wlt));
    // TODO: Check the encrypted and iv fields, if they aren't null, it's a simple wallet
    const account = wallet.accounts[0];
    let network;
    if (account.network < 0) {
      network = NetworkTypes.TEST_NET;
    } else if (account.network == 104) {
      network = NetworkTypes.MAIN_NET;
    } else {
      network = NetworkTypes.MIJIN_NET;
    }
    return new SimpleWallet(
      wallet.name,
      network,
      new Address(account.address),
      LocalDateTime.now(),
      new EncryptedPrivateKey(account.encrypted, account.iv)
    )
  }
}
