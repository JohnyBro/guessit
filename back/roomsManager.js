const io = require('./socketio')
const { customAlphabet, urlAlphabet } = require('nanoid')
const roomCode = customAlphabet(urlAlphabet, 5)

let rooms = []

function createRoom(socket, roomName) {

    const roomID = roomCode()
    if (!rooms[roomID]) {
        rooms[roomID] = { name: roomName, players: {} }
        socket.emit("roomCode", roomID)
    } else {
        console.log(`room id ${roomID} already taken`);
        createRoom(socket, roomName)
    }
}

async function joinRoom(socket, roomID, pseudo) {
    console.log(`${socket.id} is joining room ${roomID} as ${pseudo}`)

    if (!rooms[roomID]) {
        socket.emit("noRoom", "This room doesn't exist")
        return
    }

    if (rooms[roomID].players[socket.id]) {
        socket.emit("roomJoined", rooms[roomID])
        return
    }

    rooms[roomID].players[socket.id] = { pseudo: pseudo }
    await socket.join(roomID)

    socket.on('disconnect', async () => {
        await leaveRoom(socket, roomID)
        socket.to(roomID).emit('roomUpdate', rooms[roomID])
    })
    console.log(rooms);
    socket.emit("roomJoined", rooms[roomID])
    socket.to(roomID).emit('roomUpdate', rooms[roomID])
}

async function leaveRoom(socket, roomID) {
    if (!rooms[roomID] || !rooms[roomID].players[socket.id]) {
        return
    }

    console.log('leaving room')

    await socket.leave(roomID)

    delete rooms[roomID].players[socket.id]

    if (Object.keys(rooms[roomID].players).length <= 0) {
        console.log('room empty, deleting');
        delete rooms[roomID]
    }
}

module.exports.createRoom = createRoom
module.exports.joinRoom = joinRoom
module.exports.leaveRoom = leaveRoom