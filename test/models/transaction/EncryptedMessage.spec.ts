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
import { PublicAccount } from "../../../src/models/account/PublicAccount";
import { XEM } from "../../../src/models/mosaic/XEM";
import { NetworkTypes } from "../../../src/models/node/NetworkTypes";
import { EncryptedMessage } from "../../../src/models/transaction/EncryptedMessage";
import { MultisigTransaction } from "../../../src/models/transaction/MultisigTransaction";
import { TimeWindow } from "../../../src/models/transaction/TimeWindow";
import { TransferTransaction } from "../../../src/models/transaction/TransferTransaction";
import { NEMLibrary } from "../../../src/NEMLibrary";
import { TestVariables } from "../../config/TestVariables.spec";

declare let process: any;

describe("EncryptedMessage", () => {

  const privateKey = TestVariables.TEST_PRIVATE_KEY;
  let recipientPublicAccount: PublicAccount;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    recipientPublicAccount = PublicAccount.createWithPublicKey("b254d8b2b00e1b1266eb54a6931cd7c1b0f307e41d9ebb01f025f4933758f0be");
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should create a encrypted message from a DTO", () => {
    const encryptedMessage = EncryptedMessage.createFromDTO("74657374207472616e73616374696f6e");
    expect(encryptedMessage.payload).to.be.equal("74657374207472616e73616374696f6e");
  });

  it("should return encrypted message dto", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const publicAccount = PublicAccount.createWithPublicKey(account.publicKey);
    const encryptedMessage = account.encryptMessage("test transaction", publicAccount);
    const plainMessage = account.decryptMessage(encryptedMessage, publicAccount);
    expect(plainMessage.payload).to.be.equal("test transaction");
  });

  it("should create an encrypted message from a DTO and decrypt it", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const publicAccount = PublicAccount.createWithPublicKey("0414fe7647ec008e533aac98a4bf1c5fbf1d236c75b81fdadf1f5d1042fdd2ff");
    const encryptMessage = EncryptedMessage.createFromDTO("02bb332c0fdd445455117882b2bec5e49f5713860d6b34650d0f769159d021a27518ea03539af8913231b9f80f600daae9291bb100a6d32e36b52a6c457fea287ca9942a32368618fe1fd0c185dbf834");
    const plainMessage = account.decryptMessage(encryptMessage, publicAccount);
    expect(plainMessage.payload).to.be.equal("test transaction");
  });

  it("should create a transfer transaction with an encrypted message", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const encryptedMessage = account.encryptMessage("test transaction", recipientPublicAccount);
    const transaction = TransferTransaction.create(recipientPublicAccount.address, new XEM(2), encryptedMessage);
    expect(transaction.message).to.be.instanceof(EncryptedMessage);
  });

  it("should create a multisig transfer transaction with an encrypted message", () => {
    const account = Account.createWithPrivateKey(privateKey);
    const encryptedMessage = account.encryptMessage("test transaction", recipientPublicAccount);
    const transaction = TransferTransaction.create( recipientPublicAccount.address, new XEM(2), encryptedMessage);
    const multisig = MultisigTransaction.create(TimeWindow.createWithDeadline(), transaction, PublicAccount.createWithPublicKey(account.publicKey));
    expect((multisig.otherTransaction as TransferTransaction).message).to.be.instanceof(EncryptedMessage);
  });

});
