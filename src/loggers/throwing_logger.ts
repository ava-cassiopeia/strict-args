import {Logger} from "./logger";

/**
 * A logger which throws all messages as generic Errors.
 */
export class ThrowingLogger implements Logger {

  logError(message: string) {
    throw new Error(message);
  }

}
