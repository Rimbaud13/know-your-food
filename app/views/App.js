'use strict';

import React from "react";
import { Image, Navigator, View, StatusBar, AsyncStorage, Dimensions } from "react-native";
import Routes from "./Routes";

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      initialRoute : undefined,
    };
  }

  componentWillMount() {
    initStorage().then(v => {
      console.log(v);
      if (Object.keys(v).map(k => v[k]).indexOf(null) === -1) {
        this.setState({ initialRoute : Routes.Home });
      } else {
        this.setState({ initialRoute : Routes.start });
      }
    });
  }

  render() {
    if (this.state.initialRoute === undefined) {
      const d = Dimensions.get('window');
      return (
        <Image source={require('../res/icons/launchscreen.png')}
               style={{width:d.width, height:d.height}}/>
      );
    }
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

async function initStorage() {

  const val = { height : 0, weight : 0, gender : 'm' };

  for (let k of Object.keys(val)) {
    try {
      val[k] = await AsyncStorage.getItem(k);
    } catch (error) {
      // error
    }
  }
  return val;
}

export default App;

export { initStorage };