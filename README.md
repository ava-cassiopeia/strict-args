# NodeJS Strict Args

[![Build and Test](https://github.com/ava-cassiopeia/strict-args/actions/workflows/build_and_test.yml/badge.svg?branch=main)](https://github.com/ava-cassiopeia/strict-args/actions/workflows/build_and_test.yml)

[GitHub Wiki](https://github.com/ava-cassiopeia/strict-args/wiki) \
[GitHub Issue Tracker](https://github.com/ava-cassiopeia/strict-args/issues)

A NodeJS arguments library which strictly enforces flag presence, command
syntax, alerts on unexpected flags, and manages help and command outputs. This
library's goal is to make developing new command line tools in Node easy and
user-friendly.

See this project's
[GitHub Wiki](https://github.com/ava-cassiopeia/strict-args/wiki) for API
documentation.

_This library is a spiritual successor to
[@ava-cassiopeia/really-simple-args](https://github.com/ava-cassiopeia/really-simple-args),
with a focus on stricter syntax checking._

---

<!-- TOC depthfrom:2 -->

- [Quickstart](#quickstart)
- [Contributing](#contributing)
  - [Development](#development)

<!-- /TOC -->

## Quickstart

To start, import `strict-args` as a (non-dev) dependency:

```shell
npm install --save strict-args
```

Then declare the available commands and flags for your tool:

```typescript
import {StrictArgs, FlagType} from "strict-args";

const strictArgs = new StrictArgs(
    // The name of your tool. This should match how the tool is invoked in the
    // command line, ie. if one types "fakecli" then the name here should be
    // "fakecli".
    /* name= */ "fakecli",
    // The description of your tool. This is printed on the various help screens
    // that StrictArgs will render if needed.
    /* description= */ "A fake CLI that does something interesting.");

// Declare commands, including optional flags for those commands.
strictArgs.registerCommand({
  name: "start",
  description: "Starts the webserver on port 8080.",
  flags: [
    {
      name: "debug",
      description: "If present, enables debug mode.",
      type: FlagType.FLAG, // flags don't take values
    },
    {
      name: "port",
      description: "Optional port for the server to run on. Defaults to 8080.",
      default: "8080",
      type: FlagType.PROPERTY, // properties take values
    },
  ],
});
strictArgs.registerCommand({
  name: "stop",
  description: "Stops any running webserver.",
});

// Optionally register global flags, ie. flags that are available for any
// command.
strictArgs.registerGlobalFlag({
  name: "some-flag",
  description: "Does something interesting when present.",
});

// Register "command listeners". Command listeners are classes which implement
// a common interface, and have a class method which is called whenever the
// specified command is run.
// See the section on command listeners for more information.
strictArgs.addCommandListener("start", (a) => new StartCommandListener(a));

// Once all setup and registration is complete, run parse() to run the program.
// Command listeners will automatically be called if the user specifies a
// command and flags correctly, otherwise the program will exit with a message
// explaining to the user how to use the application / what they did wrong.
strictArgs.parse(process.argv);
```

## Contributing

[GitHub Issue Tracker](https://github.com/ava-cassiopeia/strict-args/issues)

Feel free to file bugs and feature requests in the GitHub issue tracker.

Pull requests are also very much welcome, and will be reviewed on a "best
effort" basis. This is typically within a few days, but can sometimes take
awhile as this project is maintained by one human.

More information is available for developing with the codebase below.

### Development

NodeJS and NPM are required to do development on this project. You can find
installers or installation instructions for both here:
[nodejs.org](https://nodejs.org). Once those are installed, see below.

When your change feels complete, please send a PR where possible so I can merge
your code with the main code and publish it under the relevant NPM package.

To build the TypeScript code, run:

```shell
npm run build
```

To test the TypeScript code, run:

```shell
npm test
```

To test a local, fake CLI (code in `manualtest/`):

```shell
npm run manualtest
```
