import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// const Test = () => {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <>
//       <StartRating
//         color="blue"
//         maxRating={10}
//         setMovieRating={setMovieRating}
//       />
//       <p>This Movie was rated {movieRating} stars</p>
//     </>
//   );
// };
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />

    {/* <StarRating
      messages={["", "Poor", "Fair", "Good", "Very Good", "Excellent"]}
    />
    <StarRating size={24} color="red" className="" />
    <Test /> */}
  </React.StrictMode>
);
