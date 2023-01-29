import Vorpal from "vorpal";
import P2P from "../services/p2p";

export default (p2p: P2P) => (vorpal: Vorpal) => {
  vorpal
    .command(
      "open <port>",
      "Open port to accept incoming connections. Eg: open 2727"
    )
    .alias("o")
    .action(async (args) => {
      if (args.port) {
        if (typeof args.port === "number") {
          const port = await p2p.startServer(args.port);
          vorpal.log(`Listening to peers on ${port}`);
        } else {
          vorpal.log(`Invalid port!`);
        }
      }
    });
};
