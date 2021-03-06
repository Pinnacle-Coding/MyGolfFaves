import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text } from 'react-native';

import Header from '../components/Header.js';

import renderIf from '../utils/renderif.js';

var offerCtrl = require('../services/OfferControl.js');

export default class Notifications extends Component {
  formatOffers(rawOffers) {
    var newOffers = [];
    rawOffers.forEach(function (rawOffer) {
      var newOffer = Object.assign({}, rawOffer);
      newOffer.key = newOffer.offerID;
      newOffers.push(newOffer);
    });
    return newOffers;
  }

  formatDate(rawDate) {
    return rawDate.substring(5, 16);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Notifications"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <ScrollView style={{paddingTop: 10}}>
          <FlatList
            data={this.formatOffers(offerCtrl.getOfferHistory())}
            renderItem={
              ({item}) =>
              <View style={{padding: 10}}>
                <Text style={styles.itemTitle}>{item.companyName}</Text>
                <Text style={{fontFamily: 'OpenSans-Regular', color: '#509E2F', paddingTop: 5}}>Accepted on {this.formatDate(item.dateAccepted)}</Text>
                {
                  renderIf(item.dateRedeemed)(
                    <Text style={{fontFamily: 'OpenSans-Regular', color: '#509E2F'}}>Redeemed on {this.formatDate(item.dateRedeemed)}</Text>
                  )
                }
                { /*
                  renderIf(!item.dateRedeemed)(
                    <Text style={{fontFamily: 'OpenSans-Regular', color: '#D12020'}}>Not redeemed yet</Text>
                  )
                */ }
                <View style={{borderBottomColor: 'lightgray', borderBottomWidth: 1, borderStyle: 'solid', padding: 10}}/>
              </View>
            }
          />
          <View style={{padding:100}}/>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemTitle: {
    fontFamily: 'OpenSans-Light'
  }
});
