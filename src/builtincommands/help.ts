import type {CommandConfig} from "../command";

/**
 * Built-in help command.
 */
export const HELP_COMMAND: CommandConfig = {
  name: "help",
  description: "Prints out information about a specified command.",
  allowArguments: true,
  internalOnlyDoNotUseIsBuiltIn: true,
};
