import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import AppBar from './AppBar';
import dataManager from './DataManager';
import strings from './Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';


function ThemesPage({ navigation, route }): JSX.Element {

    const backgroundStyle = {
        backgroundColor: 'white',
    };

    function onSetTheme(t) {
        if (t == 'Light') {
            Colors.setNewMode(1)
        } else if (t == 'Dark') {
            Colors.setNewMode(2)
        } else {
            Colors.setNewMode(3)
        }
    }
    const insets = useSafeAreaInsets();

    return (
        <GestureHandlerRootView style={{
            flex: 1, backgroundColor: Colors.gray800,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right
        }}>

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.gray800 }}>
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
                        style={{ flex: 1 }}>

                        <View style={{
                            width: '100%',
                            paddingBottom: 20,
                            backgroundColor: Colors.gray800
                        }}>
                            <AppBar navigation={navigation} />
                            {dataManager.getThemes().map((l) => {
                                return <TouchableOpacity key={l} activeOpacity={.6} onPress={() => onSetTheme(l)} style={{
                                    width: '100%',
                                    paddingLeft: 20,
                                    height: 50
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: strings.getLanguage() == l ? '#FF2882' : '#8E8E93'
                                    }}>{l}</Text>
                                </TouchableOpacity>
                            })}


                        </View>
                    </ScrollView>
                    <BottomNavBar page={EPAGE_CALENDAR} navigation={navigation} />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default ThemesPage;
