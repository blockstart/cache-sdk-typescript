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
import { CacheAccount } from '../../src/cacheModel/cacheAccount/CacheAccount';
import { CacheAddress } from '../../src/cacheModel/cacheAccount/CacheAddress';
import {NetworkTypes} from "../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../src/NEMLibrary";
import { TestVariables } from '../../test/config/TestVariables.spec';

declare let process: any;

describe("CacheAccount", () => {
  const recipientAccount = new CacheAddress(TestVariables.TEST_ADDRESS);
  const publicKey: string = TestVariables.TEST_PUBLIC_KEY;
  const privateKey: string = TestVariables.TEST_PRIVATE_KEY;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should check that cacheAddress().pretty() matches", () => {
    const cacheAccount = new CacheAccount(recipientAccount, publicKey, privateKey);
    expect(cacheAccount.cacheAddress().pretty()).to.be.equal('TDLZQL-26PP5R-VO4QCT-AJRATG-A5R4UE-DHHQGC-F3LR');
  });

  it("should check that cacheAddress().plain() matches", () => {
    const cacheAccount = new CacheAccount(recipientAccount, publicKey, privateKey);
    expect(cacheAccount.cacheAddress().plain()).to.be.equal('TDLZQL26PP5RVO4QCTAJRATGA5R4UEDHHQGCF3LR');
  });

  it("should check that signTransaction function exists", () => {
    const cacheAccount = new CacheAccount(recipientAccount, publicKey, privateKey);
    expect(typeof cacheAccount.signTransaction).to.be.equal('function');
  });

  it("should check that generateAccount function exists", () => {
    expect(typeof CacheAccount.generateAccount).to.be.equal('function');
  });

  it("should check that createWithPrivateKey function exists", () => {
    expect(typeof CacheAccount.createWithPrivateKey).to.be.equal('function');
  });

  it("should check that encryptMessage function exists", () => {
    const cacheAccount = new CacheAccount(recipientAccount, publicKey, privateKey);
    expect(typeof cacheAccount.encryptMessage).to.be.equal('function');
  });

  it("should check that decryptMessage function exists", () => {
    const cacheAccount = new CacheAccount(recipientAccount, publicKey, privateKey);
    expect(typeof cacheAccount.decryptMessage).to.be.equal('function');
  });
});
