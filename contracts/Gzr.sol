pragma solidity ^0.4.19;

// ----------------------------------------------------------------------------
//
// GZR 'Gizer Gaming' token public sale contract
//
// For details, please visit: http://www.gizer.io
//
// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
//
// SafeMath (division not needed)
//
// ----------------------------------------------------------------------------

library SafeMath {

  function add(uint a, uint b) internal pure returns (uint c) {
    c = a + b;
    require( c >= a );
  }

  function sub(uint a, uint b) internal pure returns (uint c) {
    require( b <= a );
    c = a - b;
  }

  function mul(uint a, uint b) internal pure returns (uint c) {
    c = a * b;
    require( a == 0 || c / a == b );
  }

}


// ----------------------------------------------------------------------------
//
// Owned contract
//
// ----------------------------------------------------------------------------

contract Owned {

  address public owner;
  address public newOwner;

  mapping(address => bool) public isAdmin;

  // Events ---------------------------

  event OwnershipTransferProposed(address indexed _from, address indexed _to);
  event OwnershipTransferred(address indexed _from, address indexed _to);
  event AdminChange(address indexed _admin, bool _status);

  // Modifiers ------------------------

  modifier onlyOwner { require( msg.sender == owner ); _; }
  modifier onlyAdmin { require( isAdmin[msg.sender] ); _; }

  // Functions ------------------------

  function Owned() public {
    owner = msg.sender;
    isAdmin[owner] = true;
  }

  function transferOwnership(address _newOwner) public onlyOwner {
    require( _newOwner != address(0x0) );
    OwnershipTransferProposed(owner, _newOwner);
    newOwner = _newOwner;
  }

  function acceptOwnership() public {
    require(msg.sender == newOwner);
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
  
  function addAdmin(address _a) public onlyOwner {
    require( isAdmin[_a] == false );
    isAdmin[_a] = true;
    AdminChange(_a, true);
  }

  function removeAdmin(address _a) public onlyOwner {
    require( isAdmin[_a] == true );
    isAdmin[_a] = false;
    AdminChange(_a, false);
  }
  
}


// ----------------------------------------------------------------------------
//
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
//
// ----------------------------------------------------------------------------

contract ERC20Interface {

  // Events ---------------------------

  event Transfer(address indexed _from, address indexed _to, uint _value);
  event Approval(address indexed _owner, address indexed _spender, uint _value);

  // Functions ------------------------

  function totalSupply() public view returns (uint);
  function balanceOf(address _owner) public view returns (uint balance);
  function transfer(address _to, uint _value) public returns (bool success);
  function transferFrom(address _from, address _to, uint _value) public returns (bool success);
  function approve(address _spender, uint _value) public returns (bool success);
  function allowance(address _owner, address _spender) public view returns (uint remaining);

}


// ----------------------------------------------------------------------------
//
// ERC Token Standard #20
//
// ----------------------------------------------------------------------------

contract ERC20Token is ERC20Interface, Owned {
  
  using SafeMath for uint;

  uint public tokensIssuedTotal = 0;
  mapping(address => uint) balances;
  mapping(address => mapping (address => uint)) allowed;

  // Functions ------------------------

  /* Total token supply */

  function totalSupply() public view returns (uint) {
    return tokensIssuedTotal;
  }

  /* Get the account balance for an address */

  function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
  }

  /* Transfer the balance from owner's account to another account */

  function transfer(address _to, uint _amount) public returns (bool success) {
    // amount sent cannot exceed balance
    require( balances[msg.sender] >= _amount );

    // update balances
    balances[msg.sender] = balances[msg.sender].sub(_amount);
    balances[_to]        = balances[_to].add(_amount);

    // log event
    Transfer(msg.sender, _to, _amount);
    return true;
  }

  /* Allow _spender to withdraw from your account up to _amount */

  function approve(address _spender, uint _amount) public returns (bool success) {
    // approval amount cannot exceed the balance
    require( balances[msg.sender] >= _amount );
      
    // update allowed amount
    allowed[msg.sender][_spender] = _amount;
    
    // log event
    Approval(msg.sender, _spender, _amount);
    return true;
  }

  /* Spender of tokens transfers tokens from the owner's balance */
  /* Must be pre-approved by owner */

  function transferFrom(address _from, address _to, uint _amount) public returns (bool success) {
    // balance checks
    require( balances[_from] >= _amount );
    require( allowed[_from][msg.sender] >= _amount );

    // update balances and allowed amount
    balances[_from]            = balances[_from].sub(_amount);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);
    balances[_to]              = balances[_to].add(_amount);

    // log event
    Transfer(_from, _to, _amount);
    return true;
  }

  /* Returns the amount of tokens approved by the owner */
  /* that can be transferred by spender */

  function allowance(address _owner, address _spender) public view returns (uint remaining) {
    return allowed[_owner][_spender];
  }

}


// ----------------------------------------------------------------------------
//
// GZR public token sale
//
// ----------------------------------------------------------------------------

contract GizerToken is ERC20Token {

  /* Utility variable */
  
  uint constant E6  = 10**6;

  /* Basic token data */

  string public constant name     = "Gizer Gaming Token";
  string public constant symbol   = "GZR";
  uint8  public constant decimals = 6;

  /* Wallets */
  
  address public wallet;
  address public redemptionWallet;
  address public gizerItemsContract;

  /* Crowdsale parameters (constants) */

  uint public constant DATE_ICO_START = 152112400; // 15-Mar-2018 14:00 UTC 10:00 EST
  uint public constant DATE_ICO_END   = 1523368800; // 10-Apr-2018 14:00 UTC 10:00 EST

  uint public constant TOKEN_SUPPLY_TOTAL = 10000000 * E6;
  uint public constant TOKEN_SUPPLY_CROWD =  6112926 * E6;
  uint public constant TOKEN_SUPPLY_OWNER =  3887074 * E6; // 2,000,000 tokens reserve
                                                           // 1,887,074 presale tokens

  uint public constant MIN_CONTRIBUTION = 1 ether / 100;  
  
  uint public constant TOKENS_PER_ETH = 1000;
  
  uint public constant DATE_TOKENS_UNLOCKED = 1539180000; // 10-OCT-2018 14:00 UTC 10:00 EST
  
  /* Crowdsale variables */

  uint public tokensIssuedCrowd  = 0;
  uint public tokensIssuedOwner  = 0;
  uint public tokensIssuedLocked = 0;
  
  uint public etherReceived = 0; // does not include presale ethers

  /* Keep track of + ethers contributed,
                   + tokens received 
                   + tokens locked during Crowdsale */
  
  mapping(address => uint) public etherContributed;
  mapping(address => uint) public tokensReceived;
  mapping(address => uint) public locked;
  
  // Events ---------------------------
  
  event WalletUpdated(address _newWallet);
  event GizerItemsContractUpdated(address _GizerItemsContract);
  event RedemptionWalletUpdated(address _newRedemptionWallet);
  event EthCentsUpdated(uint _cents);
  event TokensIssuedCrowd(address indexed _recipient, uint _tokens, uint _ether);
  event TokensIssuedOwner(address indexed _recipient, uint _tokens, bool _locked);
  event ItemsBought(address indexed _recipient, uint _lastIdx, uint _number);

  // Basic Functions ------------------

  /* Initialize */

  function GizerToken() public {
    require( TOKEN_SUPPLY_OWNER + TOKEN_SUPPLY_CROWD == TOKEN_SUPPLY_TOTAL );
    wallet = owner;
    redemptionWallet = owner;
  }

  /* Fallback */
  
  function () public payable {
    buyTokens();
  }

  // Information Functions ------------
  
  /* What time is it? */
  
  function atNow() public view returns (uint) {
    return now;
  }

  /* Are tokens tradeable */
  
  function tradeable() public view returns (bool) {
    if (atNow() > DATE_ICO_END) return true ;
    return false;
  }
  
  /* Available to mint by owner */
  
  function availableToMint() public view returns (uint available) {
    if (atNow() <= DATE_ICO_END) {
      available = TOKEN_SUPPLY_OWNER.sub(tokensIssuedOwner);
    } else {
      available = TOKEN_SUPPLY_TOTAL.sub(tokensIssuedTotal);
    }
  }
  
  /* Unlocked tokens in an account */
  
  function unlockedTokens(address _account) public view returns (uint _unlockedTokens) {
    if (atNow() <= DATE_TOKENS_UNLOCKED) {
      return balances[_account] - locked[_account];
    } else {
      return balances[_account];
    }
  }

  // Owner Functions ------------------
  
  /* Change the crowdsale wallet address */

  function setWallet(address _wallet) public onlyOwner {
    require( _wallet != address(0x0) );
    wallet = _wallet;
    WalletUpdated(_wallet);
  }

  /* Change the redemption wallet address */

  function setRedemptionWallet(address _wallet) public onlyOwner {
    require( _wallet != address(0x0) );
    redemptionWallet = _wallet;
    RedemptionWalletUpdated(_wallet);
  }
  
  /* Change the redemption wallet address */

  function setGizerItemsContract(address _contract) public onlyOwner {
    require( _contract != address(0x0) );
    gizerItemsContract = _contract;
    GizerItemsContractUpdated(_contract);
  }
  
  /* Minting of tokens by owner */

  function mintTokens(address _account, uint _tokens) public onlyOwner {
    // check token amount
    require( _tokens <= availableToMint() );
    
    // update
    balances[_account] = balances[_account].add(_tokens);
    tokensIssuedOwner  = tokensIssuedOwner.add(_tokens);
    tokensIssuedTotal  = tokensIssuedTotal.add(_tokens);
    
    // log event
    Transfer(0x0, _account, _tokens);
    TokensIssuedOwner(_account, _tokens, false);
  }

  /* Minting of tokens by owner */

  function mintTokensLocked(address _account, uint _tokens) public onlyOwner {
    // check token amount
    require( _tokens <= availableToMint() );
    
    // update
    balances[_account] = balances[_account].add(_tokens);
    locked[_account]   = locked[_account].add(_tokens);
    tokensIssuedOwner  = tokensIssuedOwner.add(_tokens);
    tokensIssuedTotal  = tokensIssuedTotal.add(_tokens);
    tokensIssuedLocked = tokensIssuedLocked.add(_tokens);
    
    // log event
    Transfer(0x0, _account, _tokens);
    TokensIssuedOwner(_account, _tokens, true);
  }  
  
  /* Transfer out any accidentally sent ERC20 tokens */

  function transferAnyERC20Token(address tokenAddress, uint amount) public onlyOwner returns (bool success) {
      return ERC20Interface(tokenAddress).transfer(owner, amount);
  }

  // Private functions ----------------

  /* Accept ETH during crowdsale (called by default function) */

  function buyTokens() private {
    
    // basic checks
    require( atNow() > DATE_ICO_START && atNow() < DATE_ICO_END );
    require( msg.value >= MIN_CONTRIBUTION );
    
    // check token volume
    uint tokensAvailable = TOKEN_SUPPLY_CROWD.sub(tokensIssuedCrowd);
    uint tokens = msg.value.mul(TOKENS_PER_ETH) / 10**12;
    require( tokens <= tokensAvailable );
    
    // issue tokens
    balances[msg.sender] = balances[msg.sender].add(tokens);
    
    // update global tracking variables
    tokensIssuedCrowd  = tokensIssuedCrowd.add(tokens);
    tokensIssuedTotal  = tokensIssuedTotal.add(tokens);
    etherReceived      = etherReceived.add(msg.value);
    
    // update contributor tracking variables
    etherContributed[msg.sender] = etherContributed[msg.sender].add(msg.value);
    tokensReceived[msg.sender]   = tokensReceived[msg.sender].add(tokens);
    
    // transfer Ether out
    if (this.balance > 0) wallet.transfer(this.balance);

    // log token issuance
    TokensIssuedCrowd(msg.sender, tokens, msg.value);
    Transfer(0x0, msg.sender, tokens);
  }

  // ERC20 functions ------------------

  /* Override "transfer" */

  function transfer(address _to, uint _amount) public returns (bool success) {
    require( tradeable() );
    require( unlockedTokens(msg.sender) >= _amount );
    return super.transfer(_to, _amount);
  }
  
  /* Override "transferFrom" */

  function transferFrom(address _from, address _to, uint _amount) public returns (bool success) {
    require( tradeable() );
    require( unlockedTokens(_from) >= _amount ); 
    return super.transferFrom(_from, _to, _amount);
  }

  // Bulk token transfer function -----

  /* Multiple token transfers from one address to save gas */

  function transferMultiple(address[] _addresses, uint[] _amounts) external {
    require( tradeable() );
    require( _addresses.length == _amounts.length );
    require( _addresses.length <= 100 );
    
    uint i;
    
    // check token amounts
    uint tokens_to_transfer = 0;
    for (i = 0; i < _addresses.length; i++) {
      tokens_to_transfer = tokens_to_transfer.add(_amounts[i]);
    }
    require( tokens_to_transfer <= unlockedTokens(msg.sender) );
    
    // do the transfers
    for (i = 0; i < _addresses.length; i++) {
      super.transfer(_addresses[i], _amounts[i]);
    }
  }
  
  // Functions to convert GZR to Gizer items -----------
  
  /* GZR token owner buys one Gizer Item */ 
  
  function buyItem() public returns (uint idx) {
    super.transfer(redemptionWallet, E6);
    idx = mintItem(msg.sender);

    // event
    ItemsBought(msg.sender, idx, 1);
  }
  
  /* GZR token owner buys several Gizer Items (max 100) */ 
  
  function buyMultipleItems(uint8 _items) public returns (uint idx) {
    
    // between 0 and 100 items
    require( _items > 0 && _items <= 100 );

    // transfer GZR tokens to redemption wallet
    super.transfer(redemptionWallet, _items * E6);
    
    // mint tokens, returning indexes of first and last item minted
    for (uint i = 0; i < _items; i++) {
      idx = mintItem(msg.sender);
    }

    // event
    ItemsBought(msg.sender, idx, _items);
  }

  /* Internal function to call */
  
  function mintItem(address _owner) internal returns(uint idx) {
    GizerItemsInterface g = GizerItemsInterface(gizerItemsContract);
    idx = g.mint(_owner);
  }
  
}


// ----------------------------------------------------------------------------
//
// GZR Items interface
//
// ----------------------------------------------------------------------------

contract GizerItemsInterface is Owned {

  function mint(address _to) public onlyAdmin returns (uint idx);

}


// ----------------------------------------------------------------------------
//
// Gizer Items - ERC721(ish) contract
//
// ----------------------------------------------------------------------------



// ----------------------------------------------------------------------------
//
// ERC721(ish) Token Interface 
//
// ----------------------------------------------------------------------------


interface ERC721Interface /* is ERC165 */ {

    event Transfer(address indexed _from, address indexed _to, uint256 _deedId);
    event Approval(address indexed _owner, address indexed _approved, uint256 _deedId);
    event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved);

    function balanceOf(address _owner) external view returns (uint256 _balance);
    function ownerOf(uint256 _deedId) external view returns (address _owner);
    function transfer(address _to, uint256 _deedId) external;                    // removed payable
    function transferFrom(address _from, address _to, uint256 _deedId) external; // removed payable
    function approve(address _approved, uint256 _deedId) external;               // removed payable
    // function setApprovalForAll(address _operateor, boolean _approved);        // removed payable
    // function supportsInterface(bytes4 interfaceID) external view returns (bool);
}

interface ERC721Metadata /* is ERC721 */ {
    function name() external pure returns (string _name);
    function symbol() external pure returns (string _symbol);
    function deedUri(uint256 _deedId) external view returns (string _deedUri);
}

interface ERC721Enumerable /* is ERC721 */ {
    function totalSupply() external view returns (uint256 _count);
    function deedByIndex(uint256 _index) external view returns (uint256 _deedId);
    function countOfOwners() external view returns (uint256 _count);
    // function ownerByIndex(uint256 _index) external view returns (address _owner);
    // function deedOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 _deedId);
}


// ----------------------------------------------------------------------------
//
// ERC721 Token
//
// ----------------------------------------------------------------------------

contract ERC721Token is ERC721Interface, ERC721Metadata, ERC721Enumerable, Owned {
  
  using SafeMath for uint;

  uint public ownerCount = 0;
  uint public deedCount = 0;
  
  mapping(address => uint) public balances;
  mapping(uint => address) public mIdOwner;
  mapping(uint => address) public mIdApproved;

  // Required Functions ------------------------

  /* Get the number of tokens held by an address */

  function balanceOf(address _owner) external view returns (uint balance) {
    balance = balances[_owner];
  }

  /* Get the owner of a certain token */

  function ownerOf(uint _id) external view returns (address owner) {
    owner = mIdOwner[_id];
    require( owner != address(0x0) );
  }

  /* Transfer token */
  
  function transfer(address _to, uint _id) external {
    // check ownership and address
    require( msg.sender == mIdOwner[_id] );
    require( _to != address(0x0) );

    // transfer ownership
    mIdOwner[_id] = _to;
    mIdApproved[_id] = address(0x0);

    // update balances
    updateBalances(msg.sender, _to);

    // register event
    Transfer(msg.sender, _to, _id);
  }

  /* Transfer from */
  
  function transferFrom(address _from, address _to, uint _id) external {
    // check if the sender has the right to transfer
    require( _from == mIdOwner[_id] && mIdApproved[_id] == msg.sender );

    // transfer ownership and reset approval (if any)
    mIdOwner[_id] = _to;
    mIdApproved[_id] = address(0x0);

    // update balances
    updateBalances(_from, _to);

    // register event
    Transfer(_from, _to, _id);
  }

  /* Approve token transfer (we do not make it payable) */
  
   function approve(address _approved, uint _id) external {
       require( msg.sender == mIdOwner[_id] );
       require( msg.sender != _approved );
       mIdApproved[_id] = _approved;
       Approval(msg.sender, _approved, _id);
   }

  // Metadata Functions ---------------


  // Enumeration Functions ------------
  
  function totalSupply() external view returns (uint count) {
    count = deedCount;
  }

  function deedByIndex(uint _index) external view returns (uint id) {
    id = _index;
    require( id < deedCount );
  }  
  
  function countOfOwners() external view returns (uint count) {
    count = ownerCount;
  }
  
  // Internal functions ---------------
  
  function updateBalances(address _from, address _to) internal {
    // process from (skip if minted)
    if (_from != address(0x0)) {
      balances[_from]--;
      if (balances[_from] == 0) { ownerCount--; }
    }
    // process to
    balances[_to]++;
    if (balances[_to] == 1) { ownerCount++; }
  }
      
}


// ----------------------------------------------------------------------------
//
// ERC721 Token
//
// ----------------------------------------------------------------------------

contract GizerItems is ERC721Token {

  /* Basic token data */
  
  string constant cName   = "Gizer Item";
  string constant cSymbol = "GZR721";
  
  /* uuid information */

  bytes32[] public code;
  uint[] public weight;
  uint public sumOfWeights;
  
  mapping(bytes32 => uint) public mCodeIndexPlus; // index + 1

  /* Pseudo-randomisation variables */

  uint public nonce = 0;
  uint public lastRandom = 0;
  
  /* mapping from item index to uuid */
  
  mapping(uint => bytes32) mIdxIUuid;
  
  // Events ---------------------------
  
  event MintToken(address indexed minter, address indexed _owner, bytes32 indexed _code, uint _input);
  
  event CodeUpdate(uint8 indexed _type, bytes32 indexed _code, uint _weight, uint _sumOfWeights);
  
  // Basic Functions ------------------
  
  function GizerItems() public {
    //
    // load initial codes
    // 
    addCode("74143b3842ff373eb111d12f1f497611",  500);
    addCode("564b40b09a8239fbbe400e9120b85386", 1120);
    addCode("457c0757d4bc3452853f9b3f48b70899",  500);
    addCode("785ddae3685c3c58bba1566c245e5c72", 1120);
    addCode("28a41f370fcc3b57b854ddd6529b8028", 1120);
    addCode("c1e8314b14dc3ec984b9409da3219371", 1300);
    addCode("eaba91e8e2ce35609c0f5ac992987af8", 1300);
    addCode("48ddee5a71e63d31aafb99adcaa54ed1", 1120);
    addCode("43db1b25e3a13e958eb7346e6f7b69b5", 1300);
    addCode("47e457e721d43d85ab974a0ec3a135a9", 1300);
    addCode("eea5776e85a73e398ae4f030949ac4b4", 1300);
    addCode("0a10e405769d3fd983a70cc3f6a8ac17", 1300);
    addCode("6ed505f443dd3f1fb834ce482fcf15d2",  500);
    addCode("8f7690bbb3053f4ba8548d97cf89c852",  400);
    addCode("69a1dc553de83504aabdb6858f4923d3", 1300);
    addCode("b51f0d6813a73ccb9c9bd741118d622b", 1300);
    addCode("70a34eb62d3234689bd56643cdfb514f",  400);
  }
  
  function () public payable { revert(); }
  
  // Information functions ------------

  function name() external pure returns (string) {
    return cName;
  }
  
  function symbol() external pure returns (string) {
    return cSymbol;
  }
  
  function deedUri(uint _id) external view returns (string) {
    return bytes32ToString(mIdxIUuid[_id]);
  }
  
  function getUuid(uint _id) external view returns (string) {
    require( _id < code.length );
    return bytes32ToString(code[_id]);  
  }

  // Token Minting --------------------
  
  function mint(address _to) public onlyAdmin returns (uint idx) {
    
    // initial checks
    require( sumOfWeights > 0 );
    require( _to != address(0x0) );
    require( _to != address(this) );

    // get random uuid
    bytes32 uuid32 = getRandomUuid();

    // mint token
    deedCount++;
    idx = deedCount;
    mIdxIUuid[idx] = uuid32;

    // update balance and owner count
    updateBalances(address(0x0), _to);
    mIdOwner[idx] = _to;

    // log event and return
    MintToken(msg.sender, _to, uuid32, idx);
  }
  
  // Random
  
  function getRandomUuid() internal returns (bytes32) {
    // case where there is only one item type
    if (code.length == 1) return code[0];

    // more than one
    updateRandom();
    uint res = lastRandom % sumOfWeights;
    uint cWeight = 0;
    for (uint i = 0; i < code.length; i++) {
      cWeight = cWeight + weight[i];
      if (cWeight >= res) return code[i];
    }

    // we should never get here
    revert();
  }

  function updateRandom() internal {
    nonce++;
    lastRandom = uint(keccak256(
        nonce,
        lastRandom,
        block.blockhash(block.number - 1),
        block.coinbase,
        block.difficulty
    ));
  }
  
  // uuid functions -------------------
  
  /* add a new code + weight */
  
  function addCode(string _code, uint _weight) public onlyAdmin returns (bool success) {

    bytes32 uuid32 = stringToBytes32(_code);

    // weight posiitve & code not yet registered
    require( _weight > 0 );
    require( mCodeIndexPlus[uuid32] == 0 );

    // add to end of array
    uint idx = code.length;
    code.push(uuid32);
    weight.push(_weight);
    mCodeIndexPlus[uuid32] = idx + 1;

    // update sum of weights
    sumOfWeights = sumOfWeights.add(_weight);

    // register event and return
    CodeUpdate(1, uuid32, _weight, sumOfWeights);
    return true;
  }
  
  /* update the weight of an existing code */
  
  function updateCodeWeight(string _code, uint _weight) public onlyAdmin returns (bool success) {

    bytes32 uuid32 = stringToBytes32(_code);

    // weight positive & code must be registered
    require( _weight > 0 );
    require( mCodeIndexPlus[uuid32] > 0 );

    // update weight and sum of weights
    uint idx = mCodeIndexPlus[uuid32] - 1;
    uint oldWeight = weight[idx];
    weight[idx] = _weight;
    sumOfWeights = sumOfWeights.sub(oldWeight).add(_weight);

    // register event and return
    CodeUpdate(2, uuid32, _weight, sumOfWeights);
    return true;
  }
  
  /* remove an existing code */
  
  function removeCode(string _code) public onlyAdmin returns (bool success) {

    bytes32 uuid32 = stringToBytes32(_code);

    // code must be registered
    require( mCodeIndexPlus[uuid32] > 0 );

    // index of code to be deleted
    uint idx = mCodeIndexPlus[uuid32] - 1;
    uint idxLast = code.length - 1;

    // update sum of weights and remove mapping
    sumOfWeights = sumOfWeights.sub(weight[idx]);
    mCodeIndexPlus[uuid32] = 0;

    if (idx != idxLast) {
      // if we are not deleting the last element:
      // move last element to index of deleted element
      code[idx] = code[idxLast];
      weight[idx] = weight[idxLast];
      mCodeIndexPlus[code[idxLast]] = idx;
    }
    // delete last element of arrays
    delete code[idxLast];
    code.length--;
    delete weight[idxLast];
    weight.length--;

    // register event and return
    CodeUpdate(3, uuid32, 0, sumOfWeights);
    return true;
  }

  /* Transfer out any accidentally sent ERC20 tokens */

  function transferAnyERC20Token(address tokenAddress, uint amount) public onlyOwner returns (bool success) {
      return ERC20Interface(tokenAddress).transfer(owner, amount);
  }
  
  // Utility functions ----------------

  /* https://ethereum.stackexchange.com/questions/9142/how-to-convert-a-string-to-bytes32 */
  
  function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
        result := mload(add(source, 32))
    }
  }
  
  /* https://ethereum.stackexchange.com/questions/2519/how-to-convert-a-bytes32-to-string */

  function bytes32ToString(bytes32 x) public pure returns (string) {
    bytes memory bytesString = new bytes(32);
    uint charCount = 0;
    for (uint j = 0; j < 32; j++) {
      byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
      if (char != 0) {
        bytesString[charCount] = char;
        charCount++;
      }
    }
    bytes memory bytesStringTrimmed = new bytes(charCount);
    for (j = 0; j < charCount; j++) {
      bytesStringTrimmed[j] = bytesString[j];
    }
    return string(bytesStringTrimmed);
  }
  
}