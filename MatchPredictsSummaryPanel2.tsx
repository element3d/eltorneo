import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";
import DropShadow from "react-native-drop-shadow";
import dataManager from "./DataManager";

export default function MatchPredictsSummaryPanel2({match, predicts, onUnlock, blockForAd, adLoaded }) {
    function getPredictPercent(numPredicts) {
        const percent = numPredicts / predicts.numPredicts * 100
        if (percent <= 0) return ""
        return ` (${Number.parseInt(percent)}%)`
    }

    function getPredictPercent2(numPredicts) {
        const percent = numPredicts / predicts.numPredicts * 100
        if (percent <= 0) return ""
        return `${Number.parseInt(percent)}%`
    }

    function getImageName() {
        if (hasKit(match)) {
            return `_kit.png${dataManager.getImageCacheTime()}`
        }
        return '.png'
        
    }

    function hasKit(match) {
        return match.league == 3 || match.league == 2 || match.league == 4 || match.league == 5 || match.league == 6 || match.league == 1
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
                // paddingLeft: 10,
                // paddingRight: 10,
                marginBottom: 20,
            }}>
                <View style={{
                    marginTop: blockForAd ? 5 : 0,
                    height: blockForAd ? 80 : 80,
                    // backgroundColor: 'red',
                    flexDirection: 'row'
                }}>
                    <View style={{
                        //   flex: 1,
                        marginHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* <DropShadow style={{
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: .2,
                            shadowRadius: 10,
                        }}> */}
                        <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name}${getImageName()}`} style={{
                            width: 40,
                            height: 60,
                            objectFit: hasKit(match) ? 'cover' : 'contain'
                        }}></Image>
                        {/* </DropShadow> */}
                        {/* <Text style={{
                    fontSize: 16,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                  }}>1</Text> */}
                        {/* {!blockForAd ? <Text style={{
                    fontSize: 20,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                  }}>
                    {predicts?.numP1}{getPredictPercent(predicts?.numP1)}
                    </Text> : <Icon color={Colors.titleColor} size={30} name='lock' style={{
                      marginTop: 4
                    }}/> } */}
                    </View>

                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View>
                            <Text style={{
                                marginBottom: 4,
                                color: '#8E8E93',
                                fontWeight: 'bold'
                            }}>{strings.chanses_to_win}</Text>
                        </View>
                        <View style={{
                            width: '100%',
                            marginTop: 4,
                            // backgroundColor: 'red',
                            height: 10,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                width: !blockForAd ? `${getPredictPercent2(predicts?.numP1)}`: '33.3%',
                                height: 10,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                minWidth: 10,
                                // flex: 1,
                                marginRight: 2,
                                flexShrink: 1,
                                backgroundColor: Colors.mode == 1 ? '#37003C' : 'white'
                            }}></View>
                            <View style={{
                                width: !blockForAd ? `${getPredictPercent2(predicts?.numDraw)}` : '33.3%',
                                height: 10,
                                minWidth: 10,
                                flexShrink: 1,
                                // borderRadius: 5,
                                marginRight: 2,
                                // flex: 1,
                                backgroundColor: '#8E8E93'
                            }}></View>
                            <View style={{
                                width: !blockForAd ? `${getPredictPercent2(predicts?.numP2)}` : '33.3%',
                                height: 10,
                                minWidth: 10,
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                flexShrink: 1,
                                backgroundColor: '#FF2882'
                            }}></View>
                        </View>
                        <View style={{
                            width: '100%',
                            marginTop: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>

                            {!blockForAd ? <Text style={{
                                fontSize: 12,
                                // flex: 1,
                                width: 60,
                                color: Colors.titleColor,
                                fontWeight: 'bold'
                            }}>
                                {predicts?.numP1}{getPredictPercent(predicts?.numP1)}
                            </Text>: <Icon color={Colors.titleColor} size={16} name='lock'/>}
                            {!blockForAd ? <Text style={{
                                width: 60,
                                fontSize: 12,
                                textAlign: 'center',
                                color: Colors.titleColor,
                                fontWeight: 'bold'
                            }}>
                                {predicts?.numDraw}{getPredictPercent(predicts?.numDraw)}
                            </Text> : <Icon color={Colors.titleColor} size={16} name='lock'/>}
                            {!blockForAd ? <Text style={{
                                textAlign: 'right',
                                width: 60,
                                fontSize: 12,
                                color: Colors.titleColor,
                                fontWeight: 'bold'
                            }}>
                                {predicts?.numP2}{getPredictPercent(predicts?.numP2)}
                            </Text> : <Icon color={Colors.titleColor} size={16} name='lock'/>}
                        </View>
                    </View>

                    {/* <View style={{
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
                </View> */}

                    <View style={{
                        //   flex: 1,
                        marginLeft: 10,
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* <Text style={{
                    fontSize: 16,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                  }}>2</Text>
                   */}
                        {/* <DropShadow style={{
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: .2,
                            shadowRadius: 10,
                        }}> */}
                        <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name}${getImageName()}`} style={{
                            width: 40,
                            height: 60,
                            objectFit: hasKit(match) ? 'cover' : 'contain'
                        }}></Image>
                        {/* </DropShadow> */}
                        {/* {!blockForAd ? <Text style={{
                    fontSize: 20,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                  }}>
                    {predicts?.numP2}{getPredictPercent(predicts?.numP2)}
                    </Text> : <Icon color="black" size={30} name='lock' style={{
                      marginTop: 4
                    }}/> } */}
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
                        {adLoaded ? <Icon name='play-circle-filled' size={18} color='white' style={{
                            marginLeft: 4
                        }} /> : <ActivityIndicator size={'small'} color={'white'} style={{
                            marginLeft: 6
                        }} />}
                    </TouchableOpacity>
                </View> : null}
            </View>
        </View>
    )
}