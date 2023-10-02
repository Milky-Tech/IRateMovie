//
// Main
//
export const BoxContainer = ({ movies, children }) => {
  return (
    <div
      style={{ minHeight: "70vh" }}
      className="bg-slate-800 mt-4 md:mt-0 rounded overflow-y-scroll no-scrollbar h-80 w-5/6 mx-2 md:w-1/2 md:mt-0 text-right"
    >
      {children}
    </div>
  );
};
