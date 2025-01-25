// PoTO - Proof of Temporal Order - Proof-of-Concept

class Transaction {
  constructor(sender, receiver, amount, timestamp) {
    this.id = `${sender}-${receiver}-${timestamp}`; // Unique transaction ID
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.timestamp = timestamp;
  }

  sign(privateKey) {
    // Simplified signature using JSON.stringify and a fake hash (no real cryptography for this PoC)
    this.signature = `${privateKey}-${JSON.stringify(this)}`.hashCode();
  }
}

class Block {
  constructor(previousHash) {
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.transactions = [];
    this.hash = null; // To be computed
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  computeHash() {
    return `${this.previousHash}-${this.timestamp}-${JSON.stringify(
      this.transactions
    )}`.hashCode();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.validators = ['Validator1', 'Validator2', 'Validator3'];
  }

  createGenesisBlock() {
    const genesisBlock = new Block('0');
    genesisBlock.hash = genesisBlock.computeHash();
    return genesisBlock;
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  validateTransactions(transactions) {
    const now = Date.now();
    return transactions.filter((tx) => {
      return (
        tx.timestamp <= now && // Timestamp is valid
        !this.isTransactionDuplicated(tx) // No duplicate transactions
      );
    });
  }

  isTransactionDuplicated(transaction) {
    for (const block of this.chain) {
      if (block.transactions.some((tx) => tx.id === transaction.id)) {
        return true;
      }
    }
    return false;
  }

  mineBlock() {
    const validator = this.selectValidator();
    console.log(`Selected Validator: ${validator}`);

    const validTransactions = this.validateTransactions(
      this.pendingTransactions
    );
    if (validTransactions.length === 0) {
      console.log('No valid transactions to mine.');
      return;
    }

    const newBlock = new Block(this.chain[this.chain.length - 1].hash);
    validTransactions.forEach((tx) => newBlock.addTransaction(tx));
    newBlock.hash = newBlock.computeHash();
    this.chain.push(newBlock);

    console.log('Block mined and added to the chain:', newBlock);
    this.pendingTransactions = []; // Clear pending transactions
  }

  selectValidator() {
    // Simple round-robin validator selection
    const validatorIndex = Math.floor(Math.random() * this.validators.length);
    return this.validators[validatorIndex];
  }
}

// Helper: Simple hash code generator (for PoC, not secure)
String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

// Simulate the PoTO Protocol
const blockchain = new Blockchain();

// Step 1: Create Transactions
const tx1 = new Transaction('Alice', 'Bob', 100, Date.now());
tx1.sign('AlicePrivateKey');

const tx2 = new Transaction('Bob', 'Charlie', 50, Date.now());
tx2.sign('BobPrivateKey');

const tx3 = new Transaction('Charlie', 'Alice', 30, Date.now() - 10000); // Backdated transaction

blockchain.createTransaction(tx1);
blockchain.createTransaction(tx2);
blockchain.createTransaction(tx3);

// Step 2: Validate and Mine Block
blockchain.mineBlock();

// Step 3: Display the Blockchain
console.log(JSON.stringify(blockchain.chain, null, 2));
