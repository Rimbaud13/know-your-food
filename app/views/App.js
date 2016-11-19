'use strict';

import React from "react";
import { Navigator, View } from "react-native";
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
        <Navigator
          initialRoute={ this.state.initialRoute }
          renderScene={ (route, navigator) => <route.component navigator={ navigator }  />}
        />
      </View>
    );
  }

}

export default App;