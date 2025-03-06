import { Image, Text, TouchableOpacity, View } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import dataManager from "./DataManager"
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import strings from "./Strings";
import Colors from "./Colors";

export default function TrailerItem({ navigation, onViewPress, trailer,showViewAll = true }) {
    function onNavTrailers() {
        navigation.navigate('Trailers')
    }

    return <TouchableOpacity onPress={() => { }} activeOpacity={.9} style={{
        width: '100%',
        height: 180,
        // paddingBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,

        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#37003C'
    }}>
        <Image src={`${SERVER_BASE_URL}/data/videos/${trailer.image}.png`} style={{
            width: '100%',
            height: '100%',
            // height: 250,
            // backgroundColor: 'red',
            top: 0,
            position: 'absolute'
        }} />
        <Text style={{
            color: '#FACC15',
            fontSize: 20,
            lineHeight: 26,
            marginTop: 10,
            fontFamily: 'Poppins-Bold'
        }}>{trailer.title}</Text>
        <Text style={{
            color: 'white',
            marginTop: -2,
            fontSize: 18,
            lineHeight: 20,
            fontFamily: 'Poppins-Bold'
        }}>{trailer.subtitle}</Text>

        <TouchableOpacity activeOpacity={.6} onPress={onViewPress} style={{
            marginTop: 15,
            width: 55,
            height: 55,
            backgroundColor: Colors.primary,//'#FACC15',
            borderRadius: 30,
            marginBottom: 40,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <FAIcon name={'play'} color={'white'} size={24} style={{
                marginLeft: 3
            }}></FAIcon>
        </TouchableOpacity>

        { showViewAll ? <TouchableOpacity onPress={onNavTrailers} style={{
            position: 'absolute',
            right: 12,
            bottom: 10,
        }}>
            <Text style={{
                color: 'white',
                fontWeight: 'bold'
            }}>{strings.view_all}</Text>
        </TouchableOpacity> : null }

    </TouchableOpacity>
}