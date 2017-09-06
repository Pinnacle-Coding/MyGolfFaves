
var offers = require('./OfferControl.js');
var affiliates = require('./AffiliateControl.js');
var options = require('./OptionControl.js');
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

var postRequest = function(url, postData, callback) {
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
  request.open('POST', url);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send(JSON.stringify(postData));
}

var loadProfiles = function (userID, callback) {
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
      console.log('User profile loaded.');
      user = result.Details[0];
      affiliates.refresh(userID, function (err, message) {
        if (err) {
          callback(err, 'An error occurred')
        }
        else if (message) {
          callback(null, message);
        }
        else {
          console.log('Affiliates loaded.');
          offers.refresh(userID, user, function (err, message) {
            if (err) {
              callback(err, 'An error occurred')
            }
            else if (message) {
              callback(null, message);
            }
            else {
              console.log('Offers loaded.');
              options.refresh(function (err, message) {
                if (err) {
                  callback(err, 'An error occurred')
                }
                else if (message) {
                  callback(null, message);
                }
                else {
                  console.log('Options loaded.');
                  callback(null, null);
                }
              });
            }
          });
        }
      });
    }
  });
}

module.exports = {

    register: function (registerInformation, callback) {
      postRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=updateMemberAccount&UID=1&PWD=mob!leMGF', registerInformation, function (err, result) {
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
          var userID = result.memberID; // 3478
          console.log('Created user: '+userID);
          loadProfiles(userID, callback);
        }
      });
    },

    isAuthenticated: function() {
      return user !== undefined;
    },

    getUser: function() {
      return user;
    },

    updateUser: function (userInformation, callback) {

      postRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=updateMemberAccount&UID=1&PWD=mob!leMGF', userInformation, function (err, result) {
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
          sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getMemberAccount&UID=1&PWD=mob!leMGF&memberID='+userInformation.memberID, function (err, result) {
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
              callback(null, null);
            }
          });
        }
      });
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
          var userID = result.memberID; // 3478
          console.log('Logged in user: '+userID);
          loadProfiles(userID, callback);
        }
      });
    },

    logout: function() {
      user = undefined;
    }
}
