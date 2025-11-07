require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbMovies, dbDirectors } = require('./database.js');
const app = express();
const port = process.env.PORT || 3300;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors());

app.use(express.json());

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token diperlukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    req.user = decoded.user;
    next();
  });
};

// STATUS
// app.get('/status', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Server is running',
//     timestamp: new Date()
//   });
// });

// // GET semua movies
// app.get('/movies', (req, res) => {
//   const sql = "SELECT * FROM movies ORDER BY id ASC";
//   dbMovies.all(sql, [], (err, rows) => {
//     if (err) return res.status(400).json({ error: err.message });
//     res.json(rows);
//   });
// });

// // GET movie by id
// app.get('/movies/:id', (req, res) => {
//   const sql = "SELECT * FROM movies WHERE id = ?";
//   dbMovies.get(sql, [req.params.id], (err, row) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!row) return res.status(404).json({ error: "Movie not found" });
//     res.json(row);
//   });
// });

// // POST movie baru
// app.post('/movies', authenticateToken, (req, res) => {
//   console.log('Request POST /movies oleh user:', req.user.username);
//   const { title, director, year } = req.body;
//   if (!title || !director || !year) {
//     return res.status(400).json({ error: "title, director, year is required" });
//   }
//   const sql = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
//   dbMovies.run(sql, [title, director, year], function(err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json({ id: this.lastID, title, director, year });
//   });
// });

// // Update movies
// app.put("/movies/:id", authenticateToken, (req, res) => {
//   console.log('Request PUT /movies/:id oleh user:', req.user.username);
//   const { title, director, year } = req.body;
//   dbMovies.run(
//     "UPDATE movies SET title = ?, director = ?, year = ? WHERE id = ?",
//     [title, director, year, req.params.id],
//     function (err) {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ updated: this.changes });
//     }
//   );
// });

// // DELETE movies
// app.delete("/movies/:id", authenticateToken, (req, res) => {
//   console.log('Request DELETE /movies/:id oleh user:', req.user.username);
//   dbMovies.run("DELETE FROM movies WHERE id = ?", req.params.id, function (err) {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ deleted: this.changes });
//   });
// });

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
app.post("/directors", authenticateToken, (req, res) => {
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
app.put("/directors/:id",  authenticateToken, (req, res) => {
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
app.delete("/directors/:id", authenticateToken, (req, res) => {
  dbDirectors.run("DELETE FROM directors WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});


// === AUTH ROUTES ===
app.post('/auth/register', (req, res) => {
  // guard: jika client tidak mengirim body (mis. Content-Type belum diset), req.body bisa undefined
  const { username, password } = req.body || {};
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ 
      error: 'Username dan password (min 6 char) harus diisi' 
    });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing:", err);
      return res.status(500).json({ 
        error: 'Gagal memproses pendaftaran' 
      });
    }

    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const params = [username.toLowerCase(), hashedPassword];
    dbDirectors.run(sql, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(409).json({ 
            error: 'Username sudah digunakan' 
          });
        }
        console.error("Error inserting user:", err);
        return res.status(500).json({ 
          error: 'Gagal menyimpan pengguna' 
        });
      }
      res.status(201).json({ 
        message: 'Registrasi berhasil', 
        userId: this.lastID 
      });
    });
  });
});



// Login endpoint
app.post('/auth/login', (req, res) => {
  // guard: pastikan req.body tidak undefined sebelum destruktur
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username dan password harus diisi' 
    });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  dbDirectors.get(sql, [username.toLowerCase()], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ 
        error: 'Kredensial tidak valid' 
      });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ 
          error: 'Kredensial tidak valid' 
        });
      }

      const payload = { 
        user: { 
          id: user.id, 
          username: user.username 
        } 
      };
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.error("Error signing token:", err);
          return res.status(500).json({ 
            error: 'Gagal membuat token' 
          });
        }
        res.json({ 
          message: 'Login berhasil', 
          token: token 
        });
      });
    });
  });
});

// handle 404
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// information server listening
app.listen(port, () => {
  console.log(`Server Running on localhost:${port}`);
});

