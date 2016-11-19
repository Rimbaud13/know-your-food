// @flow

import express from 'express';
import fileUpload from 'express-fileupload';
import _ from 'lodash';

const PORT = 3000;

const app = express();

app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/image', (req, res) => {
  console.log(req.files);
  res.send('route');
});

app.listen(PORT, () => {
  console.log('Running...');
});
