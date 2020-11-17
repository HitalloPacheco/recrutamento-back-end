const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes')

require('./database');

const app = express();

app.use(express.json());
app.use('/app', projectRoutes)
app.use('/user', userRoutes);
app.use(cors());

app.listen(3333);
