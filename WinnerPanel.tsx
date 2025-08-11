import { View, Text, TouchableOpacity, Image } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/FontAwesome5';
import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";
import ProfileIcon from './assets/Profile2.svg';

function WinnerPanel({ winner, season, showLeague = true, overlay = false, league = 1 }) {

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

            {winner ? <View style={{
                flexDirection: 'row',
                marginTop: 10,
                width: '100%',
                paddingLeft: 20,
                // backgroundColor: 'red'
            }}>
                <View style={{
                    width: 70,
                    height: 70,
                    borderColor: Colors.borderColor,
                    borderWidth: 2,
                    backgroundColor: Colors.bgColor,
                    borderRadius: 80,
                    overflow: 'hidden',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15,
                }}>

                    {winner.avatar?.length ? <Image style={{
                        width: 70,
                        height: 70,
                        objectFit: 'cover'
                    }} src={`${SERVER_BASE_URL}/${winner.avatar}`} /> : <ProfileIcon width={60} height={60} style={{ marginTop: 10 }} />}

                </View>
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        color: 'white',
                        // marginTop: 10,
                        // marginBottom: 4,
                        fontSize: 22
                    }}>{winner.name.trim()}</Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#ffffffaa',
                        // marginTop: 10,
                        // marginBottom: 4,
                        fontSize: 16
                    }}>{strings.predictions2}: {winner.totalPredictions}</Text>
                    <Text style={{
                        fontWeight: 'bold',
                        color: '#ffffffaa',
                        // marginTop: 10,
                        // marginBottom: 4,
                        fontSize: 16
                    }}>{strings.points}: {winner.predictions}</Text>
                </View>
            </View>
                : <View style={{
                    height: 70,
                    marginTop: 10,
                }}></View>}


        </View>
    )
}

export default WinnerPanel