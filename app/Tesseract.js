import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

class Tesseract extends React.Component {

    render() {
        return (
            <View style={styles.container}>
                <Image
                    source={{uri: 'https://cloud.avalan.ch/s/UWI9ppgh873gh8Y/download'}}
                    style={{width: 100, height: 100}}
                />
            </View>
        );
    }

}

export default Tesseract;