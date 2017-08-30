import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Font, AppLoading } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Form, Field } from 'simple-react-form';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header.js';
import TextField from '../components/TextField.js';

import renderIf from '../utils/renderif.js';

var authCtrl = require('../services/AuthControl.js');

export default class Profile extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: '',
    enableUpdate: true,
    showChangePassword: false
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

  togglePassword() {
    this.setState({
      showChangePassword: !this.state.showChangePassword
    });
  }

  updateUser() {

  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
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
                      type={TextField}/>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <Field
                      fieldName='newPassword'
                      returnKeyType='next'
                      type={TextField}/>
                    <Text style={styles.inputLabel}>Verify Password</Text>
                    <Field
                      fieldName='verifyPassword'
                      type={TextField}/>
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
  }
});
