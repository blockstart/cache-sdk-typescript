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

import {deepEqual} from "assert";
import {expect} from "chai";
import {NetworkTypes} from "../../src/models/node/NetworkTypes";
import {PlainMessage} from "../../src/models/transaction/PlainMessage";
import {Password} from "../../src/models/wallet/Password";
import {SimpleWallet} from "../../src/models/wallet/SimpleWallet";
import {NEMLibrary} from "../../src/NEMLibrary";
import {QRService} from "../../src/services/QRService";
import {TestVariables} from "../config/TestVariables.spec";

declare let process: any;

describe("QRService", () => {
  let qrService: QRService;
  let simpleWallet: SimpleWallet;
  let password: Password;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    qrService = new QRService();
    password = new Password("12345678");
    const privateKey: string = process.env.PRIVATE_KEY || TestVariables.TEST_PRIVATE_KEY;
    simpleWallet = SimpleWallet.createWithPrivateKey("testWallet", password, privateKey);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should decrypt wallet from QR code", () => {
    const qrWalletText = qrService.generateWalletQRText(password, simpleWallet);
    const privateKey = qrService.decryptWalletQRText(password, JSON.parse(qrWalletText));
    expect(privateKey).to.be.equal(simpleWallet.unlockPrivateKey(password));
  });

  it("should not decrypt the QR if the password is wrong", () => {
    const qrWalletText = qrService.generateWalletQRText(password, simpleWallet);
    expect(() => {
      const privateKey = qrService.decryptWalletQRText(new Password("another password"), JSON.parse(qrWalletText));
      console.log("QRService", privateKey);
    }).to.throw(Error);
  });

  it("should generate QR code with address", () => {
    const qrAddressText = qrService.generateAddressQRText(simpleWallet.address);
    expect(qrAddressText).to.contain(simpleWallet.address.plain());
    expect(qrAddressText).to.contain("\"type\":1");
  });

  it("should decrypt QR code and return address", () => {
    const qrWalletText = qrService.generateAddressQRText(simpleWallet.address);
    const address = qrService.decryptAddressQRText(JSON.parse(qrWalletText));
    deepEqual(address, simpleWallet.address);
  });

  it("should generate QR code with transaction", () => {
    const qrTransactionText = qrService.generateTransactionQRText(simpleWallet.address, 1, "message");
    expect(qrTransactionText).to.contain(simpleWallet.address.plain());
    expect(qrTransactionText).to.contain("\"type\":2");
    expect(qrTransactionText).to.contain("\"msg\":\"message\"");
    expect(qrTransactionText).to.contain("\"amount\":1");
  });

  it("should decrypt QR code and return transaction", () => {
    const qrTransactionText = qrService.generateTransactionQRText(simpleWallet.address, 1, "message");
    const transaction = qrService.decryptTrasactionQRText(JSON.parse(qrTransactionText));
    expect((transaction.message as PlainMessage).plain()).to.be.equal("message");
    expect(transaction.xem().quantity()).to.be.equal(1000000);
    expect(transaction.recipient.plain()).to.be.equal(simpleWallet.address.plain());
  });
});
