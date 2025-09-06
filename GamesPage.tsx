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
import BottomNavBar, { EPAGE_CALENDAR, EPAGE_TABLES } from './BottomNavBar';
import AppBar from './AppBar';
import dataManager from './DataManager';
import strings from './Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';
import TrailerItem from './TrailerItem';
import TrailerVideoDialog from './TrailerVideoDialog';
import authManager from './AuthManager';
import Icon from 'react-native-vector-icons/MaterialIcons';


function GamesPage({ navigation, route }): JSX.Element {

    const insets = useSafeAreaInsets();

    function onNavElTorneo() {
        const me = authManager.getMeSync()
        navigation.navigate({ name: 'Tables', params: { page: 1, league: me && me.league ? me.league : 1, season: dataManager.getSettings() ? dataManager.getSettings().season : '25/26' }, key: "tables" })
    }

    function onNavBeatBet() {
        const me = authManager.getMeSync()
        navigation.navigate({ name: 'BeatBetTables', params: { page: 1, league: me && me.league ? me.league : 1, season: dataManager.getSettings() ? dataManager.getSettings().season : '25/26' }, key: "beat_bet_tables" })
    }

    function onNavFireball() {

    }

    return (
        <GestureHandlerRootView style={{
            flex: 1, backgroundColor: Colors.gray800,
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
                        style={{ flex: 1 }}>

                        <View style={{
                            width: '100%',
                            // paddingBottom: 20,
                            backgroundColor: Colors.gray800
                        }}>
                            <AppBar navigation={navigation} title={strings.games} showLogo={false} />
                        </View>
                        <View style={{
                            width: '100%',
                            paddingTop: 25,
                            paddingHorizontal: 20,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                {/* El Torneo */}
                                <TouchableOpacity onPress={onNavElTorneo} activeOpacity={.8} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    <View style={{
                                        aspectRatio: 1,   // keeps it square
                                        width: '100%',
                                        maxWidth: 120,    // optional limit so they don’t get huge on tablets
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={require('./assets/playstore.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>el Torneo</Text>
                                </TouchableOpacity>

                                {/* Beat Bet */}
                                <TouchableOpacity onPress={onNavBeatBet} activeOpacity={.8} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    <View style={{
                                        aspectRatio: 1,
                                        width: '100%',
                                        maxWidth: 120,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={require('./assets/beat_bet_img.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>Beat Bet</Text>
                                </TouchableOpacity>

                                {/* Fireball */}
                                <TouchableOpacity onPress={onNavFireball} activeOpacity={.8} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    <View style={{
                                        aspectRatio: 1,
                                        width: '100%',
                                        maxWidth: 120,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={require('./assets/Fireball.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />

                                        <View style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            backgroundColor: '#00000088',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={40} color={'white'} name='lock' style={{
                                                zIndex: 2
                                            }} />
                                        </View>
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>Fireball</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            width: '100%',
                            paddingTop: 25,
                            paddingHorizontal: 20,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}>
                                <TouchableOpacity activeOpacity={.8} style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    <View style={{
                                        aspectRatio: 1,   // keeps it square
                                        width: '100%',
                                        maxWidth: 120,    // optional limit so they don’t get huge on tablets
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Image source={require('./assets/Career.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />
                                        <View style={{
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            backgroundColor: '#00000088',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Icon size={40} color={'white'} name='lock' style={{
                                                zIndex: 2
                                            }} />
                                        </View>
                                    </View>
                                    <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>Career</Text>
                                </TouchableOpacity>

                                {/* Beat Bet */}
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    {/* <View style={{
                                        aspectRatio: 1,
                                        width: '100%',
                                        maxWidth: 120,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={require('./assets/beat_bet_img.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />
                                    </View> */}
                                    {/* <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>Beat Bet</Text> */}
                                </View>

                                {/* Fireball */}
                                <View onPress={onNavFireball} activeOpacity={.8} style={{
                                    flex: 1,
                                    opacity: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 5,
                                }}>
                                    {/* <View style={{
                                        aspectRatio: 1,
                                        width: '100%',
                                        maxWidth: 120,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                    }}>
                                        <Image source={require('./assets/Fireball.png')} style={{
                                            width: '100%',
                                            height: '100%',
                                        }} />
                                    </View> */}
                                    {/* <Text style={{
                                        fontSize: 16,
                                        marginTop: 6,
                                        fontWeight: 'bold',
                                        color: Colors.titleColor,
                                    }}>Fireball</Text> */}
                                </View>
                            </View>
                        </View>


                    </ScrollView>
                    <BottomNavBar navigation={navigation} page={EPAGE_TABLES} />
                </View>
                <View style={{
                    height: insets.bottom,
                    backgroundColor: Colors.gray800,
                }} />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default GamesPage;
