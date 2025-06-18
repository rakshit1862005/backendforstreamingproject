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
async function getlogo(id,type='movie') {
    const m_id=id;
    const options = {
    method: 'GET',
    url: `https://api.themoviedb.org/3/${type}/${m_id}/images`,
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
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
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
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
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
        }
    }
    let response = await axios.request(options);
    const result = response.data;
    console.log(result);
    return (result);
}

async function getcardsgenre(url1,genreid,cardname,olang='en') {
    const options = {
    method: 'GET',
    url: url1,
    params: {
    include_adult: 'false',
    include_video: 'false',
    language: 'en-US',
    page: '1',
    sort_by: 'popularity.desc',
    with_genres: genreid,
    with_original_language: olang
  },
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
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
    with_original_language: olang
  },
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
  }
};

const title = cardname;

let data = await axios.request(options);
let data1 = await axios.request(options1);
const result = {}
result['data']=data.data.results;
result['data']=result['data'].concat(data1.data.results);
result['acardname']=title;
return (result);
}

async function getcardsurl(url1,cardname){
    const options = {
    method: 'GET',
    url: url1,
    params: {language: 'en-US', page: '1'},
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
  }
};
    const title = cardname;
    let data = await axios.request(options);
    const result = {}
    result['data']=data.data.results;
    result['acardname']=title;
    return (result);
}

async function searching(keyword) {
  const options = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/movie',
  params: {query: keyword,include_adult: 'false', language: 'en-US', page: '1'},
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
  }
};

  const options2 = {
  method: 'GET',
  url: 'https://api.themoviedb.org/3/search/tv',
  params: {query: keyword,include_adult: 'false', language: 'en-US', page: '1'},
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NmRjMzVhMGVjMGJjMDNiMGNjZGUxMTZhODAyYmUyOSIsIm5iZiI6MTc0ODUwODYzMS42NTQsInN1YiI6IjY4MzgxZmQ3OGVjZTdhMWRhZTQxNTBmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FMsi42cb0a-nmEw2H-_uUXZ4xrTM5kplWancQhl5rM4'
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
let lastFetched = 0;

app.get('/getrec',async(req,res)=>{

  const now = Date.now();
  if (cachedRecs && now - lastFetched < 1000*60*1) {
    return res.status(200).json(cachedRecs);
  }
  else{
    const cards = await Promise.all([
    getcardsurl('https://api.themoviedb.org/3/movie/now_playing','New This Season'),
    getcardsurl('https://api.themoviedb.org/3/movie/popular','Trending Movies And Shows'),
    getcardsurl('https://api.themoviedb.org/3/movie/upcoming','Upcoming',),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',14,'Fantasy'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',27,'Horror Picks'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',9648,'Romantic Picks'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',10752,'Know More About Wars'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',99,'Top In Documentaries'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',16,'In Mood For Some Anime','ja'),
    getcardsgenre('https://api.themoviedb.org/3/discover/movie',80,'Crime'),]);
    
    let reccomendations = {};
    for(let i=0;i<10;i++){
        reccomendations[`card${i+1}`]=cards[i];
    }
    

  const banneridx = Math.floor(Math.random()*19);
  const banner = await getbanner('https://api.themoviedb.org/3/movie/popular');
  const trailer = await getrailer(banner.results[banneridx].id);
  const logo = await getlogo(banner.results[banneridx].id);

  const bannerdata = {'bannerindex':banneridx,
                      'bannerdetail':banner,
                      'logo':logo,
                      'trailer':trailer
    }
    reccomendations['BannerData'] = bannerdata;
  cachedRecs = reccomendations;
  lastFetched = now;
  res.status(200).json(reccomendations);
  }

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

