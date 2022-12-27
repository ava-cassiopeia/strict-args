/**
 * @fileoverview A fake CLI that imports the relevant code and makes a fake CLI.
 */

import {StrictFlags} from "../src/index";

const strictFlags = new StrictFlags(
    "fake-cli",
    "A fake CLI tool to test StrictFlags against.");
strictFlags.registerCommand({
  name: "start",
  description: "Starts the webserver on port 8080.",
});
strictFlags.registerCommand({
  name: "status",
  description: "Checks the status of a running webserver.",
});
strictFlags.registerCommand({
  name: "admin",
  description: "Opens the admin page.",
});

strictFlags.parse(process.argv);
