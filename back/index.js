const { io } = require('./socketio')
const roomsManager = require("./roomsManager")

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
})