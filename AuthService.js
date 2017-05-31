var buffer = require('buffer')

class AuthService {
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
      return cb({success: true});
    })
    .catch((err) => {
      console.log("err: " + err);
      return cb(err);
    })
  }
}

module.exports = new AuthService();
