/**
 * @fileoverview A fake CLI that imports the relevant code and makes a fake CLI.
 */

import {StrictArgs} from "../src/index";
import {StatusCommandListener} from "./status_command_listener";

const strictArgs = new StrictArgs(
    "fake-cli",
    "A fake CLI tool to test StrictArgs against.");
strictArgs.registerCommand({
  name: "start",
  description: "Starts the webserver on port 8080.",
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
