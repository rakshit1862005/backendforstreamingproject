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

router.post('/remove-from-list',async(req,res)=>{
  const {email,movie} = req.body;
  if(!email) return res.status(400).json({message:"Missing Data Email"});
  if(!movie) return res.status(400).json({message:"Missing Data Movie"});

  try{
    let userDoc = await WatchlistModel.findOne({email});
    if(userDoc){
      userDoc.Watchlist = userDoc.Watchlist.filter(item => item.movie_id !== movie); 
      await userDoc.save();

    }
    else{
      res.status(400).json({message: "Not In List"})
    }
    res.status(200).json({ message: "Removed From watchlist" });
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }


});

router.post('/checklist',async(req,res)=>{
  const {email,movie}=req.body;
  if(!email) return res.status(400).json({message:"Missing Data Email"});
  if(!movie) return res.status(400).json({message:"Missing Data Movie"});
  try{
    let userDoc = await WatchlistModel.findOne({email});
    if(userDoc){
    let status = userDoc.Watchlist.find(item=> item.movie_id==movie);
      if(status){
        return res.status(200).json({message:"found",user_rating:status.user_rating});

      }
      else{
        return res.status(200).json({message:"not found"});
      }
  }
}
catch(error){
  return res.status(500).json({message:"Something Went Wrong"});
}
})

export default router;
