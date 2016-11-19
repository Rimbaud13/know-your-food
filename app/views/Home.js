import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableHighlight } from "react-native";
import ImagePicker from "react-native-image-crop-picker";

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
    PRICE : 17.00,
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
      plates : mock.slice(),
    }
  }

  componentDidMount() {
    //this.takePicture();
  }

  render() {
    return (
      <View/>
    );
  }


  takePicture() {
    ImagePicker.openCamera({
      width : 300,
      height : 400,
      includeBase64 : true,
      cropping : true
    }).then(image => {
      console.log(image);
    });
  }

}

export default Home;