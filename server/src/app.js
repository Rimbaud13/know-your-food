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

  var image;

  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }

  image = req.files.image;
  name = image.name;
  image.mv('/images/'+name, function(err) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      res.send('File uploaded!');
    }
  });

  res.send('route');
});

app.listen(PORT, () => {
  console.log('Running...');
});


/*
{image:
    {name: '40DBA53A-0F24-4365-9BD3-4E740FF81C4F.jpg',
     data: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 48 00 48 00 00 ff e1 00 58 45 78 69 66 00 00 4d 4d 00 2a 00 00 00 08 00 02 01 12 00 03 00 00 00 01 00 01 ... >,
     encoding: '7bit',
     mimetype: 'image/jpeg',
     mv: [Function] }
}
 */