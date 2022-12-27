import "jasmine";

import {getHelloMessage} from "../src/index";

describe("index.ts", () => {
  describe("getHelloMessage()", () => {
    it("returns the right message", () => {
      const message = getHelloMessage();
      expect(message).toEqual("Hello, world!");
    });
  });
});
