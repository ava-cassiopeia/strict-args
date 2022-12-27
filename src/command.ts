/**
 * Defines a single command that can be passed to a CLI.
 */
export class Command {

  readonly name: string;
  readonly description: string;

  constructor(config: CommandConfig) {
    this.name = config.name;
    this.description = config.description;
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
