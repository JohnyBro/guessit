const ImageModel = require('./models/imageModel')
const { StaticPool } = require("node-worker-threads-pool")

const pool = new StaticPool({
    size: 1,
    task: './workers/pixelize.js',
    workerData: {pixel: 40, step: 20}
})

async function submit(data){
    let convertedImages = await pool.exec(data)
    console.log("Saving in db ...")
    ImageModel.insertMany(convertedImages, (err, result) => {
        if(err) return console.log(err)
        console.log(result)
    })
}

module.exports.submit = submit