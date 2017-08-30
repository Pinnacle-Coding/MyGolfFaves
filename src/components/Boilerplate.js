import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Font, AppLoading } from 'expo';

import Header from './Header.js';

export default class Boilerplate extends Component {
  state = {
    loaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Light': require('../../assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({
      loaded: true
    })
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View>
        <Header title="Placeholder"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
