import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  Image
} from "react-native";
import ProgressHUD from "react-native-progress-hud";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
import GIcon from "react-native-vector-icons/MaterialIcons";
import NavigationBar from "./NavigationBar";
import Accordion from "react-native-collapsible/Accordion";
import * as Animatable from "react-native-animatable";
import { RNS3 } from "react-native-aws3";


const uploadOptions = {
  awsUrl : '163.172.173.89:56792',
  bucket : "docker",
  region : "us-east-1",
  accessKey : "JM6RZ9L0Q2VBS2LKRVHX",
  secretKey : "b31uUyf+8CMAUxGFPG4R5UtrrnZPpRzXQooB92nj",
  successActionStatus : 201
};

const DATA = {
  energy : {
    name : 'energy',
    unit : 'KJ',
    icon : require('../res/icons/energy.png'),
  },
  salt : {
    name : 'salt',
    unit : 'KJ',
    icon : require('../res/icons/salt.png'),
  },
  vitamines : {
    name : 'vitamines',
    unit : 'KJ',
    icon : require('../res/icons/vitamines.png'),
  },
  fat : {
    name : 'fat',
    unit : 'KJ',
    icon : require('../res/icons/fat.png'),
  },
  sugar : {
    name : 'sugar',
    unit : 'KJ',
    icon : require('../res/icons/sugar.png'),
  },
  fiber : {
    name : 'fibers',
    unit : 'KJ',
    icon : require('../res/icons/fiber.png'),
  }
};

const styles = StyleSheet.create({
    container : {
      flex : 1,
    },
    bottom : {
      height : 40,
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
    }
  })
  ;

const mock = [
  {
    name : "MARGHERITA",
    price : 16.50,
    description : ["Sauce", "tomate", "maison", "et", "mozzarella."]
  },
  {
    name : "RUCO LA",
    price : 17.00,
    description : ["Roquette,", "parmesan,", "sauce", "tomate", "maison."]
  },
  {
    name : "SALAME",
    price : 17.00,
    description : ["Salami", "Napoli", "sur", "notre", "sauce", "tomate", "maison", "et", "mozzarella."]
  },
  {
    name : "FUNGHI",
    price : 17.00,
    description : ["Champignons", "frais,", "sauce", "tomate", "maison", "et", "mozzarella."]
  }
];

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showHelp : false,
      isLoading : false,
      plates : mock.slice(),
      chosen : [],
    }
  }

  componentDidMount() {
    //this.takePicture();
    this.renderArray = this.renderArray.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          title={"Know your food"}
          left={[
             {
                name:'help-circle',
                handler:()=>this.setState({showHelp:true})
             }
          ]}
          right={[
            {
                name:'settings',
                handler:()=>this.setState({showHelp:true})
             },
            this.state.chosen.length === 0 ? null : {
                name:'heart',
                handler:()=>this.setState({showHelp:true})
             }
          ]}
        />
        {this.renderListView()}
        <ProgressHUD
          isVisible={this.state.isLoading}
          isDismissible={false}
          overlayColor="rgba(0, 0, 0, 0.11)"
        />
        <DropdownAlert ref={dp => this.dropdown = dp}/>
        <View style={styles.bottom}/>
        <View style={{position:'absolute', bottom:0,left:0, right:0, alignItems:'center'}}>
          <TouchableHighlight
            underlayColor="transparent"
            style={{flex:1, alignItems:'center', justifyContent:'center'}}
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
              {r.description.reduce((a, b) => `${a} ${b}`)}
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
    console.log(section, isActive);
    const array = {
      energy : 1,
      salt : 2,
      vitamines : 3,
      fat : 4,
      sugar : 5,
      fiber : 6
    };
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{ backgroundColor: (isActive ? 'rgba(255,255,255,1)' : 'rgba(245,252,255,1)') }}>
        {this.renderArray(section, array)}
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
            style={{marginVertical:10, height:40,backgroundColor:'orange', alignItems:'center', justifyContent:'center'}}>
            <GIcon name={`favorite${this.state.chosen.indexOf(plate) === -1 ? '-border' : ''}`}
                   style={{color:'white', fontSize:30}}/>
          </View>
        </TouchableHighlight>
      </View>
    )
  }


  renderFoodRow({ icon, name, unit, value, last }) {
    const range = Math.floor(Math.random() * 3);
    console.log(range);
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
            <GIcon name={`sentiment-${range===0?'neutral':range===1?'dissatisfied':'satisfied'}`}
                   style={{color:range===0?'#666':range===1?'red':'green', fontSize:30}}/>
          </View>
        </View>
      </View>
    );
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
          const imgUrl = `
  http://163.172.173.89:56792/docker/${name}`;
          console.log
                 (
                   response
                     .body
                   ,
                   imgUrl
                 )
          ;
          fetch(
            `http://128.179.178.198:3000/image?image=$ {
  imgUrl
}
`)
            .then(x => {
              console.log(x);
              this.setState({ isLoading : false });
            })
            .catch(() => this.handleError());
        }).catch(() => this.handleError());
  }

  handleError() {
    this.dropdown.alertWithType('error', 'Network error', 'An unknown error happened during the upload of the image');
    this.setState({ isLoading : false });
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
}

export default Home;