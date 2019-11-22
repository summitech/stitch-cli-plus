const { Command, flags } = require('@oclif/command')
const path = require('path');
const fs = require('fs-extra');
const db = `${path.dirname(__dirname)}/data.json`;

class LogoutCommand extends Command {
  async run() {
    fs.writeJSONSync(db, {});
    this.log(`You have been logged out`)
  }
}

LogoutCommand.description = `Describe the command here
...
Extra documentation goes here
`

LogoutCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = LogoutCommand
