import { Text, TouchableOpacity, View } from "react-native";
import AppBar from "./AppBar";
import UserPanel from "./UserPanel";
import NativeAdComp from "./NativeAdComp";
import ProfileStats from "./ProfileStat";
import React, { useState } from "react";
import Colors from "./Colors";
import dataManager from "./DataManager";
import ProfileStatsBet from "./ProfileStatsBet";
import { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from "./GamepadMenu";
import ProfileStatsFireball from "./ProfileStatsFireball";

const ProfileHeader = React.memo(({ navigation, user, isMe, predictsJson, betsJson, fireballPredictsJson }) => {
    const game = dataManager.getSettings().game;

    function getTitle() {
        if (game == EGAME_ELTORNEO) return 'el Torneo';
        if (game == EGAME_BEATBET) return 'Beat Bet';
        if (game == EGAME_FIREBALL) return 'Fireball';
    }

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
            <AppBar navigation={navigation} title={getTitle()} showLogo={false}/>
            <UserPanel navigation={navigation} user={user} place={isMe ? user.position : user.position} isMe={isMe} />
        </View>

        {dataManager.getSettings().enableAds ? <View style={{
            padding: 20,
            paddingBottom: 0
        }}>
            <NativeAdComp key={'profile_ad'} forceNativeAd={true} />
        </View> : <View style={{ height: 20 }} />}

        {predictsJson ? <ProfileStats predictsJson={predictsJson} /> : null}
        {betsJson ? <ProfileStatsBet predictsJson={betsJson} /> : null}
        {dataManager.getSettings().game == EGAME_FIREBALL && fireballPredictsJson ? <ProfileStatsFireball predictsJson={fireballPredictsJson} /> : null}

    </View>
});

export default ProfileHeader;