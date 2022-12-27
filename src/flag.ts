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
   * Asserts the given config is valid by verifying the following conditions
   * are true:
   *   - If this has the FLAG type, it does not also include a default.
   */
  private static assertConfigValid(config: FlagConfig) {
    if (config.type === FlagType.FLAG && config.default !== undefined) {
      throw new Error(
          `Cannot build flag "${config.name}": this flag is a FLAG but a ` +
          `default was specified. FLAG-type flags don't have values, so a ` +
          `default doesn't do anything.`);
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
