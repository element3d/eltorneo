import { Animated, BackHandler, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import { useEffect } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import dataManager from "./DataManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import strings from "./Strings";

export const EGAME_ELTORNEO = 'eltorneo';
export const EGAME_BEATBET = 'beatbet';
export const EGAME_FIREBALL = 'fireball';

export default function GamepadMenu({ onClose, onChangeGame }) {
    const drawerAnimation = new Animated.Value(400); // Initial off-screen position
    const backgroundAlpha = new Animated.Value(0); // Directly animate background alpha
    const speed = 250;

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
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true, // Native driver for transform
            }),
            Animated.timing(backgroundAlpha, {
                toValue: 1, // Fade in background alpha
                duration: speed,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true, // We need to disable native driver for color changes
            }),
        ]).start();
    }, []);

    function onCloseInternal() {
        Animated.parallel([
            Animated.timing(drawerAnimation, {
                toValue: 400, // Slide off-screen
                duration: speed,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true, // Native driver for transform
            }),
            Animated.timing(backgroundAlpha, {
                toValue: 0, // Fade out background alpha
                duration: speed,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true, // We need to disable native driver for color changes
            }),
        ]).start(() => {
            // Perform actions after the animation completes
            onClose(); // Callback to handle closing logic
        });
    }

    function onChangeGameInternal(newGame) {
        if (dataManager.getSettings().game == newGame) return;

        AsyncStorage.setItem('game', newGame);
        dataManager.getSettings().game = newGame;
        onChangeGame(newGame)
        onCloseInternal()
    }

    const game = dataManager.getSettings().game;

    return <Animated.View style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        bottom: 0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    }}>
        <TouchableOpacity onPress={onCloseInternal} style={{
            width: '100%',
            height: '100%',
            zIndex: 1
        }}></TouchableOpacity>
        <Animated.View style={{
            width: '100%',
            height: 400,
            zIndex: 1,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            alignItems: 'center',
            paddingTop: 20,
            backgroundColor: Colors.gray800,
            transform: [{ translateY: drawerAnimation }]
        }}>
            <Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold',
                fontSize: 20,
            }}>{strings.select_game}</Text>
            <View style={{
                flexDirection: 'row',
                padding: 20,
                justifyContent: 'space-between',
            }}>
                {/* El Torneo */}
                <TouchableOpacity onPress={() => onChangeGameInternal(EGAME_ELTORNEO)} activeOpacity={.8} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
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
                        color: game == EGAME_ELTORNEO ? Colors.primary : Colors.titleColor,
                    }}>el Torneo</Text>
                </TouchableOpacity>

                {/* Beat Bet */}
                <TouchableOpacity onPress={() => onChangeGameInternal(EGAME_BEATBET)} activeOpacity={.8} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
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
                        color: game == EGAME_BEATBET ? Colors.primary : Colors.titleColor,
                    }}>Beat Bet</Text>
                </TouchableOpacity>

                {/* Fireball */}
                <TouchableOpacity onPress={() => onChangeGameInternal(EGAME_FIREBALL)}  activeOpacity={.8} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
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
                    </View>
                    <Text style={{
                        fontSize: 16,
                        marginTop: 6,
                        fontWeight: 'bold',
                        color: game == EGAME_FIREBALL ? Colors.primary : Colors.titleColor,
                    }}>Fireball</Text>
                </TouchableOpacity>
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 20,
                paddingTop: 0
            }}>
                <TouchableOpacity onPress={() => { }} activeOpacity={.8} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
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
                        <Image source={require('./assets/heroes.png')} style={{
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
                    }}>Heroes</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => { }} activeOpacity={.8} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
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

                {/* empty */}
                <View style={{
                    flex: 1,
                    opacity: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 10,
                }}>
                </View>
            </View>
        </Animated.View>

        <Animated.View style={{
            position: 'absolute',
            bottom: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#00000088',
            opacity: backgroundAlpha
        }}>

        </Animated.View>
    </Animated.View>
}