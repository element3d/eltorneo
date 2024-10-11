import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from "./Colors";

export default function MatchPredictsSummaryPanel({predicts, onUnlock, blockForAd, adLoaded}) {
    function getPredictPercent(numPredicts) {
        const percent = numPredicts / predicts.numPredicts * 100
        if (percent <= 0) return "" 
        return ` (${Number.parseInt(percent)}%)`
    }

    return (
        <View>
            <Text style={{
              color: '#8E8E93',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 4
            }}>{strings.summary} ({predicts?.numPredicts} {strings.predictions})</Text>
            <View style={{
              width: '100%',
              backgroundColor: Colors.gray800,
              borderRadius: 12,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 20,
            }}>
              <View style={{
                marginTop: blockForAd ? 5 : 0,
                height: blockForAd ? 80 : 80,
                // backgroundColor: 'red'
                flexDirection: 'row'
              }}>
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                  }}>1</Text>
                  {!blockForAd ? <Text style={{
                    fontSize: 20,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                  }}>
                    {predicts?.numP1}{getPredictPercent(predicts?.numP1)}
                    </Text> : <Icon color={Colors.titleColor} size={30} name='lock' style={{
                      marginTop: 4
                    }}/> }
                </View>

                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                  }}>{strings.draw}</Text>
                  {!blockForAd ? <Text style={{
                    fontSize: 20,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                  }}>
                    {predicts?.numDraw}{getPredictPercent(predicts?.numDraw)}
                    </Text> : <Icon color="black" size={30} name='lock' style={{
                      marginTop: 4
                    }}/> }
                </View>

                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                  }}>2</Text>
                  {!blockForAd ? <Text style={{
                    fontSize: 20,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                  }}>
                    {predicts?.numP2}{getPredictPercent(predicts?.numP2)}
                    </Text> : <Icon color="black" size={30} name='lock' style={{
                      marginTop: 4
                    }}/> }
                </View>
              </View>

              {blockForAd ? <View style={{
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  // backgroundColor: 'red'
                }}>
                  <TouchableOpacity onPress={onUnlock} disabled={!adLoaded} activeOpacity={.8} style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    height: 24,
                    opacity: adLoaded ? 1 : .8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: '#FF2882'
                  }} >
                    <Text style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 12,
                    }}>{strings.unlock_all}</Text>
                    { adLoaded ? <Icon name='play-circle-filled' size={18} color='white' style={{
                      marginLeft: 4
                    }}/> : <ActivityIndicator size={'small'} color={'white'} style={{
                      marginLeft: 6
                    }} /> }
                  </TouchableOpacity>
              </View> : null }
            </View>
        </View>
    )
}