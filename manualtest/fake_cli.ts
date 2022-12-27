/**
 * @fileoverview A fake CLI that imports the relevant code and makes a fake CLI.
 */

import {StrictFlags} from "../src/index";

const strictFlags = new StrictFlags();
strictFlags.registerCommand({
  name: "start",
  description: "Starts the webserver on port 8080.",
});
strictFlags.registerCommand({
  name: "status",
  description: "Checks the status of a running webserver.",
});

strictFlags.parse(process.argv);
