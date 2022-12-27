import {Command, CommandConfig} from "./command";
import {InfoAction} from "./actions/info_action";

/**
 * Class which parses and manages commands and flags.
 */
export class StrictFlags {

  readonly commands = new Map<string, Command>();

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
    this.commands.set(command.name, command);
    return command;
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

}
