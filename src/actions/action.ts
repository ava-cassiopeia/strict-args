import {StrictFlags} from "../strict_flags";

/**
 * Defines an action that can be taken for some contextual conditions.
 */
export interface Action {

  execute(args: string[], flags: StrictFlags);

}
