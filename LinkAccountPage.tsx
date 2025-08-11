import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import GoogleIcon from './assets/google.svg';

import AppBar from './AppBar';
import BottomNavBar from './BottomNavBar';
import strings from './Strings';
import { useFocusEffect } from '@react-navigation/native';
import gsingin from './GSignin';
import BallIcon from './assets/ball.svg';
import AwardsPanel from './AwardsPanel';
import Colors from './Colors';
import SERVER_BASE_URL from './AppConfig';
import authManager from './AuthManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dataManager from './DataManager';
import { ESTAT_TOTAL, ETAB_PREDICTS } from './ProfilePage';

function LinkAccountPage({ navigation }): JSX.Element {
    const [lang, setLang] = useState('ru')
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState(null)
    const [googleError, setGoogleError] = useState(null)

    useFocusEffect(
        React.useCallback(() => {

            if (strings.getLanguage() != lang) {
                setLang(strings.getLanguage())
            }
            return () => {

            };
        }, [])
    );

    useEffect(() => {
        // changeNavigationBarColor(Colors.bottomNavBarColor, false, true);  // Change to your desired color
    }, []);

    function onChangeUsername(u) {
        setUsername(u)
    }

    function onChangeName(u) {
        setName(u)
    }

    function onChangePassword(p) {
        setPassword(p)
    }

    function isValidUsername(username) {
        // Check if the username is at least 6 characters long
        if (username.length < 6) {
            return false;
        }

        // Check if the username contains any spaces or line endings
        if (/\s/.test(username)) {
            return false;
        }

        return true;
    }


    function onSignIn() {
        if (username.length < 6) {
            setError(strings.err_username_len)
            return
        }
        if (!isValidUsername(username)) {
            setError(strings.err_username)
            return
        }

        if (name.length < 2) {
            setError(strings.err_name_len)
            return
        }

        if (password.length < 6) {
            setError(strings.err_password_len)
            return
        }
        if (!isValidUsername(password)) {
            setError(strings.err_password)
            return
        }

        setError(null)
        const requestOptions = {
            method: 'POST',
            headers: { 'Authentication': authManager.getToken() },
            body: JSON.stringify({
                username: username,
                name: name,
                password: password
            })
        };
        return fetch(`${SERVER_BASE_URL}/api/v1/link/username`, requestOptions)
            .then(response => {
                if (response.status == 200)
                    return response.text()

                if (response.status == 403) {
                    setError(strings.err_user_exists)
                }
                return null
            })
            .then((token) => {
                if (!token) return

                AsyncStorage.setItem(
                    'token',
                    token,
                ).then((d) => {
                    authManager.getMe(token)
                        ?.then((me) => {
                            authManager.setMe(me)
                            authManager.setToken(token)
                            if (navigation) {
                                navigation.replace('Profile', {
                                    globalPage: 1,
                                    routeSelectedLeague: -1,
                                    selectedStat: ESTAT_TOTAL,
                                    tab: ETAB_PREDICTS
                                });
                            }
                        })

                })
                    .catch((err) => {
                        console.log(err)
                    });
            })
    }

    function onNavLogin() {
        navigation.navigate('Login')
    }

    const handleSignIn = async () => {
        setGoogleError(null)

        gsingin.link(navigation, (me) => {
            if (!me) setGoogleError(strings.err_user_exists)
        })
    };
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView style={{
            flex: 1, backgroundColor: Colors.bgColor,
        }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'android' ? -insets.bottom : 0}
            >
                <View style={{
                    height: insets.top,
                    backgroundColor: Colors.gray800,
                }} />
                <StatusBar
                    barStyle={Colors.statusBar}
                    backgroundColor={Colors.bgColor}
                />

                <ScrollView
                    // onContentSizeChange={(w, h) => { setScrollWidth(w), setScrollHeight(h) }}
                    contentInsetAdjustmentBehavior="automatic"
                    contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundColor: Colors.bgColor,
                        // minHeight: '100%',
                        paddingBottom: 50
                    }}
                    style={{
                        flex: 1,
                    }}>

                    <AppBar showLogo={false} navigation={navigation} />

                    <View style={{
                        width: '100%',
                        // height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop: 30,
                    }}>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // marginBottom: 10
                        }}>
                            <Text style={{
                                fontSize: 34,
                                color: Colors.titleColor,
                                fontFamily: 'Poppins-Bold'
                            }}>el Torneo</Text>
                        </View>

                        <Text style={{
                            color: '#8E8E93',
                            fontSize: 16,
                            // fontWeight: 'bold',
                            textAlign: 'center',
                            marginTop: 0,
                            width: '80%',
                            minWidth: 320,
                            marginBottom: 20
                        }}>
                            {strings.login_desc}
                        </Text>

                        <TouchableOpacity onPress={handleSignIn} activeOpacity={.8} style={{
                            width: 320,
                            height: 52,
                            marginTop: 10,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            borderWidth: 2,
                            borderColor: Colors.borderColor
                            // backgroundColor: '#FF2882',
                        }}>
                            <Text style={{
                                fontSize: 18,
                                color: Colors.titleColor,
                                fontFamily: 'Poppins-Bold',
                                lineHeight: 28,
                                // fontWeight: 'bold'
                            }}>
                                {strings.complete_account}
                            </Text>
                            <View style={{
                                width: 40,
                                height: 40,
                                position: 'absolute',
                                right: 5,
                                // backgroundColor: 'white',
                                borderRadius: 30,
                                // marginTop: 20,
                                // borderWidth: 3,
                                borderColor: 'black',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <GoogleIcon width={32} height={32} />
                            </View>
                        </TouchableOpacity>

                        {googleError ? <View style={{
                            marginTop: 20,
                            marginBottom: -10,
                            width: 320,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                color: '#FF4747'
                            }}>{googleError}</Text>
                        </View> : null}

                        <View style={{
                            width: 280,
                            marginTop: 30,
                            flexDirection: 'row',
                            // backgroundColor: 'red',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                flex: 1,
                                height: 2,
                                backgroundColor: Colors.borderColor
                            }}></View>
                            <Text style={{
                                fontSize: 16,
                                color: Colors.titleColor,
                                fontWeight: 'bold',
                                marginLeft: 20,
                                marginRight: 20
                            }}>{strings.or}</Text>
                            <View style={{
                                flex: 1,
                                height: 2,
                                backgroundColor: Colors.borderColor
                            }}></View>
                        </View>


                        <Text style={{
                            width: 320,
                            marginTop: 20,
                            color: Colors.titleColor,
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 4
                        }}>{strings.username}</Text>
                        <TextInput value={username} onChangeText={onChangeUsername} style={{
                            width: 320,
                            height: 52,
                            color: Colors.titleColor,
                            borderColor: Colors.borderColor,
                            borderWidth: 2,
                            borderRadius: 26,
                            paddingLeft: 23
                        }}></TextInput>

                        <Text style={{
                            width: 320,
                            marginTop: 20,
                            color: Colors.titleColor,
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 4
                        }}>{strings.name}</Text>
                        <TextInput value={name} onChangeText={onChangeName} style={{
                            width: 320,
                            height: 52,
                            borderColor: Colors.borderColor,
                            borderWidth: 2,
                            color: Colors.titleColor,
                            borderRadius: 26,
                            paddingLeft: 23
                        }}></TextInput>

                        <Text style={{
                            width: 320,
                            marginTop: 20,
                            color: Colors.titleColor,
                            fontWeight: 'bold',
                            fontSize: 16,
                            marginBottom: 4
                        }}>{strings.password}</Text>

                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TextInput value={password} onChangeText={onChangePassword} secureTextEntry={!showPass} style={{
                                width: 320,
                                height: 52,
                                borderColor: Colors.borderColor,
                                borderWidth: 2,
                                color: Colors.titleColor,
                                // backgroundColor: Colors.gray800,
                                borderRadius: 26,
                                paddingLeft: 23
                            }}>
                            </TextInput>
                            <TouchableOpacity onPress={() => { setShowPass(!showPass) }} style={{
                                position: 'absolute',
                                bottom: 14,
                                right: 15
                            }}>
                                <Icon name={'eye'} color={Colors.titleColor} size={24} style={{

                                }}></Icon>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            marginTop: 20,
                            marginBottom: 20,
                            width: 320,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                color: '#FF4747'
                            }}>{error}</Text>
                        </View>

                        <TouchableOpacity onPress={onSignIn} activeOpacity={.8} style={{
                            height: 46,
                            width: 320,
                            borderRadius: 26,
                            backgroundColor: Colors.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            // marginTop: 40
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: 'white',
                                fontFamily: 'Poppins-Bold',
                                lineHeight: 28,
                            }}>
                                {strings.complete_account}
                            </Text>
                        </TouchableOpacity>

                        <View style={{
                            marginTop: 20,
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: Colors.titleColor
                            }}>{strings.already_have_acc}</Text>
                            <TouchableOpacity onPress={onNavLogin} style={{
                                marginLeft: 5
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: Colors.primary
                                }}>{strings.signin}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
                <BottomNavBar navigation={navigation} />
                <View style={{
                    height: insets.bottom,
                    backgroundColor: Colors.gray800,
                }} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "94%",
        height: 50,
        backgroundColor: 'black',
        borderLeftWidth: 3,
        marginTop: 20,
        borderLeftColor: '#ff004a',
        justifyContent: 'center',
        paddingLeft: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Open Sans'
    }
});

export default LinkAccountPage;
