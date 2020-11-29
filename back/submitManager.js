const ImageModel = require('./models/imageModel')
const { StaticPool } = require("node-worker-threads-pool")

const pool = new StaticPool({
    size: 4,
    task: './workers/pixelize.js',
    workerData: {pixel: 40, step: 20}
})

async function submit(data){
    data.forEach(dataImage => {
        pool.exec(dataImage).then(processedImage => {
            ImageModel.create(processedImage, (err, result) => {
                if(err) return console.log(err)
                console.log(`Saved image for approval in the db`)
            })
        })
    })
}

module.exports.submit = submit