import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Font, AppLoading } from 'expo';
import { Link } from 'react-router-native';
import Modal from 'react-native-modal';

import history from '../utils/history.js';

import Header from './Header.js';

var offerCtrl = require('../services/OfferControl.js');

export default class Offers extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: ''
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

  formatOffers(rawOffers) {
    var newOffers = [];
    rawOffers.forEach(function (rawOffer) {
      var newOffer = Object.assign({}, rawOffer);
      newOffer.key = newOffer.offerID;
      newOffers.push(newOffer);
    });
    return newOffers;
  }

  selectOffer(offerID) {
    offerCtrl.selectOffer(offerID, function (err, message) {
      if (err) {
        this.setState({
          modalText: err,
          showModal: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true
        });
      }
      else {
        history.push('/offer');
      }
    }.bind(this));
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View>
        <Header title="Offers"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <Modal isVisible={this.state.showModal}>
          <View style={modalStyles.modalContainer}>
            <Text style={{fontSize: 20}}>{this.state.modalText}</Text>
            <TouchableOpacity onPress={() => this.setState({showModal: false})}>
              <View style={modalStyles.modalCloseButton}>
                <Text style={{color:'#FFF'}}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView>
          <FlatList
            data={this.formatOffers(offerCtrl.getCurrentOffers())}
            renderItem={
              ({item}) =>
              <View style={{padding: 10}}>
                <View>
                  <Text style={styles.itemTitle}>{item.companyName}</Text>
                  <Text style={styles.itemText}><Text style={{fontWeight: 'bold'}}>Start Date:</Text> {item.startDate}</Text>
                  <Text style={styles.itemText}><Text style={{fontWeight: 'bold'}}>End Date:</Text> {item.endDate}</Text>
                  <Text style={styles.itemText}><Text style={{fontWeight: 'bold'}}>Distance:</Text> {item.distance} miles</Text>
                  <Text style={styles.itemText}><Text style={{fontWeight: 'bold'}}>Offer:</Text> {item.offerTitle}</Text>
                  <TouchableOpacity style={buttonStyles.solidGreenButton} onPress={() =>  this.selectOffer(item.offerID)}>
                    {
                      <Text style={buttonStyles.solidGreenButtonText}>VIEW DETAILS</Text>
                    }
                  </TouchableOpacity>
                  <View style={{borderBottomColor:'lightgray', borderBottomWidth:1, borderStyle: 'solid', padding:10}}/>
                </View>
              </View>
            }
          />
          <View style={{padding:100}}/>
        </ScrollView>
      </View>
    );
  }
}

import modalStyles from '../styles/modal.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  itemTitle: {
    fontSize: 28,
    fontFamily: 'OpenSans-Regular',
    paddingBottom: 5
  },
  itemText: {
    padding: 5
  }
});
