import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, FlatList, Button, Linking } from 'react-native';
import { Location, Permissions } from 'expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SimplePicker from 'react-native-simple-picker';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import Header from '../components/Header.js';

import renderIf from '../utils/renderif.js';
import zipcodes from '../utils/zipcodes.js';

var authCtrl = require('../services/AuthControl.js');
var affiliateCtrl = require('../services/AffiliateControl.js');

var citiesData = {
  'Las Vegas': {
    lat: 36.171,
    long: -115.1258
  },
  'Los Angeles': {
    lat: 34.0522342,
    long: -118.2436849
  },
  'Palm Springs': {
    lat: 33.8302961,
    long: -116.5452921
  },
  'Orange County': {
    lat: 33.7175,
    long: -117.8311
  },
  'San Diego': {
    lat: 32.7153292,
    long: -117.1572551
  },
  'Phoenix': {
    lat: 33.4484,
    long: -112.0740
  },
  'Scottsdale': {
    lat: 33.4942,
    long: -111.9261
  },
  'Tucson': {
    lat: 32.2217,
    long: -110.9265
  }
};

export default class FavoriteGolfCourses extends Component {
  state = {
    showModal: false,
    modalText: '',
    enableSearch: true,
    selectedCity: 'Las Vegas',
    locationLat: citiesData['Las Vegas'].lat,
    locationLong: citiesData['Las Vegas'].long,
    locationRadius: '50',
    locationOption: 2,
    ignoreRadius: false,
    nearbyAffiliates: [],
    showSelectAll: true,
    optionsCollapsed: true
  };

  componentDidMount() {
    var zipcode = "" + authCtrl.getUser().zipCode;
    if (zipcode in zipcodes) {
      this.setState({
        locationOption: 0,
        selectedZipCode: authCtrl.getUser().zipCode
      });
      // Set state doesn't trigger until after componentDidMount, so we have to manually set these options
      this.state.locationLat = zipcodes[zipcode].lat;
      this.state.locationLong = zipcodes[zipcode].long;
    }
    this.getNearbyAffiliates();
  }

  getLocationFromZipCode() {
    var zipcode = ""+this.state.selectedZipCode;
    if (zipcode in zipcodes) {
      var zipcodeData = zipcodes[zipcode];
      this.setState({
        locationOption: 0,
        locationLat: zipcodeData.lat,
        locationLong: zipcodeData.long
      });
    }
    else {
      this.setState({
        showModal: true,
        modalText: 'Invalid US zip code entered. Using your last saved location instead.'
      });
    }
  }

  async getCurrentLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        locationLat: location.coords.latitude,
        locationLong: location.coords.longitude,
        locationOption: 1
      });
    }
  }

  getLocationFromCity(cityName) {
    this.setState({
      locationLat: citiesData[cityName].lat,
      locationLong: citiesData[cityName].long,
      locationOption: 2,
      selectedCity: cityName
    });
  }

  getLocationShowAll() {
    this.setState({
      ignoreRadius: !this.state.ignoreRadius
    });
    // Click Show All/Less triggers a refresh of the affiliates list
    // this.getNearbyAffiliates();
  }

  getNearbyAffiliates() {
    this.setState({
      enableSearch: false
    });
    var radius = this.state.ignoreRadius ? 100000 : this.state.locationRadius;
    affiliateCtrl.getNearbyAffiliates(authCtrl.getUser().memberID, this.state.locationLat, this.state.locationLong, radius, function (err, message, affiliates) {
      if (err) {
        this.setState({
          modalText: err.message,
          showModal: true,
          enableSearch: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true,
          enableSearch: true
        });
      }
      else {
        affiliates.forEach(function (affiliate) {
          affiliate.key = affiliate.favoriteID;
        });
        this.setState({
          nearbyAffiliates: affiliates,
          showSelectAll: true,
          enableSearch: true
        });
      }
    }.bind(this));
  }

  selectAllAffiliates() {
    if (this.state.showSelectAll) {
      this.state.nearbyAffiliates.forEach(function (affiliate) {
        affiliate.memberFavorite = "true";
      });
    }
    else {
      this.state.nearbyAffiliates.forEach(function (affiliate) {
        affiliate.memberFavorite = "false";
      });
    }
    this.setState({
      showSelectAll: !this.state.showSelectAll
    });
  }

  selectAffiliate(item) {
    if (item.memberFavorite === 'true') {
      item.memberFavorite = 'false';
    }
    else {
      item.memberFavorite = 'true';
    }
    // Re-render by accessing state but not changing it
    this.setState({
      showSelectAll: this.state.showSelectAll
    });
  }

  openLink(item) {
    if (item.companyURL) {
      var link = item.companyURL;
      if (!link.startsWith('http://')) {
        link = 'http://' + link;
      }
      Linking.openURL(link).catch(err => console.error('An error occured', err));
    }
  }

  saveNearbyAffliates() {
    this.setState({
      enableSearch: false
    });
    affiliateCtrl.saveNearbyAffliates(authCtrl.getUser().memberID, this.state.nearbyAffiliates, function (err, message) {
      if (err) {
        this.setState({
          modalText: err.message,
          showModal: true,
          enableSearch: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true,
          enableSearch: true
        });
      }
      else {
        this.setState({
          modalText: 'Selections saved successfully',
          showModal: true,
          enableSearch: true
        });
      }
    }.bind(this));
  }

  render() {

    var milesMenu = ['50', '100', '150'];
    var citiesMenu = [];
    for (var k in citiesData) {
      if (citiesData.hasOwnProperty(k)) {
        citiesMenu.push(k);
      }
    }
    citiesMenu.sort();

    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Header title="Favorites"/>
        <View style={{borderBottomColor:'gray', borderBottomWidth:1, borderStyle: 'solid', padding:0}}/>

        <Spinner visible={!this.state.enableSearch}/>

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

        <ScrollView style={styles.container}>

          <View style={styles.locationContainer}>
            <Text style={{paddingBottom: 5, textAlign: 'center', fontFamily:'OpenSans-Regular', fontSize: 24}}>Location Options</Text>

            {
              renderIf(!this.state.optionsCollapsed)(
                <View>
                  <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 0 ? '\u2023' : '\u2022'} Location (click zip to change) </Text>
                  <TextInput
                    style={{borderWidth:1, borderColor:'#ccc', padding: 5, marginLeft: 35, lineHeight: 30, width: 120}}
                    placeholder="00000"
                    keyboardType = 'numeric'
                    onChangeText={(text) => this.setState({selectedZipCode: text})}
                    onEndEditing={() => this.getLocationFromZipCode()}
                    value={this.state.selectedZipCode}
                    underlineColorAndroid='transparent'
                  />

                  <TouchableOpacity onPress={() => this.getCurrentLocation()}>
                    <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 1 ? '\u2023' : '\u2022'} <Text style={{textDecorationLine: 'underline'}}>Use My Current Location</Text></Text>
                  </TouchableOpacity>

                  <View style={{flexDirection: 'row'}}>
                    <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 2 ? '\u2023' : '\u2022'} </Text>
                    <Text
                      style={{borderWidth: 1, borderColor:'#ccc', paddingLeft: 5, lineHeight: 30, width: 200, fontFamily:'OpenSans-Regular', fontSize: 16}}
                      onPress={() => {
                        this.refs.cityPicker.show();
                      }}
                    >
                      {this.state.selectedCity}
                    </Text>
                    <SimplePicker
                      ref={'cityPicker'}
                      options={citiesMenu}
                      labels={citiesMenu}
                      initialOptionIndex={0}
                      buttonStyle={{
                        fontSize: 18,
                        padding: 5
                      }}
                      itemStyle={{
                        fontSize: 25,
                        fontWeight: 'bold'
                      }}
                      onSubmit={(option) => this.getLocationFromCity(option)}
                    />
                  </View>

                  <TouchableOpacity onPress={() => this.getLocationShowAll()}>
                    <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{'\u2022'} <Text style={{textDecorationLine: 'underline'}}>{this.state.ignoreRadius ? 'Show Less' : 'Show All'}</Text></Text>
                  </TouchableOpacity>

                  {
                    /*
                    <View style={{borderBottomColor: 'black', borderBottomWidth: 1, borderStyle: 'solid', padding: 0, marginLeft: 20, marginRight: 20}}/>
                    */
                  }

                  <View style={{flexDirection: 'row'}}>
                    <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{'\u2022'} Search within </Text>
                    <Text
                      style={{borderWidth: 1, borderColor:'#ccc', paddingLeft: 5, marginTop: 10, lineHeight: 30, width: 50, fontFamily:'OpenSans-Regular', fontSize: 16}}
                      onPress={() => {
                        this.refs.milesPicker.show();
                      }}
                    >
                      {this.state.locationRadius}
                    </Text>
                    <SimplePicker
                      ref={'milesPicker'}
                      options={milesMenu}
                      labels={milesMenu}
                      buttonStyle={{
                        fontSize: 18,
                        padding: 5
                      }}
                      itemStyle={{
                        fontSize: 25,
                        fontWeight: 'bold'
                      }}
                      onSubmit={(option) => {this.setState({locationRadius: option})}}
                    />
                    <Text style={{padding: 5, paddingTop: 15, fontFamily:'OpenSans-Regular', fontSize: 16}}> miles</Text>
                  </View>

                  <TouchableOpacity
                    disabled={!this.state.enableSearch}
                    style={{marginTop: 15, marginLeft: 60, marginRight: 60, padding: 5, borderWidth: 1, borderStyle: 'solid'}}
                    onPress={() => this.getNearbyAffiliates()}>
                    <Text style={{fontSize: 16, fontFamily: 'OpenSans-Regular', textAlign: 'center'}}>GO</Text>
                  </TouchableOpacity>

                  {
                    /*
                    <View style={{borderBottomColor: 'black', borderBottomWidth: 1, borderStyle: 'solid', padding: 0, marginTop: 15}}/>
                     */
                  }

                  <TouchableOpacity
                    onPress={() => this.setState({ optionsCollapsed: true })}>
                    <Text
                      style={{paddingTop: 10, textAlign: 'center', fontFamily:'OpenSans-Italic', fontSize: 14, textDecorationLine: 'underline'}}>
                      Collapse
                    </Text>
                  </TouchableOpacity>

                </View>
              )
            }

            {
              renderIf(this.state.optionsCollapsed)(
                <TouchableOpacity
                  onPress={() => this.setState({ optionsCollapsed: false })}>
                  <Text
                    style={{padding: 5, textAlign: 'center', fontFamily:'OpenSans-Italic', fontSize: 14, textDecorationLine: 'underline'}}>
                    Display
                  </Text>
                </TouchableOpacity>
              )
            }

          </View>

          {
            renderIf(this.state.showSelectAll)(
              <TouchableOpacity
                style={{marginTop: 15, marginLeft: 60, marginRight: 60, padding: 5, borderWidth: 1, borderStyle: 'solid', borderColor:'#509E2F'}}
                onPress={() => this.selectAllAffiliates()}>
                <Text style={{fontSize: 16, fontFamily: 'OpenSans-Regular', textAlign: 'center', color:'#509E2F'}}>SELECT ALL</Text>
              </TouchableOpacity>
            )
          }

          {
            renderIf(!this.state.showSelectAll)(
              <TouchableOpacity
                style={{marginTop: 15, marginLeft: 60, marginRight: 60, padding: 5, borderWidth: 1, borderStyle: 'solid', borderColor: '#D12020'}}
                onPress={() => this.selectAllAffiliates()}>
                <Text style={{fontSize: 16, fontFamily: 'OpenSans-Regular', textAlign: 'center', color: '#D12020'}}>CLEAR ALL</Text>
              </TouchableOpacity>
            )
          }

          <FlatList
            style={{paddingTop: 10}}
            data={this.state.nearbyAffiliates}
            renderItem={
              ({item}) =>
              <View style={{paddingVertical: 5, flexDirection: 'row'}}>
                {
                  renderIf(item.memberFavorite === 'true')(
                    <TouchableOpacity onPress={() => this.selectAffiliate(item)}>
                      <Icon name="check" size={32} color="#509E2F"/>
                    </TouchableOpacity>
                  )
                }
                {
                  renderIf(item.memberFavorite !== 'true')(
                    <TouchableOpacity onPress={() => this.selectAffiliate(item)}>
                      <Icon name="add" size={32} color="#D12020"/>
                    </TouchableOpacity>
                  )
                }
                <TouchableOpacity onPress={() => this.openLink(item)}>
                  <Text style={{fontFamily:'OpenSans-Regular', fontSize: 16, paddingLeft: 10, paddingTop: 5}}>{item.companyName} <Text style={{fontFamily:'OpenSans-Regular', fontSize: 14}}>{item.distance}</Text></Text>
                </TouchableOpacity>
              </View>
            }
          />

          <TouchableOpacity style={buttonStyles.solidGreenButton}
            disabled={!this.state.enableSearch}
            onPress={() => this.saveNearbyAffliates()}>
            <Text style={buttonStyles.solidGreenButtonText}>SAVE CHOICES</Text>
          </TouchableOpacity>

          <View style={{padding:100}}/>
        </ScrollView>
      </View>
    )
  }
}

import modalStyles from '../styles/modal.js';
import buttonStyles from '../styles/buttons.js';
const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1
  },
  locationContainer: {
    backgroundColor: '#efefef',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 15,
    paddingBottom: 15
  }
});
