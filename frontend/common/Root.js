import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from 'routes/Home/Home';
import ReduxExample from 'routes/ReduxExample/ReduxExample';
import Login from 'routes/Login/Login';
import Logout from 'routes/Logout/Logout';
import Register from 'routes/Register/Register';
import NoMatch from 'routes/NoMatch/NoMatch';
import DashBoard from 'routes/DashBoard/Root';
import Authorization from 'common/Authorization/Authorization';

// Role-based authorization
const NotIfLoggedIn = Authorization(['None'], true);
const Staff = Authorization(['staff', 'admin']);
const Admin = Authorization(['admin']);

const LoginProtected = NotIfLoggedIn(Login);
const RegisterProtected = NotIfLoggedIn(Register);
const DashBoardIsStaff = Staff(DashBoard);

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/login" component={LoginProtected} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/register" component={RegisterProtected} />
          <Route exact path="/ReduxExample" component={ReduxExample} />
          <Route path="/dashboard" component={DashBoardIsStaff} />
          <Route component={NoMatch} />
        </Switch>
      </BrowserRouter>
    );
  }
}
