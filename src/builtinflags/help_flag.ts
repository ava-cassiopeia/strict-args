import {FlagConfig, FlagType} from "../flag";

export const HELP_FLAG: FlagConfig = {
  name: "help",
  description:
      "If specified along with a valid command, prints out help for that " +
      "command.",
  type: FlagType.FLAG,
  internalOnlyDoNotUseIsBuiltIn: true,
};
