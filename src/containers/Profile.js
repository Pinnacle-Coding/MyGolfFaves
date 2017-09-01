import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, TextInput, Picker } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form, Field } from 'simple-react-form';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import SimplePicker from 'react-native-simple-picker';

import Header from '../components/Header.js';
import TextField from '../components/TextField.js';
import SecureTextField from '../components/SecureTextField.js';
import SelectorField from '../components/SelectorField.js';

import renderIf from '../utils/renderif.js';

var authCtrl = require('../services/AuthControl.js');
var optionCtrl = require('../services/OptionControl.js');

export default class Profile extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableUpdate: true,
    showChangePassword: false,
    userFormGender: 'M',
    userFormPlayGolfFrequency: '1',
  }; // Included: userForm, passwordForm

  componentDidMount() {
    this.setState({
      userForm: authCtrl.getUser(),
      userFormGender: authCtrl.getUser().genderAbbr,
      userFormPlayGolfFrequency: authCtrl.getUser().playGolfFrequencyID,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        verifyPassword: ''
      }
    });
  }

  togglePassword() {
    this.setState({
      showChangePassword: !this.state.showChangePassword
    });
  }

  formatOptions(options, title, labelKey) {
    var menu = [
      {
        key: 0,
        section: true,
        label: title
      }
    ];
    for (var i = 0; i < options.length; i++) {
      menu.push({
        key: menu.length,
        label: options[i][labelKey]
      });
    }
    return menu;
  }

  updateUser() {

  }

  unzipOptionsLabels(arr, optionName, labelName, initialOption) {
    var ret = {
      options: [],
      labels: []
    };
    for (var i = 0; i < arr.length; i++) {
      ret.options.unshift(arr[i][optionName]);
      ret.labels.unshift(arr[i][labelName]);
    }
    ret.initialIndex = ret.options.indexOf(initialOption);
    return ret;
  }

  render() {

    var genderTypes = this.unzipOptionsLabels(optionCtrl.getGenderTypes(), 'genderAbbr', 'genderDescr', this.state.userFormGender);
    var playGolfFrequencies = this.unzipOptionsLabels(optionCtrl.getGolfFrequencyTypes(), 'playGolfFrequencyID', 'playGolfFrequency', this.state.userFormPlayGolfFrequency);

    return (
      <View>

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
          extraHeight={225}
          keyboardOpeningTime={0}
          scrollEnabled={true}>
          <Form state={this.state.userForm} onChange={(state) => this.setState({userForm : state})}>
            <View>
              <Text style={styles.inputLabel}>First Name</Text>
              <Field
                fieldName='firstName'
                placeholder='John'
                returnKeyType='next'
                type={TextField}/>

              <Text style={styles.inputLabel}>Last Name</Text>
              <Field
                fieldName='lastName'
                placeholder='Smith'
                returnKeyType='next'
                type={TextField}/>

              <Text style={styles.inputLabel}>Zip Code</Text>
              <Field
                fieldName='zipCode'
                placeholder='90001'
                returnKeyType='next'
                keyboardType='numeric'
                type={TextField}/>

              <Text style={styles.inputLabel}>City</Text>
              <Field
                fieldName='city'
                placeholder='Los Angeles'
                returnKeyType='next'
                type={TextField}/>

              <Text style={styles.inputLabel}>State</Text>
              <Field
                fieldName='State'
                placeholder='CA'
                returnKeyType='next'
                type={TextField}/>

              <Text style={styles.inputLabel}>Email Address</Text>
              <Field
                fieldName='emailAddress'
                placeholder='john.smith@example.com'
                returnKeyType='next'
                type={TextField}/>

              <Text style={styles.inputLabel}>Birth Year</Text>
              <Field
                fieldName='birthYear'
                placeholder='1980'
                returnKeyType='next'
                keyboardType='numeric'
                type={TextField}/>

              <Text style={styles.inputLabel}>Gender</Text>
                <Text
                  style={styles.pickerField}
                  onPress={() => {
                    this.refs.genderPicker.show();
                  }}
                >
                  {genderTypes.labels[genderTypes.options.indexOf(this.state.userFormGender)]}
                </Text>
              <SimplePicker
                ref={'genderPicker'}
                options={genderTypes.options}
                labels={genderTypes.labels}
                initialOptionIndex={genderTypes.initialIndex}
                buttonStyle={{
                  fontSize: 16
                }}
                itemStyle={{
                  fontSize: 25,
                  fontWeight: 'bold'
                }}
                onSubmit={(option) => {
                  this.setState({
                    userFormGender: option,
                  });
                }}
              />

              <Text style={styles.inputLabel}>How often do you play golf?</Text>
                <Text
                  style={styles.pickerField}
                  onPress={() => {
                    this.refs.playGolfFrequencyPicker.show();
                  }}
                >
                  {playGolfFrequencies.labels[playGolfFrequencies.options.indexOf(this.state.userFormPlayGolfFrequency)]}
                </Text>
              <SimplePicker
                ref={'playGolfFrequencyPicker'}
                options={playGolfFrequencies.options}
                labels={playGolfFrequencies.labels}
                initialOptionIndex={playGolfFrequencies.initialIndex}
                buttonStyle={{
                  fontSize: 16
                }}
                itemStyle={{
                  fontSize: 25,
                  fontWeight: 'bold'
                }}
                onSubmit={(option) => {
                  this.setState({
                    userFormPlayGolfFrequency: option,
                  });
                }}
              />

              <Text style={styles.inputLabel}>With whom do you most often play golf?</Text>


              <Text style={styles.inputLabel}>Username</Text>
              <Field
                fieldName='username'
                placeholder='john_smith'
                type={TextField}/>
            </View>
          </Form>

          <TouchableOpacity
            style={buttonStyles.solidGreenButton}
            onPress={() => this.togglePassword()}>
            <Text style={buttonStyles.solidGreenButtonText}>PASSWORD OPTIONS</Text>
          </TouchableOpacity>

          {
            renderIf(this.state.showChangePassword)(
              <View style={{marginTop: 25}}>
                <Form state={this.state.passwordForm} onChange={(state) => this.setState({passwordForm : state})}>
                  <View>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <Field
                      fieldName='currentPassword'
                      returnKeyType='next'
                      type={SecureTextField}/>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <Field
                      fieldName='newPassword'
                      returnKeyType='next'
                      type={SecureTextField}/>
                    <Text style={styles.inputLabel}>Verify Password</Text>
                    <Field
                      fieldName='verifyPassword'
                      type={SecureTextField}/>
                  </View>
                </Form>
              </View>
            )
          }

          <TouchableOpacity
            disabled={!this.state.enableUpdate}
            style={buttonStyles.solidGreenButton}
            onPress={() => this.updateUser()}>
            <Text style={buttonStyles.solidGreenButtonText}>UPDATE PROFILE</Text>
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
  scrollContainer: {
    padding: 20
  },
  inputLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18
  },
  textField: {
    opacity: 0.9,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: '#FFF'
  },
  pickerField: {
    lineHeight: 50,
    opacity: 0.9,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderStyle: 'solid',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: '#FFF',
    fontSize: 20,
    fontFamily: 'OpenSans-Light'
  }
});
