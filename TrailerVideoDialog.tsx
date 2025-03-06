import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import NativeAdComp from "./NativeAdComp";
import YoutubePlayer from "react-native-youtube-iframe";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";
import SupportPanel from "./SupportPanel";

export default function TrailerVideoDialog({ onClose, trailer }) {
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
                paddingTop: 8,
                borderRadius: 12,
                // marginBottom: 10,
                backgroundColor: Colors.bgColor
            }}>
                <View style={{
                    width: '100%',
                    height: 34,
                    paddingBottom: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 10,
                    // backgroundColor: 'red'
                    // paddingBottom
                    // justifyContent: 'center',
                }}>
                    <Text style={{
                        color: Colors.titleColor,
                        fontSize: 15,
                        // lineHeight: 22,
                        fontWeight: 'bold'
                        // marginTop: 10,
                        // fontFamily: 'Poppins-Bold'
                    }}>{trailer.title} - </Text>
                    <Text style={{
                        color: '#8E8E93',
                        // marginTop: -2,
                        fontSize: 15,
                        // lineHeight: 20,
                        fontWeight: 'bold'
                        // fontFamily: 'Poppins-Bold'
                    }}>{trailer.subtitle}</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={{
                    position: 'absolute',
                    top: 8,
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
                    videoId={trailer.video}
                // onChangeState={onStateChange}
                
                />
                            <SupportPanel />

            </View>
        </View>
    )
}