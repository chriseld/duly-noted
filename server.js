const http = require('http');
const express = require('express');
const path = require("path");
const app = express();
const fs = require("fs");
const port = 3000;
const data = require("./db/db.json");
const dataFile = path.join(__dirname, "/db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/assets', express.static('assets'));
app.use(express.static('public'));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "public/notes.html")));

app.get('/api/notes', (req, res) => {
    fs.readFile(dataFile, (err, data) => {
        res.send(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const id = new Date().getTime();
    req.body.id = id;
    data.push(req.body);

    fs.writeFile(dataFile, JSON.stringify(data), "utf8" , function(err){
        if(err){
            throw err;
        }
        res.json(data);
    })
});

app.delete('/api/notes/:id', (req, res) => {
    const delId = req.params.id;
    const index = data.findIndex(note => note.id === parseInt(delId));
    data.splice(index, 1);
    fs.writeFile(dataFile, JSON.stringify(data), err => {
        if(err) {
            throw err;
        }
        res.json(data);
    })
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, "public/index.html")));

app.listen(port, () => console.log(`App listening on port ${port}!`));