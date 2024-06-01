// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

import express from 'express';

const app = express();
const PORT = 3001;

app.get('/', (req, res) => res.send('Hello from the server!'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});