import express from "express";
import WatchlistModel from "../models/Watchlistmodel.js";

const router = express.Router();

router.post("/add-to-watchlist", async (req, res) => {
  const { email, movie } = req.body;

  if (!email || !movie) return res.status(400).json({ message: "Missing data" });

  try {
    let userDoc = await WatchlistModel.findOne({ email });

    if (userDoc) {
      const alreadyAdded = userDoc.Watchlist.find(item => item.movie_id === movie.movie_id);
      
      if (alreadyAdded) return res.status(200).json({ message: "Already in watchlist" });

      userDoc.Watchlist.push(movie);
      await userDoc.save();
    } else {
      await WatchlistModel.create({ email, Watchlist: [movie] });
    }

    res.status(200).json({ message: "Added to watchlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
