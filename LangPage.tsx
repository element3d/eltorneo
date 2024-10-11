import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import AppBar from './AppBar';
import dataManager from './DataManager';
import strings from './Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';


function LangPage({ navigation, route }): JSX.Element {

    const backgroundStyle = {
        backgroundColor: 'white',
    };

    function onLang(l) {
        strings.setLanguage(l)
        AsyncStorage.setItem("lang", l)
        navigation.navigate({name: 'Home', key: `home_lang_${l}`})
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.gray800 }}>

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
                            <AppBar navigation={navigation}/>
                            {Object.keys(dataManager.getLangs()).map((l)=>{
                                return <TouchableOpacity key={l} activeOpacity={.6} onPress={() => onLang(l)} style={{
                                    width: '100%',
                                    paddingLeft: 20,
                                    height: 50
                                }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: strings.getLanguage() == l ? '#FF2882' : '#8E8E93'
                                    }}>{dataManager.getLangs()[l]}</Text>
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

export default LangPage;
