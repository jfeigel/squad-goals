const config = require('./config.json');

const Koa = require('koa');
const cors = require('kcors');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
// Passport support
const session = require('koa-session2');
const redis = require('koa-redis');
const passport = require('koa-passport');
// Sockets
const KoaSocket = require('koa-socket');
const io = new KoaSocket();

const app = new Koa();
app.use(
  cors({
    credentials: true
  })
);

io.attach(app);

exports.app = app;
exports.passport = passport;

require('./models/auth');

// Trust proxy
app.proxy = true;

// Sessions
app.keys = [config.site.secret];
if (process.env.NODE_ENV === 'production') {
  app.use(
    session({
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
      store: redis()
    })
  );
} else {
  app.use(session());
}

// Body Parser
app.use(bodyParser());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Statically Serve Assets
if (process.env.NODE_ENV === 'production') {
  app.use(serve('./dist'));
}

app.use(async function response(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.app.emit('error', err, ctx);
    ctx.body = {
      error: true,
      message: String(err),
      api: ctx.state.api
    };
  }
});

require('./routes');

console.log(
  `${config.site.name} is now listening on port ${process.env.PORT ||
    config.site.port}`
);
app.listen(process.env.PORT || config.site.port);

process.on('SIGINT', () => {
  process.exit();
});
