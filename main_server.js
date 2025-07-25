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

async function getlogo(id,typee='movie') {
  try {
    const options = {
      method: 'GET',
      url: `https://api.themoviedb.org/3/${typee}/${id}/images`,
      headers: {
        accept: 'application/json',
        Authorization: tmdbkey
      }
    };
    const resp = await axios.request(options);
    return resp.data.logos.filter(lang => lang.iso_639_1 === "en");
  } catch (err) {
      
    const fallbackType = (typee === 'movie') ? 'tv' : 'movie';
    try {
      const options = {
        method: 'GET',
        url: `https://api.themoviedb.org/3/${fallbackType}/${id}/images`,
        headers: {
          accept: 'application/json',
          Authorization: tmdbkey
        }
      };
      const resp = await axios.request(options);
      return resp.data.logos.filter(lang => lang.iso_639_1 === "en");
    } catch (fallbackErr) {
      console.warn(`Logo fetch failed for ${id} with both movie and tv`);
      return null;
    }
  }

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
    'air_date.gte': gte,
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

setInterval(async ()=>{
  let response = await axios.get(`https://fyndr-sea.onrender.com/ping`);
},1000*60*60);

async function updateRecommendations() {
  try {
    const cards = await Promise.all([
      getcardsurl('https://api.themoviedb.org/3/movie/now_playing', 'New Movies This Season'),
      getcardsurl('https://api.themoviedb.org/3/movie/popular', 'Trending Movies'),
      getcardsurl('https://api.themoviedb.org/3/movie/upcoming', 'Upcoming Movies'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 14, 'Fantasy'),
      getcardsgenre('https://api.themoviedb.org/3/discover/movie', 27, 'Horror Picks'),
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
      getcardsgenre('https://api.themoviedb.org/3/discover/tv', '16', 'Latest In Anime Collection','ja','tv','10762','2025')

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

app.get('/getrecbanner', async (req, res) => {
  const email = req.query.email;
  const k = req.query.k;
  if(email){
    let response = await axios.get(`https://collaborative-model-for-fyndr.onrender.com/recommend/${email}?top_k=${k||20}`);
    response.data['data']= await Promise.all(response.data['data'].map(async(movie)=>{
      const logopath = await getlogo(movie.movie_id,movie.media_type);
      return {...movie,logopath}
    }))
    response.data['data']= response.data['data'].filter((movie)=>{
      return movie.logopath!=null && movie.backdrop_path!=null;
    })
    const idx = Math.floor(Math.random()*(response.data['data']).length);
    res.status(200).json({BannerData:{
      bannerindex:idx,
        logo:response.data['data'][idx].logopath,
        bannerdetail:{
        results:response.data['data'],
          name:response.data['data'][idx].title
      }
    }})
  }
  else{
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({BannerData:cachedRecs.BannerData});
}
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
    card4:cachedRecs.card4
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
  });
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
    
    card13:cachedRecs.card13,
    card18:cachedRecs.card18,
    card15:cachedRecs.card15
    
  });
});

app.get('/getrec6',(req,res)=>{
  if (!cachedRecs) {
    return res.status(503).json({ message: "Recommendations are being prepared, please try again shortly." });
  }
  res.status(200).json({
    card9:cachedRecs.card9,
    card14:cachedRecs.card14,
    card6:cachedRecs.card6,

  });
});

app.get('/toppicks',async (req,res)=>{
  const email = req.query.email;
  const k = req.query.k;
  let response = await axios.get(`https://collaborative-model-for-fyndr.onrender.com/recommend/${email}?top_k=${k||20}`);
  res.status(200).json({
    card0:{
      acardname:"Top Picks For You",
      data:response.data['data']
    }
  });
  
})


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

app.get('/ping',(req,res)=>{
  res.status(200).send('Pinged');
})
