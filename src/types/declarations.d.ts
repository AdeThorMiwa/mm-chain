declare module "wrtc" {}

declare class PeerExchange {
  constructor(exchange: string, config: { wrtc: unknown });
  accept(socket: unknown, cb: (err: Error, conn: unknown) => void): void;
  getNewPeer(cb: (err: Error, conn: unknown) => void): void;
  connect(socket: unknown, cb: (err: Error, conn: unknown) => void): void;
  close(cb: (err: Error) => void): void;
  on(event: string, cb: (conn: unknown) => void): void;
}

declare module "peer-exchange" {
  export default PeerExchange;
}
