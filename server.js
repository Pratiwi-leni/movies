const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3300;

app.use(cors());
app.use(express.json);

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

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
