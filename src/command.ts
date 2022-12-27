import {RESERVED_COMMAND_NAMES} from "./name_denylist";

/**
 * Defines a single command that can be passed to a CLI.
 */
export class Command {

  readonly name: string;
  readonly description: string;

  constructor(config: CommandConfig) {
    Command.assertConfigValid(config);
    this.name = config.name;
    this.description = config.description;
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
}
