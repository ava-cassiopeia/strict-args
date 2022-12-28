import {Logger} from "./logger";

/**
 * A logger which writes errors to the console.
 */
export class ConsoleLogger implements Logger {

  logError(message: string) {
    console.error(message);
  }

}
