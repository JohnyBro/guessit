const { StaticPool } = require("node-worker-threads-pool")
const jimp = require("jimp")

const pool = new StaticPool({
    size: 1,
    task: './workers/pixelize.js'
})

console.log("Avant")
pool.exec().then( base64 => console.log(base64))
console.log("Apres")