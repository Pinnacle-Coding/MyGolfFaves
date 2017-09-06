import React, { Component } from 'react';
import { TextInput, ScrollView, Image, Text, StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Font, AppLoading } from 'expo';
import { Link } from 'react-router-native';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header.js';

import focusTextInput from '../utils/TextInputManager.js';
import history from '../utils/history.js';

var authCtrl = require('../services/AuthControl.js');
var optionCtrl = require('../services/OptionControl.js')

export default class Register extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableInteract: true,
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    username: '',
    password: '',
    confirmPassword: ''
  };

  createAccount() {
    if (!this.state.username || !this.state.password || !this.state.firstName || !this.state.lastName || !this.state.email) {
      this.setState({
        showModal: true,
        modalText: 'Required fields missing.'
      });
      return;
    }
    if (this.state.email !== this.state.confirmEmail) {
      this.setState({
        showModal: true,
        modalText: 'Emails do not match'
      });
      return;
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        showModal: true,
        modalText: 'Passwords do not match'
      });
      return;
    }
    this.setState({
      enableInteract: false
    });
    authCtrl.register({
      emailAddress: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password,
      username: this.state.username,
      ///////// DEFAULTS /////////
      birthYear: '1990',
      addressLine1: '',
      city: 'Las Vegas',
      state: 'CA',
      zipCode: '88901',
      genderAbbr: 'M',
      golfPartnerID: '1',
      notificationTypeID: '1',
      playGolfFrequencyID: '1',
      /////// END DEFAULTS ///////
      UID: 1,
      PWD: 'mob!leMGF'
    }, function (err, message) {
      if (err) {
        this.setState({
          showModal: true,
          modalText: err.message,
          enableInteract: true
        });
      }
      else if (message) {
        this.setState({
          showModal: true,
          modalText: message,
          enableInteract: true
        });
      }
      else {
        history.replace('/home');
      }
    });
  }

  render() {
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
          <Header title="Create an Account"/>

          <Spinner visible={!this.state.enableInteract}/>

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

          <KeyboardAwareScrollView
            style={styles.registerBackground}
            resetScrollToCoords={{ x: 0, y: 0 }}
            extraHeight={225}
            keyboardOpeningTime={0}
            scrollEnabled={true}>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="firstName"
                  style={textStyles.formText}
                  placeholder="First Name"
                  returnKeyType={"next"}
                  onChangeText={(text) => this.setState({firstName: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.lastName)}
                />
            </View>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="lastName"
                  style={textStyles.formText}
                  placeholder="Last Name"
                  returnKeyType = {"next"}
                  onChangeText={(text) => this.setState({lastName: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.email)}
                />
            </View>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="email"
                  style={textStyles.formText}
                  placeholder="Email Address"
                  returnKeyType = {"next"}
                  onChangeText={(text) => this.setState({email: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.confirmEmail)}
                />
            </View>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="confirmEmail"
                  style={textStyles.formText}
                  placeholder="Confirm Email"
                  returnKeyType = {"next"}
                  onChangeText={(text) => this.setState({confirmEmail: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.username)}
                />
            </View>
            <View style={{borderBottomColor:'gray', borderBottomWidth:3, borderStyle: 'solid', padding:15}}/>
            <View style={{padding:15}}/>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="username"
                  style={textStyles.formText}
                  placeholder="Username"
                  returnKeyType = {"next"}
                  onChangeText={(text) => this.setState({username: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.password)}
                />
            </View>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="password"
                  style={textStyles.formText}
                  placeholder="Password"
                  returnKeyType = {"next"}
                  secureTextEntry
                  onChangeText={(text) => this.setState({password: text})}
                  onSubmitEditing={() => focusTextInput(this.refs.confirmPassword)}
                />
            </View>
            <View style={styles.registerTextbox}>
                <TextInput
                  ref="confirmPassword"
                  style={textStyles.formText}
                  placeholder="Confirm Password"
                  secureTextEntry
                  onChangeText={(text) => this.setState({confirmPassword: text})}
                />
            </View>
            <View style={{padding:10}}/>
            <TouchableOpacity
              disabled={!this.state.enableInteract}
              style={buttonStyles.solidGreenButton}
              onPress={() => this.createAccount()}>
              <Text style={buttonStyles.solidGreenButtonText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
            <View style={{padding:10}}/>
            <View>
              <Text style={styles.termsPre}>By creating an account, you agree to our</Text>
              <TouchableOpacity onPress={() => {Linking.openURL("http://www.mygolffaves.com/index.cfm?event=public.terms").catch(err => console.error('An error occured', err))} }>
                 <Text style={styles.terms}>Terms and Conditions.</Text>
              </TouchableOpacity>
            </View>
            <View style={{padding:30}}/>
          </KeyboardAwareScrollView>
        </View>
    );
  }
}

import modalStyles from '../styles/modal.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  registerBackground: {
    backgroundColor: '#efefef',
    padding: 30
  },
  registerTextbox: {
    padding: 10
  },
  termsPre: {
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'
  },
  terms: {
    color: '#509E2f',
    textDecorationLine: 'underline',
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'
  }
});
