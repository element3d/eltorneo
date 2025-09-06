import React, { useState } from 'react';
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';

import GooglePlayIcon from './assets/google-play.svg';
import moment from 'moment';
import AppBar from './AppBar';
import strings from './Strings';
import Colors from './Colors';

function FireballInfoPage({ navigation, route }): JSX.Element {
    const today = moment();

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
                            <AppBar navigation={navigation} title={"Fireball"} showLogo={false} />
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
                            }}>{strings.learn_more}</Text>
                            <Text style={{
                                marginTop: 10,
                                fontSize: 14,
                                color: '#8E8E93',

                            }}>{strings.awards_info_short}</Text>

                            <Text style={{
                                marginTop: 20,
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: Colors.titleColor,
                            }}>{strings.rules}</Text>
                            <Text style={{
                                marginTop: 10,
                                fontSize: 14,
                                color: '#8E8E93',
                            }}>{strings.fireball_rules_info}</Text>

                        </View>

                        <TouchableOpacity activeOpacity={.8} onPress={onNavPlayStore} style={{
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            paddingHorizontal: 20,
                            paddingLeft: 5,
                            marginBottom: 30,
                            backgroundColor: '#FF2882'
                        }}>
                            <View style={{
                                width: 22,
                                height: 22,
                                backgroundColor: 'white',
                                borderRadius: 11,
                                marginRight: 10,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <GooglePlayIcon width={18} height={18} />
                            </View>
                            <Text style={{
                                fontSize: 16,
                                lineHeight: 22,
                                fontFamily: 'Poppins-Bold',
                                color: 'white'
                            }}>{strings.leave_a_review}</Text>
                        </TouchableOpacity>


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

export default FireballInfoPage;
