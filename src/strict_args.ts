import {Command, CommandConfig} from "./command";
import {InfoAction} from "./actions/info_action";
import {Flag, FlagConfig} from "./flag";
import {CommandListener} from "./commandlisteners/command_listener";
import {HelpCommandListener} from "./commandlisteners/help_command_listener";
import {Logger} from "./loggers/logger";
import {ThrowingLogger} from "./loggers/throwing_logger";
import {ConsoleLogger} from "./loggers/console_logger";
import {ErrorCodes} from "./error_codes";

/**
 * Class which parses and manages commands and flags.
 */
export class StrictArgs {

  readonly commands = new Map<string, Command>();
  readonly globalFlags = new Map<string, Flag>();

  private readonly commandListeners = new Map<string, CommandListener[]>();
  private readonly infoAction = new InfoAction(this);
  private readonly logger: Logger;

  constructor(
      readonly name: string,
      readonly description: string|null = null,
      throwErrors = false) {
    if (throwErrors) {
      this.logger = new ThrowingLogger();
    } else {
      this.logger = new ConsoleLogger();
    }
  }

  /**
   * Registers a new command for this CLI.
   */
  registerCommand(config: CommandConfig): Command {
    const command = new Command(config);
    this.assertCommandNotRegistered(command.name);
    for (const flag of command.flags.values()) {
      this.assertFlagNotRegistered(flag, /* includeCommands= */ false);
    }
    this.commands.set(command.name, command);
    return command;
  }

  /**
   * Registers a new flag as a global flag.
   */
  registerGlobalFlag(config: FlagConfig): Flag {
    const flag = new Flag(config);
    this.assertFlagNotRegistered(flag);
    this.globalFlags.set(flag.name, flag);
    return flag;
  }

  /**
   * Registers a command listener class that will be called whenever a command
   * is matched successfully.
   */
  addCommandListener(
      commandName: string,
      makeListener: (args: StrictArgs) => CommandListener) {
    if (!this.commandListeners.has(commandName)) {
      this.commandListeners.set(commandName, []);
    }
    this.commandListeners.get(commandName)!.push(makeListener(this));
  }

  /**
   * Returns the value of the flag with the specified name. If the flag wasn't
   * specified, returns the flag's default value.
   * @throws If no flag with the provided name exists, throws.
   */
  getFlagValue(flagName: string): string {
    if (!this.globalFlags.has(flagName)) {
      throw new Error(
          `Cannot get global flag value for global flag '${flagName}': the ` +
          `specified flag does not exist.`);
    }
    const flag = this.globalFlags.get(flagName)!;
    return flag.get();
  }

  /**
   * Parses the given command-line arguments, printing out help text and
   * warnings to the console as needed.
   */
  parse(args: string[]) {
    let reducedArgs = [...args];
    // Remove the first two arguments, since those are just the program being
    // run.
    reducedArgs.shift();
    reducedArgs.shift();
    
    if (reducedArgs.length < 1) {
      this.infoAction.execute(args);
      return;
    }

    // Parse global flags
    try {
      for (const flag of this.globalFlags.values()) {
        reducedArgs = flag.parse(reducedArgs);
      }
    } catch (e) {
      const error = e as Error;
      this.logger.logError(error.message);
      process.exit(ErrorCodes.FAILED_TO_PARSE_GLOBAL_FLAGS);
    }

    // Parse command
    if (reducedArgs.length < 1) {
      this.logger.logError(
        `No command specified. Please run '${this.name} help' for a list ` +
        `of commands.`);
      process.exit(ErrorCodes.NO_COMMAND_SPECIFIED);
    }
    const commandName = reducedArgs[0];
    if (!this.commands.has(commandName)) {
      this.logger.logError(
        `Unrecognized command '${commandName}'. Please run ` +
        `'${this.name} help' for a list of commands.`);
      process.exit(ErrorCodes.UNRECOGNIZED_COMMAND);
    }
    const command = this.commands.get(commandName)!;
    reducedArgs.splice(0, 1); // remove command name
    try {
      command.parse(reducedArgs);
    } catch (e) {
      const error = e as Error;
      this.logger.logError(error.message);
      process.exit(ErrorCodes.FAILED_TO_PARSE_COMMAND);
    }

    this.notifyCommandListeners(command, args);
  }

  private notifyCommandListeners(command: Command, args: string[]) {
    if (!this.commandListeners.has(command.name)) return;
    const listeners = this.commandListeners.get(command.name)!;
    listeners.forEach((l) => l.onCommand(command, args));
  }

  private assertCommandNotRegistered(commandName: string) {
    if (this.commands.has(commandName)) {
      throw new Error(`Command of name '${commandName}' already registered.`);
    }
  }

  private assertFlagNotRegistered(flag: Flag, includeCommands = true) {
    if (this.globalFlags.has(flag.name)) {
      throw new Error(`Flag '${flag.name}' already registered globally.`);
    }

    if (!includeCommands) return;
    for (const command of this.commands.values()) {
      if (command.flags.has(flag.name)) {
        throw new Error(
            `Flag '${flag.name}' already registered in the ` +
            `${command.name} command.`);
      }
    }
  }

}
