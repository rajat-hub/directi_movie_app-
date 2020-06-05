const MOVIE_DB_API_KEY = 'af39d01f63ca2e08e8ebbb95cbfe59a0';
const MOVIE_DB_BASE_URL = 'https://api.themoviedb.org/3';
const MOVIE_DB_SESSION_ID = localStorage.getItem('TMDB_session_id');
const createMovieDbUrl = (relativeUrl, queryParams) => {
  let baseUrl = `${MOVIE_DB_BASE_URL}${relativeUrl}?api_key=${MOVIE_DB_API_KEY}&language=en-US`;
  if (queryParams) {
    Object.keys(queryParams).forEach(
      (paramName) => (baseUrl += `&${paramName}=${queryParams[paramName]}`)
    );
  }
  return baseUrl;
};

export const getTopMovies = async ({ page }) => {
  const fullUrl = createMovieDbUrl('/movie/top_rated', {
    page,
  });
  return fetch(fullUrl);
};

export const getTopShows = async ({ page }) => {
  const fullUrl = createMovieDbUrl('/tv/popular', {
    page,
  });
  return fetch(fullUrl);
};

export const searchMovies = async ({ page, query }) => {
  const fullUrl = createMovieDbUrl('/search/multi', {
    page,
    query,
  });
  return fetch(fullUrl);
};

export const rateMovie = async ({ movieId, newValue }) => {
  const fullUrl = `${MOVIE_DB_BASE_URL}/movie/${movieId}/rating?api_key=${MOVIE_DB_API_KEY}&session_id=${MOVIE_DB_SESSION_ID}`;

  return fetch(fullUrl, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json;charset=utf-8', // <-- Specifying the Content-Type
    }),
    body: JSON.stringify({
      value: newValue,
    }),
  });
};

export const rateShow = async ({ showId, newValue }) => {
  const fullUrl = `${MOVIE_DB_BASE_URL}/tv/${showId}/rating?api_key=${MOVIE_DB_API_KEY}&session_id=${MOVIE_DB_SESSION_ID}`;

  return fetch(fullUrl, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json;charset=utf-8', // <-- Specifying the Content-Type
    }),
    body: JSON.stringify({
      value: newValue,
    }),
  });
};

export const getMovieDetails = async ({ movieId }) => {
  const fullUrl = createMovieDbUrl(`/movie/${movieId}`);
  return fetch(fullUrl);
};

export const getShowDetails = async ({ showId }) => {
  const fullUrl = createMovieDbUrl(`/tv/${showId}`);
  return fetch(fullUrl);
};
