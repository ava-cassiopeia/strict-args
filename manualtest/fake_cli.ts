/**
 * @fileoverview A fake CLI that imports the relevant code and makes a fake CLI.
 */

import {StrictArgs, FlagType} from "../src/index";
import {StatusCommandListener} from "./status_command_listener";

const strictArgs = new StrictArgs(
    "fake-cli",
    "A fake CLI tool to test StrictArgs against.");
strictArgs.registerCommand({
  name: "start",
  description: "Starts the webserver on port 8080.",
  longDescription: "Starts the webserver on port 8080, assuming no webserver is running.",
  syntaxHint: "start <server name> [options...]",
  flags: [
    {
      name: "port",
      description: "The port to run the webserver on.",
      type: FlagType.PROPERTY,
    },
    {
      name: "open",
      description: "Opens web browser to navigate to the running webserver.",
    },
  ],
});
strictArgs.registerCommand({
  name: "status",
  description: "Checks the status of a running webserver.",
});
strictArgs.registerCommand({
  name: "admin",
  description: "Opens the admin page.",
});

strictArgs.addCommandListener("status", (a) => new StatusCommandListener(a));

strictArgs.parse(process.argv);
