const { parentPort, workerData } = require("worker_threads");
const jimp = require('jimp')

parentPort.on("message", datas => {
    let promiseArray = []
    datas.forEach(data => {
        promiseArray.push(getProcessedImage(data))
    });
    
    Promise.all(promiseArray).then(result => parentPort.postMessage(result))
})

async function getProcessedImage(imageData){
    let convertedImage = {pixelImages: [], name: imageData.name, approved: false}

    let buffer = Buffer.from(imageData.buffer)
    let jimg = await jimp.read(buffer)
    
    jimg.scaleToFit(1280, 720)

    let pixelSize = jimg.bitmap.width / workerData.pixel
    let pixelStep = pixelSize / workerData.step

    for (let i = 0; i < workerData.step; i++) {
        let imgCopy = jimg.clone()
        imgCopy.pixelate(pixelSize)
        let base64 = await imgCopy.getBase64Async(jimp.AUTO)
        convertedImage.pixelImages.push(base64)

        pixelSize -= pixelStep
    }

    convertedImage.pixelImages.push(await jimg.getBase64Async(jimp.AUTO))
    return convertedImage
}