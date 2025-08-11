import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { type Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import fetchMovies from "../../services/movieService";


export default function App() {
  const [searchMovie, setSearchMovie] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchMovie, currentPage],
    queryFn: () => fetchMovies(searchMovie, currentPage),
    enabled: !!searchMovie,
    placeholderData: keepPreviousData
  });

  const totalPages = data ? data.total_pages : 0;

  const handleSubmit = (newMovie: string) => {
    setSearchMovie(newMovie);
    setCurrentPage(1); 
  };

  useEffect(() => {
  if (isSuccess && data?.results.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [isSuccess, data]);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isModalOpen]);

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          nextLabel="→"
          previousLabel="←"
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          
        />
      )}
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && <MovieGrid movies={data.results} onSelect={openModal} />}
      {isModalOpen && selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </div>
  );
}
