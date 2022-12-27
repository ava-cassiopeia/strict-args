import {StrictArgs} from "../strict_args";

/**
 * Defines an action that can be taken for some contextual conditions.
 */
export abstract class Action {

  constructor(readonly flags: StrictArgs) {}

  abstract execute(args: string[]);

}
