const _ = require('lodash');

const goalsModel = require('../models/goals');

module.exports.get = async function(ctx) {
  const goals = await goalsModel.get(ctx.params.id);
  ctx.body = goals;
};

module.exports.create = async function(ctx) {
  const body = ctx.request.body;
  if (!body.id) {
    ctx.status = 400;
    return (ctx.body = { error: true, message: 'Must provide an ID' });
  }
  const document = goalsModel.generate(body);
  const result = await goalsModel.save(document);
  ctx.body = document;
};

module.exports.replace = async function(ctx) {
  const goal = ctx.request.body;
  if (!goal.id) {
    ctx.status = 400;
    return (ctx.body = { error: true, message: 'Must provide an ID' });
  }
  const document = await goalsModel.get(goal.id);
  if (document.error === true) {
    ctx.status = 400;
    return (ctx.body = { error: true, message: 'Must provide a valid ID' });
  }
  const result = await goalsModel.replace(goal);
  ctx.body = result;
};

module.exports.remove = async function(ctx) {
  const id = ctx.request.body.id;
  if (!id) {
    ctx.status = 400;
    return (ctx.body = { error: true, message: 'Must provide an ID' });
  }
  const result = await goalsModel.remove(id);
  this.body = result;
};
