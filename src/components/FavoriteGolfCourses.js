import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, TextInput, FlatList, Button, Linking } from 'react-native';
import { Font, AppLoading, Location, Permissions } from 'expo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalSelector from 'react-native-modal-selector';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';

import renderIf from '../utils/renderif.js';
import zipcodes from '../utils/zipcodes.js';

import Header from './Header.js';

var authCtrl = require('../services/AuthControl.js');
var affiliateCtrl = require('../services/AffiliateControl.js');

var citiesData = {
  'Los Angeles': {
    lat: 34.0522342,
    long: -118.2436849
  },
  'Las Vegas': {
    lat: 36.171,
    long: -115.1258
  },
  'San Diego': {
    lat: 32.7153292,
    long: -117.1572551
  },
  'San Jose': {
    lat: 37.3393857,
    long: -121.8949555
  },
  'San Luis Obispo': {
    lat: 35.2827524,
    long: -120.6596156
  },
  'Palm Springs': {
    lat: 33.8302961,
    long: -116.5452921
  },
  'Bakersfield': {
    lat: 35.3732921,
    long: -119.0187125
  },
  'Salinas': {
    lat: 36.6777372,
    long: -121.6555013
  }
};

export default class FavoriteGolfCourses extends Component {
  state = {
    loaded: false,
    showModal: false,
    modalText: '',
    enableSearch: true,
    selectedCity: 'Las Vegas',
    selectedZipCodeInvalid: false,
    locationLat: citiesData['Las Vegas'].lat,
    locationLong: citiesData['Las Vegas'].long,
    locationRadius: '50',
    ignoreRadius: false,
    locationOption: 2,
    nearbyAffiliates: [],
    showSelectAll: true
  };

  async componentDidMount() {
    await Font.loadAsync({
      'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
      'OpenSans-Light': require('../../assets/fonts/OpenSans-Light.ttf'),
    });
    this.setState({
      loaded: true
    });
  }

  getLocationFromZipCode() {
    var zipcode = ""+this.state.selectedZipCode;
    if (zipcode in zipcodes) {
      var zipcodeData = zipcodes[zipcode];
      this.setState({
        locationOption: 0,
        locationLat: zipcodeData.lat,
        locationLong: zipcodeData.long,
        selectedZipCodeInvalid: false
      });
    }
    else {
      this.setState({
        locationOption: 0,
        selectedZipCodeInvalid: true
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
    if (this.state.locationOption === 0 && this.state.selectedZipCodeInvalid) {
      this.setState({
        showModal: true,
        modalText: 'Invalid US zip code entered. Using your last saved location instead.'
      });
    }
    var radius = this.state.ignoreRadius ? 100000 : this.state.locationRadius;
    affiliateCtrl.getNearbyAffiliates(authCtrl.getUser().memberID, this.state.locationLat, this.state.locationLong, radius, function (err, message, affiliates) {
      if (err) {
        this.setState({
          modalText: err,
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
    affiliateCtrl.saveNearbyAffliates(authCtrl.getUser().memberID, this.state.nearbyAffiliates, function (err, message) {
      if (err) {
        this.setState({
          modalText: err,
          showModal: true
        });
      }
      else if (message) {
        this.setState({
          modalText: message,
          showModal: true
        });
      }
      else {
        this.setState({
          modalText: 'Selections saved successfully!',
          showModal: true
        });
      }
    }.bind(this));
  }

  render() {

    var milesMenu = [
      {
        key: 0,
        section: true,
        label: 'Miles'
      },
      {
        key: 1,
        label: '50'
      },
      {
        key: 2,
        label: '100'
      },
      {
        key: 3,
        label: '150'
      },
    ];

    var citiesMenu = [
      {
        key: 0,
        section: true,
        label: 'Cities'
      },
    ];
    for (var k in citiesData) {
      if (citiesData.hasOwnProperty(k)) {
        citiesMenu.push({
          key: citiesMenu.length,
          label: k
        });
      }
    }

    if (!this.state.loaded) {
      return <AppLoading/>;
    }
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

            <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 0 ? '\u2023' : '\u2022'} Location (click zip to change) </Text>
            <TextInput
              style={{borderWidth:1, borderColor:'#ccc', padding:10, marginLeft: 35, height:30, width: 120}}
              placeholder="00000"
              keyboardType = 'numeric'
              onChangeText={(text) => this.setState({selectedZipCode: text})}
              onEndEditing={() => this.getLocationFromZipCode()}
              value={this.state.selectedZipCode} />

            <TouchableOpacity onPress={() => this.getCurrentLocation()}>
              <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 1 ? '\u2023' : '\u2022'} <Text style={{textDecorationLine: 'underline'}}>Use My Current Location</Text></Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 5, paddingLeft: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{this.state.locationOption === 2 ? '\u2023' : '\u2022'} </Text>
              <ModalSelector
                style={{paddingTop: 2, width: 200}}
                data={citiesMenu}
                initValue="- Select a location -"
                onChange={(option) => this.getLocationFromCity(option.label)}>
                <TextInput
                  style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30}}
                  editable={false}
                  placeholder="- Select a location -"
                  value={this.state.selectedCity} />
              </ModalSelector>
            </View>

            <TouchableOpacity onPress={() => this.getLocationShowAll()}>
              <Text style={{padding: 5, paddingLeft: 20, paddingBottom: 20, fontFamily:'OpenSans-Regular', fontSize: 16}}>{'\u2022'} <Text style={{textDecorationLine: 'underline'}}>{this.state.ignoreRadius ? 'Show Less' : 'Show All'}</Text></Text>
            </TouchableOpacity>

            <View style={{borderBottomColor: 'black', borderBottomWidth: 1, borderStyle: 'solid', padding: 0, marginLeft: 20, marginRight: 20}}/>

            <View style={{flexDirection: 'row'}}>
              <Text style={{padding: 5, paddingLeft: 20, paddingTop: 15, fontFamily:'OpenSans-Regular', fontSize: 16}}>{'\u2022'} Search within </Text>
              <ModalSelector
                style={{paddingTop: 12, width: 50}}
                data={milesMenu}
                initValue="50"
                onChange={(option) => {this.setState({locationRadius: option.label})}}>
                <TextInput
                  style={{borderWidth:1, borderColor:'#ccc', padding:10, height:30}}
                  editable={false}
                  placeholder="50"
                  value={this.state.locationRadius}/>
              </ModalSelector>
              <Text style={{padding: 5, paddingTop: 15, fontFamily:'OpenSans-Regular', fontSize: 16}}> miles</Text>
            </View>

            <TouchableOpacity
              disabled={!this.state.enableSearch}
              style={{marginTop: 15, marginLeft: 15, marginRight: 15, padding: 5, borderWidth: 1, borderStyle: 'solid'}}
              onPress={() => this.getNearbyAffiliates()}>
              <Text style={{fontSize: 16, fontFamily: 'OpenSans-Regular', textAlign: 'center'}}>GO</Text>
            </TouchableOpacity>

          </View>

          {
            renderIf(this.state.showSelectAll)(
              <TouchableOpacity style={buttonStyles.fringedGreenButton} onPress={() => this.selectAllAffiliates()}>
                <Text style={buttonStyles.fringedGreenButtonText}>SELECT ALL</Text>
              </TouchableOpacity>
            )
          }

          {
            renderIf(!this.state.showSelectAll)(
              <TouchableOpacity style={buttonStyles.fringedRedButton} onPress={() => this.selectAllAffiliates()}>
                <Text style={buttonStyles.fringedRedButtonText}>CLEAR ALL</Text>
              </TouchableOpacity>
            )
          }

          <FlatList
            style={{paddingTop: 10}}
            data={this.state.nearbyAffiliates}
            renderItem={
              ({item}) =>
              <View style={{padding: 10, flexDirection: 'row'}}>
                {
                  renderIf(item.memberFavorite === 'true')(
                    <TouchableOpacity onPress={() => this.selectAffiliate(item)}>
                      <Icon name="check" size={40} color="#509E2F"/>
                    </TouchableOpacity>
                  )
                }
                {
                  renderIf(item.memberFavorite !== 'true')(
                    <TouchableOpacity onPress={() => this.selectAffiliate(item)}>
                      <Icon name="add" size={40} color="#D12020"/>
                    </TouchableOpacity>
                  )
                }
                <TouchableOpacity onPress={() => this.openLink(item)}>
                  <Text style={{fontFamily:'OpenSans-Regular', fontSize: 18, paddingLeft: 10, paddingTop: 5}}>{item.companyName} <Text style={{fontFamily:'OpenSans-Regular', fontSize: 14}}>{item.distance}</Text></Text>
                </TouchableOpacity>
              </View>
            }
          />

          <TouchableOpacity style={buttonStyles.solidGreenButton} onPress={() => this.saveNearbyAffliates()}>
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
