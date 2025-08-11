import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    RefreshControl,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';
import GoogleIcon from './assets/google.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppBar from './AppBar';
import strings from './Strings';
import authManager from './AuthManager';

import Colors from './Colors';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import gsingin from './GSignin';
import dataManager from './DataManager';

function SelectLeaguePage({ navigation, route }): JSX.Element {
    const me = authManager.getMeSync()

    const onSelectLeague = (league) => {

        fetch(`${SERVER_BASE_URL}/api/v1/me/movetoleague`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': authManager.getToken()
            },
            body: JSON.stringify({
                league: league
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                me.league = league
                navigation.navigate({ name: 'Tables', params: { page: 1, league: me && me.league ? me.league : 1 }, key: 1 })
            })
            .catch(error => {
                // Handle errors here
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    function getLeagues() {
        const numLeagues = dataManager.getSettings().numLevels
        const leagues = [1]
        if (numLeagues >= 2) leagues.push(2)
        if (numLeagues >= 3) leagues.push(3)
        if (numLeagues >= 4) leagues.push(4)
        return leagues
    }

    function getLeagueTitle(index) {
        if (index == 1) return strings.legend
        if (index == 2) return strings.pro
        if (index == 3) return strings.amateur
        if (index == 4) return strings.beginner
    }
    const insets = useSafeAreaInsets();

    return (
        <GestureHandlerRootView style={{
            flex: 1, backgroundColor: Colors.bgColor,
        }}>

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
                <View style={{
                    height: insets.top,
                    backgroundColor: Colors.gray800,
                }} />
                <StatusBar
                    barStyle={Colors.statusBar}
                    backgroundColor={Colors.gray800}
                />

                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        contentContainerStyle={{
                            // minHeight: '100%'
                        }}
                        style={{ flex: 1 }}
                    >

                        <View style={{
                            width: '100%',
                            // paddingBottom: 10,
                            backgroundColor: Colors.gray800
                        }}>
                            <AppBar navigation={navigation} />
                        </View>

                        <View style={{
                            padding: 18,
                            paddingTop: 0,
                            // flexDirection: 'row',
                            alignItems: 'flex-start',
                            // justifyContent: 'flex-start'
                        }}>
                            {
                                getLeagues().map((item, i) => {
                                    return <TouchableOpacity key={`league_${i}`} activeOpacity={.6} onPress={() => onSelectLeague(i + 1)} style={{
                                        width: '100%',
                                        // paddingLeft: 20,
                                        // backgroundColor: 'red',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        height: 50
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: 'bold',
                                            color: authManager.getMeSync().league == i + 1 ? '#FF2882' : '#8E8E93'
                                        }}>{getLeagueTitle(i + 1)}</Text>
                                    </TouchableOpacity>
                                })
                            }


                        </View>

                    </ScrollView>
                    <BottomNavBar navigation={navigation} />
                </View>
                <View style={{
                    height: insets.bottom,
                    backgroundColor: Colors.gray800,
                }} />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default SelectLeaguePage;
