const config = require('../config.json');
const db = require('../helpers/db');
const bcrypt = require('bcryptjs');

module.exports = {
  create: async function create() {
    const confirmation = await db.createDatabase(`${config.id}_user`);
    return confirmation;
  },
  generate: data => {
    const returnObj = {
      id: null,
      enabled: false,
      name: 'John Doe',
      password: null
    };
    return Object.assign(returnObj, data);
  },
  changePassword: async function changePassword(id, data) {
    const document = await db.getDocument(id, `${config.id}_user`);
    const match = comparePassword(data.oldPass, document.password);
    if (match === true) {
      document.password = encryptPassword(data.newPass);
      const updatedDocument = await db.saveDocument(
        document,
        `${config.id}_user`
      );
      return updatedDocument;
    }
    return {
      error: true,
      message: 'Passwords did not match'
    };
  },
  get: async function get(id) {
    const document = await db.getDocument(id, `${config.id}_user`);
    return document;
  },
  save: async function save(document) {
    const confirmation = await db.saveDocument(document, `${config.id}_user`);
    return confirmation;
  }
};

function encryptPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

function comparePassword(enteredPass, savedPass) {
  return bcrypt.compareSync(enteredPass, savedPass);
}
