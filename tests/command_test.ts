import "jasmine";

import {Command} from "../src/command";
import {FlagType} from "../src/flag";

describe("Command", () => {
  it("constructs successfully setting defaults", () => {
    const command = new Command({
      name: "mycommand",
      description: "",
    });

    expect(command.allowArguments).toBe(false);
    expect(command.flags.size).toEqual(0);
  });

  it("throws on construct if the name is reserved", () => {
    expect(() => new Command({name: "help", description: ""}))
        .toThrowError(/help/);
  });

  it("throws on construct if flag is not unique", () => {
    expect(() => new Command({
      name: "mycommand",
      description: "",
      flags: [
        {
          name: "myflag",
          description: "",
        },
        {
          name: "myflag",
          description: "another",
        },
      ],
    })).toThrowError(/myflag.*mycommand/);
  });

  describe(".getArgs()", () => {
    it("throws if args aren't allowed", () => {
      const command = new Command({name: "foo", description: ""});
      expect(() => command.getArgs()).toThrowError(/foo/);
    });
  });

  describe(".parse()", () => {
    it("updates flag states for command", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "myflag",
            description: "",
          },
          {
            name: "some-prop",
            description: "another",
            type: FlagType.PROPERTY,
          },
        ],
      });
      command.parse(["--myflag", "-some-prop", "val"]);

      expect(command.flags.get("myflag")!.isPresent()).toBe(true);
      expect(command.flags.get("some-prop")!.isPresent()).toBe(true);
      expect(command.flags.get("some-prop")!.get()).toEqual("val");
    });

    it("throws for unrecognized FLAGs", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "myflag",
            description: "",
          },
          {
            name: "some-prop",
            description: "another",
            type: FlagType.PROPERTY,
          },
        ],
      });
      
      expect(() => command.parse(["--something-else"]))
          .toThrowError(/mycommand.*--something-else/);
    });

    it("throws for unrecognized PROPERTYs", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "myflag",
            description: "",
          },
          {
            name: "some-prop",
            description: "another",
            type: FlagType.PROPERTY,
          },
        ],
      });
      
      expect(() => command.parse(["-something-else"]))
          .toThrowError(/mycommand.*-something-else/);
    });

    it("throws for ununused extra args", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "myflag",
            description: "",
          },
          {
            name: "some-prop",
            description: "another",
            type: FlagType.PROPERTY,
          },
        ],
      });
      
      expect(() => command.parse(["--myflag", "something", "another thing"]))
          .toThrowError(/mycommand.*something.*another thing/);
    });

    it("parses extra args if enabled", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        allowArguments: true,
        flags: [
          {
            name: "myflag",
            description: "",
          },
          {
            name: "some-prop",
            description: "another",
            type: FlagType.PROPERTY,
          },
        ],
      });
      command.parse(["--myflag", "something", "another thing"]);

      expect(command.getArgs()).toEqual(["something", "another thing"]);
    });
  });

  describe(".getFlagValue()", () => {
    it("returns the relevant flag value", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "my-prop",
            description: "",
            type: FlagType.PROPERTY,
          },
        ],
      });
      command.parse(["-my-prop", "value"]);

      expect(command.getFlagValue("my-prop")).toEqual("value");
    });

    it("throws if the flag doesn't exist", () => {
      const command = new Command({
        name: "mycommand",
        description: "",
        flags: [
          {
            name: "my-prop",
            description: "",
            type: FlagType.PROPERTY,
          },
        ],
      });
      
      expect(() => command.getFlagValue("error-flag"))
          .toThrowError(/error-flag.*mycommand/);
    });
  });
});
