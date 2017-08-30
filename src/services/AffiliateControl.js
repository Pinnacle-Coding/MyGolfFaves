
var xml2jsParseString = require('react-native-xml2js').parseString;

var affiliates = [];

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
            var result_text = result['wddxPacket']['data'][0]['string'][0].split('\\').join('\\\\');
            var result_json = JSON.parse(result_text);
            callback(null, result_json);
          }
      });
    }
  }
  request.open('GET', url);
  request.send();
}

var saveAffiliateAsync = function(memberID, nearbyAffiliates, callback) {
  var affiliate = nearbyAffiliates.pop();
  sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=toggleAffiliateAsFave&UID=1&PWD=mob!leMGF&boolIsFavorite='+affiliate.memberFavorite+'&favoriteID='+affiliate.favoriteID+'&memberID='+memberID, function (err, result) {
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
      if (nearbyAffiliates.length) {
        saveAffiliateAsync(memberID, nearbyAffiliates, callback);
      }
      else {
        callback(null, null);
      }
    }
  });
}

var refreshInternal = function(memberID, callback) {
  sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getAffiliatesByMemberID&UID=1&PWD=mob!leMGF&memberID='+memberID, function (err, result) {
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
      affiliates = result.Affiliates;
      if (!affiliates) {
        affiliates = [];
      }
      callback(null, null);
    }
  });
}

module.exports = {

  getAffiliates: function () {
    return affiliates;
  },

  getAffiliate: function (companyID, callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getAffiliateDetail&companyID='+companyID+'&UID=1&PWD=mob!leMGF', function (err, result) {
      if (err) {
        callback(err, 'An error occurred', null);
      }
      else if (result.fail) {
        callback(null, result.fail, null);
      }
      else if (result.status !== 'success') {
        callback(null, result.message, null);
      }
      else {
        if (result.Details) {
          callback(null, null, result.Details[0]);
        }
        else {
          callback(null, 'No company with that ID exists', null);
        }
      }
    });
  },

  /**
   * Returns a list of nearby affiliates to the user's location in the callback function.
   * @param {String} memberID The user's ID
   * @param {Number} locationLat The latitude of the location to search from
   * @param {Number} locationLong The longitude of the location to search from
   * @param {Number} radius How far away from the location to search from (maximum)
   * @param {Function} callback A function taking three arguments: error (or null), message (not null when something went wrong but not an actual error), affiliates (the array containing the raw data from the request)
   */
  getNearbyAffiliates: function (memberID, locationLat, locationLong, locationRadius, callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getAffiliates&UID=1&PWD=mob!leMGF&memberID='+memberID+'&referenceLat='+locationLat+'&referenceLong='+locationLong+'&radius='+locationRadius, function (err, result) {
      if (err) {
        callback(err, 'An error occurred', null);
      }
      else if (result.fail) {
        callback(null, result.fail, null);
      }
      else if (result.status !== 'success') {
        callback(null, result.message, null);
      }
      else {
        var nearbyAffiliates = result.Affiliates || [];
        callback(null, null, nearbyAffiliates);
      }
    })
  },

  /**
   * Saves preferences for the provided affiliates and then refreshes favorites
   * @param  {String}     memberID         The user's ID
   * @param  {[Object]}   nearbyAffiliates An array of affiliate data
   * @param  {Function}   callback         A function taking two arguments: error (or null), message (not null when something went wrong but not an actual error)
   */
  saveNearbyAffliates: function (memberID, nearbyAffiliates, callback) {
    var nearbyAffliiatesCopy = JSON.parse(JSON.stringify(nearbyAffiliates));
    saveAffiliateAsync(memberID, nearbyAffliiatesCopy, function (err, message) {
      if (err) {
        callback(err, 'An error occurred');
      }
      else if (message) {
        callback(null, message);
      }
      else {
        refreshInternal(memberID, callback);
      }
    });
  },

  /**
   * Populates the service with the user's favorite courses, downloaded from the API.
   * @param {String} memberID The user's ID
   * @param {Function} callback A function taking two arguments: error (or null), message (not null when something went wrong but not an actual error)
   */
  refresh: function(memberID, callback) {
    refreshInternal(memberID, callback);
  }

}
