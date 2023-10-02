import { useEffect, useState } from "react";
import { NavBar } from "./NavBar";
import { Logo } from "./Logo";
import { Search } from "./Search";
import { BoxContainer } from "./BoxContainer";
import { MovieDetails } from "./MovieDetails";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];
export const KEY = "7e22acf8";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [watched, setWatched] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("someting went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setIsLoading(false);
          setError("");
          // console.log(data.Search);
        } catch (err) {
          // console.error(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <SearchNumResult movies={movies} />
      </NavBar>
      <Main movies={movies}>
        <BoxContainer movies={movies}>
          <ToggleShowButton isOpen1={isOpen1} setIsOpen1={setIsOpen1} />
          {isLoading && <Loader />}
          {!isLoading && !error ? (
            isOpen1 && (
              <MoviesList movies={movies} onSelect={handleSelectMovie} />
            )
          ) : (
            <ErrorMsg error={error} />
          )}
        </BoxContainer>
        <BoxContainer>
          <ToggleShowButton isOpen1={isOpen2} setIsOpen1={setIsOpen2} />
          {isOpen2 && (
            <>
              {selectedId ? (
                <MovieDetails
                  selectedId={selectedId}
                  onCloseMovie={handleCloseMovie}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                />
              ) : (
                <>
                  <Summary watched={watched} />
                  <WatchedMovieList
                    watched={watched}
                    deleteWatched={handleDeleteWatched}
                  />
                </>
              )}
            </>
          )}
        </BoxContainer>
      </Main>
    </>
  );
}

const ErrorMsg = ({ error }) => {
  return (
    <p className="text-center mt-8 m-auto text-2xl font-bold">
      {" "}
      {error ? "⛔" + error : " "}
    </p>
  );
};
export const Loader = () => {
  return (
    <p className="text-center m-auto text-2xl font-bold mt-8">
      Just Loading...
    </p>
  );
};

const SearchNumResult = ({ movies }) => {
  return (
    <p className="text-center">
      Found <strong className="text-green-600">{movies.length}</strong> results
    </p>
  );
};

const MoviesList = ({ movies, onSelect }) => {
  return (
    <ul className="h-full w-full px-2">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelect={onSelect} />
      ))}
    </ul>
  );
};

const Movie = ({ movie, onSelect }) => {
  return (
    <li
      onClick={() => onSelect(movie.imdbID)}
      className="text-left mb-4 hover:bg-slate-500 pl-4 py-2 flex align-center m-auto"
    >
      <img className="h-32" src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className="m-auto ml-2">
        <h3 className="text-xl font-bold">{movie.Title}</h3>

        <div>
          <p className="text-md">
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </div>
    </li>
  );
};

const ToggleShowButton = ({ isOpen1, setIsOpen1 }) => {
  return (
    <button
      className="rounded-xl m-auto mr-2 mt-2 px-2 bg-slate-950"
      onClick={() => setIsOpen1((open) => !open)}
    >
      {isOpen1 ? "–" : "+"}
    </button>
  );
};

const Summary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <>
      <div className="text-left rounded-lg px-8 bg-slate-500 bg-opacity-10 border border-b-2 border-0 w-full pb-4">
        <h2 className="font-semibold text-xl">Movies you watched</h2>
        <div className="flex text-left justify-between">
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>
    </>
  );
};

const WatchedMovieList = ({ watched, deleteWatched }) => {
  return (
    <ul className="p-2">
      {watched.map((movie) => (
        <Watched
          movie={movie}
          key={movie.imdbID}
          deleteWatched={deleteWatched}
        />
      ))}
    </ul>
  );
};
const Watched = ({ movie, deleteWatched }) => {
  return (
    <li className="text-center flex">
      <img className="h-40" src={movie.poster} alt={`${movie.title} poster`} />
      <div className="m-auto text-center align-center">
        <h3 className="text-lg font-semibold ">{movie.title}</h3>
        <div className="flex ">
          <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.runtime} min</span>
          </p>
        </div>
      </div>
      <button
        className="btn-delete"
        onClick={() => deleteWatched(movie.imdbID)}
      >
        ❌
      </button>
    </li>
  );
};
const Main = ({ children, movies }) => {
  return (
    <main
      className="w-full block pt-8 md:justify-around bg-slate-950 text-white"
      style={{ minHeight: "100vh" }}
    >
      {movies.length > 0 && (
        <div className="text-center m-auto font-semibold text-xl">
          Select Movie, Rate and Add to your WatchList
        </div>
      )}
      <div
        className="w-full block md:flex pt-4 md:justify-around bg-slate-950 text-white"
        style={{ minHeight: "100vh" }}
      >
        <div className="m-auto flex w-5/6">
          <div className="md:flex m-auto my-4 md:my-0 w-full">{children}</div>
        </div>
      </div>
    </main>
  );
};
