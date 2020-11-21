const { io } = require('./socketio')
const jimp = require("jimp")
const fs = require("fs")

class Room {
    constructor(roomID, name) {
        this.id = roomID
        this.name = name
        this.sockets = []
        this.started = false
        this.pixelSize = 0.1
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
    }

    async leave(socket) {
        if (!this.sockets.find(s => s.id == socket.id)) return

        await socket.leave(this.id)
        this.sockets = this.sockets.filter(s => s.id != socket.id)

        if(this.playerCount <= 0 && this.pixelizeTimer){
            clearInterval(this.pixelizeTimer)
            this.pixelizeTimer = null
            return
        }

        io.to(this.id).emit('roomUpdate', this.infos)
    }

    async startGame(){
        if(this.started == true) return
        this.started = true

        this.sockets.forEach(s => s.ready = false)
        
        let fileNames = fs.readdirSync('./img/')
        let rand = this.randomIntFromInterval(0, fileNames.length - 1)
        
        console.log("reading new image");
        jimp.read("./img/" + fileNames[rand], (err, img) => {
            if(err) return console.log(err)

            console.log("finished reading image");
            img.scaleToFit(1500, 1000, async () => {
                console.log("finished scaling down image");
                this.pixelSize = img.bitmap.width / 40
                this.pixelStep = this.pixelSize / 20
                io.to(this.id).emit('image', await img.getBufferAsync(jimp.AUTO))
            })
        })
    }

    startLoop(){
        console.log("starting loop")
        this.pixelize()
        this.pixelizeTimer = setInterval(this.pixelize.bind(this), 1000);
    }

    async pixelize(){
        if(this.pixelSize < this.pixelStep){
            io.to(this.id).emit('pixelize', 1)
            console.log("stoping loop")
            clearInterval(this.pixelizeTimer)
            this.pixelizeTimer = null
            this.started = false
            setTimeout(() => this.startGame(), 5000)
            return
        }
        io.to(this.id).emit('pixelize', this.pixelSize)

        this.pixelSize -= this.pixelStep
    }

    randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    imageReady(socket){
        console.log("ready");
        const socketID = this.sockets.findIndex(s => s.id = socket.id)
        this.sockets[socketID].ready = true

        if(!this.sockets.find(s => s.ready != true)){
            this.startLoop()
        }
    }

    get infos() {
        let infos = {}
        infos.name = this.name
        infos.players = []
        this.sockets.forEach(socket => {
            infos.players.push(socket.pseudo)
        });
        return infos
    }

    get playerCount() {
        return this.sockets.length
    }
}

module.exports = Room