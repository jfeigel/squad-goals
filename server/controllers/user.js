const userModel = require('../models/user');

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
  const friends = await userModel.getFriends(ctx.params.id);
  ctx.body = { user: user, friends: friends };
};

module.exports.addFriend = async function(ctx) {
  const user = await userModel.addFriend(
    ctx.params.id,
    ctx.request.body.friend_id
  );
  ctx.body = user;
};
