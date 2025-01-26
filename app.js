const express = require('express');
const path = require('path');
const main_router = require('./routes/main_router');
const api_router = require('./routes/api_router');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'dist', 'js')));
// app.use(express.static(path.join(__dirname, 'dist', 'css')));
app.use(express.static(path.join(__dirname, 'dist', 'css')));
// dist klasörünü statik olarak servis et
app.use('/dist', express.static('dist'));



app.use('/', main_router);
app.use('/api', api_router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});