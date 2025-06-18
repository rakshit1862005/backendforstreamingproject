import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movie_id: Number,
  title: String,
  backdrop_path: String,
  poster_path: String,
  overview: String,
  media_type: String
}, { _id: false });

const userWatchlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  Watchlist: [movieSchema]
});

export default mongoose.model("UserWatchlist", userWatchlistSchema);
