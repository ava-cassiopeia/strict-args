import "jasmine";

import {Flag, FlagType} from "../src/flag";

describe("Flag", () => {
  it("constructs setting defaults", () => {
    const flag = new Flag({
      name: "my-flag",
      description: "My description.",
    });

    expect(flag.required).toBe(false);
    expect(flag.type).toEqual(FlagType.FLAG);
    expect(flag.default).toEqual("");
  });

  it("constructs overriding defaults", () => {
    const flag = new Flag({
      name: "my-flag",
      description: "My description.",
      required: true,
      type: FlagType.PROPERTY,
      default: "Some default",
    });

    expect(flag.required).toBe(true);
    expect(flag.type).toEqual(FlagType.PROPERTY);
    expect(flag.default).toEqual("Some default");
  });

  it("throws on construction if FLAG has default value", () => {
    expect(() => {
      new Flag({
        name: "my-flag",
        description: "My description.",
        type: FlagType.FLAG,
        default: "Some default",
      });
    }).toThrowError(/my-flag/);
  });

  it("throws on construction if FLAG has reserved name", () => {
    expect(() => {
      new Flag({
        name: "help",
        description: "My description.",
      });
    }).toThrowError(/help/);
  });

  describe(".isPresent()", () => {
    it("return false before parsing", () => {
      const flag = new Flag({name: "my-flag", description: ""});
      expect(flag.isPresent()).toBe(false);
    });

    it("returns true if setPresence() is called", () => {
      const flag = new Flag({name: "my-flag", description: ""});
      flag.setPresence();
      expect(flag.isPresent()).toBe(true);
    });
  });

  describe(".get()", () => {
    it("throws if called for a FLAG-type flag", () => {
      const flag = new Flag({name: "my-flag", description: ""});
      expect(() => flag.get()).toThrowError(/my-flag/);
    });

    it("returns default if not marked present", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
        default: "some default",
      });
      expect(flag.get()).toEqual("some default");
    });

    it("returns non-default if marked present", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
        default: "some default",
      });
      flag.setPresence("another value");
      expect(flag.get()).toEqual("another value");
    });
  });

  describe(".setPresence()", () => {
    it("throws if a value is provided for a FLAG-type flag", () => {
      const flag = new Flag({name: "my-flag", description: ""});
      expect(() => flag.setPresence("value")).toThrowError(/my-flag/);
    });

    it("throws if no value is provided for a PROPERTY-type flag", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      expect(() => flag.setPresence()).toThrowError(/my-flag/);
    });

    it("updates presence", () => {
      const flag = new Flag({name: "my-flag", description: ""});
      flag.setPresence();
      expect(flag.isPresent()).toBe(true);
    });
  });

  describe(".parse()", () => {
    it("throws if a required FLAG isn't present", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.FLAG,
        required: true,
      });
      expect(() => flag.parse(["something", "myflag", "-my-flag"]))
          .toThrowError(/my-flag/);
    });

    it("throws if a required PROPERTY isn't present", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
        required: true,
      });
      expect(() => flag.parse(["something", "myflag", "--my-flag"]))
          .toThrowError(/my-flag/);
    });

    it("sets presence & returns subarray for found FLAG", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.FLAG,
      });
      const remainingArgs = flag.parse(["something", "--my-flag", "--another"]);

      expect(flag.isPresent()).toBe(true);
      expect(remainingArgs).toEqual(["something", "--another"]);
    });

    it("sets presence & returns subarray for found PROPERTY", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      const remainingArgs =
          flag.parse(["something", "-my-flag", "value", "another-thing"]);

      expect(flag.isPresent()).toBe(true);
      expect(flag.get()).toEqual("value");
      expect(remainingArgs).toEqual(["something", "another-thing"]);
    });

    it("sets presence & returns subarray for found PROPERTY (=)", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      const remainingArgs =
          flag.parse(["something", "-my-flag=value", "another-thing"]);

      expect(flag.isPresent()).toBe(true);
      expect(flag.get()).toEqual("value");
      expect(remainingArgs).toEqual(["something", "another-thing"]);
    });

    it("sets presence & returns subarray for found PROPERTY (=\")", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      const remainingArgs = flag.parse([
        "something",
        "-my-flag=\"some \"inner\" quote\"",
        "another-thing",
      ]);

      expect(flag.isPresent()).toBe(true);
      expect(flag.get()).toEqual("some \"inner\" quote");
      expect(remainingArgs).toEqual(["something", "another-thing"]);
    });

    it("throws if PROPERTY doesn't include value", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      
      expect(() => flag.parse(["something", "-my-flag"]))
          .toThrowError(/-my-flag/);
    });

    it("throws if PROPERTY doesn't include value (=)", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      expect(() => flag.parse(["something", "-my-flag=", "another-thing"]))
          .toThrowError(/-my-flag/);
    });

    it("throws if PROPERTY doesn't include value (=\")", () => {
      const flag = new Flag({
        name: "my-flag",
        description: "",
        type: FlagType.PROPERTY,
      });
      expect(() => flag.parse(["something", "-my-flag=\"\"", "another-thing"]))
          .toThrowError(/-my-flag/);
    });
  });
});
