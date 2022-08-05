require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql2')
const cors = require('cors')
const router = require('./src/routes');
const bodyParser = require('body-parser');
// parse application/json

app.use(express.json());
app.use(cors());
// Routing

app.use(bodyParser.json())

app.use('/api/v1/', router);
app.use('/uploads', express.static('uploads'));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})