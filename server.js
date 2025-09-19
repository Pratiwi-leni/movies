require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbMovies, dbDirectors } = require('./database.js');
const app = express();
const port = process.env.PORT || 3100;
app.use(cors());

app.use(express.json());

// STATUS
app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date()
  });
});

// GET semua movies
app.get('/movies', (req, res) => {
  const sql = "SELECT * FROM movies ORDER BY id ASC";
  dbMovies.all(sql, [], (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json(rows);
  });
});

// GET movie by id
app.get('/movies/:id', (req, res) => {
  const sql = "SELECT * FROM movies WHERE id = ?";
  dbMovies.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Movie not found" });
    res.json(row);
  });
});

// POST movie baru
app.post('/movies', (req, res) => {
  const { title, director, year } = req.body;
  if (!title || !director || !year) {
    return res.status(400).json({ error: "title, director, year is required" });
  }
  const sql = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
  dbMovies.run(sql, [title, director, year], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, director, year });
  });
});

// Update movies
app.put("/movies/:id", (req, res) => {
  const { title, director, year } = req.body;
  dbMovies.run(
    "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?",
    [title, director, year, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE movies
app.delete("/movies/:id", (req, res) => {
  dbMovies.run("DELETE FROM movies WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// GET semua director
app.get("/directors", (req, res) => {
  dbDirectors.all("SELECT * FROM directors", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET director by id
app.get("/directors/:id", (req, res) => {
  dbDirectors.get("SELECT * FROM directors WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Director not found" });
    res.json(row);
  });
});

// CREATE sutradara
app.post("/directors", (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "INSERT INTO directors (name, birthYear) VALUES (?, ?)",
    [name, birthYear],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, birthYear });
    }
  );
});

// UPDATE sutradara
app.put("/directors/:id", (req, res) => {
  const { name, birthYear } = req.body;
  dbDirectors.run(
    "UPDATE directors SET name = ?, birthYear = ? WHERE id = ?",
    [name, birthYear, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE sutradara
app.delete("/directors/:id", (req, res) => {
  dbDirectors.run("DELETE FROM directors WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// information server listening
app.listen(port, () => {
  console.log('Server Running on localhost:${port}');
});

