
var xml2jsParseString = require('react-native-xml2js').parseString;

var offers = [];
var wallet = [];
var offerHistory = [];
var selectedOffer = undefined;

/**
 * Generic function for accessing the API
 * @param  {String} url The given link
 * @param  {Function} callback A callback function that takes the parameters: error (null if no error), result object
 */
var sendRequest = function(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState !== 4) {
      return;
    }
    if (request.status === 200) {
      var response_text = request.responseText;
      xml2jsParseString(response_text, function (err, result) {
          if (err) {
            callback(err, null);
          }
          else {
            var raw_result_text = result['wddxPacket']['data'][0]['string'][0];
            if (typeof raw_result_text !== 'string') {
              raw_result_text = raw_result_text['_'];
            }
            var result_text = raw_result_text.split('\\').join('\\\\');
            var result_json = JSON.parse(result_text);
            callback(null, result_json);
          }
      });
    }
  }
  request.open('GET', url);
  request.send();
}

var refreshInternal = function(memberID, memberData, callback) {
  sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getCurrentOffers&UID=1&PWD=mob!leMGF&ageMax=29&ageMin=25&genderAbbr='+memberData.genderAbbr+'&golfPartnerID='+memberData['lstGolfPartnerID']+'&originLat='+memberData.lat+'&originLong='+memberData.long+'&memberID='+memberID+'&playGolfFrequencyID='+memberData.playGolfFrequencyID+'&stateCD='+memberData.State, function (err, result) {
    if (err) {
      callback(err, 'An error occurred');
    }
    else if (result.fail) {
      callback(null, result.fail);
    }
    else if (result.status !== 'success') {
      callback(null, result.message);
    }
    else {
      offers = result.Offers || [];
      sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getMemberWallet&UID=1&PWD=mob!leMGF&memberID='+memberID, function (err, result) {
        if (err) {
           callback(err, 'An error occurred');
        }
        else if (result.fail) {
          callback(null, result.fail);
        }
        else if (result.status !== 'success') {
          callback(null, result.message);
        }
        else {
          wallet = result.Offers || [];
          sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getOfferHistory&UID=1&PWD=mob!leMGF&memberID='+memberID+'&cuttoffDate=01/01/2017', function (err, result) {
            if (err) {
              callback(err);
            }
            else if (result.fail) {
              callback(null, result.fail);
            }
            else if (result.status !== 'success') {
              callback(null, result.message);
            }
            else {
              offerHistory = result.Rows || [];
              callback(null, null);
            }
          });
        }
      });
    }
  });
}

module.exports = {

  getCurrentOffers: function () {
    return offers;
  },

  getMemberWallet: function () {
    return wallet;
  },

  getOfferHistory: function () {
    return offerHistory;
  },

  getSelectedOffer: function() {
    return selectedOffer;
  },

  /**
   * The user is attempting to redeem an offer.
   * @param {String} offerID The ID of the user's selected offer
   * @param {Function} callback A function taking returned with two arguments: error (or null) and message (not null when something went wrong but not an actual error)
   */
  selectOffer: function (offerID, callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getOfferDetail&UID=1&PWD=mob!leMGF&offerID='+offerID, function (err, result) {
      if (err) {
        callback(err, 'An error occurred');
      }
      else if (result.fail) {
        callback(null, result.fail);
      }
      else if (result.status !== 'success') {
        callback(null, result.message);
      }
      else {
        selectedOffer = result.Details[0];
        callback(null, null);
      }
    });
  },

  acceptOffer: function (userID, userData, callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=acceptOffer&UID=1&PWD=mob!leMGF&offerID='+selectedOffer.offerID+'&memberID='+userID+'&companyID='+selectedOffer.companyID, function (err, result) {
      if (err) {
        callback(err, 'An error occurred');
      }
      else if (result.fail) {
        callback(null, result.fail);
      }
      else if (result.status !== 'success') {
        callback(null, result.message);
      }
      else {
        /*
        var ri = -1;
        for (var i = 0; i < offers.length; i++) {
          if (offers[i].offerID === selectedOffer.offerID) {
            ri = i;
            break;
          }
        }
        if (ri !== -1) {
          offers.splice(ri, 1);
        }
        wallet.push(selectedOffer);
        callback(null, null);
        */
        refreshInternal(userID, userData, callback);
      }
    });
  },

  /**
   * The user is attempting to redeem selectedOffer.
   * @param {String} userID The user's ID
   * @param {String} redemptionCode The redemption code
   * @param {Number} amount The amount to redeem the offer for
   * @param {Function} callback A function taking returned with two arguments: error (or null) and message (not null when something went wrong but not an actual error)
   */
  redeemOffer: function (userID, userData, redemptionCode, amount, callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=redeemOffer&UID=1&PWD=mob!leMGF&memberID='+userID+'&companyID='+selectedOffer.companyID+'&redemptionCode='+redemptionCode+'&offerID='+selectedOffer.offerID+'&amount='+amount, function (err, result) {
      if (err) {
        callback(err, 'An error occurred');
      }
      else if (result.fail) {
        callback(null, result.fail);
      }
      else if (result.status !== 'success') {
        callback(null, result.message);
      }
      else {
        /*
        var ri = -1;
        for (var i = 0; i < wallet.length; i++) {
          if (wallet[i].offerID === selectedOffer.offerID) {
            ri = i;
            break;
          }
        }
        if (ri !== -1) {
          wallet.splice(ri, 1);
        }
        callback(null, null);
        */
        refreshInternal(userID, userData, callback);
      }
    })
  },

  /**
   * Populates the service with the user's offers, downloaded from the API.
   * @param {String} memberID The user's ID
   * @param {Number} memberData The user object
   * @param {Function} callback A function taking returned with two arguments: error (or null) and message (not null when something went wrong but not an actual error)
   */
  refresh: function(memberID, memberData, callback) {
    refreshInternal(memberID, memberData, callback);
  }

}
