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
import {AccountHttp} from "../../../src/infrastructure/AccountHttp";
import {AccountImportanceInfo} from "../../../src/models/account/AccountImportanceInfo";
import {AccountInfo, AccountInfoWithMetaData} from "../../../src/models/account/AccountInfo";
import {Address} from "../../../src/models/account/Address";
import {NetworkTypes} from "../../../src/models/node/NetworkTypes";
import {NEMLibrary} from "../../../src/NEMLibrary";
import {TestVariables} from "../../../test/config/TestVariables.spec";
import { TestAccount } from "../../config/Accounts.spec";

describe("AccountHttp", () => {
  before(() => {
    NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
  });

  after(() => {
    NEMLibrary.reset();
  });

  const address: Address = new Address("TCJZJHAV63RE2JSKN27DFIHZRXIHAI736WXEOJGA");
  const publicKey = "a4f9d42cf8e1f7c6c3216ede81896c4fa9f49071ee4aee2a4843e2711899b23a";

  it("receives AccountInfoWithMetaData given a NEM Address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getFromAddress(address)
      .subscribe((accountInfoWithMetaData) => {
          expect(accountInfoWithMetaData.publicAccount.address.plain())
            .to.equal(address.plain());
          checkAccountInfoWithMetaData(accountInfoWithMetaData);
          done();
        },
      );
  });

  it("receives AccountInfoWithMetaData given a NEM public key", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getFromPublicKey(publicKey)
      .subscribe((accountInfoWithMetaData) => {
          expect(accountInfoWithMetaData.publicAccount.address.plain())
            .to.equal(address.plain());
          expect(accountInfoWithMetaData.publicAccount.publicKey)
            .to.equal(publicKey);
          checkAccountInfoWithMetaData(accountInfoWithMetaData);
          done();
        },
      );
  });

  it("receives original account data from delegated account address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getOriginalAccountDataFromDelegatedAccountAddress(address)
      .subscribe((accountInfoWithMetaData) => {
          expect(accountInfoWithMetaData.publicAccount.address.plain())
            .to.equal(address.plain());
          checkAccountInfoWithMetaData(accountInfoWithMetaData);
          done();
        },
      );
  });

  it("receives AccountInfoWithMetaData given a NEM public key", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getOriginalAccountDataFromDelegatedAccountPublicKey(publicKey)
      .subscribe((accountInfoWithMetaData) => {
          expect(accountInfoWithMetaData.publicAccount.address.plain())
            .to.equal(address.plain());
          expect(accountInfoWithMetaData.publicAccount.publicKey)
            .to.equal(publicKey);
          checkAccountInfoWithMetaData(accountInfoWithMetaData);
          done();
        },
      );
  });

  it("receives AccountMetaData given a NEM address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.status(address)
      .subscribe((accountMetaData) => {
          expect(accountMetaData.status).to.equal("LOCKED");
          done();
        },
      );
  });

  it("receives 0 unconfirmed transactions given a NEM address and no one has done a transaction", (done) => {
    const accountHttp = new AccountHttp();
    const someOtherAddress = new Address("TAAPGI-W7K4MG-2DNIKV-XDPW3N-WUM7FG-WPYQTV-7AF4");
    accountHttp.unconfirmedTransactions(someOtherAddress)
      .subscribe((unconfirmedTransactions) => {
        expect(unconfirmedTransactions).to.have.length(0);
        done();
      });
  });

  it("receives 10 outgoing confirmed transactions given a NEM address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.outgoingTransactions(address)
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          done();
        },
      );
  });

  it("receives 10 outgoing confirmed transactions given a NEM address filtered by transaction hash", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.outgoingTransactions(address, {hash: "a84f0b4be98e5c0faadcbea742235e916c25be9b3f577e59256f405166b0b302"})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          expect(confirmedTransactions[0].getTransactionInfo().hash.data).to.be.equal("ae9d44858b4064abf49d61107d5158a608b50a540cf2d0d1aa8185debe7fb76b");
          done();
        },
      );
  });

  it("receives 10 outgoing confirmed transactions given a NEM address filtered by transaction id", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.outgoingTransactions(address, {id: 966779})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          done();
        },
      );
  });

  it("receives 10 incoming confirmed transactions given a NEM address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.incomingTransactions(address)
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          done();
        },
      );
  });

  it("receives 10 incoming confirmed transactions given a NEM address filtered by transaction hash", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.incomingTransactions(address, {hash: "a90987f2681d5e10e602dcd81b0d0bd48925f26678e6012153d1c89bd4f31fa3"})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          expect(confirmedTransactions[0].getTransactionInfo().hash.data).to.be.equal("a84f0b4be98e5c0faadcbea742235e916c25be9b3f577e59256f405166b0b302");
          done();
        },
      );
  });

  it("receives 10 incoming confirmed transactions given a NEM address filtered by transaction id", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.incomingTransactions(address, {id: 114305})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions[0].getTransactionInfo().id).to.be.equal(112685);
          done();
        },
      );
  });

  it("receives 10 confirmed transactions given a NEM address", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.allTransactions(address)
      .subscribe((confirmedTransactions) => {
        expect(confirmedTransactions).to.not.be.undefined;
        expect(confirmedTransactions).to.have.length(10);
        done();
      });
  });

  it("receives 10 confirmed transactions given a NEM address filtered by transaction hash", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.allTransactions(address, {hash: "a90987f2681d5e10e602dcd81b0d0bd48925f26678e6012153d1c89bd4f31fa3"})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          expect(confirmedTransactions[0].getTransactionInfo().hash.data).to.be.equal("6d3278d997cc1894e9420ca068ae514f2d2fa7f9de76fb9aacd1cce492ba1e12");
          done();
        },
      );
  });

  it("receives 5 confirmed transactions given a NEM address filtered by transaction hash", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.allTransactions(address, {
      hash: "a90987f2681d5e10e602dcd81b0d0bd48925f26678e6012153d1c89bd4f31fa3",
      pageSize: 5,
    })
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(5);
          expect(confirmedTransactions[0].getTransactionInfo().hash.data).to.be.equal("6d3278d997cc1894e9420ca068ae514f2d2fa7f9de76fb9aacd1cce492ba1e12");
          done();
        },
      );
  });

  it("receives 10 confirmed transactions given a NEM address filtered by transaction id", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.allTransactions(address, {id: 114305})
      .subscribe((confirmedTransactions) => {
          expect(confirmedTransactions).to.not.be.undefined;
          expect(confirmedTransactions).to.have.length(10);
          expect(confirmedTransactions[0].getTransactionInfo().id).to.be.equal(114190);
          done();
        },
      );
  });

  it("receives account harvesting information", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getHarvestInfoDataForAnAccount(new Address("TALICESKTW5TAN5GEOK4TQKD43AUGSDTHK7UIIAK"), "1043593")
      .subscribe((accountHarvestInfos) => {
        expect(accountHarvestInfos).to.not.be.undefined;
        expect(accountHarvestInfos[0].timeStamp).to.not.be.null;
        expect(accountHarvestInfos[0].id).to.not.be.null;
        expect(accountHarvestInfos[0].difficulty).to.not.be.null;
        expect(accountHarvestInfos[0].totalFee).to.not.be.null;
        expect(accountHarvestInfos[0].height).to.not.be.null;

        done();
      });
  });

  it("receives account importances information", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getAccountImportances()
      .subscribe((accountImportanceInfos) => {
        expect(accountImportanceInfos[0]).to.be.instanceOf(AccountImportanceInfo);
        expect(accountImportanceInfos[0].address).to.not.be.undefined;
        expect(accountImportanceInfos[0].importance.isSet).to.not.be.undefined;
        done();
      });
  });

  it("receives account namespace", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getNamespaceOwnedByAddress(new Address(TestAccount.address))
      .subscribe((namespaces) => {
        expect(namespaces[0].name).to.not.be.undefined;
        expect(namespaces[0].height).to.not.be.undefined;
        expect(namespaces[0].owner).to.not.be.undefined;
        done();
      });
  });

  it("receives account namespace with params parent, id and pageSize", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getNamespaceOwnedByAddress(new Address(TestAccount.address), "server", 1)
      .subscribe((namespaces) => {
        expect(namespaces[0].name).to.not.be.undefined;
        expect(namespaces[0].height).to.not.be.undefined;
        expect(namespaces[0].owner).to.not.be.undefined;
        //expect(namespaces.length).to.be.equal(1); @warning pageSize not working
        done();
      });
  });

  it("receives account created mosaics", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getMosaicCreatedByAddress(new Address(TestAccount.address))
      .subscribe((mosaics) => {
        expect(mosaics[0].creator).to.not.be.null;
        expect(mosaics[0].id).to.not.be.null;
        expect(mosaics[0].description).to.not.be.null;
        expect(mosaics[0].properties).to.not.be.null;
        done();
      });
  });

  it("receives account created mosaics from a namespace", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getMosaicCreatedByAddress(new Address(TestAccount.address), "server")
      .subscribe((mosaics) => {
        expect(mosaics[0].creator).to.not.be.null;
        expect(mosaics[0].id).to.not.be.null;
        expect(mosaics[0].description).to.not.be.null;
        expect(mosaics[0].properties).to.not.be.null;
        done();
      });
  });

  it("receives account owned mosaics", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getMosaicOwnedByAddress(new Address("TANLDM5VDKSZJQX4GFLOEC4V5OVHIJZFACRHUWI5"))
      .subscribe((mosaics) => {
        expect(mosaics[0].quantity).to.not.be.null;
        expect(mosaics[0].mosaicId).to.not.be.null;
        done();
      });
  });

  it("should unlock information", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.unlockInfo()
      .subscribe((nodeHarvestInfo) => {
        expect(nodeHarvestInfo.maxUnlocked).to.not.be.null;
        expect(nodeHarvestInfo.numUnlocked).to.not.be.null;
        done();
      });
  });

  it("should get historical account data", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getHistoricalAccountData(new Address("TALICESKTW5TAN5GEOK4TQKD43AUGSDTHK7UIIAK"), 17592, 17592, 1)
      .subscribe((accountHistoryData) => {
        expect(accountHistoryData[0].address.plain()).to.not.be.null;
        expect(accountHistoryData[0].balance.balance).to.not.be.null;
        expect(accountHistoryData[0].balance.vestedBalance).to.not.be.null;
        expect(accountHistoryData[0].pageRank).to.not.be.null;
        expect(accountHistoryData[0].importance).to.not.be.null;
        done();
      });
  });

  it("should get batch account data", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getBatchAccountData([new Address("TALICESKTW5TAN5GEOK4TQKD43AUGSDTHK7UIIAK")])
      .subscribe((accountHistoryData) => {
        expect(accountHistoryData[0].publicAccount.address.plain()).to.not.be.null;
        expect(accountHistoryData[0].balance.balance).to.not.be.null;
        expect(accountHistoryData[0].balance.vestedBalance).to.not.be.null;
        expect(accountHistoryData[0].importance).to.not.be.null;
        expect(accountHistoryData[0].harvestedBlocks).to.not.be.null;
        done();
      });
  });

  it("should get batch historical account data", (done) => {
    const accountHttp = new AccountHttp();
    accountHttp.getBatchHistoricalAccountData([new Address("TALICESKTW5TAN5GEOK4TQKD43AUGSDTHK7UIIAK")], 17592, 17592, 1)
      .subscribe((accountHistoryData) => {
        expect(accountHistoryData[0][0].address.plain()).to.not.be.null;
        expect(accountHistoryData[0][0].balance.balance).to.not.be.null;
        expect(accountHistoryData[0][0].balance.vestedBalance).to.not.be.null;
        expect(accountHistoryData[0][0].pageRank).to.not.be.null;
        expect(accountHistoryData[0][0].importance).to.not.be.null;
        done();
      });
  });

  it("uses the default testnet server when no argument is passed in constructor", () => {
    const accountHttp = new AccountHttp();
    expect(accountHttp.nextNode()).to.be.equals("http://bigalice2.nem.ninja:7890/account/");
  });

  it("uses a specific domain when it is passed in constructor", () => {
    const accountHttp = new AccountHttp([{domain: "bob.nem.ninja"}]);
    expect(accountHttp.nextNode()).to.contain("bob.nem.ninja");
  });

  // region
  const checkAccountInfo = (accountInfo: AccountInfo) => {
    expect(accountInfo.publicAccount.address).to.not.be.undefined;
    expect(accountInfo.publicAccount.publicKey).to.not.be.undefined;
    expect(accountInfo.harvestedBlocks).to.not.be.undefined;
    expect(accountInfo.importance).to.not.be.undefined;
    expect(accountInfo.balance.vestedBalance).to.not.be.undefined;
    expect(accountInfo.balance.balance).to.not.be.undefined;
  };

  const checkAccountInfoWithMetaData = (accountInfoWithMetaData: AccountInfoWithMetaData) => {
    checkAccountInfo(accountInfoWithMetaData);
    expect(accountInfoWithMetaData.cosignatories).to.not.be.undefined;
    expect(accountInfoWithMetaData.cosignatoryOf).to.not.be.undefined;
    expect(accountInfoWithMetaData.status).to.not.be.undefined;
    expect(accountInfoWithMetaData.remoteStatus).to.not.be.undefined;
  };
  // endregion
});
