const io = require('./socketio')
const { customAlphabet, urlAlphabet } = require('nanoid')
const roomCode = customAlphabet(urlAlphabet, 5)

let rooms = []

function createRoom(socket, roomName) {
    const roomID = roomCode()
    if (!rooms[roomID]) {
        rooms[roomID] = { name: roomName, sockets: [] }
        socket.emit("roomCode", roomID)
    } else {
        console.log(`room id ${roomID} already taken`);
        createRoom(socket, roomName)
    }

    console.log(rooms);
}

function joinRoom(socket, roomID, pseudo) {
    if (!rooms[roomID]) {
        return
    }

    socket.pseudo = pseudo
    rooms[roomID].sockets.push(socket)
    socket.join(roomID)
    socket.on('disconnect', () => {
        delete rooms[roomID].sockets[socket]
        if (rooms[roomID].sockets.lenght <= 0) {
            console.log('room empty, deleting');
            delete rooms[roomID]
        }
    })

    socket.emit("roomJoined", rooms[roomID])
}

module.exports.createRoom = createRoom
module.exports.joinRoom = joinRoom