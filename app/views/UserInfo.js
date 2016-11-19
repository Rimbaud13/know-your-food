import React, {Component} from "react";
import {StyleSheet, Text, View, TextInput} from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        textAlign: 'center',
    },
});

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            weight: 0,
            gender: 'm'
        };
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <NavigationBar
                    title={"Know your food"}
                    left={[
                        {
                            name: 'help',
                            handler: ()=>this.setState({showHelp: true})
                        }
                    ]}
                />
                <View style={styles.container}>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={t => this.setState({height: t})}
                        value={this.state.height}
                    />
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={t => this.setState({weight: t})}
                        value={this.state.weight}
                    />
                </View>
            </View>
        );
    }

    componentWillMount() {

    }
}

async function initStorage() {

    const defVal = {height: 0, weight: 0, gender: 'm'};
    const keys = ["height", "weight", "gender"];

    for (let k of keys) {
        try {
            const value = await AsyncStorage.getItem(k);
        } catch (error) {
            try {
                await AsyncStorage.setItem(k, defVal[k]);
            } catch (error) {

            }
        }
    }
}

export default UserInfo;