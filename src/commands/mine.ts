import Vorpal from "vorpal";
import P2P from "../services/p2p";
import Blockchain from "../services/blockchain";

export default (p2p: P2P, blockchain: Blockchain) => (vorpal: Vorpal) => {
  vorpal
    .command("mine <data>", "Mine a new block. Eg: mine hello!")
    .alias("m")
    .action(async (args) => {
      if (args.data) {
        blockchain.mine(args.data);
        p2p.broadcastLatest();
      }
    });
};
