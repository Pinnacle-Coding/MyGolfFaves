import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Linking, AsyncStorage } from 'react-native';
import { Link } from 'react-router-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header.js';

import focusTextInput from '../utils/TextInputManager.js';
import renderIf from '../utils/renderif.js';
import history from '../utils/history.js';

var authCtrl = require('../services/AuthControl.js');

var CryptoJS = require("crypto-js");
var secretKey = '1mob!leMGF';

export default class Login extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableLogin: true,
    showForgotLogin: false,
    username: '',
    password: '',
    rememberMe: false
  };

  async componentDidMount() {
    try {
      const rememberMeStored = await AsyncStorage.getItem('@MyGolfFaves:rememberMe');
      if (rememberMeStored !== null){
        this.setState({
          rememberMe: (rememberMeStored === 'true')
        });
        if (this.state.rememberMe) {
          const usernameStored = await AsyncStorage.getItem('@MyGolfFaves:username');
          if (usernameStored !== null && usernameStored !== '') {
            const ciphertext = await AsyncStorage.getItem('@MyGolfFaves:password');
            var passwordStored = CryptoJS.AES.decrypt(ciphertext, secretKey).toString(CryptoJS.enc.Utf8);
            this.setState({
              username: usernameStored,
              password: passwordStored
            });
          }
        }
      }
    } catch (error) {
      this.setState({
        modalText: error.message,
        showModal: true
      });
    }
  }

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
          modalText: err.message,
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
        try {
          if (this.state.rememberMe) {
            AsyncStorage.setItem('@MyGolfFaves:rememberMe', 'true');
            AsyncStorage.setItem('@MyGolfFaves:username', this.state.username);
            AsyncStorage.setItem('@MyGolfFaves:password', CryptoJS.AES.encrypt(this.state.password, secretKey).toString());
            history.replace('/home');
          }
          else {
            AsyncStorage.setItem('@MyGolfFaves:rememberMe', 'false');
            AsyncStorage.setItem('@MyGolfFaves:username', '');
            AsyncStorage.setItem('@MyGolfFaves:password', '');
            history.replace('/home');
          }
        } catch (error) {
          this.setState({
            modalText: error.message,
            showModal: true,
            enableLogin: true
          });
        }
      }
    }.bind(this));
  }

  render() {
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
            ref='usernameInput'
            value={this.state.username}
            style={styles.inputField}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            returnKeyType="go"
            style={styles.inputField}
            ref='passwordInput'
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
          />


          <View style={{paddingVertical: 20, flexDirection: 'row'}}>
            {
              renderIf(!this.state.rememberMe)(
                <TouchableOpacity onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}>
                  <Icon name="check-box-outline-blank" size={40} color="#ccc"/>
                </TouchableOpacity>
              )
            }
            {
              renderIf(this.state.rememberMe)(
                <TouchableOpacity onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}>
                  <Icon name="check-box" size={40} color="#ccc"/>
                </TouchableOpacity>
              )
            }
            <TouchableOpacity onPress={() => this.setState({ rememberMe: !this.state.rememberMe })}>
              <View style={{flex: 1}}>
                <Text style={{fontFamily:'OpenSans-Light', fontSize: 20, paddingLeft: 10, paddingTop: 5}}>
                  Remember Me
                </Text>
              </View>
            </TouchableOpacity>
          </View>

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
    fontFamily: 'OpenSans-Regular'
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
