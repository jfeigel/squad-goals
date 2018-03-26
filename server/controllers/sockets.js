const config = require('../config.json');
const app = require('../index').app;
const io = app.io;

io.on('connection', (ctx, data) => {
  console.log('join event fired', data);
});

io.on('disconnect', (ctx, data) => {
  console.log('leave event fired', data);
});

module.exports.friend = data => {
  io.broadcast('friend', data);
};
