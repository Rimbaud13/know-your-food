import React, { Component } from "react";
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Dimensions,
  SegmentedControlIOS
} from "react-native";
import Picker from "react-native-picker";
import NavigationBar, { DEFAULT_NAV_BAR_HEIGHT } from "./NavigationBar";
import Routes from "./Routes";
import { initStorage } from "./App";

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : 'orange',
  },
  image : {
    width : 180,
    height : 180,
  },
  center : {
    flex : 1,
    alignItems : 'center',
    justifyContent : 'center',
  },
  label : {
    fontSize : 20,
    marginBottom : 6,
    color : 'white',
    fontFamily : 'Montserrat-bold'
  },
  input : {
    borderWidth : 1,
    width : 140,
    height : 28,
    borderColor : 'white',
    borderRadius : 5,
    alignItems : 'center',
    justifyContent : 'center'
  },
  value : {
    fontSize : 18,
    color : 'white',
  }
});

const male = require('../res/img/male.png');
const female = require('../res/img/female.png');

const data = [
  Array(60).fill().map((_, i) => `${i + 15}`),
  Array(60).fill().map((_, i) => `${i + 150} cm`),
  Array(60).fill().map((_, i) => `${i + 40} kg`),
];

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height : '170 cm',
      weight : '65 kg',
      age : 25,
      gender : 'm',
      isNew : false,
      pickerMode : -1
    };
  }

  componentWillMount() {
    initStorage().then(v => {
      if (Object.keys(v).map(k => v[k]).indexOf(null) === -1) {
        this.setState({ ...v });
      } else {
        this.setState({ isNew : true });
      }
    });
  }

  done() {
    const {
      height,
      weight,
      age,
      gender
    } = this.state;
    setStorage({ height, weight, age, gender })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={"Know your food"}
          left={[
             this.state.isNew ? null : {
                name:'close-circle',
                handler:()=>{
                  this.props.navigator.pop();
                  this.done();
                }
             }
          ]}
          right={[
            {
                name:'arrow-round-forward',
                handler:()=>{
                  if (this.state.isNew){
                    this.props.navigator.push(Routes.Home)
                  }else{
                    this.props.navigator.pop();
                  }
                  this.done();
                }
             },
          ]}
        />
        <View
          style={{height:Dimensions.get('window').height-(this.state.pickerMode === -1 ? 0 : 200) - DEFAULT_NAV_BAR_HEIGHT}}>
          <View style={{alignItems:'center',justifyContent:'center', flex:2}}>
            <Image source={this.state.gender === 'm' ? male : female} style={styles.image}/>
          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', flex:1}}>
              <View style={styles.center}>
                <Text style={styles.label}>
                  {"Gender".toLocaleUpperCase()}
                </Text>
                <SegmentedControlIOS
                  style={{width:140}}
                  tintColor="white"
                  values={['Man', 'Woman']}
                  selectedIndex={this.state.gender === 'm' ? 0 : 1}
                  onChange={(event) => this.setState({gender: event.nativeEvent.selectedSegmentIndex === 0 ? 'm':'f'})}
                />
              </View>
              <View style={styles.center}>
                <Text style={styles.label}>
                  {"age".toLocaleUpperCase()}
                </Text>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={()=>this.handlePickerToggled(0)}>
                  <View style={styles.input}>
                    <Text style={styles.value}>
                      {this.state.age}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View style={{flexDirection:'row', flex:1}}>
              <View style={styles.center}>
                <Text style={styles.label}>
                  {"height".toLocaleUpperCase()}
                </Text>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={()=>this.handlePickerToggled(1)}>
                  <View style={styles.input}>
                    <Text style={styles.value}>
                      {this.state.height}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style={styles.center}>
                <Text style={styles.label}>
                  {"weight".toLocaleUpperCase()}
                </Text>
                <TouchableHighlight
                  underlayColor="transparent"
                  onPress={()=>this.handlePickerToggled(2)}>
                  <View style={styles.input}>
                    <Text style={styles.value}>
                      {this.state.weight}
                    </Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
        <Picker
          ref={r=>this.picker=r}
          style={{height: 200}}
          showDuration={300}
          showMask={false}
          pickerToolBarStyle={{backgroundColor:'orange', borderColor:'white', borderBottomWidth:0}}
          pickerBtnStyle={{color:'white'}}
          pickerData={this.state.pickerMode === -1 ? [''] : data[this.state.pickerMode]}
          selectedValue={this.selectedValue()}
          onValueChange={v=>this.handleValueChange(v)}
          onPickerDone={()=>this.setState({pickerMode:-1})}
        />
      </View>
    );
  }

  handlePickerToggled(i) {
    this.setState({ pickerMode : i });
    this.picker.toggle();
  }

  selectedValue() {
    if (this.state.pickerMode === 0) {
      return this.state.age;
    } else if (this.state.pickerMode === 1) {
      return this.state.height;
    }
    return this.state.weight;
  }

  handleValueChange(v) {
    if (this.state.pickerMode === 0) {
      const age = v[0];
      this.setState({ age });
    } else if (this.state.pickerMode === 1) {
      const height = v[0];
      this.setState({ height });
    } else {
      const weight = v[0];
      this.setState({ weight });
    }
  }

}

async function setStorage(val) {

  console.log(val);

  for (let k of Object.keys(val)) {
    try {
      await AsyncStorage.setItem(k, `${val[k]}`);
    } catch (error) {
      // error
      console.log(error);
    }
  }
}

export default UserInfo;