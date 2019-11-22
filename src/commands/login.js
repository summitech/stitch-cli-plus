const { Command, flags } = require('@oclif/command');
const inquirer = require('inquirer');
const joi = require('@hapi/joi');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const db = `${path.dirname(__dirname)}/data.json`;
axios.defaults.baseURL = 'https://stitch.mongodb.com/api/admin/v3.0';


const validateInput = (input) => {
  const { error } = joi.string().required().error(new Error('Value is required and MUST be a string')).validate(input);
  return error ? error.message : true;
}
class LoginCommand extends Command {
  getAnswers = async() => {
    const prompts = [];
    prompts.push({
      name: 'public',
      message: 'Enter public key',
      validate: (answer) => validateInput(answer)
    });
    prompts.push({
      name: 'private',
      message: 'Enter private key',
      validate: (answer) => validateInput(answer)
    });
    return await inquirer.prompt(prompts);
  }
  login = async ({privateKey, publicKey}) => {
    try {
      const {data} = await axios.post('/auth/providers/mongodb-cloud/login', {
      username: publicKey,
      apiKey: privateKey
      });
      const apps = await this.getProfile(data.access_token);
      fs.writeJSONSync(db,
        {
          privateKey,
          publicKey,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          userId: data.user_id,
          apps
        });
    } catch (result) {
      throw new Error(result.response.data.error);
    }
  }
  getProfile = async (token) => {
    const {data} = await axios.get('/auth/profile', {
      headers: {Authorization: `Bearer ${token}`}
    });
    let groupIds = data.roles.filter(role => role.group_id).map(role => role.group_id);
    groupIds = [... new Set(groupIds)];
    const groups$ = groupIds.map(id => axios.get(`/groups/${id}/apps`, {
      headers: {Authorization: `Bearer ${token}`}
    }));
    let apps = await Promise.all(groups$);
    apps = apps.filter(app => app.data.length > 0).map(app => app.data);
    return apps[0];
  }
  async run() {
    const data = fs.readJSONSync(db);
    if (data.accessToken) {
      this.log(`You are already logged in with public key: ${data.publicKey}`);
      this.exit();
    }
    const answers = await this.getAnswers();
    const user = {
      publicKey: answers.public,
      privateKey: answers.private
    };
    fs.writeJSONSync(db, user);
    await this.login(user);
    this.log('Logged In');
  }
}

LoginCommand.description = `Login programatically using your API key`

LoginCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = LoginCommand
