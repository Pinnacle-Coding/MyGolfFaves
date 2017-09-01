import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, TextInput, Picker, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form, Field } from 'simple-react-form';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import SimplePicker from 'react-native-simple-picker';

import Header from '../components/Header.js';
import TextField from '../components/TextField.js';
import SecureTextField from '../components/SecureTextField.js';

import renderIf from '../utils/renderif.js';

var authCtrl = require('../services/AuthControl.js');
var optionCtrl = require('../services/OptionControl.js');

export default class Profile extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableUpdate: true,
    showChangePassword: false,
    userFormNotificationTypes: []
  }; // Included: userForm, passwordForm

  formatSelectList(originalList, currentSelected, keyName) {
    var ret = [];
    for (var i = 0; i < originalList.length; i++) {
      var originalObject = Object.assign({}, originalList[i]);
      originalObject.key = originalObject[keyName];
      originalObject.selected =  currentSelected.indexOf(originalObject.key) > -1;
      ret.push(originalObject);
    }
    return ret;
  }

  formatSelectListToString(selectList) {
    var ret = '';
    for (var i = 0; i < selectList.length; i++) {
      if (selectList[i].seelcted)
        ret += selectList[i].key + ',';
    }
    return ret.slice(0, -1);
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

  componentDidMount() {
    this.setState({
      userForm: authCtrl.getUser(),
      userFormGender: authCtrl.getUser().genderAbbr,
      userFormPlayGolfFrequency: authCtrl.getUser().playGolfFrequencyID,
      userFormGolfPartners: this.formatSelectList(optionCtrl.getGolfPartnerTypes(), authCtrl.getUser()['lstGolfPartnerID'].split(','), 'golfPartnerID'),
      userFormNotificationTypes: this.formatSelectList(optionCtrl.getNotificationTypes(), authCtrl.getUser()['lstNotificationTypeID'].split(','), 'notificationTypeID'),
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

  unzipOptionsLabels(arr, optionName, labelName, initialOption) {
    var ret = {
      options: [],
      labels: []
    };
    for (var i = 0; i < arr.length; i++) {
      ret.options.push(arr[i][optionName]);
      ret.labels.push(arr[i][labelName]);
    }
    ret.initialIndex = ret.options.indexOf(initialOption);
    return ret;
  }

  selectItem(item) {
    item.selected = !item.selected;
    // Re-render by accessing state but not changing it
    this.setState({
      showChangePassword: this.state.showChangePassword
    });
  }

  isTextNotificationSelected() {
    for (var i = 0; i < this.state.userFormNotificationTypes.length; i++) {
      var notificationType = this.state.userFormNotificationTypes[i];
      if (notificationType.notificationType === 'Text Message') {
        return notificationType.selected;
      }
    }
    return false;
  }

  updateUser() {
    this.setState({
      enableUpdate: false
    });
    var userInformation = {};
    userInformation.addressID = this.state.userForm.addressID;
    userInformation.addressLine1 = this.state.userForm.addressLine1;
    userInformation.birthYear =  this.state.userForm.birthYear;
    userInformation.city = this.state.userForm.city;
    userInformation.emailAddress = this.state.userForm.emailAddress;
    userInformation.firstName = this.state.userForm.firstName;
    userInformation.genderAbbr = this.state.userFormGender;
    userInformation.golfPartnerID = formatSelectListToString(this.state.userFormGolfPartners);
    userInformation.lastName = this.state.userForm.lastName;
    userInformation.memberID = this.state.userForm.memberID;
    userInformation.mobilePhone = this.state.userForm.mobilePhone;
    userInformation.notificationTypeID = formatSelectListToString(this.state.userFormNotificationTypes);
    userInformation.playGolfFrequencyID = this.state.userFormPlayGolfFrequency;
    userInformation.state = this.state.userForm.State;
    userInformation.zipCode = this.state.userForm.zipCode;
    authCtrl.updateUser(userInformation, function (err, message) {
      if (err) {
        this.setState({
          modalText: err,
          showModal: true,
          enableUpdate: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true,
          enableUpdate: true
        });
      }
      else {
        this.setState({
          modalText: 'Profile updated successfully',
          showModal: true,
          enableUpdate: true
        });
      }
    }.bind(this))
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
                  fontSize: 18,
                  padding: 5
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
                  fontSize: 18,
                  padding: 5
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
              <FlatList
                style={{paddingTop: 10}}
                data={this.state.userFormGolfPartners}
                renderItem={
                  ({item}) =>
                  <View style={{padding: 10, flexDirection: 'row'}}>
                    {
                      renderIf(!item.selected)(
                        <TouchableOpacity onPress={() => this.selectItem(item)}>
                          <Icon name="check-box-outline-blank" size={40} color="#ccc"/>
                        </TouchableOpacity>
                      )
                    }
                    {
                      renderIf(item.selected)(
                        <TouchableOpacity onPress={() => this.selectItem(item)}>
                          <Icon name="check-box" size={40} color="#ccc"/>
                        </TouchableOpacity>
                      )
                    }
                    <TouchableOpacity onPress={() => this.selectItem(item)}>
                      <View style={{flex: 1}}>
                        <Text style={{fontFamily:'OpenSans-Light', fontSize: 20, paddingLeft: 10, paddingTop: 5}}>
                          {item.golfPartner}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              />

              <Text style={styles.inputLabel}>Which method(s) of notification do you prefer?</Text>
              <FlatList
                style={{paddingTop: 10}}
                data={this.state.userFormNotificationTypes}
                renderItem={
                  ({item}) =>
                  <View style={{padding: 10, flexDirection: 'row'}}>
                    {
                      renderIf(!item.selected)(
                        <TouchableOpacity onPress={() => this.selectItem(item)}>
                          <Icon name="check-box-outline-blank" size={40} color="#ccc"/>
                        </TouchableOpacity>
                      )
                    }
                    {
                      renderIf(item.selected)(
                        <TouchableOpacity onPress={() => this.selectItem(item)}>
                          <Icon name="check-box" size={40} color="#ccc"/>
                        </TouchableOpacity>
                      )
                    }
                    <TouchableOpacity onPress={() => this.selectItem(item)}>
                      <View style={{flex: 1, flexWrap: 'wrap'}}>
                        <Text style={{fontFamily:'OpenSans-Light', fontSize: 20, paddingLeft: 10, paddingTop: 5}}>
                          {item.notificationType}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }
              />

              {
                renderIf(this.isTextNotificationSelected())(
                  <View>
                    <Text style={styles.inputLabel}>Mobile Phone</Text>
                    <Field
                      fieldName='mobilePhone'
                      placeholder='000.111.2222'
                      returnKeyType='next'
                      type={TextField}/>
                  </View>
                )
              }

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
