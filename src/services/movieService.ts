import axios from "axios";
import { type Movie } from "../types/movie";

interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_results: number;
  total_pages: number;
}

export default async function fetchMovies(query: string, page: number) {
   const response = await axios.get<MovieSearchResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        include_adult: false,
        language: "en-US",
        page,
      },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
 
  return response.data;


};


