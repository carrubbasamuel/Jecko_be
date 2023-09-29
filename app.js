const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config();
const user = require('./routes/routeUser');
const location = require('./routes/routeLocation');
const event = require('./routes/routeEvent');
const message = require('./routes/routeMessage');
const reset = require('./routes/routeResetPass');
const { verifyToken } = require('./middleware/middlewareJWT');


const app = express();
app.use(cors());
app.use(express.json());



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connessione al DB avvenuta con successo!"));


const google = require('./oAuth/googleOauth');
app.use('/', google);

app.use('/', reset);

app.use('/', user);
app.use('/', location);
app.use('/', verifyToken, event);
app.use('/', verifyToken, message);





module.exports = app;
