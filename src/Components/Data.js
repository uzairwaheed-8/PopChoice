
import { useEffect } from "react";

const Data = ({setStore}) => {
    const apiKey = "9f639d29a740e02c81fa87e5aa118e00"; 
    const baseUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=`;
    
    const getmovies = async () => {
        const topMovies = [];
        const startYear = new Date().getFullYear() - 10;
        const endYear = new Date().getFullYear();
      
        for (let page = 1; page <= 50; page++) {
          const response = await fetch(`${baseUrl}${page}`);
          const data = await response.json();
          const filteredMovies = data.results.filter(movie => {
            const releaseYear = new Date(movie.release_date).getFullYear();
            return releaseYear >= startYear && releaseYear <= endYear;
          });
      
          topMovies.push(...filteredMovies);
      
          if (filteredMovies.length === 0) {
            break;
          }
        }
      
        return topMovies;
      }
      
      useEffect(() => {
        async function fetchData() {
            const movies = await getmovies();
            setStore(movies);
        }
        fetchData();
    }, []);
}

export default Data;
