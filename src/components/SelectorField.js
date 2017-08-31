import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

import renderIf from '../utils/renderif.js';

export default class TextField extends Component {
  render() {
    return (
      <View>
        <ModalSelector
          style={{marginTop: 5, marginBottom: 15, width: this.props.passProps.width}}
          data={this.props.passProps.data}
          initValue={this.props.passProps.initValue}
          onChange={(option) => {this.setState({locationRadius: option.label})}}>
          <TextInput
            editable={false}
            style={{borderWidth:1, borderColor:'#ccc', padding: 10, height: 50}}
            placeholder={this.props.passProps.placeholder}
            onSubmitEditing={this.props.passProps.onSubmitEditing}
            onChangeText={this.props.onChange}
            value={this.props.value}
            style={styles.textField}
          />
        </ModalSelector>
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
