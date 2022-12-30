import * as Table from "cli-table3";
import {Command} from "../command";
import {CommandListener} from "./command_listener";
import {FlagType} from "../flag";

/**
 * Command listener that provides help for the specified command.
 */
export class HelpCommandListener extends CommandListener {

  override onCommand(command: Command, args: string[]) {
    if (command.getArgs().length < 1) {
      throw new Error(
          `No command specified. Please specify one with "help <commandname>".`);
    }
    const commandName = command.getArgs()[0];
    if (!this.args.commands.has(commandName)) {
      throw new Error(`Cannot find command with name '${commandName}'.`);
    }
    const helpCommand = this.args.commands.get(commandName)!;
    const commandFlags = HelpCommandListener.formatCommandFlags(helpCommand);

    console.log(
        `${this.args.name} ${helpCommand.name} [args...] [options...]\n\n` +
        `${helpCommand.description}` +
        commandFlags +
        "\n");
  }

  private static formatCommandFlags(command: Command): string {
    if (command.flags.size < 1) return "";
    const table = new Table({
      chars: {
        'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
        'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' ,
        'bottom-right': '', 'left': '' , 'left-mid': '' , 'mid': '' ,
        'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' '
      },
    });

    for (const flag of command.flags.values()) {
      if (flag.type === FlagType.FLAG) {
        table.push([flag.getFullName(), flag.description]);
        continue;
      }

      table.push([`${flag.getFullName()}[= ]<value>`, flag.description]);
    }

    return "\n\nAvailable options:\n\n" + table.toString();
  }

}
