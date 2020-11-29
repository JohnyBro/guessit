const io = require('./socketio')
const { customAlphabet, urlAlphabet } = require('nanoid')
const roomCode = customAlphabet(urlAlphabet, 5)
const Room = require('./room')

let gameRooms = {}

function createRoom(socket, roomName) {
    const roomID = roomCode()

    //If the room with this id doesn't exist
    if (!gameRooms[roomID]) {
        gameRooms[roomID] = new Room(roomID, roomName)
        socket.emit("roomCode", roomID)
    } else {
        console.log(`room id ${roomID} already taken`);
        createRoom(socket, roomName)
    }
}

async function joinRoom(socket, roomID, pseudo) {
    //If the room doesn't exists
    if (!gameRooms[roomID]) {
        socket.emit("noRoom", "This room doesn't exist")
        return
    }
    //Get the room
    let gameRoom = gameRooms[roomID]

    //Make the socket join the room
    gameRoom.join(socket, pseudo)

    //If the socket leave without using the "leaveRoom" event
    socket.once('disconnect', async () => {
        leaveRoom(socket, roomID)
    })
}

async function leaveRoom(socket, roomID) {
    //If the room doesn't exists
    if (!gameRooms[roomID]) {
        return
    }

    //Get the room
    let gameRoom = gameRooms[roomID]

    await gameRoom.leave(socket)

    if (gameRoom.playerCount <= 0) {
        console.log('room empty, deleting');
        gameRooms[roomID].clean()
        delete gameRooms[roomID]
    }
}

async function startGame(socket, roomID){
    if (!gameRooms[roomID]) return

    gameRooms[roomID].startGame(socket)
}

async function guess(socket, roomID, guess, cb){
    if (!gameRooms[roomID]) return

    gameRooms[roomID].guess(socket, guess, cb)
}

module.exports.createRoom = createRoom
module.exports.joinRoom = joinRoom
module.exports.leaveRoom = leaveRoom
module.exports.startGame = startGame
module.exports.guess = guess