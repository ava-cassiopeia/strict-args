import { Command } from "../command";
import {CommandListener} from "./command_listener";

/**
 * Command listener that provides help for the specified command.
 */
export class HelpCommandListener extends CommandListener {

  override onCommand(command: Command, args: string[]) {
    // TODO
  }

}
