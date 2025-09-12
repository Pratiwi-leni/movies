const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3300;

app.use(cors());
app.use(express.json());

// Basis data sementara ulasan
let reviews = [
  {
    id: 1,
    filmId: "2baf70d1-42bb-4437-b551-e5fed5a87abe", // Spirited Away
    user: "Andi",
    rating: 5,
    comment: "Film animasi terbaik sepanjang masa!"
  }
];
let nextId = 2;

// Endpoint GET /status
app.get("/status", (req, res) => {
  res.json({ status: "API is running", time: new Date() });
});

// Endpoint GET /reviews
app.get("/reviews", (req, res) => {
  res.json(reviews);
});

// Endpoint GET /reviews/:id
app.get("/reviews/:id", (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) {
    return res.status(404).json({ error: "Review tidak ditemukan" });
  }
  res.json(review);
});

//Endpoint POST /reviews
app.post("/reviews", (req, res) => {
  const { filmId, user, rating, comment } = req.body || {};

  // Validasi input
  if (!filmId || !user || !rating || !comment) {
    return res.status(400).json({ error: "Semua field wajib diisi" });
  }

  const newReview = {
    id: nextId++,
    filmId,
    user,
    rating,
    comment
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

// Endpoint PUT /reviews/:id
app.put("/reviews/:id", (req, res) => {
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (!review) {
    return res.status(404).json({ error: "Review tidak ditemukan" });
  }

  const { filmId, user, rating, comment } = req.body;

  // Update data jika ada
  if (filmId) review.filmId = filmId;
  if (user) review.user = user;
  if (rating) review.rating = rating;
  if (comment) review.comment = comment;

  res.json(review);
});

// Endpoint DELETE /reviews/:id
app.delete("/reviews/:id", (req, res) => {
  const reviewIndex = reviews.findIndex(r => r.id === parseInt(req.params.id));
  if (reviewIndex === -1) {
    return res.status(404).json({ error: "Review tidak ditemukan" });
  }

  const deleted = reviews.splice(reviewIndex, 1);
  res.json({ message: "Review berhasil dihapus", data: deleted[0] });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
