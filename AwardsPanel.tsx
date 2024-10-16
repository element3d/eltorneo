import { View, Text, TouchableOpacity } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from "./Colors";

function AwardsPanel({ onReadMore, overlay = false }) {
    return (
        <View style={{
            // marginTop: 10,
            
            width: '100%',
            height: '100%',
            backgroundColor: overlay ? '#000000aa' : 'transparent',
            
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: 18,
                lineHeight: 18,
                marginBottom: 4,
            }}>{strings.awards}</Text>
            <Text style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                color: "#ffffffaa",
                paddingHorizontal: 20,
            }}>{strings.award_msg}</Text>
            <View style={{
                // borderWidth: 2,
                borderRadius: 40,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: 12,
                marginTop: 6,
                backgroundColor: 'white'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: "black"
                }}>
                    1 pt = 0.5 $
                </Text>
            </View>

            <Text style={{
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 4,
                fontSize: 18
            }}>{strings.rules}</Text>

            <View style={{
                // marginTop: 10,
                flexDirection: 'row'
            }}>
                <View style={{
                    width: 60,
                    //  marginLeft: 20,
                    //  marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 34,
                        height: 34,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        backgroundColor: '#FACC15'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 22,
                            fontFamily: "Poppins-Bold",
                            color: 'black'
                        }}>+3</Text>
                    </View>
                    {/* <Text style={{
                        color: 'white',
                        marginTop: 2,
                        fontWeight: 'bold'
                    }}>{strings.score}</Text> */}
                </View>

                <View style={{
                    width: 60,
                    // marginLeft: 20,
                    // marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 34,
                        height: 34,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#00C566',
                        backgroundColor: '#34C75955'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 22,
                            fontFamily: "Poppins-Bold",
                            color: '#00C566'
                        }}>+1</Text>
                    </View>
                    {/* <Text style={{
                        color: 'white',
                        marginTop: 2,
                        fontWeight: 'bold'
                    }}>{strings.win}</Text> */}
                </View>

                <View style={{
                    width: 60,
                    //  marginLeft: 20,
                    //  marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 34,
                        height: 34,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#FF4747',
                        backgroundColor: '#FF474755'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 22,
                            fontFamily: "Poppins-Bold",
                            color: '#FF4747'
                        }}>-1</Text>
                    </View>
                    {/* <Text style={{
                        marginTop: 2,
                        color: 'white',
                        fontWeight: 'bold'
                    }}>{strings.lost}</Text> */}
                </View>



            </View>
            <TouchableOpacity activeOpacity={.8} onPress={onReadMore} style={{
                height: 24,
                marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF2882',
                borderRadius: 15,
                paddingHorizontal: 20,
            }}>
                <Text style={{
                    fontFamily: 'Poppins-Bold',
                    fontSize: 13,
                    lineHeight: 18,
                    // fontWeight: 'bold',
                    color: 'white'
                }}>{strings.learn_more}</Text>
            </TouchableOpacity>
            {/* <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    color: "#ffffffcc",
                    fontSize: 14,
                    marginRight: 6,
                }}>
                    {strings.score_predicted}:
                </Text>
                <Text style={{
                    color: '#FFCC00',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    +3
                </Text>
                <Text style={{
                    color: "#ffffffcc",
                    fontSize: 14,
                    // fontWeight: 'bold'
                }}>
                    {strings.points2}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    color: "#ffffffcc",
                    fontSize: 14,
                    marginRight: 6,
                     fontWeight: 'bold'
                }}>
                    {strings.winner_or_draw_predicted}:
                </Text>
                <Text style={{
                    color: '#00C566',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    +1
                </Text>
                <Text style={{
                    color: "#ffffffcc",
                    fontSize: 14,
                    fontWeight: 'bold'
                }}>
                    {strings.point}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // marginBottom: 10,
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: "#ffffffbb",
                    fontSize: 14,
                    marginRight: 6,
                }}>
                    {strings.prediction_was_failed}:
                </Text>
                <Text style={{
                    color: '#FF4747',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    -1
                </Text>
                <Text style={{
                    color: "#ffffffbb",
                    fontSize: 14,
                    fontWeight: 'bold'
                }}>
                    {strings.point}
                </Text>
            </View> */}
        </View>
    )
}

export default AwardsPanel