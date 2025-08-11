import { View, Text, TouchableOpacity } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from "./Colors";

function AwardsPanel({ onReadMore, season, showLeague = true, overlay = false, league = 1 }) {

    function getLeagueName() {
        if (league == 1) return strings.legend
        if (league == 2) return strings.pro
        if (league == 3) return strings.amateur
        if (league == 4) return strings.beginner
    }

    return (
        <View style={{
            // marginTop: 10,

            width: '100%',
            height: '100%',
            backgroundColor: overlay ? '#000000aa' : 'transparent',

            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {showLeague ? <Text style={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: 22,
                lineHeight: 22,
                marginBottom: 4,
            }}>{getLeagueName()}</Text> : null}
            <Text style={{
                fontWeight: 'bold',
                color: '#ffffffaa',
                fontSize: 16,
                lineHeight: 16,
                marginBottom: 4,
            }}>{strings.season} 20{season}</Text>

            <Text style={{
                fontWeight: 'bold',
                color: 'white',
                marginTop: 10,
                marginBottom: 8,
                fontSize: 18
            }}>{strings.rules}</Text>

            <View style={{
                // marginTop: 10,
                flexDirection: 'row'
            }}>
                <View style={{
                    width: 50,
                    //  marginLeft: 20,
                    //  marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 28,
                        height: 28,
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

                </View>

                <View style={{
                    width: 50,
                    // marginLeft: 20,
                    // marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 28,
                        height: 28,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#00C566',
                        backgroundColor: '#34C75955'
                    }}>
                        <Text style={{
                            fontSize: 15,
                            lineHeight: 20,
                            fontFamily: "Poppins-Bold",
                            color: '#00C566'
                        }}>+2</Text>
                    </View>

                </View>

                <View style={{
                    width: 50,
                    // marginLeft: 20,
                    // marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 28,
                        height: 28,
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

                </View>

                <View style={{
                    width: 50,
                    //  marginLeft: 20,
                    //  marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 28,
                        height: 28,
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
        </View>
    )
}

export default AwardsPanel