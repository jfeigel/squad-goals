const userModel = require('../models/user');
const sockets = require('./sockets');

const _ = require('lodash');

module.exports.get = async function(ctx) {
  const user = await userModel.get(ctx.params.id);
  delete user.password;
  delete user.enabled;
  ctx.body = user;
};

module.exports.search = async function(ctx) {
  const query = ctx.query.query;
  if (query && query.length > 0) {
    const users = await userModel.search(decodeURIComponent(query));
    return (ctx.body = users);
  }
  ctx.body = [];
};

module.exports.getByEmail = async function(ctx) {
  const user = await userModel.getByEmail(ctx.params.email);
  delete user.password;
  delete user.enabled;
  ctx.body = user;
};

module.exports.getFriends = async function(ctx) {
  const user = await userModel.get(ctx.params.id);
  delete user.password;
  delete user.enabled;
  let allFriends = await userModel.getFriends(ctx.params.id);
  allFriends = _.map(allFriends, friend => {
    const userFriend = _.find(user.friends, { id: friend._id });
    friend.status = userFriend.status;
    friend.confirm = userFriend.confirm;
    return friend;
  });
  const [friends, pendingFriends] = _.partition(allFriends, {
    status: 'Active'
  });
  ctx.body = { user: user, friends: friends, pendingFriends: pendingFriends };
};

module.exports.addFriend = async function(ctx) {
  const { user, friend } = await userModel.addFriend(
    ctx.params.id,
    ctx.request.body.friend_id
  );
  user.status = 'Pending';
  user.confirm = friend._id;
  sockets.friend({
    type: 'ADD_FRIEND',
    id: ctx.request.body.friend_id,
    friend: user,
    status: 'Pending'
  });
  friend.status = 'Pending';
  friend.confirm = ctx.request.body.friend_id;
  ctx.body = friend;
};

module.exports.confirmFriend = async function(ctx) {
  const { user, friend } = await userModel.confirmFriend(
    ctx.params.id,
    ctx.request.body.friend_id
  );
  sockets.friend({
    type: 'CONFIRM_FRIEND',
    id: ctx.request.body.friend_id,
    friend: user,
    status: 'Active'
  });
  ctx.body = friend;
};
