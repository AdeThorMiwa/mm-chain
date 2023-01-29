import Vorpal from "vorpal";
import P2P from "../services/p2p";

export default (p2p: P2P) => (vorpal: Vorpal) => {
  vorpal
    .command("discover", "Discover new peers from your connected peers.")
    .alias("d")
    .action(async () => {
      try {
        p2p.discoverPeers();
      } catch (err) {
        vorpal.log(err as string);
      }
    });
};
