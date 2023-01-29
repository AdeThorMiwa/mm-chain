import Vorpal from "vorpal";
import P2P from "../services/p2p";

export default (p2p: P2P) => (vorpal: Vorpal) => {
  vorpal
    .command("peers", "Get the list of connected peers.")
    .alias("p")
    .action(async () => {
      p2p.getPeers().forEach((peer) => {
        vorpal.log(`${peer.pxpPeer.socket._host} \n`);
      });
    });
};
