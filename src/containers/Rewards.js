import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import Header from '../components/Header.js';

export default class Rewards extends Component {
  render() {
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
