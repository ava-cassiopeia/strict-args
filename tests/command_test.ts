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
});
