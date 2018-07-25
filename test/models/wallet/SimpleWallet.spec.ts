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
import {LocalDateTime} from "js-joda";
import {Account} from "../../../src/models/account/Account";
import {Address} from "../../../src/models/account/Address";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {EncryptedPrivateKey} from "../../../src/models/wallet/EncryptedPrivateKey";
import {Password} from "../../../src/models/wallet/Password";
import {SimpleWallet} from "../../../src/models/wallet/SimpleWallet";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../config/TestVariables.spec";

declare let process: any;

describe("SimpleWallet", () => {
  const privateKey = process.env.PRIVATE_KEY || TestVariables.TEST_PRIVATE_KEY;
  let environmentAccount: Account;

  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
    environmentAccount = Account.createWithPrivateKey(privateKey);
  });

  after(() => {
    NEMLibrary.reset();
  });

  it("should create a new simple wallet", () => {
    const simpleWallet = SimpleWallet.create("My wallet", new Password("password"));
    expect(simpleWallet.name).to.be.equal("My wallet");
    expect(simpleWallet.network).to.be.equal(NetworkTypes.TEST_NET);
  });

  it("should create a new wallet with privateKey", () => {
    const simpleWallet = SimpleWallet.createWithPrivateKey("My wallet", new Password("password"), privateKey);
    expect(simpleWallet.name).to.be.equal("My wallet");
    expect(simpleWallet.network).to.be.equal(NetworkTypes.TEST_NET);
    expect(simpleWallet.address.plain()).to.be.equal(environmentAccount.address.plain());
  });

  it("should open a new simple wallet", () => {
    const simpleWallet = SimpleWallet.create("My wallet", new Password("password"));
    const account = simpleWallet.open(new Password("password"));
    expect(account.address.plain()).to.be.equal(simpleWallet.address.plain());
  });

  it("should open a new simple wallet created from private key", () => {
    const simpleWallet = SimpleWallet.createWithPrivateKey("My wallet", new Password("password"), privateKey);
    const account = simpleWallet.open(new Password("password"));
    expect(account.address.plain()).to.be.equal(environmentAccount.address.plain());
  });

  it("should return a wlt content", () => {
    const simpleWallet = new SimpleWallet("My wallet",
      NetworkTypes.TEST_NET,
      new Address("TAZ53XZ2PLF2CRMF7AWPAMYZKW63ZOCBKMEJEOQJ"),
      LocalDateTime.of(2017, 11, 20),
      new EncryptedPrivateKey(
        "a4eb0dfb0bbc38dece38d58601da57596cfe25e99a7f9a42a2863972af32c839c23e8a12d45bfe09f1c8d0fd52e77274",
        "98a53e7046535b9ce0be282d3a271f12",
      ));
    const wlt = simpleWallet.writeWLTFile();
    expect(wlt).to.be.equal("eyJuYW1lIjoiTXkgd2FsbGV0IiwibmV0d29yayI6IjE1MiIsImFkZHJlc3MiOiJUQVo1M1haMlBMRjJDUk1GN0FXUEFNWVpLVzYzWk9DQktNRUpFT1FKIiwiY3JlYXRpb25EYXRlIjoiMjAxNy0xMS0yMFQwMDowMCIsInNjaGVtYSI6MSwidHlwZSI6InNpbXBsZSIsImVuY3J5cHRlZFByaXZhdGVLZXkiOiJhNGViMGRmYjBiYmMzOGRlY2UzOGQ1ODYwMWRhNTc1OTZjZmUyNWU5OWE3ZjlhNDJhMjg2Mzk3MmFmMzJjODM5YzIzZThhMTJkNDViZmUwOWYxYzhkMGZkNTJlNzcyNzQiLCJpdiI6Ijk4YTUzZTcwNDY1MzViOWNlMGJlMjgyZDNhMjcxZjEyIn0=");
  });

  it("should return a simple wallet from WLT", () => {
    const simpleWallet = SimpleWallet.readFromWLT("eyJuYW1lIjoiTXkgd2FsbGV0IiwibmV0d29yayI6IjE1MiIsImFkZHJlc3MiOiJUQVo1M1haMlBMRjJDUk1GN0FXUEFNWVpLVzYzWk9DQktNRUpFT1FKIiwiY3JlYXRpb25EYXRlIjoiMjAxNy0xMS0yMFQwMDowMCIsInNjaGVtYSI6MSwidHlwZSI6InNpbXBsZSIsImVuY3J5cHRlZFByaXZhdGVLZXkiOiJhNGViMGRmYjBiYmMzOGRlY2UzOGQ1ODYwMWRhNTc1OTZjZmUyNWU5OWE3ZjlhNDJhMjg2Mzk3MmFmMzJjODM5YzIzZThhMTJkNDViZmUwOWYxYzhkMGZkNTJlNzcyNzQiLCJpdiI6Ijk4YTUzZTcwNDY1MzViOWNlMGJlMjgyZDNhMjcxZjEyIn0=");
    expect(simpleWallet.name).to.be.equal("My wallet");
    deepEqual(simpleWallet.network, NetworkTypes.TEST_NET);
    deepEqual(simpleWallet.address, new Address("TAZ53XZ2PLF2CRMF7AWPAMYZKW63ZOCBKMEJEOQJ"));
    deepEqual(simpleWallet.creationDate, LocalDateTime.of(2017, 11, 20));
    deepEqual(simpleWallet.encryptedPrivateKey, new EncryptedPrivateKey(
      "a4eb0dfb0bbc38dece38d58601da57596cfe25e99a7f9a42a2863972af32c839c23e8a12d45bfe09f1c8d0fd52e77274",
      "98a53e7046535b9ce0be282d3a271f12",
    ));
  });

  it("should read the private key", () => {
    const password = new Password("password");
    const simpleWallet = SimpleWallet.createWithPrivateKey("My wallet", password, privateKey);
    expect(simpleWallet.unlockPrivateKey(password)).to.be.equal(privateKey);
  });

  it("should throw Error when the Password is invalid", () => {
    const password = new Password("this is an invalid password");
    const simpleWallet = SimpleWallet.createWithPrivateKey("my wallet", new Password("valid password"), privateKey);
    expect(() => {
      const privateKey = simpleWallet.unlockPrivateKey(password);
      console.log("SimpleWallet", privateKey);
    }).to.throw(Error);
  });

  it("should return a Simple Wallet from NanoWallet file format", () => {
    const simpleWallet = SimpleWallet.readFromNanoWalletWLF("eyJwcml2YXRlS2V5IjoiIiwibmFtZSI6IkpvcmlzIHRlc3QiLCJhY2NvdW50cyI6eyIwIjp7ImJyYWluIjp0cnVlLCJhbGdvIjoicGFzczpiaXAzMiIsImVuY3J5cHRlZCI6IjQ4MWJjYmZiMDExODgxMTY4MmM5OTA2YWUzNzlkOWIyMjIxNGQ0MzA1MzU4ZDFhNDU3ZTgwNWU5ZmJjYjhkM2I5NzM3OTI4MGRhODRhNmRjZDE0MDVlMzYxYzIxZmIyNSIsIml2IjoiYTVlYzE1ODhlZjkxZWQ0Njc1ZDAzYjQyMTRkNjFmNzUiLCJhZGRyZXNzIjoiVERKSFBTSUhTSFRYMloySlVaVkdIWkE1SEJQT1hKSlJNWE5DMzRMVCIsImxhYmVsIjoiUHJpbWFyeSIsIm5ldHdvcmsiOi0xMDQsImNoaWxkIjoiYmYzZjMzOGY0MWVhYjYxN2JhNmRjNDEyMThhZDhkYjdlYmYxZGQwM2QxZWM3NzRjNjM0YmRkNjM3MjFjY2MxYiIsIiQkaGFzaEtleSI6Im9iamVjdDoxODYyIn0sIjEiOnsiYWRkcmVzcyI6IlRBUURXVkNHTU5SVzM1TkM2TlUyVk9UMlNJSUpOTFJWU0w1R0oyWEMiLCJsYWJlbCI6InRlc3RXYWxsZXQiLCJjaGlsZCI6ImFlYzVlZTczNWE0ZWJlM2M1OWQxMDIzY2MzM2Q1MGU1NGQzNjRlNmIxMzA3ZjYwYTVlNDg3ZmU0YWM2M2JkZTYiLCJlbmNyeXB0ZWQiOiI5ZWUxMzM0ZDc0ODEzZWQxZjVlMDE3NDc4MWNiNDJkYTA3ZWJmYjlhYWIxY2FmYjAwMjI5YjA2NWYzY2I3ZTU1ZjYzNDgwNGM0MTFhYzlmMmY0NDM1N2U0MWQ3YWY0ZDkiLCJpdiI6Ijc1MmMwNzdiODRhNjU2NjE4NmE0NTU4NjYwZmVhZDJkIiwiJCRoYXNoS2V5Ijoib2JqZWN0OjE4NjMifX0sIiQkaGFzaEtleSI6Im9iamVjdDoxNiJ9");
    expect(simpleWallet.name).to.be.equal("Joris test");
    deepEqual(simpleWallet.network, NetworkTypes.TEST_NET);
    deepEqual(simpleWallet.address, new Address("TDJHPSIHSHTX2Z2JUZVGHZA5HBPOXJJRMXNC34LT"));
  });

  it("should throw exception if the decoded private key is not the same as stored", () => {
    const wrtFile = "eyJuYW1lIjoibXkgd2FsbGV0IiwibmV0d29yayI6IjE1MiIsImFkZHJlc3MiOiJURExaUUwyNlBQNVJWTzRRQ1RBSlJBVEdBNVI0VUVESEhRR0NGM0xSIiwiY3JlYXRpb25EYXRlIjoiMjAxOC0wMy0xNFQyMjo1NjoyMC42NTQiLCJzY2hlbWEiOjEsInR5cGUiOiJzaW1wbGUiLCJlbmNyeXB0ZWRQcml2YXRlS2V5IjoiYThkYWIxMjA1NmMzNWZjNmExYTI0MTgxNjEzNWRkNmI2MTBhNGQ2ZDc2YjEyZWMzMWQ4ZWE1Y2IzNTVlMTQyZTQ1ZjE1YThlMTZkNjRhYzJmNzI0ZGQ1ZDgyNTE1NmNiIiwiaXYiOiJhZmQ5YzdkNzdjNmQ4Yjk1YThhZDllZDgwNjI4ZTJjOSJ9";
    const invalidPassword = new Password("12345678");
    const simpleWallet = SimpleWallet.readFromWLT(wrtFile);
    expect(() => {
      simpleWallet.open(invalidPassword);
    }).to.throw(Error);
  });

  it("should should open the wrt file", () => {
    const wrtFile = "eyJuYW1lIjoibXkgd2FsbGV0IiwibmV0d29yayI6IjE1MiIsImFkZHJlc3MiOiJURExaUUwyNlBQNVJWTzRRQ1RBSlJBVEdBNVI0VUVESEhRR0NGM0xSIiwiY3JlYXRpb25EYXRlIjoiMjAxOC0wMy0xNFQyMjo1NjoyMC42NTQiLCJzY2hlbWEiOjEsInR5cGUiOiJzaW1wbGUiLCJlbmNyeXB0ZWRQcml2YXRlS2V5IjoiYThkYWIxMjA1NmMzNWZjNmExYTI0MTgxNjEzNWRkNmI2MTBhNGQ2ZDc2YjEyZWMzMWQ4ZWE1Y2IzNTVlMTQyZTQ1ZjE1YThlMTZkNjRhYzJmNzI0ZGQ1ZDgyNTE1NmNiIiwiaXYiOiJhZmQ5YzdkNzdjNmQ4Yjk1YThhZDllZDgwNjI4ZTJjOSJ9";
    const validPassword = new Password("valid password");
    const simpleWallet = SimpleWallet.readFromWLT(wrtFile);
    deepEqual(simpleWallet.open(validPassword).address, simpleWallet.address);
  });
});
