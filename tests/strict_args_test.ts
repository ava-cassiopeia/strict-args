import "jasmine";

import {StrictArgs} from "../src/strict_args";
import {MockCommandListener} from "../src/commandlisteners/mock_command_listener";

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

  describe(".parse()", () => {
    it("parses global flags", () => {
      const args = new StrictArgs("", "");
      args.registerGlobalFlag({
        name: "my-flag",
        description: "",
      });
      args.registerCommand({name: "fake", description: ""});
      args.parse(["", "", "fake", "--my-flag"]);

      expect(args.globalFlags.get("my-flag")!.isPresent()).toBe(true);
    });

    it("throws if no command specified", () => {
      const args = new StrictArgs("fakecli", "");
      args.registerGlobalFlag({
        name: "my-flag",
        description: "",
      });
      args.registerCommand({name: "fake", description: ""});

      expect(() => args.parse(["", "", "--my-flag"])).toThrowError(/fakecli/);
    });

    it("throws if unrecognized command", () => {
      const args = new StrictArgs("fakecli", "");
      args.registerGlobalFlag({
        name: "my-flag",
        description: "",
      });
      args.registerCommand({name: "fake", description: ""});

      expect(() => args.parse(["", "", "another"]))
          .toThrowError(/another.*fakecli/);
    });

    it("notifies command listeners", () => {
      const args = new StrictArgs("fakecli", "");
      const mockCommandListener = new MockCommandListener(args);
      args.registerGlobalFlag({
        name: "my-flag",
        description: "",
      });
      args.registerCommand({name: "fake", description: ""});
      args.addCommandListener("fake", (a) => mockCommandListener);

      args.parse(["", "", "fake"]);

      expect(mockCommandListener.callCount).toEqual(1);
    });
  });
});
