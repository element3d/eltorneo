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
import TrailerItem from './TrailerItem';
import TrailerVideoDialog from './TrailerVideoDialog';


function TrailersPage({ navigation, route }): JSX.Element {
    const [showTrailer, setShowTrailer] = useState(false)
    const [trailer, setTrailer] = useState(null)

    function onShowTrailer(trailer) {
        setShowTrailer(true)
        setTrailer(trailer)
    }

    function onClose() {
        setShowTrailer(false)
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.gray800 }}>

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor}}>
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
                            // paddingBottom: 20,
                            backgroundColor: Colors.gray800
                        }}>
                            <AppBar navigation={navigation}/>
                        </View>
                        <View style={{
                            width: '100%',
                            paddingTop: 25,
                            paddingHorizontal: 20
                            // height: 400,
                            // backgroundColor: 'red'
                        }}> 
                            {dataManager.getTrailers().map((t) => {
                                return <TrailerItem onViewPress={() => onShowTrailer(t)} key={t.subtitle} showViewAll={false} trailer={t}></TrailerItem>
                            })}
                        </View>
                    </ScrollView>
                    <BottomNavBar navigation={navigation} />
                </View>
                { showTrailer ? <TrailerVideoDialog trailer={trailer} onClose={() => {setShowTrailer(false)}}/> : null }
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default TrailersPage;
