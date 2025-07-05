// call the api to get the data


const API_KEY = process.env.NEXT_PUBLIC_TMB_API_KEY;
const API_TOKEN=process.env.NEXT_PUBLIC_TMB_API_TOKEN;
const BASE_URL="https://api.themoviedb.org/3";


export async function fetchTrending() {
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results;
  }
  
  export async function fetchMovieDetails(id: string) {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
    return await res.json();
  }