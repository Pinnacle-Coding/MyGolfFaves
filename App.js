import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import { Router, Route, Switch } from 'react-router-native';

import Register from './src/containers/Register.js';
import Login from './src/containers/Login.js';
import Home from './src/containers/Home.js';
import Profile from './src/containers/Profile.js';
import Rewards from './src/containers/Rewards.js';
import FavoriteGolfCourses from './src/containers/FavoriteGolfCourses.js';
import Offers from './src/containers/Offers.js';
import Offer from './src/containers/Offer.js';
import Wallet from './src/containers/Wallet.js';
import Redeem from './src/containers/Redeem.js';
import Notifications from './src/containers/Notifications.js';

import history from './src/utils/history.js';

export default class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/home" component={Home}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/favoriteCourses" component={FavoriteGolfCourses}/>
          <Route path="/offers" component={Offers}/>
          <Route path="/offer" component={Offer}/>
          <Route path="/wallet" component={Wallet}/>
          <Route path="/redeem" component={Redeem}/>
          <Route path="/rewards" component={Rewards}/>
          <Route path="/notifications" component={Notifications}/>
        </Switch>
      </Router>
    );
  }
}
