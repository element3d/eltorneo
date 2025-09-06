import { ActivityIndicator, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native"
import dataManager from "./DataManager"
import AwardsPanelBeatBet from "./AwardsPanelBeatBet"
import WinnerPanel from "./WinnerPanel"
import NativeAdComp from "./NativeAdComp"
import Colors from "./Colors"
import strings from "./Strings"
import Icon from 'react-native-vector-icons/FontAwesome5';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import authManager from "./AuthManager"
import FirstIcon from './assets/Fireball.svg';
import FirstIcon2 from './assets/first2.svg';

import { ESTAT_TOTAL, ETAB_PREDICTS } from "./ProfilePage"
import AwardsPanelFireball from "./AwardsPanelFireball"
import { EGAME_FIREBALL } from "./GamepadMenu"

const league1Img = require('./assets/Fireball_banner.png')

export default function TablesFireballPagePanel({ navigation,
    me,
    table,
    tableLoading,
    page,
    season,
    setSeason,
    league,
    showPrev,
    showNext,
    onNext,
    onPrev,
    blockForAd,
    onUnlock,
    adLoaded }) {

    const settings = dataManager.getSettings()

    function onNavAwardsInfo() {
        navigation.navigate({
            name: 'FireballInfo',
            params: {
                league: league
            },
            key: `fireball_info_${league}`
        })
    }

    function onMyPosition() {
        const page = Math.ceil(me.position / 20);
        navigation.navigate({ name: 'BeatBetTables', params: { page: page, league: me.league, season: season }, key: `${page}_${league}_${season}` })
    }

    function onLeague1() {
        navigation.navigate({ name: 'BeatBetTables', params: { page: 1, league: 1, season: season }, key: `${1}_${league}_${season}` })
    }

    function onLeague2() {
        navigation.navigate({ name: 'BeatBetTables', params: { page: 1, league: 2, season: season }, key: `${1}_${league}_${season}` })
    }

    function onLeague3() {
        navigation.navigate({ name: 'BeatBetTables', params: { page: 1, league: 3, season: season }, key: `${1}_${league}_${season}` })
    }

    function onLeague4() {
        navigation.navigate({ name: 'BeatBetTables', params: { page: 1, league: 4, season: season }, key: `${1}_${league}_${season}` })
    }

    function onMoveToLeague() {
        navigation.navigate("MoveToLeague")
    }

    // function onPrev() {
    //     navigation.navigate({ name: 'BeatBetTables', params: { page: page - 1, league: league, season: season }, key: `${page - 1}_${league}_${season}` })
    // }

    // function onNext() {
    //     navigation.navigate({ name: 'BeatBetTables', params: { page: page + 1, league: league, season: season }, key: `${page + 1}_${league}_${season}` })
    // }

    function onNavUser(u) {
        u.points = u.predictions

        authManager.setActiveUser(u)

        navigation.navigate({
            name: 'Profile',
            params: {
                id: u.id,
                globalPage: 1,
                selectedStat: ESTAT_TOTAL,
                tab: ETAB_PREDICTS
            },
            key: `profile_${u.id}_${ETAB_PREDICTS}`
        })
    }

    function getIcon(index) {
        let i = index
        i = index + 20 * (page - 1)
        if (i == 0) {
            return <View style={{
                width: 40,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {league == 1 ? <FirstIcon width={28} height={28} style={{
                    // marginLeft: 6
                }}></FirstIcon> : <FirstIcon2 width={24} height={24} style={{
                    marginLeft: 6
                }}></FirstIcon2>}
            </View>
        }

        return <Text style={{
            width: 40,
            color: Colors.titleColor,
            fontWeight: 'bold',
            textAlign: 'center'
        }}>{i + 1}</Text>
    }

    function renderTable() {
        return table?.map((u, i) => {
            return (
                <TouchableOpacity activeOpacity={.8} onPress={() => { onNavUser(u) }} key={`player_${i}`} style={{
                    width: '100%',
                    height: 52,

                    backgroundColor: authManager.getMeSync() && authManager.getMeSync().id == u.id ? Colors.gray800 : 'transparent',
                    flexDirection: 'row',
                    // backgroundColor: 'blue',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {getIcon(i)}
                    <Text numberOfLines={1} style={{
                        // width: '90%',
                        flex: 1,
                        color: authManager.getMeSync() && authManager.getMeSync().id == u.id ? Colors.primary : Colors.titleColor,
                        fontWeight: 'bold',
                        // textAlign: 'flex-start',
                        paddingLeft: 10
                    }}>{u.name}</Text>
                    <Text style={{
                        width: 50,
                        color: Colors.titleColor,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>{u.totalPredictions}</Text>
                    <Text style={{
                        width: 60,
                        // backgroundColor: 'red',
                        color: Colors.titleColor,
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>{u.fireballPoints}</Text>
                </TouchableOpacity>
            )
        })
    }

    return <View style={{
        width: '100%',
        flexDirection: 'column'
    }}>
        <View style={{
            padding: 20,
            marginTop: 10,
            paddingVertical: 10,
            marginBottom: 10,
        }}>
            <TouchableOpacity activeOpacity={.9} onPress={onNavAwardsInfo} style={{
                borderRadius: 20,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                height: 180,
                overflow: 'hidden'
            }}>
                <ImageBackground width={200} height={200} source={league1Img} style={{

                    width: '100%',
                    height: 180,
                    borderRadius: 20,
                    // marginBottom: 20
                }}>
                    {!settings?.season || settings?.season == season ? <AwardsPanelFireball onReadMore={onNavAwardsInfo} league={league} season={season} />
                        : <WinnerPanel winner={table ? table[0] : null} season={season} league={league}></WinnerPanel>}
                </ImageBackground>
            </TouchableOpacity>
        </View>

        {dataManager.getSettings().enableAds ? <View style={{
            width: '100%',
            paddingHorizontal: 20
        }}>
            <NativeAdComp forceNativeAd={true} />
        </View> : null}

        <ScrollView style={{
            marginBottom: 15,
        }}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
                flexDirection: 'row',
                paddingRight: 40
            }}>
            {/* {me?.position > 0 && (!settings?.season || settings?.season == season) ? <TouchableOpacity activeOpacity={.6} onPress={() => { onMyPosition() }} style={{
                marginLeft: 20,
                marginRight: 10,
                // paddingHorizontal: 20,
                height: 40,
                width: 40,
                backgroundColor: Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                // flex: 1,
                justifyContent: 'center'
              }}>

                <Text style={{
                  fontWeight: 'bold',
                  color: Colors.titleColor
                }}><Icon name='crosshairs' size={22}></Icon></Text>

              </TouchableOpacity> : null} */}

            <TouchableOpacity activeOpacity={.6} onPress={() => { onLeague1() }} style={{
                marginLeft: 20,//me?.position > 0 && (!settings?.season || settings?.season == season) ? 0 : 20,
                marginRight: 10,
                paddingHorizontal: 20,
                height: 40,
                backgroundColor: league == 1 ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                // flex: 1,
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: league == 1 ? 'white' : Colors.titleColor
                }}>{strings.legend}</Text>
                {me?.league == 1 ? <Text style={{
                    fontSize: 8,
                    fontWeight: 'bold',
                    lineHeight: 10,
                    color: league == 1 ? 'white' : Colors.titleColor
                }}>{strings.your_league}</Text> : null}
            </TouchableOpacity>

            {/* {settings.numLevels >= 2 || settings?.season != season ? <TouchableOpacity activeOpacity={.6} onPress={() => { onLeague2() }} style={{
                marginRight: 10,
                paddingHorizontal: 20,
                height: 40,
                backgroundColor: league == 2 ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: league == 2 ? 'white' : Colors.titleColor
                }}>{strings.pro}</Text>
                {me?.league == 2 ? <Text style={{
                    fontSize: 8,
                    fontWeight: 'bold',
                    lineHeight: 10,
                    color: league == 2 ? 'white' : Colors.titleColor
                }}>{strings.your_league}</Text> : null}
            </TouchableOpacity> : null}

            {settings.numLevels >= 3 || settings?.season != season ? <TouchableOpacity activeOpacity={.6} onPress={() => { onLeague3() }} style={{
                marginRight: 10,
                paddingHorizontal: 20,
                height: 40,
                backgroundColor: league == 3 ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: league == 3 ? 'white' : Colors.titleColor
                }}>{strings.amateur}</Text>
                {me?.league == 3 ? <Text style={{
                    fontSize: 8,
                    fontWeight: 'bold',
                    lineHeight: 10,
                    color: league == 3 ? 'white' : Colors.titleColor
                }}>{strings.your_league}</Text> : null}
            </TouchableOpacity> : null}

            {settings.numLevels >= 4 || settings?.season != season ? <TouchableOpacity activeOpacity={.6} onPress={() => { onLeague4() }} style={{
                marginRight: 10,
                paddingHorizontal: 20,
                height: 40,
                backgroundColor: league == 4 ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: league == 4 ? 'white' : Colors.titleColor
                }}>{strings.beginner}</Text>
                {me?.league == 4 ? <Text style={{
                    fontSize: 8,
                    fontWeight: 'bold',
                    lineHeight: 10,
                    color: league == 4 ? 'white' : Colors.titleColor
                }}>{strings.your_league}</Text> : null}
            </TouchableOpacity> : null} */}

            <TouchableOpacity onPress={onMoveToLeague} style={{
                width: 40,
                height: 40,
                backgroundColor: Colors.gray800,
                borderWidth: 1,
                borderColor: Colors.borderColor,
                borderRadius: 20,
                alignItems: 'center',
                // flex: 1,
                justifyContent: 'center'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}><Icon name='info' size={18}></Icon></Text>
            </TouchableOpacity>
        </ScrollView>

        {!blockForAd || !authManager.getMeSync() ? <View style={{
            width: '100%',
            padding: 15,
            paddingHorizontal: 20,
            paddingTop: 0,
            // marginTop: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <View style={{
                width: '100%',
                height: 52,
                backgroundColor: Colors.gray800,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    width: 40,
                    color: Colors.titleColor,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }}>Pos</Text>
                <Text style={{
                    // width: '90%',
                    flex: 1,
                    color: Colors.titleColor,
                    fontWeight: 'bold',
                    paddingLeft: 10
                }}>{strings.player}</Text>
                <Text style={{
                    width: 50,
                    color: Colors.titleColor,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>Tp</Text>
                <Text style={{
                    width: 60,
                    color: Colors.titleColor,
                    fontWeight: 'bold',
                    textAlign: 'center',
                }}>{"Pts"}</Text>
            </View>

            {tableLoading ? <ActivityIndicator size={'large'} color={'#FF2882'} style={{ marginTop: 20 }} />
                :
                <View style={{
                    width: '100%',
                }}>
                    {renderTable()}

                    {settings?.season == season ? <View style={{
                        height: 50,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {showPrev ? <TouchableOpacity onPress={onPrev} activeOpacity={.6} style={{
                            flex: 1,
                            marginRight: 10,
                            alignItems: showNext ? 'flex-end' : 'center'
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#FF2882'
                            }}>{`< ${strings.prev}`}</Text>
                        </TouchableOpacity> : null}

                        {showNext ? <TouchableOpacity onPress={onNext} activeOpacity={.6} style={{
                            flex: 1,
                            marginLeft: 10,
                            alignItems: showPrev ? 'flex-start' : 'center',
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: '#FF2882'
                            }}>{strings.next} ></Text>
                        </TouchableOpacity> : null}
                    </View> : null}
                    {/* { dataManager.getSettings().enableAds ? <View style={{
                    width: '100%',
                    marginTop: 10,
                    // paddingHorizontal: 20,
                  }}>
                    <NativeAdComp />
                  </View> : null } */}
                </View>}
        </View>
            : <View style={{
                height: 40,
                alignItems: 'center',
                justifyContent: 'flex-start',
            }}>
                <TouchableOpacity onPress={onUnlock} disabled={!adLoaded} activeOpacity={.8} style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    height: 24,
                    opacity: adLoaded ? 1 : .8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: '#FF2882'
                }} >
                    <Text style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 12,
                    }}>{strings.unlock_table}</Text>
                    {adLoaded ? <MDIcon name='play-circle-filled' size={18} color='white' style={{
                        marginLeft: 4
                    }} /> : <ActivityIndicator size={'small'} color={'white'} style={{
                        marginLeft: 6
                    }} />}
                </TouchableOpacity>
            </View>}
    </View>
}