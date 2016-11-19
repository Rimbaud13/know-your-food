'use strict';

import React, { PropTypes, Component } from "react";
import { Text, View, TouchableHighlight, StatusBar, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const DEFAULT_NAV_BAR_HEIGHT = 64;
const STATUS_BAR_HEIGHT = 20;

const styles = StyleSheet.create({
  navBarContainer : {
    position : 'absolute',
    top : 0,
    left : 0,
    right : 0,
  },
  header : {
    paddingTop : 20,
    paddingHorizontal : 8,
  },
  titleBox : {
    alignItems : 'center',
    justifyContent : 'center',
    position : 'absolute',
    left : 0,
    right : 0,
    bottom : 0,
    height : DEFAULT_NAV_BAR_HEIGHT - STATUS_BAR_HEIGHT,
  },
  title : {
    textAlign : 'center',
    fontWeight : 'bold',
    fontSize : 15,
  },
  iconTextBox : {
    height : DEFAULT_NAV_BAR_HEIGHT - STATUS_BAR_HEIGHT,
    alignItems : 'center',
    justifyContent : 'center',
    flexDirection : 'row',
  },
  icon : {
    width : 30,
    height : 30,
    fontWeight : 'bold',
  },
  label : {
    fontSize : 14,
    fontWeight : 'bold',
    margin : 3,
  },
  innerTouch : {
    padding : 3,
    marginHorizontal : 3,
  },
});

class NavigationBar extends Component {

  static defaultProps = {
    tint : "orange",
    color : "white",
    inner : false,
    dark : false,
  };

  static propTypes = {
    tint : PropTypes.string,
    title : PropTypes.any,
    subtitle : PropTypes.any,
    color : PropTypes.string,
    left : PropTypes.array,
    right : PropTypes.array,
    inner : PropTypes.bool,
    dark : PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      panel : 0,
      left : 0,
      right : 0,
      title : 0,
      expected : 0,
    };
  }

  render() {
    const left = this.renderButtons(this.props.left, true);
    const right = this.renderButtons(this.props.right, false);
    return (
      <View style={[styles.header, {
        backgroundColor : this.props.tint,
        height : DEFAULT_NAV_BAR_HEIGHT - (this.props.inner ? STATUS_BAR_HEIGHT : 0),
      }]}
            onLayout={(event) => {
              const width = event.nativeEvent.layout.width - 10;
              this.setState({ panel : width });
            }}
      >
        <View style={[styles.absolute, {opacity:0}]}>
          { this.renderTitle(this.props.subtitle !== undefined) }
        </View>
        <StatusBar barStyle={this.props.dark ? 'default' : 'light-content'}/>
        <View
          style={{flexDirection:'row', flex:1, alignItems:'flex-end'}}>
          { this.renderTitle() }
          { left }
          <View style={{flex:1}}/>
          { right }
        </View>
      </View>
    );
  }

  renderTitle(onLayout = false) {
    if (this.props.title === null || this.props.title === undefined) {
      return null;
    }
    const space = Math.max(this.state.left, this.state.right);

    const width = this.state.panel - 2 * space - 16;

    let text = this.props.title !== undefined ?
               (this.props.subtitle !== undefined ?
                `${this.props.title} | ${this.props.subtitle}` :
                this.props.title) : this.props.subtitle;

    if (!onLayout) {
      if (width < this.state.expected) {
        text = this.props.title !== undefined ?
               (this.props.subtitle !== undefined ?
                this.props.subtitle : this.props.title) : this.props.subtitle;
      }
    }
    return (
      <View style={styles.titleBox}>
        <Text style={[styles.title, onLayout ? { color : this.props.tint } : {
          color : this.props.color,
          width,
        }]}
              numberOfLines={1}
              onLayout={(event) => {
            if (onLayout) {
              const expected = event.nativeEvent.layout.width;
              this.setState({ expected });
            }
          }}
        >
          { text.toUpperCase() }
        </Text>
      </View>
    );
  }

  renderIcon(object) {
    if (object === null) {
      return null;
    }
    return (
      <TouchableHighlight
        underlayColor="transparent"
        style={{justifyContent:'center'}}
        onPress={object.handler}>
        <View style={styles.innerTouch}>
        <Icon name={`ios-${object.name}-outline`} style={{ color: this.props.color }} size={30}/>
        </View>
      </TouchableHighlight >
    );
  }

  renderButtons(content, isAtLeft) {
    if (content === null || content === undefined) {
      return <View />;
    }

    return (
      <View style={styles.iconTextBox} onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        if (isAtLeft) {
          this.setState({ left : width });
        } else {
          this.setState({ right : width });
        }
      }}>
        { content.map((c, i) =>
          <View key={i} style={{alignItems:'center'}}>
            { this.renderIcon(c) }
          </View>)
        }
      </View>
    );
  }
}

export default NavigationBar;
export { DEFAULT_NAV_BAR_HEIGHT, STATUS_BAR_HEIGHT };
