stitch-cli-plus
===============

A CLI that extends the original stitch cli and allows developers do more

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/stitch-cli-plus.svg)](https://npmjs.org/package/stitch-cli-plus)
[![Downloads/week](https://img.shields.io/npm/dw/stitch-cli-plus.svg)](https://npmjs.org/package/stitch-cli-plus)
[![License](https://img.shields.io/npm/l/stitch-cli-plus.svg)](https://github.com/[object Object]/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g stitch-cli-plus
$ msp COMMAND
running command...
$ msp (-v|--version|version)
stitch-cli-plus/1.0.0 darwin-x64 node-v12.13.0
$ msp --help [COMMAND]
USAGE
  $ msp COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`msp functions:test`](#msp-functionstest)
* [`msp help [COMMAND]`](#msp-help-command)
* [`msp login`](#msp-login)
* [`msp logout`](#msp-logout)
* [`msp use`](#msp-use)

## `msp functions:test`

Describe the command here

```
USAGE
  $ msp functions:test

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/functions/test.js](https://github.com/summitech/stitch-cli-plus/blob/v1.0.0/src/commands/functions/test.js)_

## `msp help [COMMAND]`

display help for msp

```
USAGE
  $ msp help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `msp login`

Login programatically using your API key

```
USAGE
  $ msp login

OPTIONS
  -n, --name=name  name to print
```

_See code: [src/commands/login.js](https://github.com/summitech/stitch-cli-plus/blob/v1.0.0/src/commands/login.js)_

## `msp logout`

Logout

```
USAGE
  $ msp logout

OPTIONS
  -n, --name=name  name to print
```

_See code: [src/commands/logout.js](https://github.com/summitech/stitch-cli-plus/blob/v1.0.0/src/commands/logout.js)_

## `msp use`

set an active Stitch project

```
USAGE
  $ msp use

OPTIONS
  -n, --name=name  name to print
```

_See code: [src/commands/use.js](https://github.com/summitech/stitch-cli-plus/blob/v1.0.0/src/commands/use.js)_
<!-- commandsstop -->
