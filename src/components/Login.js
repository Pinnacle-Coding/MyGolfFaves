import React, { Component } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Linking } from 'react-native';
import { Font, AppLoading } from 'expo';
import { Link } from 'react-router-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import focusTextInput from '../utils/TextInputManager.js';
import renderIf from '../utils/renderif.js';
import history from '../utils/history.js';

import Header from './Header.js';

var auth = require('../services/AuthControl.js');

export default class Login extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: '',
    enableLogin: true,
    showForgotLogin: false,
    username: '',
    password: ''
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

  toggleStatus() {
    this.setState({
      showForgotLogin: !this.state.showForgotLogin
    });
  }

  login() {
    this.setState({
      enableLogin: false
    });
    auth.login(this.state.username, this.state.password, function(err, message) {
      if (err) {
        this.setState({
          password: '',
          modalText: err,
          showModal: true,
          enableLogin: true
        });
      }
      else if (message) {
        this.setState({
          password: '',
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
    auth.logout();
    this.forceUpdate();
  }

  render() {
      if (!this.state.loaded) {
        return <AppLoading/>;
      }
      if (!auth.isAuthenticated) {
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
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}
            extraHeight={175}
            keyboardOpeningTime={0}
            scrollEnabled={true}>
            <View flexDirection="row" style={styles.topText}>
              <Text style={styles.noAccountTxt}>Don't have an account? </Text>
              <Link to="/register">
                <Text style={styles.createAccntLink}>Create an Account</Text>
              </Link>
            </View>

            <TextInput
              placeholder="Username"
              returnKeyType="next"
              onChangeText={(text) => this.setState({username: text})}
              onSubmitEditing={() => focusTextInput(this.refs.passwordInput)}
              style={styles.input}
            />

            <TextInput
              placeholder="Password"
              secureTextEntry
              returnKeyType="go"
              style={styles.input}
              ref='passwordInput'
              onChangeText={(text) => this.setState({password: text})}
            />

            <TouchableOpacity onPress={() => this.toggleStatus()}>
              <Text style={styles.forgot}>Forgot Username/Password</Text>
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
                    style={styles.input}
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
  container: {
    backgroundColor: '#efefef',
    padding: 30,
    flex: 1
  },
  noAccountTxt: {
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'
  },
  createAccntLink: {
    color: '#509E2f',
    fontSize: 17,
    fontFamily: 'OpenSans-Regular'
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    marginTop: 20,
    paddingHorizontal: 10,
    opacity: 0.9,
    fontSize: 20
  },
  forgot: {
    color: '#509E2f',
    fontSize: 17,
    marginTop: 20,
    fontFamily: 'OpenSans-Regular'
  }
});
