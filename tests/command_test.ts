import "jasmine";

import {Command} from "../src/command";

describe("Command", () => {
  it("constructs successfully", () => {
    new Command({
      name: "mycommand",
      description: "",
    });
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
});
