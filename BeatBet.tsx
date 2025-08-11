import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import AppBar from './AppBar';
import dataManager from './DataManager';
import strings from './Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';
import SERVER_BASE_URL from './AppConfig';


function BeatBetPage({ navigation, route }): JSX.Element {
    const [predicts, setPredicts] = useState([])

    useEffect(() => {
        getPredicts()
    }, [])

    function getPredicts() {
        fetch(`${SERVER_BASE_URL}/api/v1/beat_bet`, {
            method: 'GET',
            headers: {
                // 'Authentication': authManager.getToken()
            },
        })
            .then(response => response.json())
            .then(data => {
                setPredicts(data.predicts)
            })
            .catch(error => {

                console.error('Error fetching leagues:', error)
            });
    }

    function getColor(status) {
        if (status == 0) return 'gray'
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
                            backgroundColor: Colors.bgColor,

                        }}
                        style={{
                            flex: 1, backgroundColor: Colors.bgColor,
                        }}>

                        <View style={{
                            width: '100%',
                            // paddingBottom: 20,
                            backgroundColor: Colors.gray800
                        }}>
                            <AppBar navigation={navigation} title={'Beat Bet'} showLogo={false} />
                        </View>
                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            flexWrap: 'wrap'
                        }}>
                            {predicts.map((p) => {
                                return <View style={{
                                    width: 40,
                                    height: 40,
                                    margin: 10,
                                    backgroundColor: getColor(p.predict.status),
                                    borderRadius: 20
                                }}>
                                    <Text>{p.predict.status}</Text>
                                </View>
                            })}
                        </View>
                    </ScrollView>
                    <BottomNavBar page={EPAGE_CALENDAR} navigation={navigation} />
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default BeatBetPage;
