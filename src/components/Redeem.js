import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Font, AppLoading } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form, Field } from 'simple-react-form';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';


import history from '../utils/history.js';
import focusTextInput from '../utils/TextInputManager.js';

import Header from './Header.js';
import TextField from '../forms/TextField.js';

var authCtrl = require('../services/AuthControl.js');
var offerCtrl = require('../services/OfferControl.js');

export default class Redeem extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: '',
    exitModal: false,
    enableRedeem: true,
    form: {
      redemptionCode: undefined,
      redemptionAmount: undefined
    }
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

  closeModal() {
    this.setState({showModal: false});
    if (this.state.exitModal) {
      history.goBack();
    }
  }

  redeem() {
    this.setState({
      enableRedeem: false
    });
    var redemptionCode = this.state.form.redemptionCode;
    var redemptionAmount = this.state.form.redemptionAmount;
    if (redemptionCode && redemptionAmount) {
      offerCtrl.redeemOffer(authCtrl.getUser().memberID, authCtrl.getUser(), redemptionCode, redemptionAmount, (err, message) => {
        if (err) {
          this.setState({
            modalText: err,
            showModal: true,
            enableRedeem: true
          });
        }
        else if (message) {
          this.setState({
            modalText: message,
            showModal: true,
            enableRedeem: true
          });
        }
        else {
          this.setState({
            modalText: 'Redeemed offer successfully!',
            showModal: true,
            exitModal: true
          });
        }
      });
    }
    else {
      this.setState({
        modalText: 'Required fields missing',
        showModal: true,
        enableRedeem: true
      });
    }
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View>
        <Header title="Redeem Offer"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <Spinner visible={!this.state.enableRedeem}/>

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

        <KeyboardAwareScrollView
        style={styles.scrollContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        extraHeight={175}
        keyboardOpeningTime={0}
        scrollEnabled={true}>
          <View style={{paddingTop: 10}}>
            <Text style={styles.title}>{offerCtrl.getSelectedOffer().offerTitle}</Text>
          </View>
          <View style={{paddingBottom: 20}}>
            <Text style={styles.title}>@ {offerCtrl.getSelectedOffer().companyName}</Text>
          </View>
          <Form state={this.state.form} onChange={(state) => this.setState({form : state})}>
            <View>
              <Field
                fieldName='redemptionCode'
                placeholder='Redemption Code'
                returnKeyType='next'
                onSubmitEditing={() => focusTextInput(this.refs.redemptionAmount)}
                type={TextField}/>
              <Field
                ref='redemptionAmount'
                fieldName='redemptionAmount'
                placeholder='Amount'
                keyboardType = 'numeric'
                type={TextField}/>
            </View>
          </Form>
          <TouchableOpacity
            disabled={!this.state.enableRedeem}
            style={buttonStyles.solidGreenButton}
            onPress={() => this.redeem()}>
            <Text style={buttonStyles.solidGreenButtonText}>REDEEM</Text>
          </TouchableOpacity>
          <View style={{padding:100}}/>
      </KeyboardAwareScrollView>
      </View>
    );
  }
}

import buttonStyles from '../styles/buttons.js';
import modalStyles from '../styles/modal.js';
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10
  },
  title: {
    fontSize: 22,
    fontFamily: 'OpenSans-Light',
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#509E2f',
    borderColor: '#509E2f',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
