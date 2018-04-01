const config = require('../config.json');
const db = require('../helpers/db');
const userModel = require('./user');

const _ = require('lodash');

module.exports = {
  create: async function create() {
    const confirmation = await db.createDatabase(`${config.id}_friends`);
    return confirmation;
  },
  generate: data => {
    const returnObj = {
      user: null,
      friends: []
    };
    return Object.assign(returnObj, data);
  },
  get: async function get(id) {
    const document = await db.getDocument(id, `${config.id}_friends`);
    return document;
  },
  getByUser: async function getByUser(id) {
    const document = await db.runView(
      'friends/byUser',
      id,
      `${config.id}_friends`
    );
    let friends = _.map(document.results, 'value');
    friends = await Promise.all(
      _.map(friends, async friend => {
        const data = await userModel.get(friend.friend);
        delete data.password;
        delete data.error;
        return data;
      })
    );
    return friends;
  },
  save: async function save(document) {
    const confirmation = await db.saveDocument(
      document,
      `${config.id}_friends`
    );
    return confirmation;
  }
};
