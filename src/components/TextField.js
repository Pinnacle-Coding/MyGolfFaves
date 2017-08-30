import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { Font, AppLoading } from 'expo';

import renderIf from '../utils/renderif.js';

export default class TextField extends Component {
  state = {
    loaded: false
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

  render() {
    if (!this.state.loaded) {
      return <AppLoading/>;
    }
    return (
      <View>
        <TextInput
          placeholder={this.props.passProps.placeholder}
          keyboardType={this.props.passProps.keyboardType}
          returnKeyType={this.props.passProps.returnKeyType}
          onSubmitEditing={this.props.passProps.onSubmitEditing}
          onChangeText={this.props.onChange}
          value={this.props.value}
          style={styles.textField}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textField: {
    height: 50,
    opacity: 0.9,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 20,
    fontFamily: 'OpenSans-Light',
    borderStyle: 'solid',
    borderColor: 'lightgray',
    borderWidth: 1,
    backgroundColor: '#FFF'
  }
});
