import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Font } from 'expo';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';

import history from '../utils/history.js';

export default class Header extends Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Light': require('../../assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({
      fontsLoaded: true
    })
  }
  render() {
    return (
      <View>
        {
          /*
          rightButton={
            history.index + 1 < history.length ?
            <TouchableHighlight underlayColor="#999" style={{paddingLeft:20,paddingRight:20}} onPress={history.goForward}>
              <Icon name="angle-right" size={36} color="#000" style={{paddingTop:5}}/>
            </TouchableHighlight> : <View></View>
          }
          */
        }
        {
        this.state.fontsLoaded ? <NavigationBar
          containerStyle={styles.navbar}
          title={{
            title: this.props.title,
            style: textStyles.titleText
          }}
          leftButton={
            history.index > 0 ?
            <TouchableHighlight underlayColor="#999" style={{paddingLeft:20,paddingRight:20}} onPress={history.goBack}>
              <Icon name="angle-left" size={36} color="#000" style={{paddingTop:5}}/>
            </TouchableHighlight> : <View></View>
          }
        /> : undefined
      }
      </View>
    );
  }
}

import textStyles from '../styles/text.js';
const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#ffffff',
    paddingTop: 10,
    paddingBottom: 20
  }
});
