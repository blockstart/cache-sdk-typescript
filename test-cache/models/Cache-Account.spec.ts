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
import { CacheAddress } from '../../src/cache-model/cache-account/Cache-Address';
import {NetworkTypes} from "../../src/models/node/NetworkTypes";

describe("CacheAddress", () => {

  it("should create a testnet cacheAddress", () => {
    const cacheAddress = new CacheAddress("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
    expect(cacheAddress.plain()).to.be.equal("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
  });

  it("should create a mainnet cacheAddress", () => {
    const cacheAddress = new CacheAddress("ND7Z3K-YHWH57-CJRF7K-3QVIZA-ETELAH-7UJML4-OTM2");
    expect(cacheAddress.plain()).to.be.equal("ND7Z3KYHWH57CJRF7K3QVIZAETELAH7UJML4OTM2");
  });

  it("should return a pretty cacheAddress", () => {
    const cacheAddress = new CacheAddress("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
    expect(cacheAddress.pretty()).to.be.equal("TCJZJH-AV63RE-2JSKN2-7DFIHZ-RXIHAI-736WXE-OJGA");
  });

  it("should return testnet cacheAddress network", () => {
    const cacheAddress = new CacheAddress("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
    expect(cacheAddress.network()).to.be.equal(NetworkTypes.TEST_NET);
  });

  it("should return mainnet cacheAddress network", () => {
    const cacheAddress = new CacheAddress("ND7Z3KYHWH57CJRF7K3QVIZAETELAH7UJML4OTM2");
    expect(cacheAddress.network()).to.be.equal(NetworkTypes.MAIN_NET);
  });

  it("should return mainnet cacheAddress network when the cacheAddress is in lowercase", () => {
    const cacheAddress = new CacheAddress("nd7z3kyhwh57cjrf7k3qvizaetelah7ujml4otm2");
    expect(cacheAddress.network()).to.be.equal(NetworkTypes.MAIN_NET);
  });

  it("should throw exception when the cacheAddress contain an invalid network type", () => {
    expect(() => {
      new CacheAddress("ZD7Z3KYHWH57CJRF7K3QVIZAETELAH7UJML4OTM2");
    }).to.throw(Error, "NetworkType invalid");
  });

  it("should remove blank spaces from begining and end", () => {
    const cacheAddress = new CacheAddress(" ND7Z3K-YHWH57-CJRF7K-3QVIZA-ETELAH-7UJML4-OTM2 ");
    expect(cacheAddress.plain()).to.be.equal("ND7Z3KYHWH57CJRF7K3QVIZAETELAH7UJML4OTM2");
  });

  it("should return true if both cacheAddress are equals", () => {
    const cacheAddress = new CacheAddress(" ND7Z3K-YHWH57-CJRF7K-3QVIZA-ETELAH-7UJML4-OTM2 ");
    const cacheCacheAddress2 = new CacheAddress("nd7z3kyhwh57cjrf7k3qvizaetelah7ujml4otm2");
    expect(cacheAddress.equals(cacheCacheAddress2)).to.be.true;
  });
});