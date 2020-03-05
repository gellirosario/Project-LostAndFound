import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Pages
const PrivateRoute = React.lazy(() => import('./components/private-route/PrivateRoute'));
const Landing = React.lazy(() => import('./components/views/Landing'));
const Login = React.lazy(() => import('./components/views/Login'));
const Logout = React.lazy(() => import('./components/views/Logout'));
const Register = React.lazy(() => import('./components/views/Register'));
const Page404 = React.lazy(() => import('./components/views/404'));
const MainPage = React.lazy(() => import('./components/views/Main'));
const MoleGame = React.lazy(() => import('./components/mole-game/MoleGame'));
const MatchGame = React.lazy(() => import('./components/match-game/MatchGame'));
const SimonGame = React.lazy(() => import('./components/simonsays-game/SimonGame'));
const SummaryReport = React.lazy(() => import('./components/views/SummaryReport'));
const PersonalReport = React.lazy(() => import('./components/views/PersonalReport'));
const Profile = React.lazy(() => import('./components/views/Profile'));
const EditProfile = React.lazy(() => import('./components/views/EditProfile'));


// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/" name="Landing Page" render={props => <Landing {...props} />} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props} />} />
            </Switch>
            <Switch>
              <PrivateRoute path="/home" name="Home" Component={MainPage} />} />
              <PrivateRoute path="/logout" Component={Logout} />} />
              <PrivateRoute path="/game/molegame" name="Whack A Mole" Component={MoleGame} />} />
              <PrivateRoute path="/game/simongame" name="Simon Says" Component={SimonGame} />} />
              <PrivateRoute path="/game/matchgame" name="Card Match" Component={MatchGame} />} />
              <PrivateRoute path="/report/summary" name="Summary Report" Component={SummaryReport} />} />
              <PrivateRoute path="/profile/view" name="Profile" Component={Profile} />} />
              <PrivateRoute path="/profile/edit" name="Edit Profile" Component={EditProfile} />} />
              <PrivateRoute path="/profile/report" name="Personal Report" Component={PersonalReport} />} />
              <PrivateRoute path="*" component={Page404}/>
            </Switch>
          </React.Suspense>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
