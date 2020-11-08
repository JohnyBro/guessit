const { io } = require('./socketio')
const roomsManager = require("./roomsManager")

let rooms = []

io.on('connect', socket => {
    socket.on('createRoom', (roomName) => {
        roomsManager.createRoom(socket, roomName)
    })

    socket.on('joinRoom', (roomID, pseudo) => {
        roomsManager.joinRoom(socket, roomID, pseudo)
    })
})