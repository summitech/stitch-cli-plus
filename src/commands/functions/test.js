const { Command, flags } = require('@oclif/command')
const inquirer = require('inquirer');
const fs = require('fs-extra');
const axios = require('axios');
axios.defaults.baseURL = 'https://stitch.mongodb.com/api/admin/v3.0';
const { fetchUsers, isLoggedIn, isValidStitchProject, storage, refreshSession } = require('../../../utils');
const validator = require('../../validation');

class TestCommand extends Command {
  executeFunction = async (name, payload, isSystemUser, userId) => {
    const params = isSystemUser ? {run_as_system: true} : {user_id: userId}
    const db = fs.readJSONSync(storage);
    const { activeProject: { _id, group_id }, accessToken } = db;
    try {
      const {data} = await axios.post(`/groups/${group_id}/apps/${_id}/debug/execute_function`, {
          name,
          arguments: [payload]
      },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          params
        }
      );
      console.log(data.result);
    } catch ({response}) {
      if (response.data.error_code === 'InvalidSession') {
        await refreshSession();
        await this.executeFunction(name, payload);
      } else {
        throw new Error(response.data.error);
      }
    }
  }


  prompt = async () => {
    const prompts = [];
    prompts.push({
      name: 'fnName',
      message: 'Enter function name',
      validate: (answer) => validator.validateStringInput(answer)
    });
    prompts.push({
      name: 'payloadType',
      message: 'Choose Payload source',
      type: 'list',
      choices: ['file', 'inline']
    });
    prompts.push({
      name: 'args',
      message: 'Enter payload',
      validate: (input) => validator.validateInput(input),
      when: (answer) => answer.payloadType === 'inline'
    });
    prompts.push({
      name: 'path',
      message: 'Enter file path',
      validate: (input) => validator.validateInput(input),
      when: (answer) => answer.payloadType === 'file'
    });
    prompts.push({
      name: 'isSystemUser',
      message: 'Run as system user?',
      type: 'confirm',
      default: true
    });
    prompts.push({
      name: 'email',
      message: 'Enter user email',
      validate: (email) => validator.validateStringInput(email),
      when: (answer) => !answer.isSystemUser
    });
    return await inquirer.prompt(prompts);
  }
  async run() {
    isLoggedIn();
    isValidStitchProject();
    const answer = await this.prompt();
    const { fnName, payloadType, args, path, isSystemUser, email } = answer;
    let userId;
    if (email) {
      const users = await fetchUsers();
      const user = users.filter(user => user.data).find(user => user.data.email === email);
      if (user && user._id) {
        userId = user._id
      } else {
        throw new Error('user does not exist');
      }
    }
    const payload = payloadType === 'inline' ? args : fs.readSync(path);
    this.executeFunction(fnName, payload, isSystemUser, userId);
  }
}

TestCommand.description = `Test functions locally`

TestCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = TestCommand
