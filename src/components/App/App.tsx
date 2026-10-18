import SearchBar from "../SearchBar/SearchBar.tsx";
import {fetchMovies} from "../../services/movieService.ts";
import {toast, Toaster} from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import {useState} from "react";
import type {Movie} from "../../types/movie.ts";
import Loader from "../Loader/Loader.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const searchMovies = async (query: string): Promise<void> => {
    try {
      setMovies([]);
      setLoading(true);
      setHasError(false);
      setMovieDetails(null);
      const movies = await fetchMovies(query);
      if (!movies || movies.length < 1) {
        toast.error("No movies found for your request.");
      }
      setMovies(movies);
    } catch {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = (): void => {
    setMovieDetails(null);
  };

  function showDetails(movie: Movie): void {
    setMovieDetails(movie);
  }

  let content = null;
  if (hasError) {
    content = <ErrorMessage/>;
  } else if (loading) {
    content = <Loader/>;
  } else if (movies.length > 0) {
    content = <MovieGrid movies={movies} onSelect={showDetails}/>;
  }

  return (
    <>
      <Toaster/>
      <SearchBar onSubmit={searchMovies}/>
      {content}
      {movieDetails && <MovieModal movie={movieDetails} onClose={closeModal}/>}
    </>
  );
}

export default App;
