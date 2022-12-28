import {RESERVED_FLAG_NAMES} from "./name_denylist";

/**
 * Represents a single command-line flag.
 */
export class Flag {

  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: FlagType;
  readonly default: string;

  private internalIsPresent: boolean = false;
  private internalValue: string|null = null;

  constructor(config: FlagConfig) {
    Flag.assertConfigValid(config);
    this.name = config.name;
    this.description = config.description;
    this.required = config.required !== undefined ? config.required : false;
    this.type = config.type !== undefined ? config.type : FlagType.FLAG;
    this.default = config.default !== undefined ? config.default : "";
  }

  /**
   * Returns true if this flag is present on this run. Will always return false
   * before flags are parsed with StrictFlags.parse().
   */
  isPresent(): boolean {
    return this.internalIsPresent;
  }

  /**
   * Returns the value of this flag, if this flag is a PROPERTY type and has
   * a value. Otherwise returns the default.
   * @throws Throws if this flag is not a PROPERTY.
   */
  get(): string {
    if (this.type !== FlagType.PROPERTY) {
      throw new Error(
          `Cannot .get() value of the flag named '${this.name}', it is not a ` +
          `property flag.`);
    }
    if (this.internalValue !== null) return this.internalValue;
    return this.default;
  }

  /**
   * Marks this flag as present. Should only be used in tests or by the actual
   * StrictFlags code. If this flag is PROPERTY type, a non-null value must be
   * supplied.
   * @throws Throws if this is a PROPERTY flag and no non-null value was
   *   provided. Also throws if this is a FLAG flag and any value is provided.
   */
  setPresence(value: string|null = null) {
    if (this.type === FlagType.PROPERTY && value === null) {
      throw new Error(
          `.setIsPresent() was called for the flag '${this.name}', but no ` +
          `value was provided. This flag is a PROPERTY flag so it must come ` +
          `with a non-null value if it is present.`);
    }
    if (this.type === FlagType.FLAG && value !== null) {
      throw new Error(
          `.setIsPresent() was called for the flag '${this.name}' with a ` +
          `value. That flag is of type FLAG and therefore doesn't include a ` +
          `value.`);
    }

    this.internalIsPresent = true;
    if (value !== null) this.internalValue = value;
  }

  /**
   * Given a list of arguments, tries to locate this flag within them. If
   * successful, sets presence and value, or throws if something is amiss.
   * Removes itself from the list of arguments once complete.
   */
  parse(args: string[]): string[] {
    const fullName = this.getFullName();
    let foundFlagArg: string|null = null;
    let foundPosition = -1;

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith(fullName)
          || (this.type === FlagType.PROPERTY
              && arg.startsWith(fullName + "="))) {
        foundFlagArg = arg;
        foundPosition = i;
        break;
      }
    }

    if (foundFlagArg === null && this.required) {
      throw new Error(`${fullName} is required, please specify it.`);
    }
    if (foundFlagArg === null) return args;

    // At this point, we've found the flag for sure, so if it is just a FLAG
    // then set presence and finish up.
    if (this.type === FlagType.FLAG) {
      this.setPresence();
      args.splice(foundPosition, 1);
      return args;
    }

    // Otherwise, we have a flag, and we know it is an ARGUMENT. We must now
    // gather the value for the argument, which can be provided either with an
    // "=" or with a space, ie.:
    //
    //  -my-argument=foobar
    //  -my-argument foobar
    const argWithoutFlag = foundFlagArg.substring(fullName.length);

    // This means the value (should) be specified in the next arg.
    if (argWithoutFlag.trim() === "") {
      // There isn't another arg
      if (!args[foundPosition + 1]) this.throwNoValueError();
      this.setPresence(args[foundPosition + 1]!);
      args.splice(foundPosition, 2);
      return args;
    }

    // If we've reached here, the value (should) be specified after an equals
    // sign, optionally surrounded by quotes ("):
    //
    //  -my-argument=foobar
    let workingValue = argWithoutFlag;
    // Remove "="
    workingValue = workingValue.substring(1);
    // Remove quotes
    if (workingValue.startsWith("\"") && workingValue.endsWith("\"")) {
      workingValue = workingValue.substring(1, workingValue.length - 1);
    }
    
    // set value
    if (workingValue.trim() === "") this.throwNoValueError();
    this.setPresence(workingValue);
    args.splice(foundPosition, 1);
    return args;
  }

  /**
   * Returns the leading dashes that are used to form this entire flag.
   */
  getPrefix(): string {
    switch (this.type) {
      case FlagType.FLAG:
        return "--";
      case FlagType.PROPERTY:
        return "-";
      default:
        throw new Error("This should never be reached.");
    }
  }

  /**
   * Returns the full name of this flag, with the leading dashes.
   */
  getFullName(): string {
    return `${this.getPrefix()}${this.name}`;
  }

  private throwNoValueError() {
    throw new Error(
        `Argument ${this.getFullName()} specified, but without a value. ` +
        `Please specify a value by passing one of:\n` +
        `${this.getFullName()}=<value>\n` +
        `${this.getFullName()} <value>`);
  }

  /**
   * Asserts the given config is valid by verifying the following conditions
   * are true:
   * 
   *   - If this has the FLAG type, it does not also include a default.
   * 
   *   - The flag name is not a reserved flag name.
   */
  private static assertConfigValid(config: FlagConfig) {
    if (config.type === FlagType.FLAG && config.default !== undefined) {
      throw new Error(
          `Cannot build flag "${config.name}": this flag is a FLAG but a ` +
          `default was specified. FLAG-type flags don't have values, so a ` +
          `default doesn't do anything.`);
    }

    if (RESERVED_FLAG_NAMES.includes(config.name)) {
      throw new Error(
          `Cannot create a flag with the name '${config.name}', that name is ` +
          `reserved by the strict-args library.`);
    }
  }

}

export interface FlagConfig {
  /**
   * The name of the flag, without the preceding dashes. Typically this is in
   * kebab-case, ie. "my-cool-flag".
   */
  name: string;
  /**
   * The description of the flag, used when a user runs "yourcli --help" or
   * "yourcli help <command>".
   */
  description: string;
  /**
   * Defaults to false. Whether or not to stop execution and alert if this flag
   * isn't present.
   */
  required?: boolean;
  /**
   * Defaults to FLAG. The type of this flag.
   */
  type?: FlagType;
  /**
   * Defaults to an empty string. The default value to fall back on if no value
   * is provided by the user.
   */
  default?: string;
}

export enum FlagType {
  FLAG = 0,
  PROPERTY = 1,
}
