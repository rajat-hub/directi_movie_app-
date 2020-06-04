import { Route, Switch } from 'react-router-dom';
import React from 'react';
import LoginView from './containers/LoginView';
import Logout from './containers/LogoutView';
import MovieBrowser from './modules/movie-browser/movie-browser.container';
import TVBrowser from './modules/movie-browser/tv-browser.container';
import RatingView from './containers/RatingView';

export default class BaseRouter extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={MovieBrowser} />
          <Route exact path="/movies" component={MovieBrowser} />
          <Route exact path="/shows" component={TVBrowser} />
          <Route exact path="/login" component={LoginView} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/rating" component={RatingView} />
        </Switch>
      </div>
    );
  }
}
