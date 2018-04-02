const config = require('./config.json');

const app = require('./index').app;
const passport = require('./index').passport;
const Router = require('koa-router');
const fs = require('fs');

const user = require('./controllers/user');
const goals = require('./controllers/goals');
const friends = require('./controllers/friends');

const routes = new Router();

function loadHtml() {
  return new Promise(function(resolve, reject) {
    fs.readFile(
      './dist/index.html',
      {
        encoding: 'utf8'
      },
      function(err, data) {
        if (err) return reject(err);
        resolve(data);
      }
    );
  });
}

if (process.env.NODE_ENV === 'production') {
  routes.get(/^\/(.*)(?:\/|$)/, async function(ctx, next) {
    if (ctx.request.url.startsWith('/api')) {
      await next;
    } else {
      ctx.body = await loadHtml();
    }
  });
}

routes.post('/api/login', function(ctx, next) {
  return passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (user === false) {
      ctx.status = 401;
      ctx.body = { success: false };
    } else {
      delete user.error;
      delete user.password;
      ctx.body = user;
      return ctx.login(user);
    }
  })(ctx, next);
});

routes.post('/api/logout', function(ctx) {
  ctx.logout();
  ctx.status = 204;
});

routes.post('/api/user/signup', user.signup);
routes.post('/api/user/confirm', user.confirmAccount);
routes.put('/api/user/', user.save);
routes.get('/api/user/id/:id', user.get);
routes.get('/api/user/email/:email', user.getByEmail);
routes.get('/api/user/search', user.search);

routes.get('/api/goals/:id', goals.get);
routes.get('/api/goals/user/:id', goals.getByUser);
routes.post('/api/goals', goals.create);
routes.put('/api/goals', goals.replace);
routes.del('/api/goals', goals.remove);

routes.get('/api/friends/:id', friends.get);
routes.get('/api/friends/user/:id', friends.getByUser);
routes.post('/api/friends', friends.save);

app.use(routes.middleware());
