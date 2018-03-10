import { Injectable } from '@angular/core';
import { HttpHelperService } from '../../../core/http-helper.service';
import { ApiRoutingService } from '../../../core/api-routing.service';
import { Component, EventEmitter, OnInit, Input, Output, HostListener, NgZone } from '@angular/core';
import Web3 from 'web3';
import Contract from 'truffle-contract';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import Tx from 'ethereumjs-tx';

const GZRArtifacts = require('../../../../../build/contracts/GizerToken.json');
const StandardTokenArtifacts = require('../../../../../build/contracts/StandardToken.json');
const GZRTokenToItemGenerationArtifacts = require('../../../../../build/contracts/GZRTokenToItemGeneration.json');

declare var window: any;

@Injectable()
export class MetaMaskService {

  GzrToken = Contract(GZRArtifacts);
  StandardToken = Contract(StandardTokenArtifacts);
  GZRTokenToItemGeneration = Contract(GZRTokenToItemGenerationArtifacts);

  accounts: any;
  web3: any;

  balance: number;
  balanceSubject = new Subject<number>();
  balanceObservable$ = this.balanceSubject.asObservable();

  gzrBalance: number;
  gzrBalanceSubject = new Subject<number>();
  gzrBalanceObservable$ = this.gzrBalanceSubject.asObservable();

  contractAddress: string;
  contractAddressSubject = new Subject<string>();
  contractAddressObservable$ = this.contractAddressSubject.asObservable();

  transactionId: string;
  transactionIdSubject = new Subject<string>();
  transactionIdObservable$ = this.transactionIdSubject.asObservable();

  sendingAmount: number;
  recipientAddress: string;
  status: string;
  account: string;

  unlocked = false;
  unlockedSubject = new Subject<boolean>();
  unlockedObservable$ = this.unlockedSubject.asObservable();

  installed = false;
  installedSubject = new Subject<boolean>();
  installedObservable$ = this.installedSubject.asObservable();

  validNetwork = false;
  validNetworkSubject = new Subject<boolean>();
  validNetworkObservable$ = this.validNetworkSubject.asObservable();

  signTransactionPending = 0;
  signTransactionPendingSubject = new Subject<number>();
  signTransactionPendingObservable$ = this.signTransactionPendingSubject.asObservable();

  buyGZRTransaction = 0;
  buyGZRTransactionSubject = new Subject<number>();
  buyGZRTransactionObservable$ = this.buyGZRTransactionSubject.asObservable();

  accountSubject = new Subject<any>();
  accountObservable$ = this.accountSubject.asObservable();

  treasureTransactionSubject = new Subject<any>();
  treasureTransactionObservable$ = this.treasureTransactionSubject.asObservable();

  GZRContractInstanceSubject = new Subject<any>();
  GZRContractInstance$ = this.GZRContractInstanceSubject.asObservable();

  ItemsContractInstanceSubject = new Subject<any>();
  ItemsContractInstance$ = this.ItemsContractInstanceSubject.asObservable();


  loadMetaObservable: any;
  loadMetaSubscription$: Subscription = new Subscription();

  checkTxStatusObservable: any;
  checkTxStatusSusbscription$: Subscription = new Subscription();

  subscribed = false;
  purchasedEtherValue = 0;
  purchasedGZRValue = 0;

  constructor(
    private _ngZone: NgZone,
    private http: HttpHelperService,
    private apiRoutingService: ApiRoutingService
  ) { }

  getAccountInfo() {
    if (!this.subscribed) {
      this.subscribed = true;
      this.loadMetaObservable = Observable.interval(5000);
      this.loadMetaSubscription$ = this.loadMetaObservable.subscribe(x => {
        this.loadMetaCoin();
      });
    }
  }

  unloadAccountInfo() {
    this.loadMetaSubscription$.unsubscribe();
    this.subscribed = false;
  }

  checkIfSubscribed(): boolean {
    return this.subscribed;
  }

  loadMetaCoin() {
    this.checkAndInstantiateWeb3()
      .then((status: boolean) => {
        this.onReady();
        this.validNetwork = status;
        this.validNetworkSubject.next(this.validNetwork);
      })
      .catch(() => {
        this.validNetwork = false;
        this.validNetworkSubject.next(this.validNetwork);
      });
  }

  checkAndInstantiateWeb3() {
    return new Promise((resolve, reject) => {
      if (typeof window.web3 !== 'undefined') {
        this.installed = true;
        this.installedSubject.next(this.installed);
        this.web3 = new Web3(window.web3.currentProvider);

        window.web3.version.getNetwork((err, netId) => {
          switch (netId) {
            case '3':
              resolve(true);
              break;
            default:
              resolve(false);
          }
        });
      } else {
        this.installed = false;
        this.installedSubject.next(this.installed);
        reject(false);
      }
    });
  }

  onReady() {
    this.GzrToken.setProvider(this.web3.currentProvider);
    this.StandardToken.setProvider(this.web3.currentProvider);
    this.GZRTokenToItemGeneration.setProvider(this.web3.currentProvider);

    this.web3.eth.getAccounts((err, accs) => {

      this.installed = true;
      this.installedSubject.next(this.installed);

      if (accs.length === 0) {
        this.unlocked = false;
        this.unlockedSubject.next(this.unlocked);
        return;
      }

      this.unlocked = true;
      this.unlockedSubject.next(this.unlocked);
      this.accounts = accs;
      this.account = this.accounts[0];
      this.accountSubject.next(this.account);
      this.refreshBalance();
    });
  }

  createGZR() {
    let gzr;
    return this.GzrToken
      .deployed()
      .then(instance => {
        gzr = instance;
        gzr.mintTokens.call(this.account, 2000);
      })
      .then(() => {
        return gzr.balanceOf(this.account);
      })
      .then(value => {
      })
      .catch(e => {
        this.setStatus('Error getting balance; see log.');
      });
  }

  getBalance(address) {
    return new Promise((resolve, reject) => {
      this.web3.eth.getBalance(address, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(this.web3.fromWei(result, 'ether').toString(10));
        }
      });
    });
  }

  balanceOf(address) {
    if (this.validNetwork === false) {
      return;
    }
    return this.GzrToken.deployed()
      .then(instance => {
        this.contractAddress = instance.address;
        this.contractAddressSubject.next(this.contractAddress);
        return instance.balanceOf(address);
      });
  }

  refreshBalance() {
    if (this.validNetwork === false) {
      return;
    }
    this.getBalance(this.account)
      .then(balance => {
        this.balance = parseFloat(balance.toString());
        this.balanceSubject.next(this.balance);
      });

    this.balanceOf(this.account)
      .then(balance => {
        this.gzrBalance = Number(balance.toString()) / 1000000;
        this.gzrBalanceSubject.next(this.gzrBalance);
      });
  }

  setStatus(message) {
    this.status = message;
  }

  checkTransactionStatus(transactionId) {
    this.checkTxStatusObservable = Observable.interval(3000);
    return new Promise((resolve, reject) => {
      this.checkTxStatusSusbscription$ = this.checkTxStatusObservable.subscribe(() => {
        this.checkTransaction(transactionId, resolve, reject);
      });
    });
  }

  checkTransaction(txId, resolve, reject) {
    this.web3.eth.getTransactionReceipt(txId, (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res == null) {
          this.transactionId = txId;
          this.transactionIdSubject.next(this.transactionId);
          return;
        } else if (res.status === 1) {
          resolve({ 'success': true, 'transaction': txId, 'etherValue': this.purchasedEtherValue, 'gzrValue': this.purchasedGZRValue });
          this.checkTxStatusSusbscription$.unsubscribe();
        } else {
          resolve({ 'success': false, 'transaction': txId, 'etherValue': this.purchasedEtherValue, 'gzrValue': this.purchasedGZRValue });
          this.checkTxStatusSusbscription$.unsubscribe();
        }
        this.refreshBalance();
      }
    });
  }

  TransferEthToBuyGzr(ethValue, gzrValue) {
    if (this.validNetwork === false) {
      return;
    }

    let gzr;
    return new Promise((resolve, reject) => {
      this.GzrToken
        .deployed()
        .then(instance => {
          gzr = instance;
          gzr.sendTransaction({
            from: this.account, to: this.contractAddress, value: this.web3.toWei(ethValue, 'ether')
          }, (error, transactionId) => {
            if (error) {
              reject({ 'failure': true });
            } else {
              resolve({ 'success': true, 'transaction': transactionId });
            }
          });
        })
        .catch(e => {
          reject({ 'failure': true });
          this.setStatus('Error getting balance; see log.');
        });
    });
  }

  SignInTransaction() {
    if (this.validNetwork === false) {
      return;
    }

    let gzr;
    return new Promise((resolve, reject) => {
      this.GzrToken
        .deployed()
        .then(instance => {
          gzr = instance;
		  /* tslint:disable:max-line-length */
          const hex_string = this.web3.fromAscii(`The Gizer Token Sale \r\n
PLEASE READ THIS AGREEMENT CAREFULLY. NOTE THAT SECTION 11 CONTAINS A BINDING ARBITRATION CLAUSE AND CLASS ACTION WAIVER, WHICH AFFECT YOUR LEGAL RIGHTS. IF YOU DO NOT AGREE TO THIS AGREEMENT, DO NOT PURCHASE TOKENS.

Your purchase of GZR Tokens ('GZR' or 'Tokens') from Gizer Inc. ('Gizer' 'we,' 'us,' 'our,' or the 'Company') is subject to this Service Agreement and Terms of Token Sale ('Agreement'). Each of you and the Company are a 'Party,' and together are the 'Parties.' This Agreement takes effect once you deliver funds in exchange for Tokens (the 'Effective Date'). You represent to us that you are lawfully able to enter into contracts (e.g., you are not a minor). If you are entering into this Agreement for an entity, such as the company you work for, you represent to us that you have legal authority to bind that entity. Section 12 contains the definitions of certain capitalized terms used in this Agreement. Though you should read and understand this entire document before agreeing to its terms, you should pay particular attention to those terms written in ALL CAPITAL LETTERS.

1.GENERAL
2.Terms.
You will adhere to all Gizer rules and regulations applicable to your purchase of GZR, including the Policies as defined in Section 11. If you did not understand any of the concepts identified in the risk disclosure in Section 8 or Appendix A, you have contacted us via email at support@gizer.io or via telephone and we have explained them to your satisfaction.

3.Tokens.
Tokens will be ERC-20 standard Ethereum tokens. Tokens will be used to unlock digital goods on digital avatars and to pay for fees or commissions on the Gizer global gaming network, a peer-to-peer network that allows gamers, hosts, small businesses, freelancing services and venues to participate in eSports activity.

4.OFFERING
5.Service.
We agree to publish the Distribution Smart Contract that will allow you to purchase from us, on the terms set forth herein, the GZR. Your purchase is final. We will not provide any refund of amounts sent to the Distribution Smart Contract under any circumstances, subject to Section 3.4. Upon publication of the Distribution Smart Contract address, you may purchase GZR by sending ether ('ETH') to the Distribution Smart Contract. Tokens will be purchased at a rate as set forth below in Section 2.1.(a):

6.Tokens sold for an amount up to 2,300 ETH in the aggregate (the 'Presale Cap'), shall initially be sold through a presale (the 'Presale'). The first 100 purchasers during the Presale may purchase Tokens at a rate of 1,150 GZR per ETH. To the extent the Presale Cap is not reached by the first 100 purchasers’ purchases, then the next 400 purchasers during the Presale may purchase Tokens at a rate of 1,100 GZR per ETH. To the extent the Presale Cap is not reached by the first 500 purchasers’ purchases, then additional purchasers may purchase Tokens during the Presale at a rate of 1,075 GZR per ETH, up to the Presale Cap. Following the Presale, the Company shall sell additional Tokens beginning in December 2017. The first 500 purchasers following the Presale may purchase Tokens at a rate of 1,050 GZR per ETH, and the following purchasers may purchase Tokens at a rate of 1,000 GZR per ETH.

7.Delivery Date.
The Distribution Smart Contract will make Tokens available to you immediately upon purchase.

8.Delivery Method.
If you purchased GZR with ETH, the Distribution Smart Contract will make available the appropriate amount of GZR on the Ethereum address from which your ether was sent.

9.Third Party.
If you purchase GZR using a third party, that third party is your agent, not ours, for the purpose of the payment of ETH for Tokens. You, not we, are responsible for ensuring that we receive the appropriate amount of ETH. We are not responsible for any loss of funds due in any part to the use of a third party to send or receive ETH for Tokens.

10.SECURITY AND DATA PRIVACY
11.Your Security.
You will implement reasonable and appropriate measures designed to secure access to (i) any device associated with the email address associated with you, and (ii) private keys required to access any relevant blockchain address or your GZR. In the event that you are no longer in possession of any private key or device associated with your provided blockchain address, you understand you may never be able to access your GZR.

12.Additional Information.
You will provide to us, immediately upon our notice of request, information that we, in our sole discretion, deem to be required to maintain compliance with any federal, state or local law, regulation or policy. Such documents include, but are not limited to, passports, driver’s licenses, utility bills, photographs of you, government identification cards, or sworn statements.

13.Your Information.
We may collect information useful or necessary for communicating with you regarding this Agreement, including your name, email address, Ethereum address, physical address, and phone number. However, we will not release your personally-identifying information to any third party without your consent, except as set forth herein or in any Policy.

14.Know Your Customer.
Know Your Customer applies to our Presale purchasers. Within 30 days after the Effective Date, we will engage a third party vendor to run an authorization check on you (a 'KYC Check') to determine your eligibility to purchase GZR. Your Tokens will be locked and have no use until you pass the KYC Check. If you do not pass the KYC Check, then your funds shall either be returned to you or forfeited, at our discretion.

15.YOUR RESPONSIBILITIES
16.Security and Backup.
You are responsible for properly configuring any software in connection with your access to or use of GZR.

17.End User Violations.
You will be deemed to have taken any action that you permit, assist or facilitate any person or entity to take related to this Agreement. You are responsible for End Users’ purchase and use of GZR. You will ensure that all End Users comply with your obligations under this Agreement and that the terms of your agreement with each End User are consistent with this Agreement.

18.End User Support.
You are responsible for providing customer service (if any) to End Users. We do not provide any support or services to End Users unless we have a separate agreement with you or an End User obligating us to provide support or services.

19.Taxes.
You are responsible for complying with all applicable law regarding the payment of taxes related to the purchase of GZR. Gizer is not responsible for your compliance with tax law.

20.TERM TERMINATION
21.Term.
This Agreement will terminate automatically upon the delivery of Tokens to you, subject to restrictions in Section 5.3. We may terminate this Agreement in our sole discretion if you breach any term or Policy.

22.Termination.
This Agreement will terminate automatically upon the delivery of Tokens to you, subject to restrictions in Section 5.3. We may terminate this Agreement in our sole discretion if you breach any term or Policy.

23.Effect of Termination.
Upon any termination of this Agreement: (a) all your rights under this Agreement immediately terminate; (b) you are not entitled to a refund of any amount paid; (c) you will immediately return or, if instructed by us, destroy all Gizer Content in your possession; and (d) Sections 4, 5, 6, 7, 8, 9 and 10 will continue to apply in accordance with their terms. We will not be liable for any special, incidental or consequential damages you sustain, including, without limitation, any special, incidental or consequential damages due to any loss of credentials, login information or private keys for any website or software or your inability to access any website or account.

24.INDEMNIFICATION
25.General.
You will defend, indemnify, and hold harmless us, our affiliates and licensors, and each of their respective employees, officers, directors, and representatives from and against any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising out of or relating to any third party claim concerning this Agreement or your use of GZR, whether or not the GZR was sold to you under this Agreement. If we or our affiliates are obligated to respond to a third party subpoena or other compulsory legal order or process described above, you will also reimburse us for reasonable attorneys’ fees, as well as our employees’ and contractors’ time and materials spent responding to the third party subpoena or other compulsory legal order or process at reasonable hourly rates.

26.Process.
We will promptly notify you of any claim subject to Section 7.1, but our failure to promptly notify you will only affect your obligations under Section 7.1 to the extent that our failure prejudices your ability to defend the claim. You may: (a) use counsel of your own choosing (subject to our written consent) to defend against any claim; and (b) settle the claim as you deem appropriate, provided that you obtain our prior written consent before entering into any settlement. We may also assume control of the defense and settlement of the claim at any time.

27.RISKS AND DISCLAIMERS
28.Risks.
YOU understand that blockchain technology, Ethereum AND ether are new and untested technologies outside of Gizer’s control and adverse changes in market forces or technology, broadly construed, will excuse Gizer’s performance under this agreement. IN ADDITION, YOU UNDERSTAND GZR AND BLOCKCHAIN TECHNOLOGY ARE SIMILARLY NEW AND UNTESTED AND ADVERSE CHANGES IN MARKET FORCES OR TO THE UNDERLYING TECHNOLOGY, BROADLY CONSTRUED, WILL EXCUSE Gizer’s PERFORMANCE UNDER THIS AGREEMENT.

In Particular, and in addition to the terms of this document, you assume all risk of loss resulting from, concerning or associated with the risks set forth in the OFFERING DOCUMENTATION, INCLUDING EXHIBIT A TO THIS AGREEMENT.

29.Disclaimers.
GZR ARE DISTRIBUTED BY THE DISTRIBUTION SMART CONTRACT 'AS IS.' WE AND OUR AFFILIATES AND LICENSORS MAKE NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY OR OTHERWISE REGARDING GZR OR THE THIRD PARTY CONTENT, INCLUDING ANY WARRANTY THAT GZR OR THIRD PARTY CONTENT WILL BE UNINTERRUPTED, ERROR FREE OR FREE OF HARMFUL COMPONENTS, OR THAT ANY CONTENT, INCLUDING YOUR CONTENT OR THE THIRD PARTY CONTENT, WILL BE SECURE OR NOT OTHERWISE LOST OR DAMAGED. EXCEPT TO THE EXTENT PROHIBITED BY LAW, WE AND OUR AFFILIATES AND LICENSORS DISCLAIM ALL WARRANTIES, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, SATISFACTORY QUALITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR QUIET ENJOYMENT, AND ANY WARRANTIES ARISING OUT OF ANY COURSE OF DEALING OR USAGE OF TRADE.

WE DO NOT AND WILL NOT PROVIDE YOU WITH ANY SOFTWARE. THE NETWORK WILL DISTRIBUTE GZR TO YOU.

30.LIMITATIONS OF LIABILITY
WE AND OUR AFFILIATES OR LICENSORS WILL NOT BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES (INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, OR DATA), EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHER, NEITHER WE NOR ANY OF OUR AFFILIATES OR LICENSORS WILL BE RESPONSIBLE FOR ANY COMPENSATION, REIMBURSEMENT, OR DAMAGES ARISING IN CONNECTION WITH: (A) YOUR INABILITY TO USE GZR, INCLUDING, WITHOUT LIMITATION, AS A RESULT OF ANY TERMINATION OR SUSPENSION OF THE NETWORK OR THIS AGREEMENT, INCLUDING AS A RESULT OF POWER OUTAGES, MAINTENANCE, DEFECTS, SYSTEM FAILURES OR OTHER INTERRUPTIONS; (B) THE COST OF PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; (C) ANY INVESTMENTS, EXPENDITURES, OR COMMITMENTS BY YOU IN CONNECTION WITH THIS AGREEMENT OR YOUR USE OF OR ACCESS TO ANY GZR; OR (D) ANY UNAUTHORIZED ACCESS TO, ALTERATION OF, OR THE DELETION, DESTRUCTION, DAMAGE, LOSS OR FAILURE TO STORE ANY DATA, INCLUDING RECORDS, PRIVATE KEY OR OTHER CREDENTIALS, ASSOCIATED WITH ANY GZR, WHETHER OR NOT OBTAINED UNDER THIS AGREEMENT.

IN ANY CASE, OUR AND OUR AFFILIATES’ AND LICENSORS’ AGGREGATE LIABILITY UNDER THIS AGREEMENT WILL BE LIMITED TO THE VALUE (IN UNITED STATES DOLLARS AT THE TIME OF THE SALE) YOU PAID US IN EXCHANGE FOR THE OFFERING UNDER THIS AGREEMENT.

YOU WAIVE YOUR RIGHT TO DEMAND the RETURN OF ANY AMOUNTS YOU PAID US FOR THE OFFERING UNDER ANY CIRCUMSTANCES, INCLUDING, WITHOUT LIMITATION, A DEMAND FOR SPECIFIC PERFORMANCE.

31.AMENDMENT
Either party may modify this Agreement with the written approval of the other party. The modified terms will become effective immediately.

32.MISCELLANEOUS
33.Confidentiality and Publicity.
You may use Gizer Confidential Information only in connection with your purchase of GZR under this Agreement and pursuant to the terms of this Agreement. You will not disclose Gizer Confidential Information during the Term or at any time following the end of the Term. You will take all reasonable measures to avoid disclosure, dissemination or unauthorized use of Gizer Confidential Information, including, at a minimum, those measures you take to protect your own confidential information of a similar nature. You will not issue any press release or make any other public communication with respect to this Agreement or your purchase. You will not misrepresent or embellish the relationship between us and you (including by expressing or implying that we support, sponsor, endorse, or contribute to you or your business endeavors), or express or imply any relationship or affiliation between us and you or any other person or entity except as expressly permitted by this Agreement.

34.Force Majeure.
We and our affiliates will not be liable for any delay or failure to perform any obligation under this Agreement where the delay or failure results from any cause beyond our reasonable control, including acts of God, labor disputes or other industrial disturbances, electrical, telecommunications, hardware, software or other utility failures, earthquake, storms or other elements of nature, blockages, embargoes, riots, acts or orders of government, acts of terrorism, or war, changes in blockchain technology (broadly construed), changes in the underlying blockchain or Network protocols or any other force outside of our control.

35.No Third Party Beneficiaries.
This Agreement does not create any third party beneficiary rights in any individual or entity.

36.Import and Export Compliance.
In connection with this Agreement, you will comply with all applicable import, re-import, export, and re-export control and regulations, including the Export Administration Regulations, the International Traffic in Arms Regulations, and country or individual-specific economic sanctions programs implemented by the Office of Foreign Assets Control. For clarity, you are solely responsible for compliance related to the manner in which you choose to use GZR.

37.Notice.
38.To You.
We may provide any notice to you under this Agreement by emailing you or notifying you in person or via telephone. Notices we provide will be effective when sent.

39.To Us.
To give us notice under this Agreement, you must contact Gizer by email at support@gizer.io. Notices to us will be effective one business day after they are sent.

40.Language.
All communications and notices to be made or given pursuant to this Agreement must be in the English language.

41.Assignment.
You will not assign this Agreement, or delegate or sublicense any of your rights under this Agreement, without our prior written consent. Any assignment or transfer in violation of this section will be void. Subject to the foregoing, this Agreement will be binding upon, and inure to the benefit of the parties and their respective successors and assigns.

42.No Waivers.
The failure by us to enforce any provision of this Agreement will not constitute a present or future waiver of such provision nor limit our right to enforce such provision at a later time. All waivers by us must be unequivocal and in writing to be effective.

43.Reformation and Severability.
Except as otherwise set forth herein, if any portion of this Agreement is held to be invalid or unenforceable, the remaining portions of this Agreement will remain in full force and effect. Any invalid or unenforceable portions will be interpreted to effect the intent of the original portion. If such construction is not possible, the invalid or unenforceable portion will be severed from this Agreement, but the rest of the Agreement will remain in full force and effect.

44.Disputes Resolution by Binding Arbitration; Jury Trial Waiver; Class Action Waiver; Limitation of Time.
For any and all controversies, disputes, demands, claims, or causes of action between you and us (including the interpretation and scope of this Section and the arbitrability of the controversy, dispute, demand, claim, or cause of action) relating to GZR or this Agreement (as well as any related or prior agreement that you may have had with us), you and we agree to resolve any such controversy, dispute, demand, claim, or cause of action exclusively through binding and confidential arbitration. The arbitration will take place in the federal judicial district of your residence. As used in this Section, 'we' and 'us' mean Gizer. In addition, 'we' and 'us' include any third party providing any product, service, or benefit in connection with this Agreement (as well as any related or prior agreement that you may have had with us) if such third party is named as a co-party with us in any controversy, dispute, demand, claim, or cause of action subject to this Section.

Arbitration will be subject to the Federal Arbitration Act and not any state arbitration law. The arbitration will be conducted before one commercial arbitrator from the American Arbitration Association ('AAA') with substantial experience in resolving commercial contract disputes. As modified by this Agreement, and unless otherwise agreed upon by the parties in writing, the arbitration will be governed by the AAA’s Commercial Arbitration Rules and, if the arbitrator deems them applicable, the Supplementary Procedures for Consumer Related Disputes (collectively, the 'Rules and Procedures'). Where no claims or counterclaims exceed $10,000, the dispute will be resolved by the submission of documents without a hearing, unless a hearing is requested by a party or deemed necessary by the arbitrator, in which case, a party may elect to participate telephonically.

You should review this provision carefully. To the extent permitted by applicable law, you are GIVING UP YOUR RIGHT TO GO TO COURT to assert or defend your rights EXCEPT for matters that you file in small claims court in the state or municipality of your residence within the jurisdictional limits of the small claims court and as long as such matter is only pending in that court. Additionally, notwithstanding this agreement to arbitrate, claims of defamation, and infringement or misappropriation of the other party’s patent, copyright, trademark, or trade secret shall not be subject to this arbitration agreement. Such claims shall be exclusively brought in the state or federal courts located in the State of New York. Additionally, notwithstanding this agreement to arbitrate, you or we may seek emergency equitable relief before the state or federal courts located in the State of New York in order to maintain the status quo pending arbitration and hereby agree to submit to the exclusive personal jurisdiction of the courts located within the State of New York for such purpose. A request for interim measures shall not be deemed a waiver of the right to arbitrate.

Your rights will be determined by a NEUTRAL ARBITRATOR and NOT a judge or jury. You are entitled to a FAIR HEARING, BUT the arbitration procedures may be SIMPLER AND MORE LIMITED THAN RULES APPLICABLE IN COURT. Arbitrators’ decisions are as enforceable as any court order and are subject to VERY LIMITED REVIEW BY A COURT.

You and we must abide by the following rules: (a) ANY CLAIMS BROUGHT BY YOU OR US MUST BE BROUGHT IN THE PARTY’S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING; (b) THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON’S CLAIMS, MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A REPRESENTATIVE OR CLASS PROCEEDING, AND MAY NOT AWARD CLASS-WIDE RELIEF; (c) in the event that you are able to demonstrate that the costs of arbitration will be prohibitive as compared to the costs of litigation, we will pay as much of your filing and hearing fees in connection with the arbitration as the arbitrator deems necessary to prevent the arbitration from being cost-prohibitive as compared to the cost of litigation, (d) we also reserve the right, in our sole and exclusive discretion, to assume responsibility for any or all of the costs of the arbitration; (e) the arbitrator will honor claims of privilege and privacy recognized at law; (f) the arbitration will be confidential, and neither you nor we may disclose the existence, content, or results of any arbitration, except as may be required by applicable law or for purposes of enforcement of the arbitration award; (g) subject to the limitation of liability provisions of this Agreement, the arbitrator may award any individual relief or individual remedies that are expressly permitted by applicable law; and (h) you and we will pay our respective attorneys’ fees and expenses, unless there is a statutory provision that requires the prevailing party to be paid its fees and litigation expenses and the arbitrator awards such attorneys’ fees and expenses to the prevailing party, and, in such instance, the fees and costs awarded will be determined by the applicable law.

This Section will survive termination of your account and this Agreement as well as any voluntary payment of any debt in full by you or any bankruptcy by you or us. With the exception of subparts (a) and (b) above of this Section (prohibiting arbitration on a class or collective basis), if any part of this arbitration provision is deemed to be invalid, unenforceable, or illegal, or otherwise conflicts with the Rules and Procedures, then the balance of this arbitration provision will remain in effect and will be construed in accordance with its terms as if the invalid, unenforceable, illegal or conflicting part was not contained herein. If, however, either subpart (a) or (b) above of this Section is found to be invalid, unenforceable, or illegal, then the entirety of this arbitration provision will be null and void, and neither you nor we will be entitled to arbitration. If for any reason a claim proceeds in court rather than in arbitration, the dispute shall be exclusively brought in state or federal court located in San Francisco, California.

For more information on the AAA, the Rules and Procedures, or the process for filing an arbitration claim, you may call the AAA at 888-778-7879 or visit the AAA website at http://www.adr.org.

YOU AGREE THAT, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ANY CLAIM OR CAUSE OF ACTION ARISING OUT OF OR RELATING TO THE PURCHASE OR THIS AGREEMENT MUST BE FILED WITHIN ONE (1) YEAR AFTER SUCH CLAIM OR CAUSE OF ACTION AROSE OR IT WILL BE FOREVER BARRED.

45.Entire Agreement; English Language.
This Agreement includes the Policies and is the entire agreement between you and us regarding the subject matter of this Agreement. This Agreement supersedes all prior or contemporaneous representations, understandings, agreements, or communications between you and us, whether written or verbal, regarding the subject matter of this Agreement. Notwithstanding any other agreement between you and us, the security and data privacy provisions in this Agreement contain the Parties’ and their affiliates’ entire obligation regarding the security, privacy and confidentiality of your personal information. We will not be bound by, and specifically object to, any term, condition or other provision which is different from or in addition to the provisions of this Agreement (whether or not it would materially alter this Agreement) and which is submitted by you in any order, receipt, acceptance, confirmation, correspondence or other document. If the terms of this document are inconsistent with the terms contained in any Policy, the terms contained in this document will control. If we provide a translation of the English language version of this Agreement, the English language version of the Agreement will control if there is any conflict.

46.DEFINITIONS
'Gizer Confidential Information' means all nonpublic information disclosed by us, our affiliates, business partners or our or their respective employees, contractors or agents that is designated as confidential or that, given the nature of the information or circumstances surrounding its disclosure, reasonably should be understood to be confidential. Gizer Confidential Information includes: (a) nonpublic information relating to our or our affiliates’ or business partners’ technology, customers, business plans, promotional and marketing activities, finances and other business affairs; (b) third-party information that we are obligated to keep confidential; and (c) the nature, content and existence of any discussions or negotiations between you and us or our affiliates. Gizer Confidential Information does not include any information that: (i) is or becomes publicly available without breach of this Agreement; (ii) can be shown conclusively by documentation to have been known to you at the time of your receipt from us; (iii) is received from a third party who did not acquire or disclose the same by a wrongful or tortious act; or (iv) can be shown conclusively by documentation to have been independently developed by you without reference to the Gizer Confidential Information.

'Gizer Content' means Content we or any of our affiliates make available in connection with this Agreement or on the Gizer Site to allow access to or purchase of GZR. Gizer Content does not include GZR.

'Gizer Site' means Gizer’s website at www.gizer.io and any successor or related site used by us.

'Content' means software (including machine images), data, text, audio, video, images or other content.

'Distribution Smart Contract' means the algorithmic code that distributes GZR to purchasers at a rate of ETH per Token set forth in Section 2.1.1 hereof and sent to the Ethereum address contained within the code.

'End User' means any individual or entity that directly or indirectly through another user purchases GZR on behalf of another person or entity.

'Network' means public blockchain supporting GZR as well as the Distribution Smart Contract.

'Policies' means this Agreement, all policies related to use of our website, and any other policy or terms referenced in or incorporated into this Agreement. Policies does not include whitepapers or other marketing materials referenced on the Gizer Site. In the event of a conflict between any Policy and this Agreement, the terms of this Agreement prevail.

'Suggestions' means all suggested modifications, improvements, additions or subtractions to our business that you provide to us.

'Term' means the term of this Agreement described in Section 5.1.

'Third Party Content' means Content made available to us or to you by any third party, including, without limitation, any price, speed, volume, frequency, or statistical information.

EXHIBIT A
Gizer intends to offer to the public the opportunity to purchase GZR Tokens ('Offering'). The purchase of blockchain tokens by you ('Purchaser') involves a high degree of risk. You should consider carefully the risks described below, together with all of the other information produced as part of the sale of the blockchain tokens, before making a purchase decision. The following risks entail circumstances under which Gizer’s business, financial condition, results of operations and prospects could suffer.

Risks associated with the Tokens and the Gizer Network

Startups including Gizer face a high degree of risk. Participation in token sales by startups including the GZR sale may involve an even higher degree of risk.

Financial and operating risks confronting startups are significant, and Gizer is not immune to these. The startup market in which Gizer competes is highly competitive and the percentage of companies that survive and prosper is small. Startups often experience unexpected problems in the areas of product development, marketing, financing, and general management, among others, which frequently cannot be solved. In addition, startups may require substantial amounts of financing, which may not be available through institutional private placements, the public markets or otherwise. Purchasers participating in the Offering may purchase Tokens that never realize their expected utility.

Gizer may be forced to cease operations or take actions that result in a Dissolution Event.

It is possible that, due to any number of reasons, including, but not limited to, an unfavorable fluctuation in the value of cryptographic and fiat currencies, the failure of commercial relationships, or intellectual property ownership challenges, the Company may no longer be viable to operate and the Company may dissolve or take actions that result in a Dissolution Event.

The tax treatment of the Token distribution is uncertain.

The tax characterization of the Tokens is uncertain, and each Purchaser must seek its own tax advice in connection with the purchase of any Tokens. Each Purchaser should consult with and must rely upon the advice of its own professional tax advisors with respect to the United States and non-U.S. tax treatment of the purchase of the Tokens.

GZR has no history.

GZR will be a newly formed token and has no operating history. Each purchase of GZR should be evaluated on the basis that Gizer or any third party’s assessment of the prospects of the Gizer Network may not prove accurate, and that Gizer may not achieve its business objectives. Past performance of Gizer, or any token similar to GZR, is not predictive of future results.

The Gizer Network may not be widely adopted and may have limited users.

It is possible that the Gizer Network will not be used by a large number of individuals, companies and other entities or that there will be limited public interest in the creation and development the Gizer Network. Such a lack of use or interest could negatively impact the potential utility of the Tokens.

Alternative gaming platforms may be established that compete with or are more widely used than the Gizer Network.

It is possible, and even likely, that alternative gaming platforms could be established which attempt to provide products and services that are materially similar to the Gizer Network’s products and services. Such alternative platforms would compete with the Gizer Network, which could negatively impact the Gizer Network and the Tokens.

Ethereum, the blockchain network on which GZR will depend, may be the target of malicious cyberattacks which may result in security breaches and the loss or theft of Tokens. If Ethereum’s security is compromised or if the Gizer Network is subjected to attacks that frustrate or thwart users’ ability to access the Gizer Network, their Tokens or the Gizer Network products and services, users may cut back on or stop using the Gizer Network altogether, which could seriously curtail the utilization of the Tokens.

Ethereum may be the target of malicious attacks seeking to identify and exploit weaknesses in the software which may result in the loss or theft of Tokens. This may materially and adversely affect the Gizer Network and the utility of the Tokens. In any such event, Purchasers may lose all or some of their Tokens.

If the Gizer Network is unable to satisfy data protection, security, privacy, and other government- and industry-specific requirements, its growth could be harmed.

There are a number of data protection, security, privacy and other government- and industry-specific requirements, including those that require companies to notify individuals of data security incidents involving certain types of personal data. Security compromises could harm the Gizer Network’s reputation, erode user confidence in the effectiveness of its security measures, negatively impact its ability to attract new users, or cause existing users to stop using the Gizer Network.

Risks related to blockchain technologies and digital assets.
The regulatory regime governing blockchain technologies, cryptocurrencies, tokens and token offerings (such as Ethereum, the GZR Tokens and this Offering) is uncertain, and new regulations or policies may materially adversely affect the development of Ethereum, the Gizer Network and the utility of the Tokens.

Regulation of tokens (including GZR) and token offerings such as this, cryptocurrencies, blockchain technologies, and cryptocurrency exchanges currently is undeveloped and likely to rapidly evolve, varies significantly among international, federal, state and local jurisdictions and is subject to significant uncertainty. Various legislative and executive bodies in the United States and in other countries may in the future adopt laws, regulations, guidance, or other actions, which may severely impact the development and growth of Ethereum and the adoption and utility of the Tokens. Failure by the Company or users of Ethereum to comply with any laws, rules and regulations, some of which may not exist yet or are subject to interpretation and may be subject to change, could result in a variety of adverse consequences, including civil penalties and fines.

As blockchain networks and blockchain assets have grown in popularity and in market size, federal and state agencies have begun to take interest in, and in some cases regulate, their use and operation. In the case of virtual currencies, state regulators like the New York Department of Financial Services have created new regulatory frameworks. Others, like Texas, have published guidance on how their existing regulatory regimes apply to virtual currencies. Some states, like New Hampshire, North Carolina, and Washington, have amended their statutes to include virtual currencies in existing licensing regimes. Treatment of virtual currencies continues to evolve under federal law as well. The Department of the Treasury, the Securities and Exchange Commission (the 'SEC') and the Commodity Futures Trading Commission (the 'CFTC'), for example, have published guidance on the treatment of virtual currencies. The Internal Revenue Service released guidance treating virtual currency as property that is not currency for US federal income tax purposes, although there is no indication yet whether other courts or federal or state regulators will follow this classification. Both federal and state agencies have instituted enforcement actions against those violating such agencies’ interpretation of existing laws.

The regulation of non-currency use of blockchain assets is also uncertain. The CFTC has publicly taken the position that certain blockchain assets are commodities, and the SEC has issued a public report stating federal securities laws require treating some blockchain assets as securities. To the extent that a domestic government or quasi-governmental agency exerts regulatory authority over a blockchain network or asset, Ethereum and the Tokens may be materially and adversely affected.

Blockchain networks also face an uncertain regulatory landscape in many foreign jurisdictions such as the European Union, China and Russia. Various foreign jurisdictions may, in the near future, adopt laws, regulations or directives that affect Ethereum. Such laws, regulations or directives may conflict with those of the United States or may directly and negatively impact Gizer’s business. The effect of any future regulatory change is impossible to predict, but such change could be substantial and materially adverse to the development and growth of the Ethereum and the adoption and utility of the Tokens.

New or changing laws and regulations or interpretations of existing laws and regulations, in the United States and other jurisdictions, may materially and adversely impact the value of the currency in which the Tokens may be exchanged, the liquidity of the Tokens, the ability to access marketplaces or exchanges on which to trade the Tokens, and the structure, rights and transferability of Tokens.

This Issuance of GZR May Constitute the Issuance of a 'Security' Under U.S. Federal Securities Laws.

GZR is a utility token that has a specific consumptive use – i.e. it allows participants in to gain access to the Gizer Network and the Gizer Global Identity ('GG ID') system and unlock profile items which attach to a Gizer user’s GG ID and to do so on a distributed network with significant advantages over current gaming platforms. Due to the nature of GZR, we do not think it should be considered a 'security' as that term is defined in the Act. Gizer has not received any opinion from a federal or state regulator that GZR is or is not a security.

On July 25, 2017, the SEC issued a Report of Investigation (the 'Report') under Section 21(a) of the Securities Exchange Act of 1934 (the 'Exchange Act') describing an SEC investigation of The DAO, a virtual organization, and its use of distributed ledger or blockchain technology to facilitate the offer and sale of DAO Tokens to raise capital. The SEC applied existing U.S. federal securities laws to this new paradigm, determining that DAO Tokens were securities. The SEC stressed that those who offer and sell securities in the U.S. are required to comply with federal securities laws, regardless of whether those securities are purchased with virtual currencies or distributed with blockchain technology. The SEC’s announcement, and the related Report, may be found here: https://www.sec.gov/news/press-release/2017-131.

After reviewing the Report, Gizer believes that GZR is substantially different from DAO Tokens, and should not be considered a 'security' under U.S. federal securities laws. Nevertheless, as noted by the SEC, the issuance of tokens represents a new paradigm and the application of the federal securities laws to this new paradigm is very fact specific. If GZR were deemed to be a security under U.S. federal securities laws then Purchaser may have certain transfer restrictions regarding the Tokens.

The further development and acceptance of blockchain networks, including the Ethereum Network, which are part of a new and rapidly changing industry, are subject to a variety of factors that are difficult to evaluate. The slowing or stopping of the development or acceptance of blockchain networks and blockchain assets would have a material adverse effect on the successful development and adoption of the Gizer Network and the Tokens.

The growth of the blockchain industry in general, as well as the blockchain networks on which GZR and the Gizer Network will rely, is subject to a high degree of uncertainty. The factors affecting the further development of the cryptocurrency industry, as well as blockchain networks, include, without limitation:

Worldwide growth in the adoption and use of blockchain technologies;
Government and quasi-government regulation of blockchain assets and their use, or restrictions on or regulation of access to and operation of blockchain networks or similar systems;
The maintenance and development of the open-source software protocol of blockchain networks;
Changes in consumer demographics and public tastes and preferences;
The availability and popularity of other forms or methods of buying and selling goods and services, or trading assets including new means of using fiat currencies or existing networks;
General economic conditions and the regulatory environment relating to cryptocurrencies; or
A decline in the popularity or acceptance of blockchain networks.
The slowing or stopping of the development, general acceptance and adoption and usage of blockchain networks and blockchain assets may deter or delay the acceptance and adoption of the Gizer Network and the Tokens.

The prices of blockchain assets are extremely volatile. Fluctuations in the price of digital assets could materially and adversely affect our business, and the Tokens may also be subject to significant price volatility.

The prices of blockchain assets such as Bitcoin have historically been subject to dramatic fluctuations and are highly volatile, and the market price of the Tokens may also be highly volatile. Several factors may influence the market price of the Tokens, including, but not limited to:

Global blockchain asset supply;
Global blockchain asset demand, which can be influenced by the growth of retail merchants' and commercial businesses' acceptance of blockchain assets like cryptocurrencies as payment for goods and services, the security of online blockchain asset exchanges and digital wallets that hold blockchain assets, the perception that the use and holding of blockchain assets is safe and secure, and the regulatory restrictions on their use;
Changes in the rights, obligations, incentives, or rewards for the various participants in the Gizer Network;
Interest rates;
Currency exchange rates, including the rates at which digital assets may be exchanged for fiat currencies;
Fiat currency withdrawal and deposit policies of blockchain asset exchanges on which the Tokens may be traded and liquidity on such exchanges;
Interruptions in service from or failures of major blockchain asset exchanges on which the Tokens may be traded;
Investment and trading activities of large investors, including private and registered funds, that may directly or indirectly invest in the Tokens or other blockchain assets;
Investors’ expectations with respect to the rate of inflation;
Monetary policies of governments, trade restrictions, currency devaluations and revaluations;
Regulatory measures, if any, that affect the use of blockchain assets such as the Tokens;
The maintenance and development of Ethereum and the Gizer Network;
Global or regional political, economic or financial events and situations; or
Expectations among Gizer Network participants that the value of the Tokens or other blockchain assets will soon change.
A decrease in the price of a single blockchain asset may cause volatility in the entire blockchain asset industry and may affect other blockchain assets including the Tokens. For example, a security breach that affects investor or user confidence in Bitcoin may affect the industry as a whole and may also cause the price of the Tokens and other blockchain assets to fluctuate.

The Offering involves unanticipated Risks.

Cryptocurrency is a new and untested technology. In addition to the risks set forth above, there are risks inherent in GZR, Ethereum and the Gizer Network that cannot be anticipated. Risks may further materialize as unanticipated combinations or variations of the risks set forth above. The Risk Factors set forth above do not purport to advise of all of the risks and other significant aspects of the Offering. Purchasers should also consider any additional risks and considerations relating to the Offering and should consult legal, tax, financial and other advisors before participating in the Offering.`).toString();
          /* tslint:enable:max-line-length */
          this.web3.personal.sign(hex_string, this.account, (error, result) => {
            if (error) {
              reject({
                'failure': true
              });
            } else {
              this.signTransactionPending = this.signTransactionPending + 1;
              this.signTransactionPendingSubject.next(this.signTransactionPending);
              gzr.balanceOf(this.account)
                .then((value) => {
                  resolve({
                    'success': true,
                    'token': result,
                    'account': this.account,
                    'ammount': Number(value.toString()) / 1000000
                  });
                  this.refreshBalance();
                })
                .catch((err) => {
                  reject({ 'failure': true });
                });
            }
          });
        })
        .catch(e => {
          reject({ 'failure': true });
          this.setStatus('Error getting balance; see log.');
        });
    });
  }


  getTokenContract() {
    if (this.validNetwork === false) {
      return;
    }
    return this.StandardToken.deployed();
  }

  getStandardContract() {
    if (this.validNetwork === false) {
      return;
    }
    return this.GZRTokenToItemGeneration.deployed();
  }
  getItemGenerationContract() {
    if (this.validNetwork === false) {
      return;
    }
    return this.GZRTokenToItemGeneration.deployed();
  }



  approveGZRSpending(amount) {
    let gzr;
    return new Promise((resolve, reject) => {
      this.getTokenContract()
        .then(ins => {
          gzr = ins;
          return this.getItemGenerationContract();
        })
        .then(instance => {
          return gzr.approve(instance.address, amount, { from: this.account, gas: 41000 });
        })
        .then(t => {
          resolve(t);
        })
        .catch(e => {
          this.setStatus('Error in GZR approval');
        });
    });
  }

  generateItem() {
    return new Promise((resolve, reject) => {
      this.getItemGenerationContract()
        .then(instance => {
          return instance.spendGZRToGetAnItem.sendTransaction({
            from: this.account, gas: 41000, to: instance.address
          });
        })
        .then(tx => {
          this.treasureTransactionSubject.next(tx);
          resolve(tx);
        })
        .catch(e => {
          reject({ 'failure': true });
          this.setStatus('Error in item generation');
        });
    });
  }

}
