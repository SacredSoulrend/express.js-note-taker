const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for handling JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET /api/notes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(notes);
});

// POST /api/notes
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  newNote.id = generateUniqueID(); // Generate a unique ID for the new note
  notes.push(newNote);
  fs.writeFileSync('db.json', JSON.stringify(notes));
  res.json(newNote);
});

// DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const updatedNotes = notes.filter((note) => note.id !== noteId);
  fs.writeFileSync('db.json', JSON.stringify(updatedNotes));
  res.json({ message: 'Note deleted' });
});

