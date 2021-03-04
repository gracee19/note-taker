const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

const notes = [];


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public','notes.html')));

app.get('/api/notes',(req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            throw err;
        }
        var content = JSON.parse(data);
        res.json(content);
        // console.log(content);
    })
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    console.log(newNote);
    fs.readFile(path.join(__dirname, 'db','db.json'), (err,data) => {
        if (err) throw err;

        var savedNotes = JSON.parse(data);
        savedNotes.push(newNote);
        fs.writeFile(path.join(__dirname, 'db','db.json'),JSON.stringify(savedNotes),(err) => {
            if (err) throw err;
            res.json(savedNotes);
            console.log(savedNotes);
        });

    });
});

app.get('/api/notes/:id', (req,res) => {
    res.json(req.params.id);
});

app.get('/notes', function(req,res) {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.delete('/api/notes/:id', function(req,res) {
    fs.readFile('./db/db.json', function (err, data) {
        if (err) { throw err;}
        const noteList = JSON.parse(data);

        const newSetNote = noteList.filter(note => note.id !== req.params.id);
        console.log(newSetNote);

        fs.writeFile(path.join(__dirname, 'db','db.json'),JSON.stringify(newSetNote),(err) => {
            if (err) throw err;
            res.json(newSetNote);
        })
    });
    console.log(req.params.id);
    // res.end();
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public','index.html')));
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
