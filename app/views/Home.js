import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image,
  Modal
} from "react-native";
import ProgressHUD from "react-native-progress-hud";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import GIcon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-crop-picker";
import NavigationBar from "./NavigationBar";
import Accordion from "react-native-collapsible/Accordion";
import * as Animatable from "react-native-animatable";
import { RNS3 } from "react-native-aws3";
import Routes from "./Routes";


const uploadOptions = {
  awsUrl : '163.172.173.89:56792',
  bucket : "docker",
  region : "us-east-1",
  accessKey : "JM6RZ9L0Q2VBS2LKRVHX",
  secretKey : "b31uUyf+8CMAUxGFPG4R5UtrrnZPpRzXQooB92nj",
  successActionStatus : 201
};

const DATA = {
  proteins : {
    name : 'proteins',
    unit : 'g',
    max : 50,
    icon : require('../res/icons/proteins.png'),
  },
  energy : {
    name : 'energy',
    fr : "Énergie",
    unit : 'KJ',
    max : 8400,
    icon : require('../res/icons/energy.png'),
  },
  salt : {
    name : 'salt',
    fr : "Sel",
    unit : 'g',
    max : 90,
    icon : require('../res/icons/salt.png'),
  },
  fat : {
    name : 'fat',
    fr : "Matières grasses",
    unit : 'g',
    max : 70,
    icon : require('../res/icons/fat.png'),
  },
  sugar : {
    name : 'sugar',
    fr : "Sucres",
    unit : 'g',
    max : 90,
    icon : require('../res/icons/sugar.png'),
  },
  fiber : {
    name : 'fibers',
    fr : "Fibres alimentaires",
    unit : 'g',
    max : 30,
    icon : require('../res/icons/fiber.png'),
  }
};

const styles = StyleSheet.create({
    container : {
      flex : 1,
    },
    preview : {
      flex : 1,
      justifyContent : 'flex-end',
      alignItems : 'center',
      height : Dimensions.get('window').height,
      width : Dimensions.get('window').width
    },
    bottom : {
      height : 50,
      backgroundColor : 'orange',
    },
    label : {
      fontSize : 20,
      textAlign : 'center',
    },
    roundButton : {
      width : 80,
      height : 80,
      borderRadius : 40,
      backgroundColor : 'orange',
      justifyContent : 'center',
      alignItems : 'center',
    },
    cameraIcon : {
      fontSize : 50,
      color : 'white',
    },
    foodArray : {
      paddingHorizontal : 20,
      paddingVertical : 5
    },
    foodRow : {
      flexDirection : 'row',
      alignItems : 'center',
      borderBottomWidth : 1,
      borderColor : 'orange',
      height : 60,
    },
    foodRowTitle : {
      fontSize : 18,
      fontFamily : 'Montserrat-regular',
      color : '#666'
    },
    foodRowLabel : {
      borderRightWidth : 1,
      borderColor : 'orange',
    },
    foodRowLeft : {
      width : 150,
      borderRightWidth : 1,
      borderColor : 'orange',
      alignItems : 'center',
      justifyContent : 'center',
    },
    foodRowRight : {
      flex : 1,
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center',
    },
    foodRowValue : {
      color : '#777',
      fontSize : 26,
      fontFamily : 'Montserrat-regular',
    },
    foodRowIcon : {
      width : 32,
      height : 32
    },
    modalContainer : {
      flex : 1,
      backgroundColor : 'rgba(0,0,0,0.35)'
    },
    firstDetailed : {
      width : 100,
      height : 68,
      paddingHorizontal : 3,
      borderRightWidth : 1,
      borderColor : '#BBB',
      justifyContent : 'center',
      alignItems : 'center',
    },
    secondDetailed : {
      width : 70,
      paddingHorizontal : 3,
      height : 68,
      borderRightWidth : 1,
      borderColor : '#BBB',
      justifyContent : 'center',
      alignItems : 'center',
    }
  })
  ;

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showHelp : false,
      showFav : false,
      isLoading : false,
      plates : [],
      details : -1,
    }
  }

  componentDidMount() {
    this.takePicture();
    this.renderArray = this.renderArray.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={"Know your food"}
          right={[
                        {
                            name: 'settings',
                            handler: ()=>this.props.navigator.push(Routes.UserInfo)
                        },
                    ]}
        />
        {this.renderListView()}
        <ProgressHUD
          isVisible={this.state.isLoading}
          isDismissible
          overlayColor="rgba(0, 0, 0, 0.11)"
        />
        <DropdownAlert ref={dp => this.dropdown = dp}/>
        {this.renderModal()}
        <View style={styles.bottom}/>
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center'}}>
          <TouchableHighlight
            underlayColor="transparent"
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
            onPress={()=>this.takePicture()}
          >
            <View style={styles.roundButton}>
              <Icon name="ios-camera-outline" style={styles.cameraIcon}/>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderListView() {
    return (
      <ScrollView
        style={{flex: 1}}
      >
        <Accordion
          sections={this.state.plates}
          underlayColor="orange"
          renderHeader={this._renderHeader.bind(this)}
          renderContent={this._renderContent.bind(this)}
          duration={100}
        />
      </ScrollView>
    );
  }

  _renderHeader(r, index, isActive) {
    return (
      <Animatable.View
        duration={100}
        transition="backgroundColor"
        style={{backgroundColor: (isActive ? 'rgba(255,165,0,0.15)' : 'white')}}>
        <View
          style={{
                        flexDirection: 'row',
                        paddingVertical: 16,
                        paddingHorizontal: 5,
                        borderBottomWidth: 1,
                        marginHorizontal: 16,
                        borderBottomColor: '#DDD'
                    }}>
          <View style={{flex: 1}}>
            <Text style={{fontFamily: 'Montserrat-bold', fontSize: 20, color: '#666'}}>
              {r.name}
            </Text>
            <Text style={{fontFamily: 'Montserrat-light', fontSize: 16, color: '#666'}}
                  numberOfLines={1}>
              {r.description.reduce((a, b) => `${a} ${b}`)}
            </Text>
          </View>
          <View style={{justifyContent: 'center', marginLeft: 10}}>
            <Text style={{fontFamily: 'Montserrat-regular', fontSize: 22, color: '#777'}}>
              {r.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)')}}>
        {this.renderArray(section, this.computeSum(section))}
      </Animatable.View>
    );
  }

  renderArray(plate, values) {
    return (
      <View style={styles.foodArray}>
        {Object.keys(values).map((k, i) => this.renderFoodRow({
          ...DATA[k],
          value : values[k],
          last : Object.keys(values).length - 1 === parseInt(i)
        }))}
        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>this.handleSelection(plate)}
        >
          <View
            style={{
                            marginVertical: 10,
                            height: 40,
                            backgroundColor: 'orange',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
            <GIcon name={`favorite${this.state.chosen.indexOf(plate) === -1 ? '-border' : ''}`}
                   style={{color: 'white', fontSize: 30}}/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }


  renderFoodRow({ icon, name, unit, value, last }) {
    const range = Math.floor(Math.random() * 3);
    return (
      <View style={[styles.foodRow, {borderBottomWidth: last ? 0 : 1}]} key={icon}>
        <View style={styles.foodRowLeft}>
          <Image source={icon} style={styles.foodRowIcon}/>
          <Text style={styles.foodRowTitle}>
            {name.toLocaleUpperCase()}
          </Text>
        </View>
        <View style={styles.foodRowRight}>
          <View style={[styles.foodRowRight, {justifyContent: 'flex-end'}]}>
            <Text style={styles.foodRowValue}>
              {`${value} ${unit}`}
            </Text>
          </View>
          <View style={styles.foodRowRight}>
            <GIcon
              name={`sentiment-${range === 0 ? 'neutral' : range === 1 ? 'dissatisfied' : 'satisfied'}`}
              style={{color: range === 0 ? '#666' : range === 1 ? 'red' : 'green', fontSize: 30}}/>
          </View>
        </View>
      </View>
    );
  }

  renderListView() {
    return (
      <ScrollView
        style={{flex:1}}
      >
        <Accordion
          sections={this.state.plates}
          underlayColor="orange"
          renderHeader={this._renderHeader.bind(this)}
          renderContent={this._renderContent.bind(this)}
          duration={100}
        />
      </ScrollView>
    );
  }

  _renderHeader(r, index, isActive) {
    return (
      <Animatable.View
        duration={100}
        transition="backgroundColor"
        style={{ backgroundColor: (isActive ? 'rgba(255,165,0,0.15)' : 'white') }}>
        <View
          style={{flexDirection:'row', paddingVertical:16,paddingHorizontal:5, borderBottomWidth:1, marginHorizontal:16, borderBottomColor:'#DDD'}}>
          <View style={{flex:1}}>
            <Text style={{fontFamily:'Montserrat-bold', fontSize:20, color:'#666'}}>
              {r.name}
            </Text>
            <Text style={{fontFamily:'Montserrat-light', fontSize:16, color:'#666'}}
                  numberOfLines={1}>
              {r.description.length === 0 ? '' : r.description.reduce((a, b) => `${a} ${b}`)}
            </Text>
          </View>
          <View style={{justifyContent:'center', marginLeft:10}}>
            <Text style={{fontFamily:'Montserrat-regular', fontSize:22, color:'#777'}}>
              {r.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </Animatable.View>
    );
  }

  _renderContent(section, i, isActive) {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{ backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)') }}>
        {this.renderArray(section, this.computeSum(section), parseInt(i))}
      </Animatable.View>
    );
  }

  renderArray(plate, values, i) {
    return (
      <View style={styles.foodArray}>
        {Object.keys(values).map((k, i) => {
          return this.renderFoodRow({
            ...DATA[k],
            value : values[k],
            last : Object.keys(values).length - 1 === parseInt(i)
          })
        })}
        <TouchableHighlight
          underlayColor="transparent"
          onPress={()=>this.setState({details:i})}
          style={{flex:1}}
        >
          <View
            style={{flex:1, marginVertical:10,marginRight:5, height:40,backgroundColor:'orange', alignItems:'center', justifyContent:'center'}}>
            <GIcon name="view-list"
                   style={{color:'white', fontSize:30}}/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }


  renderFoodRow({ icon, max, name, unit, value, last }) {
    const lower = 1 / 3 * max;
    const upper = max;
    const inside = value > lower && value < upper;
    return (
      <View style={[styles.foodRow, {borderBottomWidth:last ? 0:1}]} key={icon}>
        <View style={styles.foodRowLeft}>
          <Image source={icon} style={styles.foodRowIcon}/>
          <Text style={styles.foodRowTitle}>
            {name.toLocaleUpperCase()}
          </Text>
        </View>
        <View style={styles.foodRowRight}>
          <View style={[styles.foodRowRight, {justifyContent:'flex-end'}]}>
            <Text style={styles.foodRowValue}>
              {`${value} ${unit}`}
            </Text>
          </View>
          <View style={styles.foodRowRight}>
            <GIcon name={`sentiment-${inside ? 'satisfied':'dissatisfied'}`}
                   style={{color:inside ? 'green':'red', fontSize:30}}/>
          </View>
        </View>
      </View>
    );
  }

  renderModal() {
    if (this.state.details === -1) {
      return null;
    }
    const p = this.state.plates[this.state.details];
    return (
      <Modal
        animationType="slide"
        transparent
        visible
      >
        <View style={styles.modalContainer}>
          <NavigationBar
            title={p.name}
            left={[
             {
                name:'close',
                handler:()=>this.setState({details:-1})
             }
          ]}
          />
          {this.renderDetailedArray(p)}
        </View>
      </Modal>
    )
  }

  uploadImg(path, name) {
    this.setState({ isLoading : true });
    let file = {
      uri : path,
      name,
      type : "image/jpeg"
    };
    RNS3.put(file, uploadOptions)
        .then(response => {
          const imgUrl = `http://163.172.173.89:56792/docker/${name}`;
          console.log(response.body, imgUrl);


          fetch(`http://kyf.scapp.io:3000/image?image=${imgUrl}`)
            .then(x => {
              console.log(x);
              this.setState({ isLoading : false });

              console.log(x);
              x.json().then(res => {
                let g = [];

                // for (let meal in res) {
                res.forEach(meal => {

                  // a meal
                  let m = {};
                  m.name = meal.name;
                  m.price = meal.price;
                  m.description = meal.description;

                  // array of ingredients
                  let a = [];

                  let ingredients = Object.keys(meal.values);

                  ingredients.forEach(ingredient => {
                    // an ingredient
                    let val = { name : ingredient };

                    let nutrients = meal.values[ingredient].nutrients;
                    nutrients.forEach(nutrient => {
                      const eng = frtoeng(nutrient.fr);
                      if (eng !== "") {
                        val[eng] = nutrient.per_hundred;
                      }
                    });

                    a.push(val);
                  });
                  m.ingredients = a;
                  g.push(m);
                });
                this.setState({ plates : g });

              });
              this.setState({ isLoading : false });


            })
            .catch(() => this.handleError());


        }).catch(() => this.handleError());
  }

  handleError() {
    this.dropdown.alertWithType('error', 'Network error', 'An unknown error happened during the upload of the image');
    this.setState({ isLoading : false });
  }

  computeSum(plate) {
    const r = {};
    const keys = Object.keys(DATA);
    keys.forEach(k => {
      r[k] = plate.ingredients.map(i => i[k] || 0).reduce((a, b) => a + b, 0)
    });
    return r;
  }

  takePicture() {
    ImagePicker.openCamera({
      width : 1000,
      height : 1000,
      cropping : true
    }).then(image => {
      console.log(image);
      this.uploadImg(image.path, image.path.substring(image.path.lastIndexOf("/") + 1));
    });
  }

  handleSelection(plate) {
    let chosen = this.state.chosen;
    const idx = chosen.indexOf(plate);
    if (idx === -1) {
      chosen.push(plate);
    } else {
      chosen.splice(idx, 1)
    }
    this.setState({ chosen });
  }

  renderDetailedArray(p) {
    return (
      <ScrollView
        horizontal
      >
        <ScrollView>
          <View style={styles.foodArray}>
            {this.renderFoodHeader()}
            {Object.keys(p.ingredients).map((k, i) =>
              this.renderDetailedFoodRow(p.ingredients[k],
                Object.keys(p.ingredients).length - 1 === parseInt(i)))}
          </View>
        </ScrollView>
      </ScrollView>
    )
  }

  renderFoodHeader() {
    return (
      <View
        style={{flexDirection:'row', borderBottomWidth:1, borderColor:'#CCC', backgroundColor:'white'}}>
        <View style={styles.firstDetailed}/>
        {Object.keys(DATA).map(k => this.renderFoodHeaderIcon(DATA[k]))}
      </View>
    )
  }

  renderFoodHeaderIcon({ name, unit, icon }) {
    return (
      <View key={icon} style={styles.secondDetailed}>
        <Image source={icon} style={{width:30, height:30}}/>
        <Text style={{fontFamily:'Montserrat-regular', color:'#AAA'}} numberOfLines={1}>
          {name.toLocaleUpperCase()}
        </Text>
        <Text style={{fontFamily:'Montserrat-ultralight', fontSize:14, color:'#AAA'}}
              numberOfLines={1}>
          {`(${unit.toLocaleUpperCase()})`}
        </Text>
      </View>
    )
  }

  renderDetailedFoodRow(p, isLast) {
    console.log(p);
    const ingredients = Object.keys(DATA).map((k, i) => (
      <View key={i} style={styles.secondDetailed}>
        <Text style={{fontFamily:'Montserrat-regular', color:'#AAA'}} numberOfLines={1}>
          {p[k] || 0}
        </Text>
      </View>
    ));
    return (
      <View
        key={p.name}
        style={{flexDirection:'row', borderBottomWidth:isLast ? 0 : 1, borderColor:'#CCC', backgroundColor:'white'}}>
        <View style={styles.firstDetailed}>
          <Text style={{textAlign:'center', fontFamily:'Montserrat-regular', color:'#999'}}
                numberOfLines={2}>
            {p.name.toLocaleUpperCase()}
          </Text>
        </View>
        {ingredients}
      </View>
    );
  }

}

function frtoeng(fr) {
  const keys = Object.keys(DATA);
  let en = "";
  keys.forEach(k => {
    if (DATA[k].fr === fr) {
      en = DATA[k].name;
    }
  });
  return en;
}

export default Home;