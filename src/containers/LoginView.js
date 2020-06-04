import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, TextField, Tabs, Tab, AutoComplete } from 'material-ui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 15,
};

class LoginView extends React.Component {
  state = {
    username: '',
    password: '',
    logged_in: false,
  };

  componentDidMount() {
    let session = localStorage.getItem('TMDB_session_id');
    if (session) {
      this.setState({ logged_in: true });
    }
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });
  };
  handleUsernameChange = (e) => {
    this.setState({ username: e.target.value });
  };

  requestLoginConfirmation = (event) => {
    console.log('hi');
    event.preventDefault();
    axios
      .get(
        'https://api.themoviedb.org/3/authentication/token/new?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0'
      )
      .then((res) => {
        let token = res.data.request_token;
        let user_data = {
          username: this.state.username,
          password: this.state.password,
          request_token: token,
        };
        axios
          .post(
            'https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0',
            user_data
          )
          .then((res) => {
            axios
              .post(
                'https://api.themoviedb.org/3/authentication/session/new?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0',
                { request_token: res.data.request_token }
              )
              .then((res) => {
                localStorage.setItem('TMDB_session_id', res.data.session_id);
                axios
                  .get(
                    'https://api.themoviedb.org/3/account?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0&session_id=' +
                      res.data.session_id
                  )
                  .then((res) => {
                    let user = {
                      id: res.data.id,
                      name: res.data.name,
                      username: res.data.username,
                      gravatar_hash: res.data.avatar.gravatar.hash,
                      low_la: res.data.iso_639_1,
                      hi_la: res.data.iso_3166_1,
                    };
                    localStorage.setItem('User', JSON.stringify(user));
                    this.setState({ logged_in: true }, () => {
                      toast.success('Welcome back, ' + user.username);
                    });
                  });
              });
          })
          .catch((err) => {
            toast.error(
              'Something went wrong. Are you sure your credentials are correct?'
            );
          });
      });
  };

  render() {
    var styles = {
      appBar: {
        flexWrap: 'wrap',
      },
      tabs: {
        width: '100%',
      },
    };
    if (this.state.logged_in) {
      return <Redirect to="/" />;
    }
    return (
      <div>
        <MuiThemeProvider>
          <div>
            {localStorage.getItem('TMDB_session_id') ? (
              <AppBar title="Movie Browser">
                <Tabs style={styles.tabs}>
                  <Tab
                    label="Movies"
                    containerElement={<Link to="/movies" />}
                  />
                  <Tab
                    label="TV shows"
                    containerElement={<Link to="/shows" />}
                  />
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
                  <Tab
                    label="Movies"
                    containerElement={<Link to="/movies" />}
                  />
                  <Tab
                    label="TV shows"
                    containerElement={<Link to="/shows" />}
                  />
                  <Tab
                    label="Login with tmdb credentials"
                    containerElement={<Link to="/login" />}
                  />
                </Tabs>
              </AppBar>
            )}

            <form
              style={{ margin: 'auto' }}
              onSubmit={this.requestLoginConfirmation}
            >
              <TextField
                hintText="Enter your Username"
                floatingLabelText="Enter your TMDB account username"
                onChange={this.handleUsernameChange}
              />
              <br />
              <TextField
                type="password"
                hintText="Type your password"
                floatingLabelText="Password"
                onChange={this.handlePasswordChange}
              />
              <br />
              <RaisedButton
                label="Submit"
                type="submit"
                primary={true}
                style={style}
              />
            </form>
          </div>
          <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default LoginView;
