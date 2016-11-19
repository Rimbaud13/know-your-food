import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  },
  label : {
    fontSize : 20,
    textAlign : 'center',
  },
});

class Tesseract extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>
          Home
        </Text>
      </View>
    );
  }
}

export default Tesseract;