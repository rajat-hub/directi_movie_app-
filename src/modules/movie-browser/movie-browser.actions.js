import { createAsyncActionCreator } from '../common/redux.helpers';
import * as movieService from './movie-browser.service';

export const keys = {
  GET_TOP_MOVIES: 'GET_TOP_MOVIES',
  SEARCH_MOVIES: 'SEARCH_MOVIES',
  GET_MOVIE_DETAILS: 'GET_MOVIE_DETAILS',
  RATE_MOVIE: 'RATE_MOVIE',
  GET_TOP_SHOWS: 'GET_TOP_SHOWS',
  SEARCH_SHOWS: 'SEARCH_SHOWS',
  GET_SHOW_DETAILS: 'GET_SHOW_DETAILS',
  RATE_SHOW: 'RATE_SHOW',
};

export const getTopMovies = (page) =>
  createAsyncActionCreator(
    keys.GET_TOP_MOVIES,

    movieService.getTopMovies,

    { page }
  );

export const getTopShows = (page) =>
  createAsyncActionCreator(
    keys.GET_TOP_SHOWS,

    movieService.getTopShows,

    { page }
  );

export const searchMovies = (query, page) =>
  createAsyncActionCreator(keys.SEARCH_MOVIES, movieService.searchMovies, {
    query,
    page,
  });

export const rateMovie = (movieId, newValue) =>
  createAsyncActionCreator(keys.RATE_MOVIE, movieService.rateMovie, {
    movieId,
    newValue,
  });

export const rateShow = (showId, newValue) =>
  createAsyncActionCreator(keys.RATE_SHOW, movieService.rateShow, {
    showId,
    newValue,
  });

export const getMovieDetails = (movieId) =>
  createAsyncActionCreator(
    keys.GET_MOVIE_DETAILS,
    movieService.getMovieDetails,
    { movieId }
  );

export const getShowDetails = (showId) =>
  createAsyncActionCreator(keys.GET_SHOW_DETAILS, movieService.getShowDetails, {
    showId,
  });
