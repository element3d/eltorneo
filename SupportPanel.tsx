import { Linking, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import YoutubeIcon from './assets/youtube.svg';
import TikTokIcon from './assets/tiktok.svg';
import FacebookIcon from './assets/telegram.svg';
import PlayStoreIcon from './assets/google-play.svg';
import strings from "./Strings";

export default function SupportPanel() {
    const onNavYoutube = () => {
        const youtubeUrl = 'https://www.youtube.com/@eltorneo';

        Linking.openURL(youtubeUrl).catch(err =>
            console.error('An error occurred while opening URL:', err)
        );
    };

    const onNavTikTok = () => {
        const tiktokUrl = 'https://www.tiktok.com/@el.torneo.app?_t=ZS-8uSKrlxdGjK&_r=1';

        Linking.openURL(tiktokUrl).catch(err =>
            console.error('An error occurred while opening URL:', err)
        );
    };

    const onNavFacebook = () => {
        const facebookUrl = 'https://t.me/elTorneoBot';//'https://www.facebook.com/profile.php?id=61565578976994';
  const url = 'https://t.me/elTorneoBot';

        Linking.openURL(facebookUrl).catch(err =>
            console.error('An error occurred while opening URL:', err)
        );
    };

    const onNavPlayStore = () => {
        const appPackageName = 'com.eltorneo'; // Replace with your app's package name
        const playStoreUrl = `https://play.google.com/store/apps/details?id=${appPackageName}`;

        Linking.canOpenURL(playStoreUrl)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(playStoreUrl);
                } else {
                    console.log("Don't know how to open URI: " + playStoreUrl);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    return <View style={{
        width: '100%',
        padding: 10,
        // height: 40,
        flexDirection: 'column',
        marginBottom: 2,

        // backgroundColor: 'red'
    }}>
        <Text style={{
            // fontFamily: 'Poppins-Bold',
            color: Colors.titleColor
        }}>{strings.support_msg}</Text>
        <View style={{
            marginTop: 10,
            width: '100%',
            flexDirection: 'row'
            // backgroundColor: 'blue'
            // ,
            // height: 35,
        }}>
            <TouchableOpacity onPress={onNavYoutube}>

                <YoutubeIcon height={36} width={50} ></YoutubeIcon>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavTikTok}>
                <TikTokIcon style={{
                    marginLeft: 10,
                    // backgroundColor: 'red'
                }} height={36} width={50} ></TikTokIcon>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavFacebook}>
                <FacebookIcon style={{
                    // marginLeft: 10,
                    // backgroundColor: 'red'
                }} height={36} width={50} ></FacebookIcon>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavPlayStore}>
                <PlayStoreIcon style={{
                    marginLeft: 5,
                    // backgroundColor: 'red'
                }} height={36} width={50} ></PlayStoreIcon>
            </TouchableOpacity>
        </View>
    </View>
}