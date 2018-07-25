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

import { expect } from "chai";
import { Account } from "../../../src/models/account/Account";
import { Address } from "../../../src/models/account/Address";
import { XEM } from "../../../src/models/mosaic/XEM";
import { NetworkTypes } from "../../../src/models/node/NetworkTypes";
import { MultisigSignatureTransaction } from "../../../src/models/transaction/MultisigSignatureTransaction";
import { EmptyMessage, PlainMessage } from "../../../src/models/transaction/PlainMessage";
import { TimeWindow } from "../../../src/models/transaction/TimeWindow";
import { TransferTransaction, TxType } from "../../../src/models/transaction/TransferTransaction";
import { NEMLibrary } from "../../../src/NEMLibrary";
import { TestVariables } from "../../config/TestVariables.spec";

declare let process: any;

describe("Account", () => {
  const recipientAccount = new Address(TestVariables.TEST_ADDRESS);
  const publicKey: string = TestVariables.TEST_PUBLIC_KEY;
  const privateKey: string = TestVariables.TEST_PRIVATE_KEY;
  const undefinedPrivateKey: string = process.env.NOT_DEFINED_PRIVATE_KEY;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should sign a multisig transaction", () => {
    const account = new Account(recipientAccount, publicKey, privateKey);
    const transaction = new MultisigSignatureTransaction(
      TimeWindow.createFromDTOInfo(68502384, 68505984),
      -1744830462,
      new Address("TBUAUC3VYKPP3PJPOH7A7BCB2C4I64XZAAOZBO6N"),
      {data: "d6103d88aad57055e31e8f7a90e08c8a40883b5a427e63e6acc69ccf22ebc94e"},
      6000000,
      "585e68a4a4677a2fef3883353e0b1e57d7c9d9a9b0ee84baff58462a044aabee38353c29d81d5ccee23ae1ea6bb34f6bcd54500d4c4d1dd68ce8d0eb6eac730a");
    const signedTransaction = account.signTransaction(transaction);
    expect(signedTransaction.data).to.be.equal("021000000200009870431504200000002a9b9786d94b1ce89723c0b4ce1673aaed2185a2d8cee367499d80ac0259f0c6808d5b0000000000805115042400000020000000d6103d88aad57055e31e8f7a90e08c8a40883b5a427e63e6acc69ccf22ebc94e280000005442554155433356594b505033504a504f48374137424342324334493634585a41414f5a424f364e");
    expect(signedTransaction.signature).to.be.equal("474c081045e38f4b77a9ace17c38cdd1c1f5693a2553e99e0b8fc91168c2fe0837214ccaba0031ca54aa96cd7dfb8d789fcd95d3fa2692429633a3bec8502c00");
  });

  it("should sign a transaction with message", () => {
    const account = new Account(recipientAccount, publicKey, privateKey);

    const transaction = TransferTransaction.create(recipientAccount, TxType.xem, new XEM(1),
      PlainMessage.create("test transaction"));
    const signedTransaction = account.signTransaction(transaction);
    expect(signedTransaction.data).to.be.equal("010100000100009870431504200000002a9b9786d94b1ce89723c0b4ce1673aaed2185a2d8cee367499d80ac0259f0c6a086010000000000805115042800000054444c5a514c323650503552564f34514354414a5241544741355234554544484851474346334c5240420f000000000018000000010000001000000074657374207472616e73616374696f6e");
    expect(signedTransaction.signature).to.be.equal("9de0945b8d605b84591f882dc83d0ff7d0652206bf31b6c43335e9a7f7160f8529c691a989e0e2c174b57d5fea1b05665cac9edc45c510bfffa11cb601b34700");
  });

  it("should sign a transaction without message", () => {
    const account = new Account(recipientAccount, publicKey, privateKey);

    const transaction = TransferTransaction.create(recipientAccount, TxType.xem, new XEM(1), EmptyMessage);
    const signedTransaction = account.signTransaction(transaction);
    expect(signedTransaction.data).to.be.equal("010100000100009870431504200000002a9b9786d94b1ce89723c0b4ce1673aaed2185a2d8cee367499d80ac0259f0c650c3000000000000805115042800000054444c5a514c323650503552564f34514354414a5241544741355234554544484851474346334c5240420f000000000000000000");
    expect(signedTransaction.signature).to.be.equal("73d0e12d9ecc009d9ad580d1864a68117a79f096b8dae3101e154407cba070a74727d6cf694932495f949c61b392d1b540d5bbfa7bd2f1ad381cd082baf71702");
  });

  it("should sign message string",()=>{
    const account = new Account(recipientAccount, publicKey, privateKey);
    const message = "Nem is Awesome";
    const signatureMessage = account.signMessage(message).toString();
    expect(signatureMessage).to.be.equal("e2be0d43c6b09f37ddce4807cad2c2fbf0fc6a3483f5de7bbd8c026d59c5e4e569380e459c6d6562630abbc12984d5fb9598d807561967e9094cd3a9bd250403");
  });

  it("should return true when signedMessage is signed with correct privateKey",()=> {
    const account = new Account(recipientAccount, publicKey, privateKey);
    const message = "Nem is Awesome";
    const signatureMessage = "e2be0d43c6b09f37ddce4807cad2c2fbf0fc6a3483f5de7bbd8c026d59c5e4e569380e459c6d6562630abbc12984d5fb9598d807561967e9094cd3a9bd250403";
    expect(account.verifySignedMessage(message,signatureMessage)).to.be.true;
  });

  it("should return false when signedMessage is signed with other privateKey",()=> {
    const account = new Account(recipientAccount, publicKey, privateKey);
    const message = "Nem is Awesome";
    const signatureMessage = "e2be0d43c6b09f37ddce4807cad2c2fbf0fc6a3483f5de7bbd8c026d59c5e4e569380e459c6d6562630abbc12984d5fb9598d807561967e9094cd3a9bd2false";
    expect(account.verifySignedMessage(message,signatureMessage)).to.be.false;
  });

  it("should generate an account given a private key", () => {
    const account = Account.createWithPrivateKey(privateKey);
    expect(account.publicKey).to.be.equal(publicKey);
    expect(account.address.plain()).to.be.equal(recipientAccount.plain());
  });

  it("hasPublicKey should return true when it has a public key", () => {
    const account = Account.createWithPrivateKey(privateKey);
    expect(account.hasPublicKey()).to.be.true;
  });

  it("hasPublicKey should return false when it hasn't public key", () => {
    const account = new Account(recipientAccount, "", privateKey);
    expect(account.hasPublicKey()).to.be.false;
  });

  it("should throw exception when the private key is not valid", () => {
    expect(() => {
      Account.createWithPrivateKey(undefinedPrivateKey);
    }).to.throw(Error);
  });

  it("should create a new wallet and account", () => {
    const accountOnTestnet = Account.generateAccount("my-new-test-wallet", "!4|\/|54+05|-|!:)", NetworkTypes.TEST_NET);

    expect(accountOnTestnet.address.plain().length).to.be.equal(40);
    expect(accountOnTestnet.publicKey.length).to.be.equal(64);
    expect(accountOnTestnet.address.plain()[0]).to.equal("T");
    expect(accountOnTestnet.privateKey.length).to.be.equal(64);
  });

});
