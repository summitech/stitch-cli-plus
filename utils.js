const path = require('path');
const fs = require('fs-extra');
const db = `${path.dirname(__filename)}/data.json`;
const workingDirectory = process.cwd();
const axios = require('axios');
axios.defaults.baseURL = 'https://stitch.mongodb.com/api/admin/v3.0';

module.exports.storage = db;

module.exports.isLoggedIn = function () {
  const data = fs.readJSONSync(db);
  if (!data.accessToken) {
    throw new Error('You are not logged in.');
  }
}

module.exports.isValidStitchProject = function(){
  const valid = fs.pathExistsSync(`${workingDirectory}/stitch.json`);
  if (!valid) {
    throw new Error('This is not a stitch project');
  }
}

module.exports.refreshSession = async () => {
  const stitchData = fs.readJSONSync(db);
  const { data } = await axios.post(`auth/session`, {}, {
    headers: {
      Authorization: `Bearer ${stitchData.refreshToken}`
    }
  });
  stitchData.accessToken = data.access_token;
  fs.writeJSONSync(db, stitchData);
}

module.exports.fetchUsers = async () => {
  const stitchData = fs.readJSONSync(db);
  const { activeProject: { _id, group_id }, accessToken } = stitchData;
  try {
    const { data } = await axios.get(`/groups/${group_id}/apps/${_id}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return data;
  } catch ({ response }) {
    if (response.data.error_code === 'InvalidSession') {
      await this.refreshSession();
      await this.fetchUsers();
    } else {
      throw new Error(response.data.error);
    }
  }
}