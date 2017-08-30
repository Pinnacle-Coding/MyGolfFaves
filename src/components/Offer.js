import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Image, Platform } from 'react-native';
import { Font, AppLoading } from 'expo';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';


import history from '../utils/history.js';

import Header from './Header.js';

var authCtrl = require('../services/AuthControl.js');
var offerCtrl = require('../services/OfferControl.js');
var affiliateCtrl = require('../services/AffiliateControl.js');

export default class Offer extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: '',
    exitModal: false,
    enableOffer: true
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

  formatWebsite(website) {
    if (!website.startsWith('http')) {
      return 'http://' + website;
    }
    return website;
  }

  openOfferLocation() {
    var companyID = offerCtrl.getSelectedOffer().companyID;
    affiliateCtrl.getAffiliate(companyID, function (err, message, company) {
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
        if (Platform.OS === 'ios') {
          var gpsLink = 'http://maps.apple.com/?ll='+company.lat+','+company.long;
        }
        else {
          var gpsLink = 'geo:'+company.lat+','+company.long;
        }
        Linking.openURL(gpsLink).catch(err => console.error('An error occured', err))
      }
    }.bind(this));
  }

  closeModal() {
    this.setState({showModal: false});
    if (this.state.exitModal) {
      history.goBack();
    }
  }

  accept() {
    this.setState({
      enableOffer: false
    });
    offerCtrl.acceptOffer(authCtrl.getUser().memberID, authCtrl.getUser(), function (err, message) {
      if (err) {
        this.setState({
          modalText: err,
          showModal: true,
          enableOffer: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true,
          enableOffer: true
        });
      }
      else {
        this.setState({
          modalText: 'Offer added to wallet!',
          showModal: true,
          exitModal: true,
          enableOffer: true
        });
      }
    }.bind(this));
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View>
        <Header title="Offer"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <Spinner visible={!this.state.enableOffer}/>

        <Modal isVisible={this.state.showModal}>
          <View style={modalStyles.modalContainer}>
            <Text style={{fontSize: 20}}>{this.state.modalText}</Text>
            <TouchableOpacity onPress={() => this.closeModal()}>
              <View style={modalStyles.modalCloseButton}>
                <Text style={{color:'#FFF'}}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView style={{padding: 10}}>
          <View>
            <Text style={styles.title}>{offerCtrl.getSelectedOffer().companyName}</Text>
          </View>
          <View style={{paddingTop: 10, paddingBottom: 10}}>
            <Text style={styles.description}>{offerCtrl.getSelectedOffer().offerTitle}</Text>
          </View>
          <Image source={{uri: offerCtrl.getSelectedOffer().logoImageURL}} style={{width: 400, height: 250}} />
          <View style={{borderBottomColor:'lightgray', borderBottomWidth:1, borderStyle: 'solid', padding:10}}/>
          <View style={{paddingTop: 10}}>
            <Text style={styles.title}>Offer Details</Text>
          </View>
          <View style={styles.subsection}>
            <View>
              <Text style={styles.subtitle}>Redemption Location</Text>
            </View>
            <TouchableOpacity onPress={() => this.openOfferLocation()}>
              <Text style={styles.subcontentClickable}>{offerCtrl.getSelectedOffer().addressLine1 + ', ' + offerCtrl.getSelectedOffer().city + ', ' + offerCtrl.getSelectedOffer().stateCD + ' ' + offerCtrl.getSelectedOffer().zipCode}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subsection}>
            <View>
              <Text style={styles.subtitle}>Website</Text>
            </View>
            <TouchableOpacity onPress={() => {Linking.openURL(this.formatWebsite(offerCtrl.getSelectedOffer().website)).catch(err => console.error('An error occured', err))} }>
              <Text style={styles.subcontentClickable}>{offerCtrl.getSelectedOffer().website}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subsection}>
            <View>
              <Text style={styles.subtitle}>Expires on</Text>
            </View>
            <View>
              <Text style={styles.subcontent}>{offerCtrl.getSelectedOffer().endDate}</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <View>
              <Text style={styles.subtitle}>More details</Text>
            </View>
            <View>
              <Text style={styles.subcontent}>{offerCtrl.getSelectedOffer().details}</Text>
            </View>
          </View>
          <View style={styles.subsection}>
            <View>
              <Text style={styles.subtitle}>Terms</Text>
            </View>
            <View>
              <Text style={styles.subcontent}>{offerCtrl.getSelectedOffer().terms}</Text>
            </View>
          </View>
          <TouchableOpacity
            disabled={!this.state.enableOffer}
            style={buttonStyles.solidGreenButton}
            onPress={() => this.accept()}>
            <Text style={buttonStyles.solidGreenButtonText}>ADD TO WALLET</Text>
          </TouchableOpacity>
          <View style={{padding:80}}/>
        </ScrollView>
      </View>
    );
  }
}

import modalStyles from '../styles/modal.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center'
  },
  description: {
    fontSize: 22,
    fontFamily: 'OpenSans-Light',
    textAlign: 'center'
  },
  subsection: {
    paddingTop: 10
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
  },
  subcontent: {
    fontFamily: 'OpenSans-Light'
  },
  subcontentClickable: {
    fontFamily: 'OpenSans-Light',
    textDecorationLine: 'underline'
  }
});
