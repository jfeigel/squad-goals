const _ = require('lodash');

const goalsModel = require('../models/goals');

module.exports = {
  get: async function get(ctx) {
    const goal = await goalsModel.get(ctx.params.id);
    ctx.body = goal;
  },
  getByUser: async function getByUser(ctx) {
    const goals = await goalsModel.getByUser(ctx.params.id);
    ctx.body = goals;
  },
  create: async function create(ctx) {
    const body = ctx.request.body;
    if (!body.id) {
      ctx.status = 400;
      return (ctx.body = { error: true, message: 'Must provide an ID' });
    }
    const document = goalsModel.generate(body);
    const result = await goalsModel.save(document);
    ctx.body = document;
  },
  replace: async function replace(ctx) {
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
  },
  remove: async function remove(ctx) {
    const id = ctx.request.body.id;
    if (!id) {
      ctx.status = 400;
      return (ctx.body = { error: true, message: 'Must provide an ID' });
    }
    const result = await goalsModel.remove(id);
    this.body = result;
  }
};
