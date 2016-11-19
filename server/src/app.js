// @flow

import express from 'express';
var bodyParser = require('body-parser')
import imageProcess from './tesseract';
import fs from 'fs'

const PORT = 3000;

const app = express();

console.log("dirname", fs.__dirname);

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.send('hello');
});

app.post('/image', (req, res) => {



    var url = req.body.image;
    console.log(req.body);


    /* var image;
    const folder = 'images/';

    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }

    image = req.files.image;
    const path = folder + image.name;
    image.mv(path, function (err) {
        if (err) {
            res.status(500).send(err);
            console.log(err);
        }
        else {
            res.send('File uploaded!');
            console.log("File uploaded");
            imageProcess(path);
        }
    }); */

    // console.log("debug");
});

app.listen(PORT, () => {
    console.log('Running...');
});