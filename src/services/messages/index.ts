import Block from "../../entities/block";
import {
  BlockchainMessage,
  BlockchainMessageType,
} from "../../types/blockchain";

class Messages {
  static getLatestBlock(): BlockchainMessage {
    return {
      type: BlockchainMessageType.REQUEST_LATEST_BLOCK,
    };
  }

  static sendLatestBlock(block: Block): BlockchainMessage {
    return {
      type: BlockchainMessageType.RECEIVE_LATEST_BLOCK,
      data: block,
    };
  }

  static getBlockchain(): BlockchainMessage {
    return {
      type: BlockchainMessageType.REQUEST_BLOCKCHAIN,
    };
  }

  static sendBlockchain(blockchain: Block[]): BlockchainMessage {
    return {
      type: BlockchainMessageType.RECEIVE_BLOCKCHAIN,
      data: blockchain,
    };
  }
}

export default Messages;
