const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes')

require('./database');

const app = express();
app.use(cors());

app.use(express.json());
app.use('/app', projectRoutes)
app.use('/user', userRoutes);

app.listen(3333);
