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
        navigation.navigate('SelectLeague');
        return

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
                            paddingBottom: 0,
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

                            }}>{strings.leagues_msg}</Text>
                        </View>

                        <View style={{
                            width: '100%',
                            padding: 18,
                            flex: 1,
                        }}>
                            <View style={{
                                flex: 1,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'flex-start'
                                // alignItems: 'center'
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    {/* <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 10,
                                        backgroundColor: Colors.titleColor
                                    }}></View> */}
                                    <Text style={{
                                        // marginLeft: 10,
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: Colors.titleColor
                                    }}>{strings.legend}:</Text>
                                </View>
                                <Text style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    // fontWeight: 'bold',
                                    fontSize: 16,
                                    color: '#8E8E93',
                                    // color: Colors.titleColor
                                }}>{strings.legend_msg}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                marginTop: 6,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'flex-start'
                                // alignItems: 'center'
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        // marginLeft: 10,
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: Colors.titleColor
                                    }}>{strings.pro}:</Text>
                                </View>
                                <Text style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    // fontWeight: 'bold',
                                    fontSize: 16,
                                    color: '#8E8E93',
                                    // color: Colors.titleColor
                                }}>{strings.pro_msg}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                marginTop: 6,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'flex-start'
                                // alignItems: 'center'
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        // marginLeft: 10,
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: Colors.titleColor
                                    }}>{strings.amateur}:</Text>
                                </View>
                                <Text style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    // fontWeight: 'bold',
                                    fontSize: 16,
                                    color: '#8E8E93',
                                    // color: Colors.titleColor
                                }}>{strings.amateur_msg}</Text>
                            </View>

                            <View style={{
                                flex: 1,
                                marginTop: 6,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'flex-start'
                                // alignItems: 'center'
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        // marginLeft: 10,
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        color: Colors.titleColor
                                    }}>{strings.beginner}:</Text>
                                </View>
                                <Text style={{
                                    flex: 1,
                                    marginLeft: 5,
                                    // fontWeight: 'bold',
                                    fontSize: 16,
                                    color: '#8E8E93',
                                    // color: Colors.titleColor
                                }}>{strings.beginner_msg}</Text>
                            </View>
                        </View>

                        <View style={{
                            padding: 18,
                            paddingTop: 0,
                            // flexDirection: 'row',
                            alignItems: 'flex-start',
                            // justifyContent: 'flex-start'
                        }}>
                            <Text style={{
                                fontSize: 14,
                                color: '#8E8E93',

                            }}>{strings.leagues_msg2}</Text>
                        </View>

                        {me ? <TouchableOpacity activeOpacity={.8} onPress={onNavPlayStore} style={{
                            height: 30,
                            marginTop: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15,
                            flexDirection: 'row',
                            alignSelf: 'center',
                            paddingHorizontal: 20,
                            marginBottom: 30,
                            backgroundColor: '#FF2882'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                lineHeight: 22,
                                fontWeight: 'bold',
                                // fontFamily: 'Poppins-Bold',
                                color: 'white'
                            }}>{strings.select_league}</Text>
                        </TouchableOpacity> : null}

                        {!me ? <TouchableOpacity activeOpacity={.8} onPress={onSignIn} style={{
                            height: 30,
                            marginTop: 30,
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
                                }} />
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
