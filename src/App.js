import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar.component"
import UserList from "./components/user-list.component"

function App() {
  return (
    <Router>
      <Navbar></Navbar>
      <br/>
      <Route path="/" component={UserList}/>
    </Router>
  );
}

export default App;
