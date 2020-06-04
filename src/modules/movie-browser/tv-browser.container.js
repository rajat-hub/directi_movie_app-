import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { AppBar, TextField, Tabs, Tab } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';
import { Link } from 'react-router-dom';

// e.g. { getTopMovies, ... }

import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';
import { searchMovies } from './movie-browser.service';

class TVBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: [],
      searchText: '',
    };

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.onscroll = this.handleScroll;
    this.props.getTopShows(this.state.currentPage);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const { topShows } = this.props;
    if (!topShows.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > 0.8) {
        const nextPage = this.state.currentPage + 1;
        this.props.getTopShows(nextPage);
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
    const { topShows } = this.props;
    const movies = movieHelpers.getMoviesList(topShows.response);
    searchedMovies = movieHelpers.getMoviesList(
      this.props.movieSearch.response
    );

    var styles = {
      appBar: {
        flexWrap: 'wrap',
      },
      tabs: {
        width: '100%',
      },
    };

    return (
      <div>
        {localStorage.getItem('TMDB_session_id') ? (
          <AppBar title="Movie Browser" showMenuIconButton={false}>
            <Tabs style={styles.tabs}>
              <Tab label="Movies" containerElement={<Link to="/movies" />} />
              <Tab label="TV shows" containerElement={<Link to="/shows" />} />

              <Tab
                label="My ratings"
                containerElement={<Link to="/rating" />}
              />
              <Tab label="Logout" containerElement={<Link to="/logout" />} />
            </Tabs>
          </AppBar>
        ) : (
          <AppBar title="Movie Browser" showMenuIconButton={false}>
            <Tabs style={styles.tabs}>
              <Tab label="Movies" containerElement={<Link to="/movies" />} />
              <Tab label="TV shows" containerElement={<Link to="/shows" />} />
              <Tab
                label="Login with tmdb credentials"
                containerElement={<Link to="/login" />}
              />
            </Tabs>
          </AppBar>
        )}
        <Container>
          <Row>
            <form onSubmit={this.onSubmit} style={{ textAlign: 'center' }}>
              <TextField
                floatingLabelText="Search movies and tv shows..."
                value={this.state.searchText}
                onChange={this.handleSearch}
                name="searchText"
              />
              <IconButton type="submit">
                <Search />
              </IconButton>
            </form>
          </Row>
          <Row>
            <MovieList
              movies={
                searchedMovies && searchedMovies.length
                  ? searchedMovies
                  : movies
              }
              isLoading={topShows.isLoading}
            />
          </Row>
        </Container>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  (state) => ({
    topShows: state.movieBrowser.topShows,
    movieSearch: state.movieBrowser.movieSearch,
  }),

  { ...movieActions }
)(TVBrowser);
