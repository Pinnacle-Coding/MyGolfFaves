var xml2jsParseString = require('react-native-xml2js').parseString;

var genderTypes = [];
var golfPartnerTypes = [];
var notificationTypes = [];
var golfFrequencyTypes = [];

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

  getGenderTypes: function () {
    return genderTypes;
  },

  getGolfPartnerTypes: function () {
    return golfPartnerTypes;
  },

  getNotificationTypes: function () {
    return notificationTypes;
  },

  getGolfFrequencyTypes: function () {
    return golfFrequencyTypes;
  },

  refresh: function(callback) {
    sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getGender&UID=1&PWD=mob!leMGF', function (err, result) {
      if (err) {
        callback(err, null);
      }
      else if (result.fail) {
        callback(null, result.fail);
      }
      else if (result.status !== 'success') {
        callback(null, result.message);
      }
      else {
        genderTypes = result.Rows;
        sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getGolfPartner&UID=1&PWD=mob!leMGF', function (err, result) {
          if (err) {
            callback(err, null);
          }
          else if (result.fail) {
            callback(null, result.fail);
          }
          else if (result.status !== 'success') {
            callback(null, result.message);
          }
          else {
            golfPartnerTypes = result.Rows;
            sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getNotificationType&UID=1&PWD=mob!leMGF', function (err, result) {
              if (err) {
                callback(err, null);
              }
              else if (result.fail) {
                callback(null, result.fail);
              }
              else if (result.status !== 'success') {
                callback(null, result.message);
              }
              else {
                notificationTypes = result.Rows;
                sendRequest('http://business.mygolffaves.com/ws/mobilePublicService.cfc?method=getNotificationType&UID=1&PWD=mob!leMGF', function (err, result) {
                  if (err) {
                    callback(err, null);
                  }
                  else if (result.fail) {
                    callback(null, result.fail);
                  }
                  else if (result.status !== 'success') {
                    callback(null, result.message);
                  }
                  else {
                    golfFrequencyTypes = result.Rows;
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
}
