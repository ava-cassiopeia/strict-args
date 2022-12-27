import {Flag, FlagConfig} from "./flag";
import {RESERVED_COMMAND_NAMES} from "./name_denylist";

/**
 * Defines a single command that can be passed to a CLI.
 */
export class Command {

  readonly name: string;
  readonly description: string;
  readonly flags = new Map<string, Flag>();

  constructor(config: CommandConfig) {
    Command.assertConfigValid(config);
    this.name = config.name;
    this.description = config.description;

    if (!config.flags) return;
    config.flags!
        .map((f) => new Flag(f))
        .forEach((f) => this.addFlag(f));
  }

  /**
   * Adds a flag to this command.
   */
  addFlag(flag: Flag) {
    if (this.flags.has(flag.name)) {
      throw new Error(
          `Cannot add flag '${flag.name}' to command ${this.name}: that flag ` +
          `already exists for that command.`);
    }
    this.flags.set(flag.name, flag);
  }

  /**
   * Verifies that the given config is valid by make sure the following
   * conditions are true:
   * 
   *   - The command name is not a reserved command name.
   */
  private static assertConfigValid(config: CommandConfig) {
    if (RESERVED_COMMAND_NAMES.includes(config.name)) {
      throw new Error(
          `Cannot create command with name '${config.name}', that name is ` +
          `reserved by the strict-args library.`);
    }
  }

}

export interface CommandConfig {
  /**
   * The name of the command. This is typically all one word (ie. "run" or
   * "runquickly"). Cannot include spaces or other whitespace.
   */
  name: string;
  /**
   * The description of this command that is shown when a user runs
   * "yourcli --help" or "yourcli help <commandname>".
   */
  description: string;
  /**
   * Defaults to an empty list. List of flags associated with this command.
   */
  flags?: FlagConfig[];
}
