const config = require('../config.json');
const userModel = require('../models/user');
const goalsModel = require('../models/goals');
const registrationModel = require('../models/registration');
const emailService = require('../services/email');
const sockets = require('./sockets');

const _ = require('lodash');
const jwt = require('jsonwebtoken');

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

module.exports.signup = async function(ctx) {
  const existing = await userModel.getByEmail(ctx.request.body.email);
  if (existing) {
    ctx.throw(400, 'Email already exists');
  }
  const user = userModel.generate(ctx.request.body);
  const userConfirmation = await userModel.save(user);
  const registration = registrationModel.generate(userConfirmation.id);
  const registrationConfirmation = await registrationModel.save(registration);
  emailService.register({
    email: userConfirmation.email,
    token: registrationConfirmation.token
  });
  const goals = {
    user: userConfirmation.id,
    goals: []
  };
  const goalsConfirmation = await goalsModel.save(goals);
  ctx.status = 201;
};

module.exports.confirmAccount = async function(ctx) {
  const token = ctx.request.body.token;
  let decoded = jwt.decode(token);
  const registration = await registrationModel.getByUser(decoded.id);
  if (!registration || registration.token !== token) {
    ctx.throw(
      400,
      'Confirmation not found. Please verify the link is correct and you have not already confirmed your account.'
    );
  }
  try {
    decoded = jwt.verify(token, config.site.secret);
  } catch (err) {
    let message;
    if (err.name === 'TokenExpiredError') {
      message =
        'Your confirmation token has expired. Please check your email for a new confirmation link.';
      decoded = jwt.decode(token);
      const userToNotify = await userModel.get(decoded.id);
      const registrationToUpdate = await registrationModel.getByUser(
        decoded.id
      );
      const newRegistration = registrationModel.generate(decoded.id);
      registrationToUpdate.token = newRegistration.token;
      registrationToUpdate.expires = newRegistration.expires;
      const registrationToUpdateConfirmation = await registrationModel.save(
        registrationToUpdate
      );
      emailService.register({
        email: userToNotify.email,
        token: registrationToUpdateConfirmation.token
      });
    } else {
      message =
        'Your confirmation token is invalid. Please check the link and try again.';
    }
    ctx.throw(401, message);
  }
  const registrationConfirmation = await registrationModel.remove(
    registration._id
  );
  const user = await userModel.get(decoded.id);
  user.enabled = true;
  const userConfirmation = await userModel.save(user);
  delete userConfirmation.password;
  ctx.body = userConfirmation;
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
