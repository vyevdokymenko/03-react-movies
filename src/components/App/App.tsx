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
  const [movieDetails, setMovieDetails] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [hasError, setHasError] = useState(false);

  const searchMovies = async (query: string): Promise<void> => {
    try {
      setLoading(true);
      setHasError(false);
      const movies = await fetchMovies(query);
      if (!movies || movies.length < 1) {
        toast.error("No movies found for your request.");
      }
      setMovies(movies);
    } catch (error) {
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (): void => {
    setIsModalShow(true);
  };

  const closeModal = (): void => {
    setIsModalShow(false);
  };

  function showDetails(movie: Movie): void {
    setMovieDetails(movie);
    openModal();
  }

  let content = null;
  if (hasError) {
    content = <ErrorMessage/>;
  } else if (loading) {
    content = <Loader/>;
  } else if (movies.length > 0) {
    content = <MovieGrid movies={movies} onSelect={showDetails}/>;
  }

  let modal = null;
  if (isModalShow && movieDetails) {
    modal = <MovieModal movie={movieDetails} onClose={closeModal}/>;
  }

  return (
    <>
      <Toaster/>
      <SearchBar onSubmit={searchMovies}/>
      {content}
      {modal}
    </>
  );
}

export default App;
