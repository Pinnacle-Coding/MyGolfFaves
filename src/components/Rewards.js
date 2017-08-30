import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Font, AppLoading } from 'expo';

import Header from './Header.js'

export default class Rewards extends Component {
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
      <View style={styles.container}>
        <Header title="Rewards"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>
        <View style={{
        justifyContent: 'center',
        alignItems: 'center'}}>
          <Text style={{
            fontFamily:'OpenSans-Regular', fontSize: 20, paddingTop: 40}}>
            My Rewards Feature Coming Soon!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

  }
});
