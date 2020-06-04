import React, { Component } from 'react';
import axios from 'axios';
import BaseRouter from './routes';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const AppContext = React.createContext();

class App extends Component {
  state = {
    config: {},
    search_results: [],
    query: '',
    handleResultsSubmit: (value) => {
      this.setState({ query: value });
    },
  };
  componentDidMount() {
    axios
      .get(
        'https://api.themoviedb.org/3/configuration?api_key=af39d01f63ca2e08e8ebbb95cbfe59a0'
      )
      .then((res) => {
        this.setState({
          config: res.data,
        });
      });
  }
  render() {
    return (
      // Provides the Material UI theme to child components
      <MuiThemeProvider>
        <AppContext.Provider value={this.state}>
          <Router>
            <BaseRouter searchQuery={this.state.query} />
          </Router>
        </AppContext.Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
