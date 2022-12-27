import "jasmine";

import {Command} from "../src/command";

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
});
