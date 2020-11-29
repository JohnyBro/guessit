const { io } = require('./socketio')
const roomsManager = require("./roomsManager")
const db = require("./mongoose")
const submitManager = require('./submitManager')

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
    console.log("Database connected")
})

io.on('connect', socket => {

    socket.on('createRoom', (roomName) => {
        roomsManager.createRoom(socket, roomName)
    })

    socket.on('joinRoom', (roomID, pseudo) => {
        roomsManager.joinRoom(socket, roomID, pseudo)
    })

    socket.on('leaveRoom', roomID => {
        roomsManager.leaveRoom(socket, roomID)
    })

    socket.on('startGame', roomID => {
        roomsManager.startGame(socket, roomID)
    })

    socket.on('guess', (roomID, guess, cb) => {
        roomsManager.guess(socket, roomID, guess, cb)
    })

    socket.on('submitImage', (data, cb) => {
        cb("OK")
        submitManager.submit(data)
    })
})