import Vorpal from "vorpal";
import welcome from "./commands/welcome";
import connect from "./commands/connect";
import discover from "./commands/discover";
import blockchain from "./commands/blockchain";
import peers from "./commands/peers";
import mine from "./commands/mine";
import open from "./commands/open";
import Blockchain from "./services/blockchain";
import PeerToPeer from "./services/p2p";

const app = (vorpal: Vorpal) => {
  const bChain = new Blockchain();
  const p2p = new PeerToPeer(bChain);

  vorpal
    .use(welcome)
    .use(connect(p2p))
    .use(discover(p2p))
    .use(blockchain(bChain))
    .use(peers(p2p))
    .use(mine(p2p, bChain))
    .use(open(p2p))
    .delimiter("blockchain →")
    .show();
};

export default app;
