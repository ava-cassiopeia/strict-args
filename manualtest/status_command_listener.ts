import {Command, CommandListener} from "../src/index";

export class StatusCommandListener extends CommandListener {

  override onCommand(command: Command, args: string[]) {
    console.log("Status check!");
  }

}
