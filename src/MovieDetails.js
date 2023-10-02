import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { KEY, Loader } from "./App";

export const MovieDetails = ({
  onAddWatched,
  watched,
  selectedId,
  onCloseMovie,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const yourRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(function () {
    function callback(e) {
      if (e.code === "Escape") {
        onCloseMovie();
        // console.log("Closing..");
      }
    }
    document.addEventListener("keydown", callback);
    return function () {
      document.removeEventListener("keydown", callback);
    };
  });

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      setIsLoading(false);
      const data = await res.json();
      setMovie(data);
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="text-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="text-left rounded-lg bg-slate-200 bg-opacity-10 w-full">
            <button
              className="float-left bg-gray-100 rounded-2xl px-2 py-1 text-slate-950 absolute z-50"
              onClick={onCloseMovie}
            >
              <strong>&larr;</strong>
            </button>
            <div className="flex">
              <img
                className="h-64"
                src={poster}
                alt={`Poster of ${movie} movie`}
              />
              <div className="m-auto text-left">
                <div className="details-overview">
                  <h2 className="text-2xl font-semibold font-sans py-4">
                    {title}
                  </h2>
                  <p className="py-3">
                    {released} &bull; {runtime}{" "}
                  </p>
                </div>

                <p className="py-3">{genre}</p>
                <p className="py-3">
                  <span>⭐</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </div>
          </header>
          <section>
            <div className="m-auto w-full my-6">
              {!isWatched ? (
                <div className="my-2">
                  <div className="m-auto flex w-5/6 bg-gray-400 bg-opacity-30 py-4 mb-1 rounded-lg">
                    {" "}
                    <StarRating
                      maxRating={10}
                      size={24}
                      setMovieRating={setUserRating}
                      className="m-auto"
                    />
                  </div>
                  {userRating > 0 && (
                    <button
                      className="w-5/6 rounded-lg bg-blue-700 text-center p-2"
                      onClick={handleAdd}
                    >
                      + Add to List
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-left py-4 w-5/6">
                  You Have Seen This Movie and Rated it {yourRating}⭐
                </p>
              )}
            </div>
            <div className="px-6">
              <p className="text-justify w-5/6">
                <em>{plot}</em>
              </p>
              <p className="text-left text-sm py-4 w-5/6">Staring {actors}</p>
              <p className="text-left text-sm py-2 w-5/6">
                Directed by {director}
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
