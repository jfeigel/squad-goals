const config = require('../config.json');
const db = require('../helpers/db');

module.exports = {
  create: async function create() {
    const confirmation = await db.createDatabase(`${config.id}_goals`);
    return confirmation;
  },
  generate: data => {
    const returnObj = {
      title: null,
      amount: 0,
      m: false,
      t: false,
      w: false,
      th: false,
      f: false,
      sa: false,
      su: false
    };
    return Object.assign(returnObj, data);
  },
  get: async function get(id) {
    const document = await db.runView(
      'goals/currentGoals',
      id,
      `${config.id}_goals`
    );
    let goals = document.results[0].value || [];
    goals.error = document.error;
    return goals;
  },
  replace: async function replace(document) {
    const body = await db.getDocument(document.id, `${config.id}_goals`);
    document._id = body._id;
    document._rev = body._rev;
    const confirmation = await db.saveDocument(document, `${config.id}_goals`);
    return confirmation;
  },
  save: async function save(document) {
    const confirmation = await db.saveDocument(document, `${config.id}_goals`);
    return confirmation;
  },
  remove: async function remove(id) {
    const confirmation = await db.removeDocument(id, `${config.id}_goals`);
    return confirmation;
  }
};
