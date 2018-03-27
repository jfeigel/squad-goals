const config = require('../config.json');
const db = require('../helpers/db');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

module.exports = {
  create: async function create() {
    const confirmation = await db.createDatabase(`${config.id}_user`);
    return confirmation;
  },
  generate: data => {
    const returnObj = {
      enabled: false,
      name: 'John Doe',
      password: null,
      friends: []
    };
    const user = Object.assign(returnObj, data);
    if (user.password) {
      user.password = encryptPassword(user.password);
    }
    return user;
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
  getByEmail: async function get(email) {
    const document = await db.runView(
      'user/byEmail',
      email,
      `${config.id}_user`
    );
    if (document.results.length === 0) {
      return null;
    }
    let user = document.results[0].value;
    user.error = document.error;
    return user;
  },
  getFriends: async function getFriends(id) {
    const document = await db.runView('user/friends', id, `${config.id}_user`);
    const friends = _.map(document.results, 'value');
    return friends;
  },
  addFriend: async function addFriend(user_id, friend_id) {
    const user = await db.getDocument(user_id, `${config.id}_user`);
    const friend = await db.getDocument(friend_id, `${config.id}_user`);
    user.friends.push({ id: friend_id, status: 'Pending', confirm: friend_id });
    friend.friends.push({ id: user_id, status: 'Pending', confirm: friend_id });
    const userConfirmation = await this.save(user);
    delete userConfirmation.enabled;
    delete userConfirmation.password;
    const friendConfirmation = await this.save(friend);
    delete friendConfirmation.enabled;
    delete friendConfirmation.password;
    return { user: userConfirmation, friend: friendConfirmation };
  },
  confirmFriend: async function confirmFriend(user_id, friend_id) {
    const user = await db.getDocument(user_id, `${config.id}_user`);
    const friend = await db.getDocument(friend_id, `${config.id}_user`);
    const userIndex = _.findIndex(user.friends, { id: friend_id });
    user.friends[userIndex].status = 'Active';
    const friendIndex = _.findIndex(friend.friends, { id: user_id });
    friend.friends[friendIndex].status = 'Active';
    const userConfirmation = await this.save(user);
    delete userConfirmation.enabled;
    delete userConfirmation.password;
    const friendConfirmation = await this.save(friend);
    delete friendConfirmation.enabled;
    delete friendConfirmation.password;
    return { user: userConfirmation, friend: friendConfirmation };
  },
  search: async function search(query) {
    const opts = {
      startkey: query,
      endkey: `${query}\u9999`
    };
    const document = await db.runView(
      'user/byEmail',
      opts,
      `${config.id}_user`
    );
    const users = _.map(document.results, 'value');
    return users;
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
