import {StrictFlags} from "../strict_flags";

/**
 * Defines an action that can be taken for some contextual conditions.
 */
export abstract class Action {

  constructor(readonly flags: StrictFlags) {}

  abstract execute(args: string[]);

}
