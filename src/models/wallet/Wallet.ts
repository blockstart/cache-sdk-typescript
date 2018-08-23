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
import {Account} from "../account/Account";
import {Address} from "../account/Address";
import {NetworkTypes} from "../node/NetworkTypes";
import {Password} from "./Password";

export enum WalletType {
  SIMPLE,
  BRAIN,
}

/**
 * Wallet base model
 */
export abstract class Wallet {
  /**
   * The wallet's name
   */
  public readonly name: string;

  /**
   * The wallet's network
   */
  public readonly network: NetworkTypes;

  /**
   * The wallet's address
   */
  public readonly address: Address;

  /**
   * The wallet's creation date
   */
  public readonly creationDate: LocalDateTime;

  /**
   * Wallet schema number
   */
  public readonly schema: number;

  /**
   * @internal
   * @param name
   * @param network
   * @param address
   * @param creationDate
   * @param schema
   */
  constructor(name: string, network: NetworkTypes, address: Address, creationDate: LocalDateTime, schema: number){
    this.name = name;
    this.network = network;
    this.address = address;
    this.creationDate = creationDate;
    this.schema = schema;
  }

  /**
   * Abstract open wallet method returning an account from current wallet.
   * @param password
   */
  public abstract open(password: Password): Account;

  /**
   * Receives the Private Key for the Wallet
   * @param {Password} password
   * @returns {string}
   */
  public abstract unlockPrivateKey(password: Password): string;

  /**
   * @internal
   */
  public static networkTypesSDKAdapter(network: NetworkTypes): number {
    if (network == NetworkTypes.MAIN_NET) {
      return 104;
    } else if (network == NetworkTypes.TEST_NET) {
      return -104;
    } else {
      return 96;
    }
  }

  /**
   * Given a WLT string, retusn the WalletType
   * @param {string} wlt
   * @returns {WalletType}
   */
  public static walletTypeGivenWLT(wlt: string): WalletType {
    const wallet = JSON.parse(Base64.decode(wlt));
    if (wallet.type == "simple") return WalletType.SIMPLE;
    else if (wallet.type == "brain") return WalletType.BRAIN;
    throw new Error("ILLEGAL WALLET TYPE");
  }
}
