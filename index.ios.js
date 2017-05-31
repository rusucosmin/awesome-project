/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

var Login = require('./Login');

export default class awesomeproject extends Component {
  constructor() {
    super();

    this.state = {
      isLoggedIn: false
    };
  }
  render() {
      if(this.state.isLoggedIn) {
        return (
          <View style={styles.container}>
            <Text style={styles.welcome}>Logged in</Text>
          </View>
        );
      }
      else {
        return (
          <Login onLogin={this.onLogin.bind(this)}/>
        );
      }
  }
  onLogin() {
    console.log("on logged in");
    this.setState({
      isLoggedIn: true
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('awesomeproject', () => awesomeproject);
