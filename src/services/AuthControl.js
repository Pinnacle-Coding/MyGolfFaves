
var offers = require('./OfferControl.js');
var affiliates = require('./AffiliateControl.js');
var xml2jsParseString = require('react-native-xml2js').parseString;

var user = undefined;

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

module.exports = {

    isAuthenticated: function() {
      return user !== undefined;
    },

    getUser: function() {
      return user;
    },

    /**
     * Login function
     * @param {String} username The user's account name
     * @param {String} password The user's password
     * @param {Function} callback A function taking returned with two arguments: error (or null) and message (not null when something went wrong but not an actual error)
     */
    login: function(username, password, callback) {
      if (!username || !password) {
        callback(null, 'Required fields missing');
        return;
      }

      sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=loginMember&UID=1&PWD=mob!leMGF&username='+username+'&password='+password, function (err, result) {
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
          var userID = 3478; // TODO: result.memberID;
          sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getMemberAccount&UID=1&PWD=mob!leMGF&memberID='+userID, function (err, result) {
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
              user = result.Details[0];
              affiliates.refresh(userID, function (err, message) {
                if (err) {
                  callback(err, 'An error occurred')
                }
                else if (message) {
                  callback(null, message);
                }
                else {
                  offers.refresh(userID, user, function (err, message) {
                    if (err) {
                      callback(err, 'An error occurred')
                    }
                    else if (message) {
                      callback(null, message);
                    }
                    else {
                      callback(null, null);
                    }
                  });
                }
              });
            }
          });
        }
      });
    },

    logout: function() {
      user = undefined;
    }
}
