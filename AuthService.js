var buffer = require('buffer');
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val) => {
      console.log("MULTI GET");
      console.log("ERR " + err);
      console.log("VAL " + val[0]);
      console.log("VAL " + val[1]);
      if(err)
        return cb(err);
      console.log("not error");
      if(!val)
        return cb();
      var zippedObj = _.fromPairs(val);
      if(!zippedObj[authKey]) {
        return cb();
      }
      var authInfo = {
        header: {
          Authorization: 'Basic ' + zippedObj[authKey]
        },
        user: JSON.parse(zippedObj[userKey])
      }
      return cb(null, authInfo);
    });
  }
  login(creds, cb) {
    var b = new buffer.Buffer(creds.username +
      ":" + creds.password);
    var encodedAuth = b.toString('base64');

    fetch('https://api.github.com/user', {
      headers: {
        'Authorization': 'Basic ' + encodedAuth
      }
    })
    .then((res) => {
      if(res.status >= 200 && res.status < 300)
        return res;
      throw {
        success: false,
        badCredentials: res.status == 401,
        unknownError: res.status != 401
      }
    })
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      AsyncStorage.multiSet([
        [authKey, encodedAuth],
        [userKey, JSON.stringify(res)]
      ], (err) => {
        if(err)
          throw err;
        return cb({success: true});
      });
    })
    .catch((err) => {
      console.log("err: " + err);
      return cb(err);
    })
  }
}

module.exports = new AuthService();
