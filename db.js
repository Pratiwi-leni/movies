const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
// Beberapa layanan cloud (termasuk Neon) memerlukan SSL
ssl: {
rejectUnauthorized: false
}
});

module.exports = {
query: (text, params) => pool.query(text, params)
};










// require('dotenv').config();
// const sqlite3 = require('sqlite3').verbose();
// const DB_MOVIES = process.env.DB_MOVIES || "movies.db";
// //const DB_DIRECTORS = process.env.DB_DIRECTORS || "directors.db";

// // Koneksi ke database movies.db
// const dbMovies = new sqlite3.Database(DB_MOVIES, (err) => {
//   if (err) {
//     console.error("Error connect ke movies.db:", err.message);
//     throw err;
//   } else {
//     console.log("Connected to movies.db");

//     // Buat tabel movies (kalau belum ada)
//     dbMovies.run(`CREATE TABLE IF NOT EXISTS movies (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL, 
//       director TEXT NOT NULL, 
//       year INTEGER NOT NULL
//     )`, (err) => {
//       if (!err) {
//         console.log("Table 'movies' created. Seeding initial data...");
//         const insert = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
//         dbMovies.run(insert, ["The Lord of the Rings", "Peter Jackson", 2001]);
//         dbMovies.run(insert, ["The Avengers", "Joss Whedon", 2012]);
//         dbMovies.run(insert, ["Spider-Man", "Sam Raimi", 2002]);
//       } 
//     });

//     // Buat tabel users di movies.db dengan kolom role (default 'user')
//     dbMovies.run(`CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT NOT NULL UNIQUE,
//       password TEXT NOT NULL,
//       role TEXT NOT NULL DEFAULT 'user'
//     )`, (err) => {
//       if (err) {
//         console.error("Gagal membuat tabel users:", err.message);
//       }
//       // Kita tidak akan menambah data awal admin di sini
//       // Kita akan membuatnya melalui endpoint khusus
//     });
//   }
// });


// //     // ✅ Buat tabel users juga
// //     dbMovies.run(`CREATE TABLE IF NOT EXISTS users (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       username TEXT NOT NULL UNIQUE,
// //       password TEXT NOT NULL
// //     )`, (err) => {
// //       if (err) {
// //         console.error("Gagal membuat tabel users:", err.message);
// //       } else {
// //         console.log("Table 'users' siap digunakan.");
// //       }
// //     });
// //   }
// // });

// // (Optional) Database lain
// // const dbDirectors = new sqlite3.Database('./directors.db', (err) => {
// //   if (err) {
// //     console.error("Gagal konek ke directors.db:", err.message);
// //   } else {
// //     console.log("Connected to directors.db");
// //   }
// // });

// // module.exports = { dbMovies, dbDirectors };


// // ====== Koneksi ke directors.db ======
// // const dbDirectors = new sqlite3.Database(DB_DIRECTORS, (err) => {
// //   if (err) {
// //     console.error("Error connect ke directors.db:", err.message);
// //     throw err;
// //   } else {
// //     console.log("Connected to directors.db");

// //     dbDirectors.run(`CREATE TABLE IF NOT EXISTS directors (
// //       id INTEGER PRIMARY KEY AUTOINCREMENT,
// //       name TEXT NOT NULL, 
// //       birthYear INTEGER
// //     )`, (err) => {
// //       if (!err) {
// //         console.log("Table 'directors' created. Seeding initial data...");
// //         const insert = 'INSERT INTO directors (name, birthYear) VALUES (?, ?)';
// //         dbDirectors.run(insert, ["leni Ayu Pratiwi", 2005]);
// //         dbDirectors.run(insert, ["Anisa Suci Rahmawati", 2005]);
// //         dbDirectors.run(insert, ["Husnul Alisah", 2005]);
// //       }
// //     });

// //     // users table dibuat di movies.db; tidak dibuat di directors.db
// //   }
// // });

// // Export dua koneksi database
// module.exports = {dbMovies};












// // require('dotenv').config();
// // const sqlite3 = require('sqlite3').verbose();
// // const DBSOURCE = process.env.DB_SOURCE; // Added a fallback

// // const db = new sqlite3.Database(DBSOURCE, (err) => {
// //     if (err) {
// //         console.error(err.message);
// //         throw err;
// //     } else {

// //         console.log('Connected to the SQLite database.');

// //         db.run(`CREATE TABLE IF NOT EXISTS movies (
// //                     id INTEGER PRIMARY KEY AUTOINCREMENT,
// //                     title TEXT NOT NULL, 
// //                     director TEXT NOT NULL,
// //                     year INTEGER NOT NULL
// //                 )`, (err) => {

// //             if (!err) {
// //                 console.log("Table 'movies' created. Seeding initial data...");
// //                 const insert = 'INSERT INTO movies (title, director, year) VALUES (?,?,?)';
// //                 db.run(insert, ["The Lord of the Rings", "Peter Jackson", 2001]);
// //                 db.run(insert, ["The Avengers", "Joss Whedon", 2012]);
// //                 db.run(insert, ["Spider-Man", "Sam Raimi", 2002]);

// //             } else {

// //                 console.log("Table 'movies' already exists.");
// //             }
// //         });
// //     }
// // });
// ``
// // module.exports = db;