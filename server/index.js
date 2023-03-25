const express = require('express');

const app = express();

app.get('/', (req, res) => {
    console.log("Hello world");
})

app.listen(8000, () => {
    console.log("Server listening at port no ", 8000);
})