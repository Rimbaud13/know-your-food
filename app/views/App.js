'use strict';

import React from "react";
import { Navigator, View, StatusBar } from "react-native";
import Routes from "./Routes";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initialRoute : Routes.start,
    };
  }

  render() {
    return (
      <View style={{flex:1}}>
        <StatusBar barStyle="light-content"/>
        <Navigator
          initialRoute={ this.state.initialRoute }
          renderScene={ (route, navigator) => <route.component navigator={ navigator }  />}
        />
      </View>
    );
  }

}

export default App;