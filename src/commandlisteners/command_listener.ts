import {Command} from "../command";
import {StrictArgs} from "../strict_args";

/**
 * Defines what a generic command listener looks like.
 */
export abstract class CommandListener {

  constructor(protected readonly args: StrictArgs) {}

  abstract onCommand(command: Command, args: string[]);

}
