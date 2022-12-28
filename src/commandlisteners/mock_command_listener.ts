import { Command } from "../command";
import {CommandListener} from "./command_listener";

/**
 * A mock command listener for testing -- it only counts the amount of times
 * it is called.
 */
export class MockCommandListener extends CommandListener {

  callCount = 0;

  override onCommand(command: Command, args: string[]) {
    this.callCount++;
  }

}
