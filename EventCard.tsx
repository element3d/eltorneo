import { Image, Text, TouchableOpacity, View } from "react-native";
import SERVER_BASE_URL from "./AppConfig";
import strings from "./Strings";
import moment from "moment";
import dataManager from "./DataManager";
import SpecialAwardPanel from "./SpecialAwardPanel";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EventCard({ onPress, onClose, match }) {

    function getDate(matchDate) {
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'day').startOf('day');

        if (moment(matchDate).isSame(today, 'day')) {
            return strings.today;
        } else if (moment(matchDate).isSame(tomorrow, 'day')) {
            return strings.tomorrow;
        } else {
            return `${moment(matchDate).format('DD')} ${strings[moment(matchDate).format('MMM').toLowerCase()]}`;
        }
    }

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 12,
            backgroundColor: "#000000cc"
        }}>
            <TouchableOpacity activeOpacity={.9}  style={{
                width: '100%',
                // height: 220,
                borderRadius: 16,
                backgroundColor: 'black',
                overflow: 'hidden'
            }}>
                <Image src={`${SERVER_BASE_URL}/data/special/${match.title}.png`} style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    // bottom: -30,
                }}></Image>
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 10,
                }}>
                    <Text style={{
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'Poppins-Bold'
                    }}>{match.translatedTitle}</Text>
                    <View style={{
                        marginTop: -10,
                        height: 20,
                        flexDirection: 'row',
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 12,
                            lineHeight: 12,
                            marginBottom: 1,
                            fontFamily: 'Poppins-Bold'
                        }}>{strings.at}</Text>
                        <Text style={{
                            color: 'white',
                            fontSize: 14,
                            lineHeight: 20,
                            fontFamily: 'Poppins-Bold'
                        }}> {match.stadium}</Text>
                    </View>

                    <View style={{
                        width: '100%',
                        marginTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            //  width: 150,
                            flex: 1,

                            //  backgroundColor: 'red',
                            //  height: 70,
                            // backgroundColor: '#00000088',
                            // borderRadius: 50,
                            alignItems: 'flex-end',
                            paddingRight: 25,
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flexShrink: 1,
                                // backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.match.team1.name}.png`} style={{
                                    width: 80,
                                    height: 80
                                }}></Image>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                    // lineHeight: 20,
                                    fontFamily: 'Poppins-Bold'
                                }}>{match.match.team1.shortName}</Text>
                            </View>

                        </View>
                        <View style={{
                            // width: 30,
                            // backgroundColor: 'red',
                            alignItems: 'center',
                            paddingBottom: 16,
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: 'white',
                                fontSize: 14,
                                // lineHeight: 20,
                                fontFamily: 'Poppins-Bold'
                            }}>{getDate(match.match.date)}</Text>
                            <View style={{
                                height: 30,
                                paddingHorizontal: 8,
                                borderRadius: 15,
                                borderColor: '#34C759',
                                borderWidth: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#34C75955'
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    lineHeight: 22,
                                    color: '#34C759',
                                    fontFamily: 'Poppins-Bold'
                                }}>{moment(match.match.date).format('HH:mm')}</Text>
                            </View>
                        </View>
                        <View style={{
                            //  width: 150,
                            flex: 1,
                            paddingLeft: 25,
                            flexDirection: 'row',
                            // alignItem: 'flex-start',
                            //  backgroundColor: 'red',
                            //  height: 70,
                            // backgroundColor: '#00000088',
                            // borderRadius: 50,
                            // alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <View style={{
                                flexShrink: 1,
                                // backgroundColor: 'red',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.match.team2.name}.png`} style={{
                                    width: 80,
                                    height: 80,
                                    // backgroundColor: 'blue',

                                }}></Image>
                                <Text style={{
                                    // backgroundColor: 'blue',
                                    color: 'white',
                                    fontSize: 16,
                                    // lineHeight: 20,
                                    fontFamily: 'Poppins-Bold'
                                }}>{match.match.team2.shortName}</Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <SpecialAwardPanel />
                        <TouchableOpacity onPress={onPress} activeOpacity={.8} style={{
                            height: 24,
                            marginTop: 3,
                            marginBottom: 20,
                            paddingHorizontal: 20,
                            backgroundColor: '#FF2882',
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                lineHeight: 18,
                                color: 'white',
                                fontFamily: 'Poppins-Bold'
                            }}>{strings.predict}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={{
                    position: 'absolute',
                    top: 10,
                    right: 10
                }}>
                    <Icon name={'close'} size={24} color={'white'} style={{

                    }} />
                </TouchableOpacity>
            </TouchableOpacity>

        </View>
    )
}