import { EventEmitter } from "stream";

export interface PeerConnection extends EventEmitter {
  pxpPeer: {
    socket: {
      _host: number;
    };
  };
  write(...args: unknown[]): void;
}
