const io = require('socket.io')(3001)
const { customAlphabet, urlAlphabet } = require('nanoid')
const roomCode = customAlphabet(urlAlphabet, 5)

let rooms = []

io.on('connect', socket => {
    console.log('connected')

    socket.on('createRoom', (roomName) => {
        const roomID = roomCode()
        if (!rooms[roomID]) {
            rooms[roomID] = { name: roomName, users: 1 }

            socket.join(roomID)

            console.log('sending room code');
            socket.emit('roomCode', roomID)
        } else {
            console.log(`room id ${roomID} already taken`);
        }
    })

    socket.on('disconnecting', () => {
        const roomID = Object.keys(socket.rooms)[1]
        rooms[roomID].users--
        if (rooms[roomID].users <= 0) {
            delete rooms[roomID]
        }
    })

    socket.on('disconnect', () => {
        console.log('disconnected')
    })
})

io.on('disconnect', socket => {
    console.log('disconnected')
})