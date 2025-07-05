"use client";

// pages/index.tsx
import { useEffect, useState } from "react";
import { fetchTrending } from "../../utils/api";

interface Movie {
  id: number;
  title: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrending().then(setMovies);
    console.log("fetching sucess",setMovies)
  }, []);

  return (
    <div>
      <h1>test only </h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}
