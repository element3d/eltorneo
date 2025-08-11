import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

export default function FairPlayDialog({ onClose }) {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const dialogOpacity = useRef(new Animated.Value(0)).current;
    const bgOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(bgOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 50,
                stiffness: 2120,
            }),
            Animated.timing(dialogOpacity, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

    }, []);

    return (
        <Animated.View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: bgOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["transparent", "#00000066"],
                }),
            }}
        >
            <TouchableWithoutFeedback>
                <View style={{ position: "absolute", width: "100%", height: "100%" }} />
            </TouchableWithoutFeedback>

            <Animated.View
                style={{
                    width: 320,
                    height: 180,
                    borderRadius: 30,
                    backgroundColor: Colors.gray800,
                    transform: [{ scale: scaleAnim }],
                    opacity: dialogOpacity,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        padding: 20,
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            color: Colors.titleColor,
                            fontWeight: "bold",
                            fontSize: 24,
                        }}
                    >
                        {"Fair Play"}
                    </Text>
                    <Text
                        style={{
                            marginTop: 10,
                            color: "#8E8E93",
                            fontWeight: 'bold',
                            textAlign: "center",
                            fontSize: 14,
                        }}
                    >
                        {strings.fair_play}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        // backgroundColor: 'red',
                        height: 55,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onClose}
                        style={{
                            backgroundColor: "#FF2882",
                            alignItems: "center",
                            height: 30,
                            borderRadius: 20,
                            width: "40%",
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "bold" }}>{strings.close}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Animated.View>
    );
}
