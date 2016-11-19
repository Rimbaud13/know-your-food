import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableHighlight, ListView } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Ionicons";

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
  }
});

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

function uploadImg(path, name) {
  console.log(path, name);
  let data = new FormData();
  data.append('image', { uri : path, name, type : 'image/jpg' });
  const config = {
    method : 'POST',
    headers : {
      'Accept' : 'application/json',
    },
    body : data
  };
  return fetch("http://128.179.139.121:3000/image", config).then(x => console.log(x)).catch(console.log);
}

const ds = new ListView.DataSource({ rowHasChanged : (r1, r2) => r1 !== r2 });

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showHelp : false,
      plates : mock.slice(),
    }
  }

  componentDidMount() {
    this.takePicture();
  }

  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          dataSource={ds.cloneWithRows(mock)}
          renderRow={r=>this.renderRow(r)}
        />
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

  renderRow(r) {
    console.log(r);
    return (
      <View>
        <View style={{flexDirection:'row'}}>
          <Text>
            {r.name}
          </Text>
          <Text>
            {r.price.toFixed(2)}
          </Text>
        </View>
        <Text>
          {r.description.reduce((a, b) => `${a} ${b}`)}
        </Text>
      </View>
    )
  }

  takePicture() {
    ImagePicker.openCamera({
      width : 300,
      height : 400,
      cropping : true
    }).then(image => {
      console.log(image);
      uploadImg(image.path, image.path.substring(image.path.lastIndexOf("/") + 1));
    });
  }

}

export default Home;