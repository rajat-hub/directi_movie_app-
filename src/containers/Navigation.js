import React from 'react';
import { AppBar, TextField, Tabs, Tab } from 'material-ui';

import { Link } from 'react-router-dom';

var styles = {
  appBar: {
    flexWrap: 'wrap',
  },
  tabs: {
    width: '100%',
  },
};

class NavBarComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        {localStorage.getItem('TMDB_session_id') ? (
          <AppBar title="Movie Browser">
            <Tabs style={styles.tabs}>
              <Tab label="Movies" containerElement={<Link to="/movies" />} />
              <Tab label="TV shows" containerElement={<Link to="/shows" />} />
              <Tab label="Logout" containerElement={<Link to="/login" />} />
              <Tab
                label="My ratings"
                containerElement={<Link to="/rating" />}
              />
              <Tab label="TV shows" />
            </Tabs>
          </AppBar>
        ) : (
          <AppBar title="Movie Browser">
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
      </React.Fragment>
    );
  }
}

export default NavBarComponent;
