const { Command, flags } = require('@oclif/command')
const inquirer = require('inquirer');
const joi = require('@hapi/joi');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const db = `${path.dirname(__dirname)}/data.json`;
axios.defaults.baseURL = 'https://stitch.mongodb.com/api/admin/v3.0';


class UseCommand extends Command {
  apps = [];
  getProjects = () => {
    const data = fs.readJSONSync(db);
    if (!data.accessToken) {
      this.log('You are not logged in.')
      this.exit();
    } else {
      this.apps = data.apps.map(app => app.name);
    }
  }
  getActiveProject = () => {
    const data = fs.readJSONSync(db);
    return data.activeProject ? ` ${data.activeProject} is currently active` : '';
  }
  prompt = async () => {
    const prompts = [];
    prompts.push({
      name: 'project',
      message: 'Choose project to make active',
      type: 'list',
      choices: this.apps,
      suffix: this.getActiveProject()
    });
    return await inquirer.prompt(prompts);
  }
  async run() {
    this.getProjects();
    const { project } = await this.prompt();
    const data = fs.readJSONSync(db);
    data.activeProject = project;
    fs.writeJSONSync(db, data);
    this.log(`${project} is now active`);
  }
}

UseCommand.description = `set an active Stitch project`

UseCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = UseCommand
