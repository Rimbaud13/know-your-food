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

app.all('/image', (req, res) => {

    var url = req.query.image;
    const result = imageProcess(url);
    res.send(result);

});

app.listen(PORT, () => {
    console.log('Running...');
});