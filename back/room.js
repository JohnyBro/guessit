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
        
        let fileNames = fs.readdirSync('./img/')
        let rand = this.randomIntFromInterval(0, fileNames.length - 1)
        let beforeRead = process.hrtime()
        jimp.read("./img/" + fileNames[rand], (err, img) => {
            if(err) return console.log(err)

            let afterRead = process.hrtime(beforeRead)
            console.log(`Temps de lecture de l'image : %dms`, afterRead[1] / 1000000);
            let beforeScale = process.hrtime()

            img.scaleToFit(1500, 1000, () => {

                let afterScale = process.hrtime(beforeScale)
                console.log(`Temps pour redimensionner l'image : %dms`, afterScale[1] / 1000000);

                this.currentImage = img
                this.pixelSize = this.currentImage.bitmap.width / 40
                this.pixelStep = this.pixelSize / 20
                this.pixelize()
                this.pixelizeTimer = setInterval(this.pixelize.bind(this), 2000);
            })
        })
        
    }

    async pixelize(){
        let baseImage = this.currentImage.clone()
        let imageData 

        let beforePixelize = process.hrtime()

        if(this.pixelSize < this.pixelStep){
            imageData = await baseImage.getBase64Async(jimp.AUTO)
        }else{
            imageData = await baseImage.pixelate(this.pixelSize <= this.pixelStep ? 1 : this.pixelSize).getBase64Async(jimp.AUTO)
        }

        let afterPixelize = process.hrtime(beforePixelize)
        console.log(`Temps pour pixeliser l'image : %dms`, afterPixelize[1] / 1000000);
        
        io.to(this.id).emit('img', imageData)

        if(this.pixelSize < this.pixelStep){
            clearInterval(this.pixelizeTimer)
            this.pixelizeTimer = null
            this.started = false
            setTimeout(() => this.startGame(), 5000)
            return
        }

        this.pixelSize -= this.pixelStep
    }

    randomIntFromInterval(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
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