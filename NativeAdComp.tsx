import NativeAdView, { NativeMediaView, HeadlineView, TaglineView, AdManager, ImageView, AdvertiserView, PriceView, StoreView, StarRatingView, IconView, CallToActionView } from "react-native-admob-native-ads";
import AdMobIcon from './assets/admob.svg'
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Colors from "./Colors";
import strings from "./Strings";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import dataManager from "./DataManager";

const NativeAdComp = (({ forceNativeAd = false }) => {

    if (!dataManager.getSettings().enableNativeAds || !dataManager.getSettings().enableAds) {
        return <View></View>
    }


    // const nativeAdViewRef = useRef();
    const [loading, setLoading] = useState(false)
    const [failed, setFailed] = useState(false)

    useEffect(() => {

        setLoading(false)

        // if (nativeAdViewRef.current) {
        //     setLoading(true)
        //     nativeAdViewRef.current.loadAd();
        // } else if (dataManager.getSettings().bannerType == 2 && !forceNativeAd) 
            {
            setLoading(true)
        }
    }, []);

    const adLoaded = () => {
        setLoading(false)
        setFailed(false)
    };

    function onBannerLoaded() {
        setLoading(false)
        setFailed(false)
    }

    function onBannerFail() {
        setLoading(false)
        setFailed(true)
    }

    const adFailedToLoad = (error) => {
        // console.error("Ad failed to load:", error);
        setLoading(false)
        setFailed(true)
    };

    if (failed) {
        return (<View></View>)
    }

    return (
        <View style={{
            width: '100%',
            marginBottom: 20,
        }}>
            <View style={{
                marginBottom: 8,
                flexDirection: 'row'
            }}>
                {loading ? <ActivityIndicator color={'#FF2882'} style={{
                    width: 20,
                    height: 20,
                }} size={'small'} /> :
                    <AdMobIcon style={{
                        width: 20,
                        height: 20,
                    }} />
                }
                <Text style={{
                    color: Colors.titleColor,
                    fontWeight: 'bold',
                    marginLeft: 10,
                }}>{strings.sponsor}</Text>
            </View>
            {dataManager.getSettings().bannerType == 1 || forceNativeAd == true ?
                // <NativeAdView
                //     ref={nativeAdViewRef}
                //     onAdLoaded={adLoaded}
                //     onAdFailedToLoad={adFailedToLoad}
                //     requestNonPersonalizedAdsOnly={true}
                //     // enableSwipeGestureOptions={{
                //     //     tapsAllowed: true,
                //     //     swipeGestureDirection: 'up',
                //     // }}
                //     // repository="imageAd"

                //     adUnitID="ca-app-pub-7041403371220271/1149907129" // Test Ad Unit ID "ca-app-pub-3940256099942544/2247696110"
                //     style={{
                //         width: '100%',
                //         minHeight: 130,
                //         // backgroundColor: Colors.gray800,
                //         // borderRadius: 16,
                //         // overflow: 'hidden'
                //         // backgroundColor: 'red'
                //     }}
                // >

                //     <View style={{
                //         backgroundColor: Colors.gray800,
                //         paddingHorizontal: 10,
                //         padding: 12,
                //         // paddingBottom: 20,
                //         width: '100%',
                //         borderRadius: 16,
                //     }}>
                //         <View style={{
                //             width: '100%',

                //             flexDirection: 'row',
                //         }}>
                //             <View style={{
                //                 borderRadius: 8,
                //                 // backgroundColor: 'white',
                //                 overflow: 'hidden',
                //             }}>
                //                 <IconView
                //                     style={{
                //                         marginRight: 10,
                //                         width: 60,
                //                         height: 60,
                //                     }}
                //                 />
                //             </View>
                //             <View style={{
                //                 // backgroundColor: 'red',
                //                 // width: '100%',
                //                 flexShrink: 1,
                //             }}>
                //                 <HeadlineView style={{
                //                     fontSize: 14,
                //                     fontWeight: 'bold',
                //                     // textAlign: 'center',
                //                     color: Colors.titleColor,
                //                 }} />

                //                 <TaglineView style={{
                //                     fontSize: 14,
                //                     // textAlign: 'center',
                //                     color: '#AEAEB2',
                //                 }} />
                //             </View>
                //             {/* <View style={{
                //         borderRadius: 12,
                //         overflow: 'hidden',
                //         marginTop: 10,
                //         width: '100%',
                //         height: 150,
                //     }}>

                //         <NativeMediaView style={{
                //             width: '100%',
                //             // backgroundColor: 'red',
                //             height: 150, // Adjust height as needed
                //         }} />

                //     </View> */}
                //         </View>
                //         <View style={{
                //             width: '100%',
                //             flexDirection: 'row',
                //             alignItems: 'center',
                //             // justifyContent: 'space-between',
                //             marginTop: 10
                //         }}>

                //             {!loading ? <CallToActionView
                //                 style={[{
                //                     height: 25,

                //                     // paddingHorizontal: 12,
                //                     justifyContent: "center",
                //                     alignItems: "center",
                //                     // elevation: 10,
                //                     // width: '100%',
                //                     // flex: 1,
                //                     width: 150,

                //                 },]}
                //                 buttonAndroidStyle={{
                //                     backgroundColor: "#FF2882",
                //                     borderRadius: 10,
                //                 }}
                //                 allCaps
                //                 textStyle={{
                //                     fontSize: 13,
                //                     flexWrap: "wrap",
                //                     fontWeight: 'bold',
                //                     textAlign: "center",
                //                     color: "white",
                //                 }}
                //             /> : null}
                //             <StarRatingView
                //                 size={24}
                //                 fullIconColor="#FACC15"
                //                 emptyIconColor="gray"
                //                 style={{
                //                     marginBottom: 4,
                //                     width: 65,
                //                     marginLeft: 10,

                //                 }}
                //             />

                //         </View>
                //         {/* <View>
                //         <AdvertiserView
                //             style={{
                //                 fontSize: 10,
                //                 color: "gray",
                //             }}
                //         />
                //         <StoreView
                //             style={{
                //                 fontSize: 12,
                //                 color: "black",
                //             }}
                //         />
                //     </View> */}
                //     </View>
                // </NativeAdView> :
                <View style={{
                    alignItems: 'center',
                    width: '100%',

                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: '100%',
                        //  width: 300,
                        paddingVertical: 20,
                        //  height: 290,
                        // marginBottom: 20,
                        borderRadius: 8,
                        //  alignItems: 'f',
                        overflow: 'hidden',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.gray800
                    }}>
                        <BannerAd unitId='ca-app-pub-7041403371220271/5297891922' size={BannerAdSize.LARGE_BANNER}
                            onAdLoaded={onBannerLoaded}
                            onAdFailedToLoad={onBannerFail}
                            requestOptions={{
                                requestNonPersonalizedAdsOnly: true
                            }} />
                    </View></View>
                :

                <View style={{
                    alignItems: 'center',
                    width: '100%',

                    justifyContent: 'center',
                }}>
                    <View style={{
                        width: '100%',
                        //  width: 300,
                        paddingVertical: 20,
                        //  height: 290,
                        // marginBottom: 20,
                        borderRadius: 8,
                        //  alignItems: 'f',
                        overflow: 'hidden',
                        //  justifyContent: 'center',
                        backgroundColor: Colors.gray800
                    }}>
                        <View style={{
                            width: '100%',
                            height: 250,
                            // marginBottom: 20,
                            // borderRadius: 12,
                            alignItems: 'center',
                            // overflow: 'hidden',
                            justifyContent: 'center',
                            backgroundColor: Colors.gray800
                        }}>
                            <BannerAd unitId='ca-app-pub-7041403371220271/5297891922' size={BannerAdSize.MEDIUM_RECTANGLE}
                                onAdLoaded={onBannerLoaded}
                                onAdFailedToLoad={onBannerFail}
                                requestOptions={{
                                    requestNonPersonalizedAdsOnly: true
                                }} />
                        </View>
                    </View>
                </View>}
        </View>


    )
})

export default NativeAdComp