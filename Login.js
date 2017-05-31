'use strict';

import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native';

var buffer = require('buffer');

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showProgress: false
    }
  }
  render() {
    var error = <View />
    if(!this.state.success && this.state.badCredentials)
      error = <Text style={styles.error}>
        Invalid username and password combination
      </Text>
    if(!this.state.success && this.state.unknownError)
      error = <Text style={styles.error}>
        We experiences and unexpected issue
      </Text>
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
          source={require('./img/Octocat.png')}/>
        <Text style={styles.heading}>
          GitHub Browser
        </Text>
        <TextInput
          onChangeText={(text) => this.setState({username: text})}
          style={styles.input}
          placeholder = "GitHub username"/>
        <TextInput style={styles.input}
          onChangeText={(text) => this.setState({password: text})}
          placeholder = "GitHub password"
          secureTextEntry={true} />
        <TouchableHighlight
          onPress={this.onLoginPressed.bind(this)}
          style={styles.button}>
          <Text style={styles.buttonText}>
            Log in
          </Text>
        </TouchableHighlight>

        {error}

        <ActivityIndicator
          animating={this.state.showProgress}
          size="large"
          style={styles.loader} />
      </View>
    );
  }
  onLoginPressed() {
    console.log("login with: " + this.state.username);
    this.setState({showProgress: true});

    var b = new buffer.Buffer(this.state.username +
      ":" + this.state.password);
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
        badCredentials: res.status == 401,
        unknownError: res.status != 401
      }
    })
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      this.setState({success: true})
      this.setState({showProgress: false});
    })
    .catch((err) => {
      console.log("err: " + err);
      this.setState(err);
    })
    .finally(() => {
      this.setState({showProgress: false});
    })

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    padding: 5
  },
  logo: {
    width: 66,
    height: 55
  },
  heading: {
      fontSize: 30,
      marginTop: 10
  },
  input: {
      height: 50,
      marginTop: 10,
      padding: 4,
      fontSize: 18,
      borderWidth: 1,
      borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#48BBEC',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loader: {
    marginTop: 20
  },
  error: {
    color: "red",
    paddingTop: 10
  }
});

module.exports = Login;
