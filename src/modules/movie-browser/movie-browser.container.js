import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { AppBar, TextField, Tabs, Tab } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';
import { Link } from 'react-router-dom';

// { getTopMovies, ... }

import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';
import { searchMovies } from './movie-browser.service';

class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: [],
      searchText: '',
    };
    // Binds the handleScroll to this class (MovieBrowser)
    // which provides access to MovieBrowser's props
    // Note: You don't have to do this if you call a method
    // directly from a lifecycle method or define an arrow function
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    localStorage.setItem('shows', 'no');
    window.onscroll = this.handleScroll;
    this.props.getTopMovies(this.state.currentPage);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const { topMovies } = this.props;
    if (!topMovies.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > 0.8) {
        const nextPage = this.state.currentPage + 1;
        this.props.getTopMovies(nextPage);
        this.setState({ currentPage: nextPage });
      }
    }
  }

  handleSearch = async (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onSubmit = async (event) => {
    console.log(this.state.searchText);
    event.preventDefault();
    await this.props.searchMovies(
      this.state.searchText,
      this.state.currentPage
    );
  };

  render() {
    let searchedMovies = [];
    const { topMovies } = this.props;
    const movies = movieHelpers.getMoviesList(topMovies.response);
    searchedMovies = movieHelpers.getMoviesList(
      this.props.movieSearch.response
    );

    var styles = {
      appBar: {
        flexWrap: 'wrap',
      },
      tabs: {
        width: '100%',
        outline: 'none',
      },
    };

    return (
      <div>
        {localStorage.getItem('TMDB_session_id') ? (
          <AppBar title="Movie Browser" showMenuIconButton={false}>
            <Tabs
              style={styles.tabs}
              inkBarStyle={{ backgroundColor: 'rgb(0, 188, 212)' }}
            >
              <Tab label="Movies" containerElement={<Link to="/movies" />} />
              <Tab label="TV shows" containerElement={<Link to="/shows" />} />

              <Tab
                label="My ratings"
                containerElement={<Link to="/rating" />}
              />
              <Tab label="Logout" containerElement={<Link to="/logout" />} />
              <Tab label="Search">
                <form onSubmit={this.onSubmit} style={{ textAlign: 'center' }}>
                  <TextField
                    floatingLabelText="Search movies and tv shows...."
                    value={this.state.searchText}
                    onChange={this.handleSearch}
                    name="searchText"
                  />
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </form>
              </Tab>
            </Tabs>
          </AppBar>
        ) : (
          <AppBar title="Movie Browser" showMenuIconButton={false}>
            <Tabs
              style={styles.tabs}
              inkBarStyle={{ backgroundColor: 'rgb(0, 188, 212)' }}
            >
              <Tab label="Movies" containerElement={<Link to="/movies" />} />
              <Tab label="TV shows" containerElement={<Link to="/shows" />} />
              <Tab
                label="Login with tmdb credentials"
                containerElement={<Link to="/login" />}
              />

              <Tab label="Search">
                <form onSubmit={this.onSubmit} style={{ textAlign: 'center' }}>
                  <TextField
                    floatingLabelText="Search movies and tv shows...."
                    value={this.state.searchText}
                    onChange={this.handleSearch}
                    name="searchText"
                  />
                  <IconButton type="submit">
                    <Search />
                  </IconButton>
                </form>
              </Tab>
            </Tabs>
          </AppBar>
        )}
        <Container>
          <Row>
            {/* <MovieList
              movies={
                searchedMovies && searchedMovies.length
                  ? searchedMovies
                  : movies
              }
              isLoading={topMovies.isLoading}
            /> */}
            <MovieList movies={movies} isLoading={topMovies.isLoading} />
          </Row>
        </Container>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    topMovies: state.movieBrowser.topMovies,
    movieSearch: state.movieBrowser.movieSearch,
  }),

  { ...movieActions }
)(MovieBrowser);
