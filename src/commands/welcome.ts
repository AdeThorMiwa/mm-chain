import Vorpal from "vorpal";

export default (vorpal: Vorpal) => {
  vorpal.log("Welcome to blockchain CLI");
  vorpal.exec("help");
};
