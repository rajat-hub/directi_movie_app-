import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, Tabs, Tab, AutoComplete } from 'material-ui';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RaisedButton from 'material-ui/RaisedButton';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

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
    const classes = this.props.classes;
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
              <AppBar title="Movie Browser" showMenuIconButton={false}>
                <Tabs
                  style={styles.tabs}
                  inkBarStyle={{ backgroundColor: 'rgb(0, 188, 212)' }}
                >
                  <Tab
                    label="Movies"
                    containerElement={<Link to="/movies" />}
                  />
                  <Tab
                    label="TV shows"
                    containerElement={<Link to="/shows" />}
                  />

                  <Tab
                    label="My ratings"
                    containerElement={<Link to="/rating" />}
                  />
                  <Tab
                    label="Logout"
                    containerElement={<Link to="/logout" />}
                  />
                </Tabs>
              </AppBar>
            ) : (
              <AppBar title="Movie Browser" showMenuIconButton={false}>
                <Tabs
                  style={styles.tabs}
                  inkBarStyle={{ backgroundColor: 'rgb(0, 188, 212)' }}
                >
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

            <Grid container component="main" className={classes.root}>
              <CssBaseline />
              <Grid item xs={false} sm={4} md={7} className={classes.image} />
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <div className={classes.paper}>
                  <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <form
                    className={classes.form}
                    noValidate
                    onSubmit={this.requestLoginConfirmation}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      onChange={this.handleUsernameChange}
                      label="Username"
                      name="email"
                      autoComplete="email"
                      autoFocus
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      onChange={this.handlePasswordChange}
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                    />
                    <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="Remember me"
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Sign In
                    </Button>
                  </form>
                </div>
              </Grid>
            </Grid>
          </div>
          <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default () => {
  const classes = useStyles();
  return <LoginView classes={classes} />;
};
