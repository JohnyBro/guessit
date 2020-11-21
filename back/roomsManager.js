const io = require('./socketio')
const { customAlphabet, urlAlphabet } = require('nanoid')
const roomCode = customAlphabet(urlAlphabet, 5)
const Room = require('./room')

let gameRooms = {}

function createRoom(socket, roomName) {
    const roomID = roomCode()

    if (!gameRooms[roomID]) {
        gameRooms[roomID] = new Room(roomID, roomName)
        socket.emit("roomCode", roomID)
    } else {
        console.log(`room id ${roomID} already taken`);
        createRoom(socket, roomName)
    }
}

async function joinRoom(socket, roomID, pseudo) {
    console.log(`${socket.id} is joining room ${roomID} as ${pseudo}`)

    if (!gameRooms[roomID]) {
        socket.emit("noRoom", "This room doesn't exist")
        return
    }

    let gameRoom = gameRooms[roomID]

    gameRoom.join(socket, pseudo)

    socket.once('disconnect', async () => {
        await leaveRoom(socket, roomID)
    })

    //console.log(gameRooms);
}

async function leaveRoom(socket, roomID) {
    //If the room doesn't exists
    if (!gameRooms[roomID]) {
        return
    }

    let gameRoom = gameRooms[roomID]

    console.log(`${socket.id} is leaving room ${roomID}`)
    await gameRoom.leave(socket)

    if (gameRoom.playerCount <= 0) {
        console.log('room empty, deleting');
        delete gameRooms[roomID]
    }

    //console.log(gameRooms);
}

async function startGame(socket, roomID){
    if (!gameRooms[roomID]) return

    gameRooms[roomID].startGame(socket)
}

module.exports.createRoom = createRoom
module.exports.joinRoom = joinRoom
module.exports.leaveRoom = leaveRoom
module.exports.startGame = startGame