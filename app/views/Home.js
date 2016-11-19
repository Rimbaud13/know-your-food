import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, ScrollView } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import ProgressHUD from "react-native-progress-hud";
import DropdownAlert from "react-native-dropdownalert";
import Icon from "react-native-vector-icons/Ionicons";
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
      justifyContent : 'center',
      alignItems : 'center',
    },
    label : {
      fontSize : 20,
      textAlign : 'center',
    },
    roundButton : {
      width : 80,
      height : 80,
      borderRadius : 40,
      marginBottom : 10,
      backgroundColor : 'orange',
      justifyContent : 'center',
      alignItems : 'center',
    },
    cameraIcon : {
      fontSize : 50,
      color : 'white',
    },
    foodRow : {
      flexDirection : 'row',
      borderBottomWidth : 1,
      borderColor : 'orange',
      height : 60,
    },
    foodRowTitle : {
      width : 150,
      borderRightWidth : 1,
      borderColor : 'orange',
      alignItems : 'center',
      justifyContent : 'center',
    },
    foodRowLabel : {
      flex : 1,
      borderRightWidth : 1,
      borderColor : 'orange',
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
    }
  }

  componentDidMount() {
    //this.takePicture();
    this.renderArray = this.renderArray.bind(this);
  }

  render() {
    return (
      <View style={{flex:1}}>
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
                name:'home',
                handler:()=>this.setState({showHelp:true})
             }
          ]}
        />
        {this.renderListView()}
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
        <ProgressHUD
          isVisible={this.state.isLoading}
          isDismissible={false}
          overlayColor="rgba(0, 0, 0, 0.11)"
        />
        <DropdownAlert ref={dp => this.dropdown = dp}/>
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
            <Text style={{fontFamily:'Montserrat-regular', fontSize:22}}>
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
        {this.renderArray(array)}
      </Animatable.View>
    );
  }

  renderArray(values) {
    return (
      <View>
        {Object.keys(values).map(k => this.renderFoodRow(DATA[k], values[k]))}
      </View>
    )
  }

  renderFoodRow({ title }) {
    return (
      <View style={styles.foodRow}>
        <Text style={styles.foodRowTitle}>
          {title}
        </Text>
        <Text style={styles.foodRowTitle}>
          {title}
        </Text>
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
          const imgUrl = `http://163.172.173.89:56792/docker/${name}`;
          console.log(response.body, imgUrl);
          fetch(`http://128.179.178.198:3000/image?image=${imgUrl}`)
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

}

export default Home;