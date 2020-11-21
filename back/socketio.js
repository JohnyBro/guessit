const config = require("./config")
const io = require('socket.io')(config.socketPort)

module.exports.io = io;