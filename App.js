import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import { Router, Route, Switch } from 'react-router-native';

import Register from './src/components/Register.js';
import Login from './src/components/Login.js';
import Home from './src/components/Home.js';
import Profile from './src/components/Profile.js';
import Rewards from './src/components/Rewards.js';
import FavoriteGolfCourses from './src/components/FavoriteGolfCourses.js';
import Offers from './src/components/Offers.js';
import Offer from './src/components/Offer.js';
import Wallet from './src/components/Wallet.js';
import Redeem from './src/components/Redeem.js';
import Notifications from './src/components/Notifications.js';

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
