export const Search = ({ query, setQuery }) => {
  return (
    <div className="flex w-full md:w-3/5 px-2 ">
      <input
        className="border w-4/5 m-auto mt-8 md:mt-0 md:w-full bg-slate-500
        px-4 py-2 text-slate-950
        border-slate-600 rounded-xl"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
