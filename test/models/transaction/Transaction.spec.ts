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

import {expect} from "chai";
import {PublicAccount} from "../../../index";
import {Account} from "../../../src/models/account/Account";
import {Address} from "../../../src/models/account/Address";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {Transaction} from "../../../src/models/transaction/Transaction";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../config/TestVariables.spec";
import {MockTransaction} from "./MockTransaction.spec";

declare let process: any;

describe("Transaction", () => {
  const recipientAccount = new Address("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
  const privateKey = process.env.PRIVATE_KEY || TestVariables.TEST_PRIVATE_KEY;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should create a Transaction for an account with signer private key", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const transaction = new MockTransaction(account);

    expect(transaction.signer!.publicKey).to.be.equal(account.publicKey);
    expect(transaction.type).to.be.equal(123);
    expect(transaction.version).to.be.equal(0x00000002);
    expect(transaction.fee).to.be.equal(5);
  });

  it("should throw exception when there is a sender, but it hasn't public key", () => {
    expect(() => {
      new MockTransaction(new PublicAccount(recipientAccount, ""));
    })
      .to.throw(Error, /signer key pair is required to create a verifiable entity/);
  });

  it("should throw error if getTransactionInfo is called when the transaction is not confirmed", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const transaction = new MockTransaction(account);
    expect(() => {
      transaction.getTransactionInfo();
    }).to.throw(Error, /TransactionInfo is not available when it is not confirmed/);
  });

  it("should add the Testnet version", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const transaction = new MockTransaction(account);
    transaction.setNetworkType(account.address.network());
    expect(transaction.networkVersion).to.be.equal(-1744830462);
  });

  it("should add the Mainet version", () => {
    NEMLibrary.reset();
    NEMLibrary.bootstrap(NetworkTypes.MAIN_NET);
    const account = Account.createWithPrivateKey(privateKey);
    const transaction = new MockTransaction(account);
    transaction.setNetworkType(account.address.network());
    expect(transaction.networkVersion).to.be.equal(1744830466);
    NEMLibrary.reset();
  });
});
