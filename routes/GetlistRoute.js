import express from "express";
import WatchlistModel from "../models/Watchlistmodel.js"; 

const router = express.Router();

router.get('/get-watchlist', async (req,res)=>{
    const {email} = req.query;
    
    try{
        const user = await WatchlistModel.findOne({email});
        if(!user){
            return res.status(404).json({message:'Start Adding Something To Watch-List',watchlist:[]});
        }
        else{
            return res.status(200).json({message:'Watchlist Found',watchlist:user.Watchlist})
        }
    }
    catch(error){
        return res.status(500).json({ message: "Server error" });
    }
})

export default router;
