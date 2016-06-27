import { fromCallback } from 'bluebird';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import Reindex from 'reindex-js';
import Auth0Lock from 'auth0-lock';

import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';

import Config from './config';

import CurrentUserContainer from './components/CurrentUserContainer';
import AllUsersContainer from './components/AllUsersContainer';
import UserContainer from './components/UserContainer';

const reindex = new Reindex(Config.REINDEX_URL);
const networkInterface = createNetworkInterface(
  `${Config.REINDEX_URL}/graphql`
);
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }
    req.options.headers = {
      ...req.options.headers,
      ...reindex.getAuthenticationHeaders(),
    }
    next();
  }
}]);
const client = new ApolloClient({
  networkInterface,
});

class Main extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: reindex.isLoggedIn(),
    };
  }

  componentDidMount() {
    reindex.addListener('tokenChange', this.handleTokenChange);
  }

  componentWillUnmount() {
    reindex.removeListener('tokenChange', this.handleTokenChange);
  }

  handleTokenChange = () => {
    this.setState({ isLoggedIn: reindex.isLoggedIn() });
  };

  makeContent() {
    if (this.state.isLoggedIn) {
      return (
        <div>
          <h2>Routes</h2>
          <div>
            <Link to="/">Logged-in user</Link>
          </div>
          <div>
            <Link to="/user">All users</Link>
          </div>
          {this.props.children}
        </div>
      );
    } else {
      return (
        <div>
          You are not logged-in
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div>
          {this.state.isLoggedIn ?
           <Link to="/logout">Logout</Link> :
           <Link to="/login">Login</Link>}
        </div>
        {this.makeContent()}
      </div>
    );
  }
}

async function handleLogin(nextState, replace, callback) {
  if (!reindex.isLoggedIn()) {
    try {
      const lock = new Auth0Lock(Config.AUTH0_CLIENT_ID, Config.AUTH0_DOMAIN);
      const auth0Result = await fromCallback(
       (callback) => lock.show({}, callback),
       { multiArgs: true },
      );

      console.log(auth0Result);

      // Login to Reindex
      const reindexResponse = await reindex.loginWithToken(
        'auth0',
        auth0Result[1],
      );
      for (const error of reindexResponse.errors || []) {
        console.log(error);
      }
    } catch (e) {
      console.log(e);
    }
  }

  replace('/');
  callback();
}

function handleLogout() {
  reindex.logout();
  // Clear Store
  document.location.href = '/';
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={CurrentUserContainer} />
        <Route path="/user" component={AllUsersContainer} />
        <Route path="/user/:userId" component={UserContainer} />
        <Route onEnter={handleLogin} path="/login" />
        <Route onEnter={handleLogout} path="/logout" />
      </Route>
    </Router>
  </ApolloProvider>,
  document.getElementById('app')
);
