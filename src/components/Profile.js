import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Font, AppLoading } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from './Header.js';

import renderIf from '../utils/renderif.js';

var auth = require('../services/AuthControl.js');

var t = require('tcomb-form-native');
var Form = t.form.Form;
var ProfileModel = t.struct({
  firstName: t.String,
  lastName: t.String,
  zipCode: t.Number,
  city: t.String,
  state: t.String,
  emailAddress: t.String,
  birthYear: t.Number,
  gender: t.enums({
    M: 'Male',
    F: 'Female'
  }),
  "howOftenDoYouPlayGolf?": t.enums({
    F: 'Frequently',
    L: 'Less Than 10 Times a Year',
    N: 'New Golfer'
  }),
  "withWhomDoYouMostOftenPlayGolf?": t.struct({
    businessAssociates: t.Boolean,
    friends: t.Boolean,
    spouse: t.Boolean,
    "jr.Golfers": t.Boolean,
  }),
  username: t.String,
});
var ProfilePasswordModel = t.struct({
  firstName: t.String,
  lastName: t.String,
  zipCode: t.Number,
  city: t.String,
  state: t.String,
  emailAddress: t.String,
  birthYear: t.Number,
  gender: t.enums({
    M: 'Male',
    F: 'Female'
  }),
  "howOftenDoYouPlayGolf?": t.enums({
    F: 'Frequently',
    L: 'Less Than 10 Times a Year',
    N: 'New Golfer'
  }),
  username: t.String,
  "withWhomDoYouMostOftenPlayGolf?": t.struct({
    businessAssociates: t.Boolean,
    friends: t.Boolean,
    spouse: t.Boolean,
    "juniorGolfers": t.Boolean,
  }),
  currentPassword: t.String,
  newPassword: t.String,
  verifyPassword: t.String
});

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      showModal: false,
      modalText: '',
      enableUpdate: true,
      showChangePassword: false,
      formType: ProfileModel
    };

    this.onTogglePassword = this.onTogglePassword.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Light': require('../../assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({
      loaded: true
    })
  }

  onTogglePassword() {
    if (this.state.showChangePassword) {
      this.setState({
        formType: ProfileModel,
        showChangePassword: false
      });
    }
    else {
      this.setState({
        formType: ProfilePasswordModel,
        showChangePassword: true
      });
    }
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View style={styles.container}>

        <Header title="Profile"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <Spinner visible={!this.state.enableUpdate}/>

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
        style={styles.scrollContainer}
        resetScrollToCoords={{ x: 0, y: 0 }}
        extraHeight={175}
        keyboardOpeningTime={0}
        scrollEnabled={true}>
          <Form
            ref="form"
            type={this.state.formType}
          />
          <TouchableOpacity style={styles.button} onPress={this.onTogglePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.onPress}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <View style={{padding:100}}/>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

import modalStyles from '../styles/modal.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  container: {

  },
  scrollContainer: {
    padding: 20
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
