const { io } = require('./socketio')
const ImageModel = require('./models/imageModel')

class Room {
    constructor(roomID, name) {
        this.id = roomID
        this.name = name
        this.sockets = []
        this.started = false
        this.imageData = null
    }

    async join(socket, pseudo) {
        //If the socket isn't already in the room we add it
        if (!this.sockets.find(s => s.id == socket.id)) {
            socket.pseudo = pseudo
            await socket.join(this.id)
            this.sockets.push(socket)
        }

        let roomInfos = this.infos
        socket.emit("roomJoined", roomInfos)
        socket.to(this.id).emit('roomUpdate', roomInfos)
        if(this.started && this.currentImage){
            socket.emit('image', await this.currentImage.getBufferAsync(jimp.AUTO))
        }
    }

    async leave(socket) {
        if (!this.sockets.find(s => s.id == socket.id)) return

        await socket.leave(this.id)

        let socketIndex = this.sockets.findIndex(s => s.id == socket.id)
        this.sockets.splice(socketIndex, 1)

        if(this.playerCount > 0){
            io.to(this.id).emit('roomUpdate', this.infos)
        }
    }

    async startGame(socket){
        //If the socket isn't the host of the room or the romm already started
        if(this.sockets[0].id != socket.id || this.started == true) return
        this.started = true
        await this.setNextImageData()
        this.startLoop()
    }

    async setNextImageData(){
        if(!this.started) return
        this.sockets.forEach((s, i, a) => a[i].guessed = false)
        io.to(this.id).emit('roomUpdate', this.infos)

        console.log("Getting next image to guesse")
        let count = await ImageModel.estimatedDocumentCount().exec()
        let random = Math.floor(Math.random() * count)
        this.imageData = await ImageModel.findOne().skip(random).exec()
        this.imageIndex = 0
        this.startLoop()
    }

    startLoop(){
        clearInterval(this.loopTimer)
        this.loopTimer = setInterval(async () => {
            //Out of pixelImages array
            if(!this.imageData.pixelImages[this.imageIndex]){
                clearInterval(this.loopTimer)

                setTimeout(async () => {
                    this.setNextImageData.call(this)
                }, 5000)
                return
            }

            io.to(this.id).emit('image', this.imageData.pixelImages[this.imageIndex])
            this.imageIndex++
        }, 1000)
    }

    guess(socket, guess, cb){
        if(guess == this.imageData.name){
            let playerSocket = this.sockets.find(s => s.id == socket.id)
            playerSocket.guessed = true
            cb(true)
            io.to(this.id).emit('roomUpdate', this.infos)
        }else{
            cb(false)
        }
    }

    clean(){
        clearInterval(this.loopTimer)
        this.started = false
    }

    get infos() {
        let infos = {
            name: this.name,
            started: this.started,
            players: [],
            host: this.sockets[0].id
        }

        this.sockets.forEach(socket => {
            infos.players.push({id: socket.id, pseudo: socket.pseudo, guessed: socket.guessed})
        })

        return infos
    }

    get playerCount() {
        return this.sockets.length
    }
}

module.exports = Room