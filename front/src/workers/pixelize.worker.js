import jimp from 'jimp'

onmessage = (e) => {
    let [baseImage, pixelSize] = e.data
    jimp.read(baseImage, (err, jimg) => {
        if(err) return console.log(err)

        pixelSize != 1 && jimg.pixelate(pixelSize)

        jimg.getBase64(jimp.AUTO, (err, base64) => {
            if(err) return console.log(err)

            postMessage(base64)
        })
    })
}