// @flow
import 'babel-polyfill'
import express from 'express';
var bodyParser = require('body-parser')
import imageProcess from './tesseract';

const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get('/', (req, res) => {
    res.send('hello');
});

app.all('/image', (req, res) => {

    var url = req.query.image;
    console.log("url", url);
    imageProcess(url).then(result => {
        console.log("finished");
        res.send(result);
        console.log("end");
    });

});

app.listen(PORT, () => {
    console.log('Running...');
});