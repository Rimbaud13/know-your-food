import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import NavigationBar from "./NavigationBar";

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

class Help extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={"Know your food"}
          left={[
            {
              name:'help',
              handler:()=>this.setState({showHelp:true})
            }
          ]}
        />
        <View style={styles.container}>
          <Text style={styles.label}>
            Home
          </Text>
        </View>
      </View>
    );
  }
}

export default Help;