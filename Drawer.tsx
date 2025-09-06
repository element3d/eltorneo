import { Animated, BackHandler, Easing, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import HomeIcon from './assets/profile.svg';
import CalendarIcon from './assets/cal.svg';
import BBIcon from './assets/bbicon.svg';
import FireballIcon from './assets/Fireball.svg';
import SunIcon from './assets/sun.svg';
import MoonIcon from './assets/moon-gray.svg';
import FAIcon from 'react-native-vector-icons/Fontisto';
import TrophyIcon from './assets/first.svg'
import authManager from "./AuthManager";
import strings from "./Strings";
import SupportPanel from "./SupportPanel";
import { useEffect } from "react";
import dataManager from "./DataManager";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from "./GamepadMenu";

export default function Drawer({ onClose, navigation, setMode }) {
    const drawerAnimation = new Animated.Value(-300); // Initial off-screen position
    const backgroundAlpha = new Animated.Value(0); // Directly animate background alpha
    const speed = 150;

    useEffect(() => {
        const backAction = () => {
            onCloseInternal()
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        // Open drawer with animation
        Animated.parallel([
            Animated.timing(drawerAnimation, {
                toValue: 0, // Slide in
                duration: speed,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true, // Native driver for transform
            }),
            Animated.timing(backgroundAlpha, {
                toValue: 0.5, // Fade in background alpha
                duration: speed,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false, // We need to disable native driver for color changes
            }),
        ]).start();
    }, []);

    function onCloseInternal() {
        Animated.parallel([
            Animated.timing(drawerAnimation, {
                toValue: -300, // Slide off-screen
                duration: speed,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true, // Native driver for transform
            }),
            Animated.timing(backgroundAlpha, {
                toValue: 0, // Fade out background alpha
                duration: speed,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false, // We need to disable native driver for color changes
            }),
        ]).start(() => {
            // Perform actions after the animation completes
            onClose(); // Callback to handle closing logic
        });
    }

    function onNavLang() {
        onClose()
        navigation.navigate({ name: "Langs", key: strings.getLanguage() })
    }

    function onNavThemes() {
        navigation.navigate({ name: "Themes", key: "Themes" })
    }

    function onNavHome() {
        navigation.navigate("Profile")
    }

    function onNavCalendar() {
        onClose()
        navigation.navigate("Calendar")
    }

    function onNavElTorneo() {
        onClose()
        const me = authManager.getMeSync()
        navigation.navigate({ name: 'Tables', params: { page: 1, routeGame: dataManager.getSettings().game, league: me && me.league ? me.league : 1, season: dataManager.getSettings() ? dataManager.getSettings().season : '25/26' }, key: "tables" })
    }

    function onNavBeatBet() {
        onClose()
        const me = authManager.getMeSync()
        navigation.navigate({ name: 'Tables', params: { page: 1, routeGame: dataManager.getSettings().game, league: me && me.league ? me.league : 1, season: dataManager.getSettings() ? dataManager.getSettings().season : '25/26' }, key: "tables" })
    }

    function onNavFireball() {
        onClose()
        const me = authManager.getMeSync()
        navigation.navigate({ name: 'Tables', params: { page: 1, routeGame: dataManager.getSettings().game, league: me && me.league ? me.league : 1, season: dataManager.getSettings() ? dataManager.getSettings().season : '25/26' }, key: "tables" })
    }

    function onNavTrailers() {
        onClose()
        navigation.navigate("Trailers")
    }

    function onSetMode() {
        Colors.swap()
        setMode(Colors.mode)
        changeNavigationBarColor(Colors.bottomNavBarColor, true);  // Change to your desired color

    }

    return <Animated.View style={{
        position: 'absolute',
        width: '100%',
        flex: 1,
        height: '100%',
        // opacity: backgroundOpacity,
        // top: 80,
        backgroundColor: backgroundAlpha.interpolate({
            inputRange: [0, 0.5],
            outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'], // Fade in/out background color
        }),
        flexDirection: 'row'
    }}>
        <Animated.View style={{
            backgroundColor: Colors.gray800,
            width: 300,
            padding: 20,
            paddingTop: 30,
            paddingLeft: 10,
            height: '100%',
            transform: [{ translateX: drawerAnimation }]
        }}>
            <Text style={{
                fontSize: 22,
                marginLeft: 10,
                fontFamily: 'Poppins-Bold',
                color: Colors.titleColor,
                marginBottom: 20
            }}>el Torneo</Text>

            {/* <TouchableOpacity activeOpacity={.6} onPress={onNavHome} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <HomeIcon width={40} style={{
                    marginLeft: -10
                }} />
                <Text style={{
                    fontSize: 16,
                    marginLeft: 4,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{strings.home_page}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity activeOpacity={.6} onPress={onNavCalendar} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <CalendarIcon width={40} style={{
                    marginLeft: -10
                }} />
                <Text style={{
                    fontSize: 16,
                    marginLeft: 4,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{strings.calendar_page}</Text>
            </TouchableOpacity>

            { dataManager.getSettings().game == EGAME_ELTORNEO ? <TouchableOpacity activeOpacity={.6} onPress={onNavElTorneo} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <TrophyIcon width={22} style={{
                    // marginLeft: -10
                }} />
                <Text style={{
                    marginLeft: 12,
                    fontSize: 16,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>el Torneo</Text>
            </TouchableOpacity> : null }

            { dataManager.getSettings().game == EGAME_BEATBET ? <TouchableOpacity activeOpacity={.6} onPress={onNavBeatBet} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <BBIcon width={28} style={{
                    marginLeft: -2
                }} />
                <Text style={{
                    marginLeft: 8,
                    fontSize: 16,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>Beat Bet</Text>
            </TouchableOpacity> : null }

             { dataManager.getSettings().game == EGAME_FIREBALL ? <TouchableOpacity activeOpacity={.6} onPress={onNavFireball} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <FireballIcon width={25} style={{
                    marginLeft: -5,
                    marginRight: 6,
                }} />
                <Text style={{
                    marginLeft: 8,
                    fontSize: 16,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>Fireball</Text>
            </TouchableOpacity> : null }


            <TouchableOpacity activeOpacity={.6} onPress={onNavTrailers} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <FAIcon name={'film'} color='gold' size={24} style={{
                    // marginLeft: -10
                }} />
                <Text style={{
                    marginLeft: 10,
                    fontSize: 16,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{strings.trailers_page}</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity activeOpacity={.8} onPress={onNavBeatBet} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                // paddingLeft: -20,
                borderRadius: 8,
                backgroundColor: '#37003C'
            }}>
                <BBIcon width={30} style={{
                    marginLeft: 8
                }} />
                <Text style={{
                    fontSize: 16,
                    color: 'white',
                    lineHeight: 22,
                    marginLeft: 8,
                    fontFamily: 'Poppins-Bold'
                }}>Beat Bet</Text>
            </TouchableOpacity> */}

            <Text style={{
                marginTop: 50,
                fontSize: 16,
                fontWeight: 'bold',
                marginLeft: 10,
                color: '#8E8E93'
            }}>{strings.settings}</Text>
            <TouchableOpacity activeOpacity={.6} onPress={onSetMode} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10,
                marginTop: 10
                // backgroundColor: 'red'
            }}>
                {Colors.mode == 1 ? <MoonIcon width={40} style={{
                    marginLeft: -10,
                }} /> : <SunIcon width={26} style={{
                    marginLeft: -4,
                    marginRight: 8
                }} />}
                <Text style={{
                    fontSize: 16,
                    marginLeft: 2,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{Colors.mode == 1 ? strings.dark_mode : strings.light_mode}</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={.6} onPress={onNavLang} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <Text style={{
                    width: 34,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#8E8E93'
                }}>{strings.getLanguage().toUpperCase()}</Text>
                <Text style={{
                    fontSize: 16,
                    // marginLeft: 4,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{strings.language_page}</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity activeOpacity={.6} onPress={onNavThemes} style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 50,
                paddingLeft: 10
                // backgroundColor: 'red'
            }}>
                <Text style={{
                    width: 34,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#8E8E93'
                }}>{strings.getLanguage().toUpperCase()}</Text>
                <Text style={{
                    fontSize: 16,
                    // marginLeft: 4,
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{'Theme'}</Text>
            </TouchableOpacity> */}

            <View style={{
                marginTop: 'auto'
            }}></View>
            <SupportPanel />
        </Animated.View>
        <TouchableOpacity onPress={onCloseInternal} style={{
            width: '30%',
            height: '100%',
        }}></TouchableOpacity>

    </Animated.View>
}