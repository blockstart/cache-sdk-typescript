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
import {EncryptedMessage} from "../transaction/EncryptedMessage";
import {PlainMessage} from "../transaction/PlainMessage";
import {SignedTransaction} from "../transaction/SignedTransaction";
import {Transaction} from "../transaction/Transaction";
import {Address} from "./Address";
import {PublicAccount} from "./PublicAccount";

/**
 * Account model
 */
export class Account extends PublicAccount {

  /**
   * Constructor
   * @internal
   * @param address
   * @param publicKey
   * @param privateKey
   */
  constructor(address: Address, publicKey: string, public readonly privateKey: string) {
    super(address, publicKey);
  }

  /**
   * Sign a transaction
   * @param transaction
   * @returns {{data: any, signature: string}}
   */
  public signTransaction(transaction: Transaction): SignedTransaction {
    transaction.signer = PublicAccount.createWithPublicKey(this.publicKey);
    transaction.setNetworkType(this.address.network());
    const dto = transaction.toDTO();
    const keyPair: any = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(this.privateKey));
    const result = nemSdk.default.utils.serialization.serializeTransaction(dto);
    const signature = keyPair.sign(result);
    return {
      data: nemSdk.default.utils.convert.ua2hex(result),
      signature: signature.toString(),
    };
  }

  /**
   * Sign string
   * @param messagestring
   * @returns signatureString
   */
  public signMessage(message:string){
    const keyPair: any = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(this.privateKey));
    return  keyPair.sign(message);
  }

  /**
   * verify message
   * @param signedMessage
   * @param signature
   * @returns true/false
   */
  public verifySignedMessage(signedMessage:string, signature:string){
    return nemSdk.default.crypto.verifySignature(this.publicKey,signedMessage,signature);
  }

  /**
   * constructor with private key
   * @param privateKey
   * @returns {Account}
   */
  public static createWithPrivateKey(privateKey: string) {
    if (privateKey == undefined) {
      throw new Error("Private Key is undefined");
    }
    let network;
    if (NEMLibrary.getNetworkType() == NetworkTypes.MAIN_NET) {
      network = nemSdk.default.model.network.data.mainnet.id;
    } else if (NEMLibrary.getNetworkType() == NetworkTypes.TEST_NET) {
      network = nemSdk.default.model.network.data.testnet.id;
    }
    const keyPair: any = nemSdk.default.crypto.keyPair.create(nemSdk.default.utils.helpers.fixPrivateKey(privateKey));
    const publicKey: string = keyPair.publicKey.toString();
    const address: string = nemSdk.default.model.address.toAddress(publicKey, network);
    return new Account(
      new Address(address),
      publicKey,
      privateKey,
    );
  }

  /**
   * generate new account
   * @param walletName
   * @param passphrase
   * @param networkType
   * @returns {Account}
   */
  public static generateAccount(walletName: string, passphrase: string, networkType: NetworkTypes): Account {
    // Generate a random private key
    // Note: we DON'T want to derivate the private key from the passphrase, since everytime the password is the same,
    //   the same key pair would be generated (brain wallet).
    //   Brain wallets are great, if the user can remember the password in his BRAIN and the
    //   password is still complex enough to be secure and unique.
    //   Hence, brain wallets are not the right choice for most users
    const privateKey = nemSdk.default.crypto.js.lib.WordArray.random(32).toString();
    const keyPair = nemSdk.default.crypto.keyPair.create(privateKey);

    const address = PublicAccount.createWithPublicKey(keyPair.publicKey.toString()).address;
    return new Account(
      address,
      keyPair.publicKey.toString(),
      privateKey.toString(),
    );
  }

  /**
   * Create a new encrypted Message
   * @param message
   * @param recipientPublicAccount
   * @returns {EncryptedMessage}
   */
  public encryptMessage(message: string, recipientPublicAccount: PublicAccount): EncryptedMessage {
    return EncryptedMessage.create(message, recipientPublicAccount, this.privateKey);
  }

  /**
   * Decrypts an encrypted message
   * @param encryptedMessage
   * @param recipientPublicAccount
   * @returns {PlainMessage}
   */
  public decryptMessage(encryptedMessage: EncryptedMessage, recipientPublicAccount: PublicAccount): PlainMessage {
    return EncryptedMessage.decrypt(encryptedMessage, this.privateKey, recipientPublicAccount);
  }
}
