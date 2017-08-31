import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'react-router-native';
import Modal from 'react-native-modal';

import Header from '../components/Header.js';

import history from '../utils/history.js';

var offerCtrl = require('../services/OfferControl.js');

export default class Wallet extends Component {
  state = {
    showModal: false,
    modalText: ''
  };

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
        history.push('/redeem');
      }
    }.bind(this));
  }

  render() {
    return (
      <View>
        <Header title="Wallet"/>
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
            data={this.formatOffers(offerCtrl.getMemberWallet())}
            renderItem={
              ({item}) =>
              <View style={{padding: 10}}>
                  <Text style={styles.itemTitle}>{item.companyName} - {item.offerTitle}</Text>
                  <TouchableOpacity style={buttonStyles.solidGreenButton} onPress={() =>  this.selectOffer(item.offerID)}>
                    {
                      <Text style={buttonStyles.solidGreenButtonText}>REDEEM</Text>
                    }
                  </TouchableOpacity>
                  <View style={{borderBottomColor:'lightgray', borderBottomWidth:1, borderStyle: 'solid', padding:10}}/>
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
    paddingTop: 10,
    fontSize: 28,
    fontFamily: 'OpenSans-Regular',
    paddingBottom: 5
  }
});
