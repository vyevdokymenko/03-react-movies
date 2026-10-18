import axios from "axios";
import type {Movie} from "../types/movie.ts";

const api = axios.create({baseURL: "https://api.themoviedb.org"});

api.interceptors.request.use((config) => {
  const token: string = import.meta.env.VITE_TMDB_TOKEN;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

interface MoviedbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const response = await api.get<MoviedbResponse>(
    "/3/search/movie",
    {
      params: { query }
    }
  );
  return response.data.results;
};