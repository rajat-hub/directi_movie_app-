import React from 'react';
import axios from 'axios';
import RatingCard from './RatingCard';
import { Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AppBar, TextField, Tabs, Tab } from 'material-ui';
import { Link } from 'react-router-dom';

class RatingView extends React.Component {
  state = {
    currentPage: 1,
    results: [],
    totalPages: 1,
    total_results: 1,
    loading: true,
  };
  componentDidMount() {
    let session = localStorage.getItem('TMDB_session_id');
    let account_id = JSON.parse(localStorage.getItem('User')).id;
    if (session) {
      axios
        .get(
          'https://api.themoviedb.org/3/account/' +
            account_id +
            '/rated/movies?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0&session_id=' +
            localStorage.getItem('TMDB_session_id') +
            '&language=en-US&sort_by=created_at.asc&page=1'
        )
        .then((res) => {
          this.setState({
            results: res.data.results,
            currentPage: res.data.page,
            totalPages: res.data.total_pages,
            loading: false,
          });
        });
    }
  }
  render() {
    var styles = {
      appBar: {
        flexWrap: 'wrap',
      },
      tabs: {
        width: '100%',
        outline: 'none',
      },
    };
    let session = localStorage.getItem('TMDB_session_id');
    if (!session) {
      return <Redirect to="/" />;
    }
    if (this.state.loading) {
      return (
        <Row center className="mt-5 pt-5">
          <CircularProgress />
        </Row>
      );
    }
    return (
      <div className="container">
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
        <div className="row mt-5">
          <div className="col-md-12 pt-3" style={{ textAlign: 'center' }}>
            <h1 className="h5-responsive font-weight-bold text-center text-uppercase pb-5">
              Your rated movies
            </h1>
          </div>
          <div className="col-md-12 mt-2">
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                alignItems: 'inherit',
                marginRight: '-30px',
              }}
            >
              {this.state.results.map((movie) => (
                <div className="col-md-3" key={movie.id}>
                  <RatingCard data={movie} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RatingView;
