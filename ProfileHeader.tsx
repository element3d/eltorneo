import { Text, TouchableOpacity, View } from "react-native";
import AppBar from "./AppBar";
import UserPanel from "./UserPanel";
import NativeAdComp from "./NativeAdComp";
import ProfileStats from "./ProfileStat";
import React, { useState } from "react";
import Colors from "./Colors";
import dataManager from "./DataManager";
import strings from "./Strings";
import { ESTAT_TOTAL, ETAB_BETS, ETAB_PREDICTS } from "./ProfilePage";
import ProfileStatsBet from "./ProfileStatsBet";

const ProfileHeader = React.memo(({ navigation, user, isMe, predictsJson, betsJson, tab, setTab }) => {

    function onNavPredicts() {
        navigation.navigate({
            name: 'Profile', params: {
                id: isMe ? null : user.id,
                globalPage: 1,
                routeSelectedLeague: -1,
                selectedStat: ESTAT_TOTAL,
                tab: ETAB_PREDICTS
            }, key: `profile_${user.id}_${ETAB_PREDICTS}`
        })
    }

    function onNavBets() {
        navigation.navigate({
            name: 'Profile', params: {
                id: isMe ? null : user.id,
                globalPage: 1,
                routeSelectedLeague: -1,
                selectedStat: ESTAT_TOTAL,
                tab: ETAB_BETS
            }, key: `profile_${user.id}_${ETAB_BETS}`
        })
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
            <AppBar navigation={navigation} />
            <UserPanel navigation={navigation} user={user} place={isMe ? user.position : user.position} isMe={isMe} />
        </View>

        {dataManager.getSettings().enableAds ? <View style={{
            padding: 20,
            paddingBottom: 0
        }}>
            <NativeAdComp key={'profile_ad'} forceNativeAd={true} />
        </View> : <View style={{ height: 20 }} />}

        <View style={{
            paddingLeft: 20,
            paddingRight: 20
        }}>
            <View style={{
                width: '100%',
                height: 46,
                padding: 4,
                marginBottom: 20,
                backgroundColor: Colors.selectBGColor,
                borderRadius: 23,
                flexDirection: 'row'
            }}>
                <TouchableOpacity activeOpacity={.6} onPress={() => { onNavPredicts() }} style={{
                    flex: 1,
                    height: 38,
                    backgroundColor: tab == ETAB_PREDICTS ? Colors.selectColor : 'transparent',
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: tab == ETAB_PREDICTS ? Colors.titleColor : "#8E8E93",
                        fontWeight: 'bold'
                    }}>{strings.predictions2}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.6} onPress={() => { onNavBets() }} style={{
                    flex: 1,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tab == ETAB_BETS ? Colors.selectColor : 'transparent',
                    borderRadius: 30
                }}>
                    <Text style={{
                        color: tab == ETAB_BETS ? Colors.titleColor : "#8E8E93",
                        fontWeight: 'bold'
                    }}>{strings.bets}</Text>
                </TouchableOpacity>
            </View>
        </View>
        {predictsJson ? <ProfileStats predictsJson={predictsJson} /> : null}
        {betsJson ? <ProfileStatsBet predictsJson={betsJson} /> : null}
        
    </View>
});

export default ProfileHeader;