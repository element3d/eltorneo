import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Image,
    Linking,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
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

import AppBar from './AppBar';
import strings from './Strings';
import authManager from './AuthManager';

import Colors from './Colors';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import gsingin from './GSignin';

function MoveToLeaguePage({ navigation, route }): JSX.Element {
    const me = authManager.getMeSync()

    const onNavPlayStore = () => {
        const league = me.league == 1 ? 2 : 1

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
                navigation.goBack()
            })
            .catch(error => {
                // Handle errors here
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    function onSignIn() {
        gsingin.signin(null, (me) => {
            navigation.navigate('Calendar')
        })
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bgColor }}>

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
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
                            // flexDirection: 'row',
                            alignItems: 'flex-start',
                            // justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: Colors.titleColor,
                            }}>{strings.leagues_title}</Text>
                            <Text style={{
                                marginTop: 10,
                                fontSize: 14,
                                color: '#8E8E93',

                            }}>{strings.leagues_msg}</Text>
                        </View>

                        {me && (me.points <= 20 || me.league == 2) ? <TouchableOpacity activeOpacity={.8} onPress={onNavPlayStore} style={{
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            paddingHorizontal: 20,
                            paddingRight: 5,
                            marginBottom: 30,
                            backgroundColor: '#FF2882'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                lineHeight: 22,
                                fontWeight: 'bold',
                                // fontFamily: 'Poppins-Bold',
                                color: 'white'
                            }}>{strings.move_to_league} {me.league == 1 ? "2" : '1'}</Text>
                            <MDIcon name={'arrow-right'} size={30} color={'white'}></MDIcon>

                        </TouchableOpacity> : null}

                        {!me ? <TouchableOpacity activeOpacity={.8} onPress={onSignIn} style={{
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            paddingHorizontal: 20,
                            paddingRight: 5,
                            marginBottom: 30,
                            backgroundColor: '#FF2882'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                lineHeight: 22,
                                fontWeight: 'bold',
                                // fontFamily: 'Poppins-Bold',
                                color: 'white'
                            }}>{strings.sign_in_to_predict}</Text>
                            <View style={{
                                width: 20,
                                height: 20,
                                marginLeft: 5,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <GoogleIcon style={{
                                    width: 18,
                                    height: 18
                                }}/>
                            </View>

                        </TouchableOpacity> : null}

                    </ScrollView>
                    <BottomNavBar navigation={navigation} />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default MoveToLeaguePage;
