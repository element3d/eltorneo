import { View } from "react-native";
import AppBar from "./AppBar";
import UserPanel from "./UserPanel";
import NativeAdComp from "./NativeAdComp";
import ProfileStats from "./ProfileStat";
import React from "react";
import Colors from "./Colors";
import dataManager from "./DataManager";

const ProfileHeader = React.memo(({ navigation, user, isMe, predictsJson }) => {

    return <View style={{
        marginBottom: 10
    }}>
        <View style={{
            width: "100%",
            // height: 500,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.gray800,
            paddingBottom: 10
        }}>
            <AppBar navigation={navigation} />
            <UserPanel navigation={navigation} user={user} place={isMe ? user.position : user.position} isMe={isMe} />
        </View>

        { dataManager.getSettings().enableAds ? <View style={{
            padding: 20,
            paddingBottom: 0
        }}>
            <NativeAdComp key={'profile_ad'} forceNativeAd={true} />
        </View> : <View style={{height: 20}}/> }

        {predictsJson ? <ProfileStats predictsJson={predictsJson} /> : null}
    </View>
});

export default ProfileHeader;