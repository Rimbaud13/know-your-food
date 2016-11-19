// @flow

import express from 'express';
import _ from 'lodash';

const PORT = 3000;

const app = express();

app.all('/hash', (req, res) => {
  const hash = req.body.password === undefined ? '' : sha256(req.body.password);
  res.send(`<form action="/hash" method="post">${hash}<input type="password" name="password"><input type="submit" value="Hash"/></form>`);
});

app.listen(PORT, () => {
  console.log('Running...'); // eslint-disable-line no-console
});

