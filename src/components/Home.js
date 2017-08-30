import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableHighlight } from 'react-native';
import { Font, AppLoading } from 'expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Link } from 'react-router-native';

import Header from './Header.js';

export default class Home extends Component {
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
        <Header title="Home"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>
        <ScrollView>
          <Link to='/profile'>
            <View style={styles.homeLinkAccented}>
              <Icon name="person" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>My Profile</Text>
                <Text style={styles.homeSubtitleText}>Update your personal profile</Text>
              </View>
            </View>
          </Link>
          <Link to='/favoriteCourses'>
            <View style={styles.homeLink}>
              <Icon name="golf-course" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>Favorite Golf Courses</Text>
                <Text style={styles.homeSubtitleText}>Update your favorite golf courses</Text>
              </View>
            </View>
          </Link>
          <Link to='/offers'>
            <View style={styles.homeLinkAccented}>
              <Icon name="info" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>My Offers</Text>
                <Text style={styles.homeSubtitleText}>View offers from your favorite courses</Text>
              </View>
            </View>
          </Link>
          <Link to='/wallet'>
            <View style={styles.homeLink}>
              <Icon name="check-circle" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>My Wallet</Text>
                <Text style={styles.homeSubtitleText}>View offers you have accepted</Text>
              </View>
            </View>
          </Link>
          <Link to='/notifications'>
            <View style={styles.homeLinkAccented}>
              <Icon name="notifications" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>My Notifications</Text>
                <Text style={styles.homeSubtitleText}>View notifications</Text>
              </View>
            </View>
          </Link>
          <Link to='/rewards'>
            <View style={styles.homeLink}>
              <Icon name="redeem" size={50} color="#509E2f"/>
              <View style={{paddingLeft: 10}}>
                <Text style={styles.homeTitleText}>My Rewards</Text>
                <Text style={styles.homeSubtitleText}>View rewards</Text>
              </View>
            </View>
          </Link>
        </ScrollView>
      </View>
    );
  }
}

import textStyles from '../styles/text.js';
const styles = StyleSheet.create({
  homeTitleText: {
    fontFamily:'OpenSans-Regular',
    fontSize: 28
  },
  homeSubtitleText: {
    fontFamily:'OpenSans-Light',
    fontSize: 20
  },
  homeLink: {
      backgroundColor: '#ffffff',
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 10,
      flexDirection: 'row',
      alignItems: 'center'
  },
  homeLinkAccented: {
      backgroundColor: '#eeeeee',
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 10,
      flexDirection: 'row',
      alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});
