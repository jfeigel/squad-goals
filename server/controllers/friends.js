const config = require('../config.json');
const friendsModel = require('../models/friends');
const sockets = require('./sockets');

const _ = require('lodash');

module.exports = {
  get: async function get(ctx) {
    const friend = await friendsModel.get(ctx.params.id);
    ctx.body = friend;
  },
  getByUser: async function getByUser(ctx) {
    const friends = await friendsModel.getByUser(ctx.params.id);
    ctx.body = friends;
  },
  save: async function save(ctx) {
    const confirmation = await friendsModel.save(ctx.request.body);
    ctx.body = confirmation;
  }
};
