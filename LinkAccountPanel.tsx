import { Text, TouchableOpacity, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

export default function LinkAccountPanel({navigation}) {
    function onLinkAccount() {
        navigation.navigate('LinkAccount');
    }

    return <View style={{
        width: '100%',
        padding: 20,
        paddingBottom: 10,
        // marginTop: 10,
        // marginLeft: 10,
        alignItems: 'center',
        // backgroundColor: 'red',
        // paddingRight: 20,
        // paddingLeft: 20
    }}>
        <View style={{
            width: '100%',
            borderRadius: 12,
            padding: 10,
            backgroundColor: '#FF474719'
        }}>
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#FF4747'
            }}>{strings.attention_quest}</Text>
            <Text style={{
                color: Colors.titleColor
            }}>{strings.link_account_message}</Text>

            <TouchableOpacity activeOpacity={.8} onPress={onLinkAccount} style={{
                height: 24,
                width: 'auto',
                alignSelf: 'center',
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
                }}>{strings.complete_account}</Text>
            </TouchableOpacity>

        </View>
    </View>
}