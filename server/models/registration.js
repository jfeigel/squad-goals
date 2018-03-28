const config = require('../config.json');
const db = require('../helpers/db');
const jwt = require('jsonwebtoken');

module.exports = {
  create: async function create() {
    const confirmation = await db.createDatabase(`${config.id}_registration`);
    return confirmation;
  },
  generate: user => {
    const token = jwt.sign({ id: user }, config.site.secret, {
      expiresIn: 10800
    });
    const decoded = jwt.decode(token);
    return {
      user: user,
      token: token,
      expires: decoded.iat
    };
  },
  get: async function get(id) {
    const document = await db.getDocument(id, `${config.id}_registration`);
    return document;
  },
  getByUser: async function getByUser(user_id) {
    const document = await db.runView(
      'registration/byUser',
      user_id,
      `${config.id}_registration`
    );
    if (document.results.length === 0) {
      return null;
    }
    return document.results[0].value;
  },
  save: async function save(document) {
    const confirmation = await db.saveDocument(
      document,
      `${config.id}_registration`
    );
    return confirmation;
  },
  remove: async function remove(id) {
    const confirmation = await db.removeDocument(
      id,
      `${config.id}_registration`
    );
    return confirmation;
  }
};
