import Vorpal from "vorpal";
import Blockchain from "../services/blockchain";

export default (blockchain: Blockchain) => (vorpal: Vorpal) => {
  vorpal
    .command("blockchain", "See the current state of the blockchain.")
    .alias("bc")
    .action(async () => {
      vorpal.log(blockchain.get() as unknown as string);
    });
};
