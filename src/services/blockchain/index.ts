import crypto from "crypto";
import Block from "../../entities/block";

class Blockchain {
  private blockchain: Block[];
  private difficulty: number;
  constructor() {
    this.blockchain = [Block.genesis];
    this.difficulty = 3;
  }

  get() {
    return this.blockchain;
  }

  get latestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }

  private isValidHashDifficulty(hash: string) {
    let i = 0;
    while (i < hash.length) {
      if (hash[i] !== "0") {
        break;
      }
      i++;
    }
    return i >= this.difficulty;
  }

  private calculateHashForBlock(block: Block) {
    const { index, previousHash, timestamp, data, nonce } = block;
    return this.calculateHash(index, previousHash, timestamp, data, nonce);
  }

  private calculateHash(
    index: number,
    previousHash: string,
    timestamp: number,
    data: string,
    nonce: number
  ) {
    return crypto
      .createHash("sha256")
      .update(index + previousHash + timestamp + data + nonce)
      .digest("hex");
  }

  public mine(data: string) {
    const newBlock = this.generateNextBlock(data);
    this.addBlock(newBlock);
  }

  private generateNextBlock(data: string) {
    const nextIndex = this.latestBlock.index + 1;
    const previousHash = this.latestBlock.hash;
    let timestamp = new Date().getTime();
    let nonce = 0;
    let nextHash = this.calculateHash(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nonce
    );

    while (!this.isValidHashDifficulty(nextHash)) {
      nonce = nonce + 1;
      timestamp = new Date().getTime();
      nextHash = this.calculateHash(
        nextIndex,
        previousHash,
        timestamp,
        data,
        nonce
      );
    }

    const nextBlock = new Block(
      nextIndex,
      previousHash,
      timestamp,
      data,
      nextHash,
      nonce
    );

    return nextBlock;
  }

  public addBlock(newBlock: Block) {
    if (this.isValidNextBlock(newBlock, this.latestBlock)) {
      this.blockchain.push(newBlock);
    } else {
      throw new Error("Error: Invalid block");
    }
  }

  private isValidNextBlock(nextBlock: Block, previousBlock: Block) {
    const nextBlockHash = this.calculateHashForBlock(nextBlock);

    if (previousBlock.index + 1 !== nextBlock.index) {
      return false;
    } else if (previousBlock.hash !== nextBlock.previousHash) {
      return false;
    } else if (nextBlockHash !== nextBlock.hash) {
      return false;
    } else if (!this.isValidHashDifficulty(nextBlockHash)) {
      return false;
    } else {
      return true;
    }
  }

  private isValidChain(chain: Block[]) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis)) {
      return false;
    }

    const tempChain = [chain[0]];
    for (let i = 1; i < chain.length; i = i + 1) {
      if (this.isValidNextBlock(chain[i], tempChain[i - 1])) {
        tempChain.push(chain[i]);
      } else {
        return false;
      }
    }
    return true;
  }

  private isChainLonger(chain: Block[]) {
    return chain.length > this.blockchain.length;
  }

  public replaceChain(newChain: Block[]) {
    if (this.isValidChain(newChain) && this.isChainLonger(newChain)) {
      this.blockchain = JSON.parse(JSON.stringify(newChain));
    } else {
      throw new Error("Error: invalid chain");
    }
  }
}

export default Blockchain;
