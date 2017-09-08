import React, { Component } from 'react';
import { StyleSheet, View} from 'react-native';
import { Font, AppLoading } from 'expo';
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

var optionCtrl = require('./src/services/OptionControl.js');

export default class App extends Component {
  state = {
    fontsLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Regular': require('./assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Italic': require('./assets/fonts/OpenSans-Italic.ttf'),
      'OpenSans-Light': require('./assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({
      fontsLoaded: true
    });
  }

  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading/>;
    }
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
