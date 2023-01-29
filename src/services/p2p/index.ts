import net from "net";
import wrtc from "wrtc";
import Exchange from "peer-exchange";
import { PeerConnection } from "../../types/peer";
import Blockchain from "../blockchain";
import {
  BlockchainMessage,
  BlockchainMessageType,
} from "../../types/blockchain";
import Messages from "../messages";
import Block from "../../entities/block";

const p2p = new Exchange("Blockchain Demo 2.0", { wrtc: wrtc });

class PeerToPeer {
  private peers: PeerConnection[];

  constructor(private readonly blockchain: Blockchain) {
    this.peers = [];
  }

  getPeers() {
    return this.peers;
  }

  public async startServer(port: number) {
    return new Promise<number>((res, rej) => {
      net
        .createServer((socket) =>
          p2p.accept(socket, (err, conn) => {
            if (err) {
              rej(err);
            } else {
              this.initConnection(conn as PeerConnection);
            }
          })
        )
        .listen(port, () => res(port));
    });
  }

  private initConnection(conn: PeerConnection) {
    this.peers.push(conn);
    this.initMessageHandler(conn);
    this.initErrorHandler(conn);
    this.write(conn, Messages.getLatestBlock());
  }

  public discoverPeers() {
    p2p.getNewPeer((err, conn) => {
      if (err) {
        throw err;
      } else {
        this.initConnection(conn as PeerConnection);
      }
    });
  }

  public connectToPeer(host: string, port: number) {
    const socket: unknown = net.connect(port, host, () =>
      p2p.connect(socket, (err, conn) => {
        if (err) {
          throw err;
        } else {
          this.initConnection(conn as PeerConnection);
        }
      })
    );
  }

  private write(peer: PeerConnection, message: unknown) {
    peer.write(JSON.stringify(message));
  }

  public broadcastLatest() {
    this.broadcast(Messages.sendLatestBlock(this.blockchain.latestBlock));
  }

  private broadcast(message: BlockchainMessage) {
    this.peers.forEach((peer) => this.write(peer, message));
  }

  private handleMessage(peer: PeerConnection, message: BlockchainMessage) {
    switch (message.type) {
      case BlockchainMessageType.REQUEST_LATEST_BLOCK:
        this.write(peer, Messages.sendLatestBlock(this.blockchain.latestBlock));
        break;
      case BlockchainMessageType.REQUEST_BLOCKCHAIN:
        this.write(peer, Messages.sendBlockchain(this.blockchain.get()));
        break;
      case BlockchainMessageType.RECEIVE_LATEST_BLOCK:
        this.handleReceivedLatestBlock(message, peer);
        break;
      case BlockchainMessageType.RECEIVE_BLOCKCHAIN:
        this.handleReceivedBlockchain(message);
        break;
      default:
        throw "Received invalid message.";
    }
  }

  private handleReceivedLatestBlock(
    message: BlockchainMessage,
    peer: PeerConnection
  ) {
    const receivedBlock = message.data as Block;
    const latestBlock = this.blockchain.latestBlock;

    if (latestBlock.hash === receivedBlock.previousHash) {
      this.blockchain.addBlock(receivedBlock);
    } else if (receivedBlock.index > latestBlock.index) {
      this.write(peer, Messages.getBlockchain());
    }
  }

  private handleReceivedBlockchain(message: BlockchainMessage) {
    const receivedChain = message.data as Block[];
    this.blockchain.replaceChain(receivedChain);
  }

  private initMessageHandler(conn: PeerConnection) {
    conn.on("data", (data) => {
      const message = JSON.parse(data.toString("utf8"));
      this.handleMessage(conn, message);
    });
  }

  private initErrorHandler(conn: PeerConnection) {
    conn.on("error", (err) => {
      throw err;
    });
  }

  private closeConnection() {
    p2p.close((err: Error) => {
      throw err;
    });
  }
}

export default PeerToPeer;
