import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { AppBar, TextField, Tabs, Tab } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';
import { Link } from 'react-router-dom';
import axios from 'axios';
// { getTopMovies, ... }

import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';
import { searchMovies } from './movie-browser.service';
import RatingCard from '../../containers/RatingCard';

class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: [],
      searchQuery: '',
      searchResult: [],
    };

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

  handleSearchSubmit = (e) => {
    console.log('enter handlesearchchange');
    let language = 'us-US';
    let User = JSON.parse(localStorage.getItem('User'));
    if (User) {
      language = User.low_la + '-' + User.hi_la;
    }
    this.setState({ searchQuery: e.target.value }, () => {
      if (this.state.searchQuery && this.state.searchQuery.length > 1) {
        if (this.state.searchQuery.length % 2 === 0) {
          let query = encodeURI(this.state.searchQuery);
          console.log(query);
          axios
            .get(
              'https://api.themoviedb.org/3/search/movie?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0&language=' +
                language +
                '&query=' +
                query +
                '&page=1&include_adult=false'
            )
            .then((res) => {
              this.setState({ searchResult: res.data.results });
              console.log('searchedresults' + this.state.searchResult);
            });
        }
      } else if (
        this.state.searchQuery === '' ||
        this.state.searchQuery.length === 0
      ) {
        this.setState({ searchResult: [] });
      }
    });
  };

  render() {
    const { topMovies } = this.props;
    const movies = movieHelpers.getMoviesList(topMovies.response);

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
                <form style={{ textAlign: 'center' }}>
                  <TextField
                    floatingLabelText="Search movies and tv shows...."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchSubmit}
                    name="searchQuery"
                  />
                  <IconButton>
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
                <form style={{ textAlign: 'center' }}>
                  <TextField
                    floatingLabelText="Search movies and tv shows...."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchSubmit}
                    name="searchQuery"
                  />
                  <IconButton>
                    <Search />
                  </IconButton>
                </form>
              </Tab>
            </Tabs>
          </AppBar>
        )}
        <Container>
          <Row>
            {this.state.searchResult.length > 1 ? (
              this.state.searchResult.map((movie) => (
                <div className="col-md-3" key={movie.id}>
                  <RatingCard data={movie} />
                </div>
              ))
            ) : (
              <MovieList movies={movies} isLoading={topMovies.isLoading} />
            )}
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
