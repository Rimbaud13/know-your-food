// @flow

import express from 'express';
import _ from 'lodash';

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
  res.send('hello');
});

app.post('/image', (req, res) => {
  

  res.send('route');
});

app.listen(PORT, () => {
  console.log('Running...');
});
