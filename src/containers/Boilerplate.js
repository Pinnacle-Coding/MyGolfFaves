import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import Header from '../components/Header.js';

export default class Boilerplate extends Component {
  render() {
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
