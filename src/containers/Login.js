import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Linking } from 'react-native';
import { Link } from 'react-router-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header.js';

import focusTextInput from '../utils/TextInputManager.js';
import renderIf from '../utils/renderif.js';
import history from '../utils/history.js';

var authCtrl = require('../services/AuthControl.js');

export default class Login extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableLogin: true,
    showForgotLogin: false,
    username: '',
    password: ''
  };

  toggleStatus() {
    this.setState({
      showForgotLogin: !this.state.showForgotLogin
    });
  }

  login() {
    this.setState({
      enableLogin: false
    });
    authCtrl.login(this.state.username, this.state.password, function(err, message) {
      if (err) {
        this.setState({
          modalText: err,
          showModal: true,
          enableLogin: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true,
          enableLogin: true
        });
      }
      else {
        this.setState({
          username: '',
          password: '',
          enableLogin: true
        });
        history.replace('/home');
      }
    }.bind(this));
  }

  logout() {
    authCtrl.logout();
    this.forceUpdate();
  }

  render() {
      if (!authCtrl.isAuthenticated) {
        return (
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            <Header title="Login"/>
            <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>
            <View style={{
            justifyContent: 'center',
            alignItems: 'center'}}>
              <TouchableOpacity style={buttonStyles.solidGreenButton}>
                  <Link to="/home">
                    <Text style={buttonStyles.solidGreenButtonText}>RETURN TO HOME</Text>
                  </Link>
              </TouchableOpacity>
              <TouchableOpacity style={buttonStyles.solidGreenButton} onPress={() => this.logout()}>
                  <Text style={buttonStyles.solidGreenButtonText}>LOG OUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
      return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
          <Header title="Login"/>

          <Spinner visible={!this.state.enableLogin}/>

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
            <View flexDirection="row" style={styles.topText}>
              <Text style={{fontSize: 17, fontFamily: 'OpenSans-Regular'}}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => {history.push('/register')}}>
                <Text style={styles.greenHighlightText}>Create an Account</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Username"
              returnKeyType="next"
              onChangeText={(text) => this.setState({username: text})}
              onSubmitEditing={() => focusTextInput(this.refs.passwordInput)}
              style={styles.inputField}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              returnKeyType="go"
              style={styles.inputField}
              ref='passwordInput'
              onChangeText={(text) => this.setState({password: text})}
            />

            <TouchableOpacity onPress={() => this.toggleStatus()}>
              <Text style={styles.greenHighlightTextMargin}>Forgot Username/Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!this.state.enableLogin}
              style={buttonStyles.solidGreenButton}
              onPress={() => this.login()}>
                <Text style={buttonStyles.solidGreenButtonText}>LOG IN</Text>
            </TouchableOpacity>

            {
              renderIf(this.state.showForgotLogin)(
                <View>
                  <TextInput
                    placeholder="Email Address"
                    returnKeyType="go"
                    style={styles.inputField}
                  />

                  <TouchableOpacity style={buttonStyles.solidGreenButton}>
                    <Text style={buttonStyles.solidGreenButtonText}>SEND LOGIN CREDENTIALS</Text>
                  </TouchableOpacity>
                </View>
              )
            }

          </KeyboardAwareScrollView>
      </View>
    );
  }
}

import modalStyles from '../styles/modal.js';
import textStyles from '../styles/text.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#efefef'
  },
  greenHighlightText: {
    color: '#509E2f',
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'
  },
  greenHighlightTextMargin: {
    color: '#509E2f',
    fontSize: 17,
    fontFamily: 'OpenSans-Regular',
    marginTop: 20
  },
  inputField: {
    height: 50,
    opacity: 0.9,
    marginTop: 20,
    paddingHorizontal: 10,
    fontSize: 20,
    fontFamily: 'OpenSans-Light',
    backgroundColor: '#FFF'
  }
});
