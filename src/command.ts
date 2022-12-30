import {Flag, FlagConfig} from "./flag";
import {RESERVED_COMMAND_NAMES} from "./name_denylist";

/**
 * Defines a single command that can be passed to a CLI.
 */
export class Command {

  readonly name: string;
  readonly description: string;
  readonly allowArguments: boolean;
  readonly longDescription: string;
  readonly syntaxHint: string|null;
  readonly flags = new Map<string, Flag>();

  private internalArgs: string[] = [];

  constructor(config: CommandConfig) {
    Command.assertConfigValid(config);
    this.name = config.name;
    this.description = config.description;
    this.allowArguments =
        config.allowArguments !== undefined ? config.allowArguments : false;
    this.longDescription = config.longDescription || this.description;
    this.syntaxHint = config.syntaxHint || null;

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
   * Attempts to get args for this command.
   * @throws Throws if args aren't allowed for this command.
   */
  getArgs(): string[] {
    if (!this.allowArguments) {
      throw new Error(
          `Cannot get args for '${this.name}' command: arguments are not ` +
          `allowed for that command. If you want to enable arguments, set ` +
          `'allowArguments: true' when constructing / registering the ` +
          `command.`);
    }
    return this.internalArgs;
  }

  /**
   * Returns the value of the flag with the specified name. If the flag wasn't
   * specified, returns the flag's default value.
   * @throws If no flag with the provided name exists, throws.
   */
  getFlagValue(flagName: string): string {
    if (!this.flags.has(flagName)) {
      throw new Error(
          `Cannot get flag value for flag '${flagName}' in command ` +
          `'${this.name}': the specified flag does not exist.`);
    }
    const flag = this.flags.get(flagName)!;
    return flag.get();
  }

  /**
   * Tries to parse all flags for this command.
   */
  parse(args: string[]) {
    let workingArgs = [...args];
    for (const flag of this.flags.values()) {
      workingArgs = flag.parse(workingArgs);
    }

    // Round up the rest of the arguments
    let remainingArgs: string[] = [];
    for (const remaining of workingArgs) {
      if (remaining.startsWith("-")) {
        throw new Error(
            `Unrecognized flag for '${this.name}' command: '${remaining}'.`);
      }
      remainingArgs.push(remaining);
    }

    if (!this.allowArguments && remainingArgs.length > 0) {
      throw new Error(
          `Unrecognized / unsupported loose values for command ` +
          `'${this.name}': [${remainingArgs}]`);
    }

    this.internalArgs = remainingArgs;
  }

  /**
   * Verifies that the given config is valid by make sure the following
   * conditions are true:
   * 
   *   - The command name is not a reserved command name.
   */
  private static assertConfigValid(config: CommandConfig) {
    if (!config.internalOnlyDoNotUseIsBuiltIn && RESERVED_COMMAND_NAMES.includes(config.name)) {
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
   * An optional long description that is only printed when a user asks for the
   * full help information for this command.
   */
  longDescription?: string;
  /**
   * An optional syntax hint (like "start <server_name>") that appears instead
   * of the automatically generated syntax hint in help printouts.
   */
  syntaxHint?: string;
  /**
   * Defaults to an empty list. List of flags associated with this command.
   */
  flags?: FlagConfig[];
  /**
   * Defaults to false. If true, enables the use of loose arguments, ie. loose
   * values in the args that don't match any parameter or flag.
   */
  allowArguments?: boolean;
  internalOnlyDoNotUseIsBuiltIn?: boolean;
}
