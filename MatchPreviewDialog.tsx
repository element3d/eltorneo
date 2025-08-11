import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import NativeAdComp from "./NativeAdComp";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";

import SupportPanel from "./SupportPanel";


export default function MatchPreviewDialog({ onClose, match }) {

    return (
        <View style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#00000099',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: 0
        }}>
            <View style={{
                width: '100%',
                paddingTop: 10,
                borderRadius: 12,
                backgroundColor: Colors.bgColor
            }}>
                <View style={{
                    width: '100%',
                    height: 60,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: '40%',
                        // backgroundColor: 'red',
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            color: Colors.titleColor,
                            // fontWeight: 'bold'
                            fontFamily: 'Poppins-Bold'
                        }}>
                            {match.team1.shortName}
                        </Text>
                        <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name.replace(/ö/g, 'o')}.png`} style={{
                            width: 30,
                            height: 30,
                            marginLeft: 4,
                        }}></Image>
                    </View>

                    {!match.isTeaser ? <View style={{
                        marginHorizontal: 6,
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            color: Colors.titleColor,
                            // fontWeight: 'bold',
                            fontFamily: 'Poppins-Bold',
                            fontSize: 18
                        }}>
                            {match.team1_score}
                        </Text>
                        <Text style={{
                            color: Colors.titleColor,
                            // fontWeight: 'bold',
                            fontFamily: 'Poppins-Bold',
                            fontSize: 18,
                            marginHorizontal: 2
                        }}>:</Text>
                        <Text style={{
                            color: Colors.titleColor,
                            // fontWeight: 'bold',
                            fontFamily: 'Poppins-Bold',
                            fontSize: 18
                        }}>
                            {match.team2_score}
                        </Text>
                    </View> : <Text style={{
                        color: Colors.titleColor,
                        // fontWeight: 'bold',
                        fontFamily: 'Poppins-Bold',
                        fontSize: 14,
                        marginLeft: 10,
                        marginRight: 10,
                        marginHorizontal: 2
                    }}>VS</Text>}
                    <View style={{
                        width: '40%',
                        flexDirection: 'row',
                        // backgroundColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name.replace(/ö/g, 'o')}.png`} style={{
                            width: 30,
                            height: 30,
                            marginRight: 4,
                        }}></Image>
                        <Text style={{
                            color: Colors.titleColor,
                            // fontWeight: 'bold',
                            fontSize: 14,
                            fontFamily: 'Poppins-Bold'
                        }}>
                            {match.team2.shortName}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={{
                    position: 'absolute',
                    top: 5,
                    right: 10
                }}>
                    <Icon name="close" size={28} color={Colors.titleColor} />
                </TouchableOpacity>
                <View style={{
                    width: '100%',
                    paddingHorizontal: 12,
                }}>
                    <NativeAdComp forceNativeAd={true} />
                </View>
                <YoutubePlayer
                    width={Dimensions.get('window').width}
                    height={220}
                    play={true}
                    initialPlayerParams={
                        {
                            // controls: false
                        }
                    }
                    webViewProps={{
                        source: { baseUrl: "https://youtube.com" },
                    }}
                    videoId={match.isTeaser ? match.teaser : match.preview}
                // onChangeState={onStateChange}
                />
                <SupportPanel />
            </View>
        </View>
    )
}