import Tesseract from 'tesseract.js'
var request = require('request')
var fs = require('fs')
var url = 'https://cloud.avalan.ch/s/UWI9ppgh873gh8Y/download'
var filename = 'menu.png'

var writeFile = fs.createWriteStream(filename)

request(url).pipe(writeFile).on('close', function () {
    console.log(url, 'saved to', filename)
    Tesseract.recognize(filename)
        .progress(function (p) {
            console.log('progress', p)
        })
        .catch(err => console.error(err))
        .then(function (result) {
            console.log(result.text)
            process.exit(0)
        })
});