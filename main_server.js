import axios from 'axios';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import WatchlistRoute from './routes/WatchlistRoute.js'
import GetlistRoute from './routes/GetlistRoute.js'


dotenv.config()

const app = express()
app.use(express.json());


const port = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL;
const tmdbkey = process.env.TMDB_API_KEY;



mongoose.connect(MONGO_URL).then(()=>{
    console.log('Connected To Mongo DB');
    app.use("/", WatchlistRoute);
    app.use("/", GetlistRoute);
    app.listen(port,()=>{
    console.log("Project Started");
})
})

app.use(cors({
  
}))

const today = new Date();
const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

async function getlogo(id,type='movie') {
    const m_id=id;
    const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/${type}/${m_id}/images`,
    headers: {
        accept: 'application/json',
        Authorization: tmdbkey
    }
    };
    const resp = await axios.request(options);
    const logos = resp.data.logos.filter(lang=>lang.iso_639_1=="en");


    return(logos);

}

async function getrailer(id) {
    const m_id = id;
    const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/movie/${m_id}/videos`,
    params: {language: 'en-US'},
    headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};
    const resp = await axios.request(options);
    const trailers = resp.data.results.filter(trailer=>trailer.type=="Trailer")
    console.log(trailers);
    return(trailers);
}

async function getbanner(url1) {
        
        const options = {
        method: 'GET',
        url: url1,
        params: {language: 'en-US', page: '1'},
        headers: {
            accept: 'application/json',
            Authorization: tmdbkey
        }
    }
    let response = await axios.request(options);
    const result = response.data;
    console.log(result);
    return (result);
}

async function getcardsgenre(url1,genreid,cardname,olang='en',type='movie',bangenre='%20',gte='%20') {
  
    const options = {
    method: 'GET',
    url: url1,
    params: {
    'first_air_date.gte': gte,
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: '1',
    sort_by: 'popularity.desc',
    with_genres: genreid,
    with_original_language: olang,
    without_genres: bangenre

  },
  headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};

    const options1 = {
    method: 'GET',
    url: url1,
    params: {
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: '2',
    sort_by: 'popularity.desc',
    with_genres: genreid,
    with_original_language: olang,
    without_genres: bangenre
  },
  headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};

const title = cardname;

let data = await axios.request(options);
let data1 = await axios.request(options1);
const result = {}
result['data']=data.data.results;
result['data']=result['data'].concat(data1.data.results);
result['acardname']=title;
result['data'].map((object)=>{
  object['media_type']=type;
})
return (result);
}

async function getcardsurl(url1,cardname,type='movie'){
    const options = {
    method: 'GET',
    url: url1,
    params: {language: 'en-US', page: '1'},
    headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};
    const title = cardname;
    let data = await axios.request(options);
    const result = {}
    result['data']=data.data.results;
    result['acardname']=title;
result['data'].map((object)=>{
  object['media_type']=type;
})
    return (result);
}

async function searching(keyword) {
  const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/movie',
  params: {query: keyword,include_adult: 'false', language: 'en-US', page: '1'},
  headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};

  const options2 = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/tv',
  params: {query: keyword,include_adult: 'false', language: 'en-US', page: '1'},
  headers: {
    accept: 'application/json',
    Authorization: tmdbkey
  }
};
 
    const response = await axios.request(options);
    const response2 = await axios.request(options2);

    let data1 = response.data.results.map((movie) => ({
      ...movie,
      media_type: 'movie'
    }));

    let data2 = response2.data.results.map((tv) => ({
      ...tv,
      media_type: 'tv'
    }));

    return data1.concat(data2);

}

async function addtowatchlist({email}) {
  
}

let cachedRecs = null;

(async () => {
  await updateRecommendations();
})();

setInterval(updateRecommendations, 1000 * 60 * 3);

async function updateRecommendations() {
  try {
    const cards = await Promise.all([
      getcardsurl('https://api.themoviedb.org/3/movie/now_playing', 'New Movies This Season'),
      getcardsurl('https://api.themoviedb.org/3/movie/popular', 'Trending Movies'),
      getcardsurl('https://api.themoviedb.org/3/movie/upcoming', 'Upcoming Movies'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 14, 'Fantasy'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 27, 'Horror Picks'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 9648, 'Romantic Picks'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 10752, 'Know More About Wars'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 99, 'Top In Documentaries'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 16, 'In Mood For Some Anime Movies', 'ja'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 80, 'Crime'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', 10765, 'Sci-Fi & Fantasy TV-Shows','en','tv'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', 9648, 'Mystery','en','tv'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '9648,16', 'Mystery Anime','ja','tv','10762'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '18', 'K-Drama','ko','tv','10762'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '10759,18', 'Shows With Some Action','en','tv','10762'),
      getcardsurl('https://api.themoviedb.org/3/tv/airing_today', 'New Shows','tv'),
      getcardsurl('https://api.themoviedb.org/3/tv/top_rated', 'Highest Rated Shows','tv'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '18,16', 'Shonen Jump','ja','tv','10762'),
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '16', 'Latest In Anime Collection','ja','tv','10762',twoMonthsAgo.toString())

    ]);

    const reccomendations = {};
    for (let i = 0; i < cards.length; i++) {
      reccomendations[`card${i + 1}`] = cards[i];
    }

    const banner = await getbanner('https://api.themoviedb.org/3/movie/popular');

    let validBannerOptions = [];
    for (const movie of banner.results) {
      const logos = await getlogo(movie.id);
      if (logos.length > 0) {
        validBannerOptions.push({ movie, logos });
      }
    }

    if (validBannerOptions.length === 0) {
      throw new Error("No banner candidate has a valid logo");
    }

    const banneridx = Math.floor(Math.random() * validBannerOptions.length);
    const selected = validBannerOptions[banneridx];
    const trailer = await getrailer(selected.movie.id);

    reccomendations.BannerData = {
      bannerindex: banneridx,
      bannerdetail: { results: validBannerOptions.map(v => v.movie) },
      logo: selected.logos,
      trailer,
    };

    cachedRecs = reccomendations;
    console.log("Recommendations updated at", new Date().toLocaleString());

  } catch (err) {
    console.error("Failed to fetch recommendations:", err.message);
  }
}

app.get('/getrecbanner', (req, res) => {
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({BannerData:cachedRecs.BannerData});
});

app.get('/getrec1', (req, res) => {
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card1:cachedRecs.card1,
    card2:cachedRecs.card2,
    card16:cachedRecs.card16,

  });
});

app.get('/getrec2', (req, res) => {
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card17:cachedRecs.card17,
    card3:cachedRecs.card3,
    card13:cachedRecs.card13,
  });
});

app.get('/getrec3', (req, res) => {
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card7:cachedRecs.card7,
    card8:cachedRecs.card8,
    card19:cachedRecs.card19,
    card9:cachedRecs.card9});
});

app.get('/getrec4',(req,res)=>{
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card10:cachedRecs.card10,
    card11:cachedRecs.card11,
    card12:cachedRecs.card12
  });
});

app.get('/getrec5',(req,res)=>{
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card4:cachedRecs.card4,
    card5:cachedRecs.card5,
    card15:cachedRecs.card15
    
  });
});

app.get('/getrec6',(req,res)=>{
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card14:cachedRecs.card14,
    card6:cachedRecs.card6,
    card18:cachedRecs.card18
  });
});


app.get('/searchkey',async(req,res)=>{
  const {keyword} = req.query;
  let results = await searching(keyword);
  res.status(200).json(results);
})

app.get('/getlogo',async (req,res)=>{
  const {id,type}=req.query;
  let result = await getlogo(id,type);
  res.status(200).json(result);
})

