const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const notes = [];

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'notes.html')));

app.get('/api/notes',(req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            throw err;
        }
        var content = JSON.parse(data);
        res.json(content);
        console.log(content);
    })
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './index.html')));
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
