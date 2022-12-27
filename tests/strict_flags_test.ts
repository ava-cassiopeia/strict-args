import "jasmine";

import {StrictArgs} from "../src/strict_args";

describe("StrictArgs", () => {
  describe(".registerCommand()", () => {
    it("registers a command by name", () => {
      const flags = new StrictArgs("", "");
      const command = flags.registerCommand({
        name: "flagname",
        description: "",
      });

      expect(flags.commands.has("flagname")).toBe(true);
      expect(flags.commands.get("flagname")).toBe(command);
    });

    it("throws if the same command name is registered twice", () => {
      const flags = new StrictArgs("", "");
      flags.registerCommand({
        name: "flagname",
        description: "",
      });

      expect(() => {
        flags.registerCommand({
          name: "flagname",
          description: "description",
        });
      }).toThrowError(/flagname/);
    });
  });
});
