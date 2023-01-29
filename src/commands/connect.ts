import Vorpal from "vorpal";
import P2P from "../services/p2p";

export default (p2p: P2P) => (vorpal: Vorpal) => {
  vorpal
    .command(
      "connect <host> <port>",
      "Connect to a new peer. Eg: connect localhost 2727"
    )
    .alias("c")
    .action(async (args) => {
      if (args.host && args.port) {
        try {
          p2p.connectToPeer(args.host, args.port);
        } catch (err) {
          vorpal.log(err as string);
        }
      }
    });
};
