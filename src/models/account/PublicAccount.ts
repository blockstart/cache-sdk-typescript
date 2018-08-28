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

import * as nemSdk from "nem-sdk";
import {NEMLibrary} from "../../NEMLibrary";
import {NetworkTypes} from "../node/NetworkTypes";
import {Address} from "./Address";

/**
 * Public account model
 */
export class PublicAccount {
  public readonly address: Address;
  public readonly publicKey: string;

  /**
   * @internal
   * @param address
   * @param publicKey
   */
  constructor(address: Address,
              publicKey: string,
  ) {
    this.address = address;
    this.publicKey = publicKey;
  }

  /**
   * @returns {boolean}
   */
  public hasPublicKey(): boolean {
    return this.publicKey !== null && (this.publicKey.length === 64 || this.publicKey.length === 66);
  }

  /**
   * Creates a new PublicAccount from a public key
   * @param publicKey
   * @returns {PublicAccount}
   */
  public static createWithPublicKey(publicKey: string): PublicAccount {
    if (publicKey === null || (publicKey.length !== 64 && publicKey.length !== 66)) {
      throw new Error("Not a valid public key");
    }
    let network;
    if (NEMLibrary.getNetworkType() === NetworkTypes.MAIN_NET) {
      network = nemSdk.default.model.network.data.mainnet.id;
    } else if (NEMLibrary.getNetworkType() === NetworkTypes.TEST_NET) {
      network = nemSdk.default.model.network.data.testnet.id;
    } else if (NEMLibrary.getNetworkType() == NetworkTypes.MIJIN_NET){
      network = nemSdk.default.model.network.data.mijin.id;
    }
    const address: string = nemSdk.default.model.address.toAddress(publicKey, network);
    return new PublicAccount(new Address(address), publicKey);
  }
}
