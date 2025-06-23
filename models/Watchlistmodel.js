import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  movie_id: Number,
  title: String,
  backdrop_path: String,
  poster_path: String,
  overview: String,
  media_type: {type:String,default:'movie'},
  original_language: {type:String,default:'en'},
  vote_average : Number,
  vote_count : Number,
  release_date : Date,
  user_rating : {type:String,default:'neutral'}

}, { _id: false });

const userWatchlistSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  Watchlist: [movieSchema]
});

export default mongoose.model("UserWatchlist", userWatchlistSchema);
