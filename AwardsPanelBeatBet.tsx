import { View, Text, TouchableOpacity } from "react-native";
import strings from "./Strings";
import BBIcon from './assets/bbicon.svg'

function AwardsPanelBeatBet({ onReadMore, season, showLeague = true, overlay = false, league = 1 }) {

    function getLeagueName() {
        return strings.legend

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
                    // width: 50,
                    flexDirection: 'row',
                    //  marginLeft: 20,
                    //  marginRight: 20,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginRight: 6,
                        fontWeight: 'bold'
                    }}>Min</Text>
                    <View style={{
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#00C566',
                        backgroundColor: '#34C75955'
                    }}>
                        <Text style={{
                            fontSize: 13,
                            // lineHeight: 18,
                            fontWeight: 900,
                            // fontFamily: "Poppins-Bold",
                            color: '#00C566',
                        }}>10$</Text>
                    </View>

                </View>

                <View style={{
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <BBIcon width={32} height={32}></BBIcon>
                </View>

                <View style={{
                    // width: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // marginLeft: 20,
                    // marginRight: 20,
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: 30,
                        height: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: '#00C566',
                        backgroundColor: '#34C75955'
                    }}>
                        <Text style={{
                            fontSize: 13,
                            // lineHeight: 18,
                            fontWeight: 900,
                            // fontFamily: "Poppins-Bold",
                            color: '#00C566',
                        }}>20$</Text>
                    </View>
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        marginLeft: 6,
                        fontWeight: 'bold'
                    }}>Max</Text>
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

export default AwardsPanelBeatBet