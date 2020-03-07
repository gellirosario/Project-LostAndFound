import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import errorReducer from "./reducers/errorReducer";
import alertReducer from "./reducers/alertReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  success: alertReducer
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
