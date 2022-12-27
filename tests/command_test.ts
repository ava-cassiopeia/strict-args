import "jasmine";

import {Command} from "../src/command";

describe("Command", () => {
  it("constructs successfully", () => {
    new Command({
      name: "mycommand",
      description: "",
    });
  });
});
