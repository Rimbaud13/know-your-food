import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import NavigationBar from "./NavigationBar";

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
});

let boxes = [[1592,336,536,176],
  [664,557,142,49],
  [824,552,202,70],
  [1046,564,290,47],
  [1356,561,245,69],
  [1623,583,132,37],
  [1776,571,275,68],
  [2072,573,470,68],
  [2563,586,141,43],
  [2721,581,111,64],
  [2851,583,27,49],
  [2895,587,135,61],
  [662,652,118,35],
  [799,634,66,53],
  [883,634,50,52],
  [951,635,176,53],
  [1149,636,211,64],
  [1381,641,66,53],
  [1466,642,49,53],
  [1535,643,163,56],
  [1718,649,64,52],
  [1801,651,199,68],
  [2021,652,63,52],
  [2103,652,118,53],
  [2239,671,138,51],
  [2398,672,71,34],
  [2487,672,99,51],
  [2607,655,180,54],
  [2803,661,225,66],
  [659,714,71,52],
  [748,732,147,35],
  [913,724,51,43],
  [981,714,75,53],
  [1074,716,89,60],
  [1182,729,155,43],
  [1355,719,66,54],
  [1439,722,49,52],
  [1506,729,172,63],
  [1695,726,356,71],
  [2069,735,131,48],
  [2215,733,159,51],
  [2392,749,97,52],
  [2507,733,254,52],
  [1413,956,420,89],
  [1875,959,419,88],
  [335,1111,408,55],
  [330,1196,146,50],
  [491,1204,186,44],
  [693,1201,206,49],
  [918,1207,51,43],
  [986,1196,328,54],
  [335,1310,247,56],
  [332,1394,247,69],
  [594,1415,289,51],
  [903,1416,154,37],
  [1074,1407,200,45],
  [1292,1400,224,50],
  [333,1508,252,59],
  [333,1591,170,56],
  [518,1598,182,69],
  [718,1617,88,36],
  [821,1611,150,44],
  [991,1619,154,37],
  [1162,1609,199,46],
  [333,1678,186,51],
  [535,1688,50,43],
  [600,1683,312,55],
  [338,1786,225,62],
  [336,1868,367,78],
  [720,1882,135,62],
  [873,1903,152,38],
  [1042,1896,197,45],
  [337,1954,186,52],
  [539,1968,48,42],
  [603,1966,310,54],
  [1637,1115,156,61],
  [1634,1311,158,62],
  [1632,1509,159,64],
  [1628,1794,161,66],
  [1911,1115,400,53],
  [2333,1116,34,52],
  [2388,1116,238,53],
  [1907,1195,210,62],
  [2135,1205,48,42],
  [2200,1195,366,69],
  [2583,1196,116,52],
  [2717,1214,84,34],
  [2817,1207,141,41],
  [1907,1292,147,35],
  [2071,1284,187,43],
  [2276,1280,198,47],
  [2492,1286,48,42],
  [2558,1276,303,52],
  [1909,1390,297,53],
  [1907,1471,176,54],
  [2097,1476,215,65],
  [2324,1471,206,69],
  [2545,1471,159,53],
  [1906,1562,48,44],
  [1970,1552,361,70],
  [2348,1551,129,60],
  [2495,1569,143,37],
  [2654,1560,179,44],
  [2848,1553,187,49],
  [1906,1645,48,44],
  [1970,1633,304,55],
  [1905,1753,226,56],
  [1905,1837,151,55],
  [2074,1846,50,44],
  [2141,1840,219,66],
  [2379,1848,193,55],
  [2590,1847,83,37],
  [2691,1837,139,44],
  [2847,1837,140,39],
  [1904,1928,192,47],
  [2115,1921,200,52],
  [2334,1924,47,45],
  [2400,1909,304,59],
  [3161,1118,141,58],
  [3159,1386,143,60],
  [3159,1735,18,51],
  [3188,1730,113,62]]

const ratioX = Dimensions.get('window').height /2160;
const ratioY = Dimensions.get('window').width /3840;

class Help extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <NavigationBar
          title={"Know your food"}
          left={[
            {
              name:'help',
              handler:()=>this.setState({showHelp:true})
            }
          ]}
        />
        <View style={styles.container}>
          <Text style={styles.label}>
            Home
          </Text>
        </View>
      </View>
    );
  }
}

export default Help;