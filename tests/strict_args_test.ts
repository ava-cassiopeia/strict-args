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

    it("throws if the command has flags that conflict with global flags", () => {
      const flags = new StrictArgs("", "");
      flags.registerGlobalFlag({name: "myflag", description: ""});

      expect(() => {
        flags.registerCommand({
          name: "flagname",
          description: "description",
          flags: [
            {name: "myflag", description: "another"},
          ],
        });
      }).toThrowError(/myflag/);
    });
  });

  describe(".registerGlobalFlag()", () => {
    it("throws if flag is already registered globally", () => {
      const strictArgs = new StrictArgs("", "");
      strictArgs.registerGlobalFlag({
        name: "flagname",
        description: "",
      });

      expect(() => {
        strictArgs.registerGlobalFlag({
          name: "flagname",
          description: "",
        });
      }).toThrowError(/flagname/);
    });

    it("throws if flag is already registered in a command", () => {
      const strictArgs = new StrictArgs("", "");
      strictArgs.registerCommand({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "flagname",
            description: "",
          },
        ],
      });

      expect(() => {
        strictArgs.registerGlobalFlag({
          name: "flagname",
          description: "",
        });
      }).toThrowError(/flagname.*mycommand/);
    });
  });
});
