import {Command, CommandConfig} from "./command";
import {InfoAction} from "./actions/info_action";
import {Flag, FlagConfig} from "./flag";

/**
 * Class which parses and manages commands and flags.
 */
export class StrictArgs {

  readonly commands = new Map<string, Command>();
  readonly globalFlags = new Map<string, Flag>();

  private readonly infoAction = new InfoAction(this);

  constructor(
      readonly name: string,
      readonly description: string|null = null) {}

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
   * Parses the given command-line arguments, printing out help text and
   * warnings to the console as needed.
   */
  parse(args: string[]) {
    const reducedArgs = [...args];
    // Remove the first two arguments, since those are just the program being
    // run.
    reducedArgs.shift();
    reducedArgs.shift();
    
    if (reducedArgs.length < 1) {
      this.infoAction.execute(args);
      return;
    }

    console.warn("This should never be reached. Invalid invocation.");
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
