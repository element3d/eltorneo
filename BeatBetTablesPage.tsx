import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
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
import BottomNavBar, { EPAGE_TABLES } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import LeagueChip from './LeagueChip';
import dataManager from './DataManager';
import strings from './Strings';
import AppBar from './AppBar';
import authManager from './AuthManager';
import { ESTAT_TOTAL, ETAB_BETS, ETAB_PREDICTS } from './ProfilePage';
import CupIcon from './assets/Trophy.svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import GoogleIcon from './assets/google.svg';
import FirstIcon from './assets/bbicon.svg';
import FirstIcon2 from './assets/first2.svg';

import adsManager from './AdsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwardsPanel from './AwardsPanel';
import { useFocusEffect } from '@react-navigation/native';
import Colors from './Colors';
import NativeAdComp from './NativeAdComp';
import gsingin from './GSignin';
import WinnerPanel from './WinnerPanel';
import AwardsPanelBeatBet from './AwardsPanelBeatBet';

const league1Img = require('./assets/bb.png')
const league2Img = require('./assets/second.png')

const ETABLE_GENERAL = 0
const ETABLE_SCORE = 1
const ETABLE_WINNER = 2

function TableCheap({ title, selected, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8} style={{
      height: 40,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 10,
      backgroundColor: selected ? '#FF2882' : Colors.gray800,
      borderColor: selected ? '#FF2882' : Colors.borderColor,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{
        fontSize: 14,
        color: selected ? 'white' : '#8E8E93',
        fontWeight: 'bold'
      }}>{title}</Text>
    </TouchableOpacity>
  )
}

function BeatBetTablesPage({ navigation, route }): JSX.Element {
  const { page, league, season } = route.params;
  const [table, setTable] = useState([])
  const [selectedTable, setSelectedTable] = useState(ETABLE_GENERAL)
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [blockForAd, setBlockForAd] = useState(dataManager.getSettings()?.blockForAd)
  const [adLoaded, setAdLoaded] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [me, setMe] = useState(authManager.getMeSync())
  const [myLeague, setMyLeague] = useState(me?.league || 1)
  // const [season, setSeason] = useState(dataManager.getSettings() ? dataManager.getSettings().season : '25/26')

  const backgroundStyle = {
    backgroundColor: Colors.gray800,
  };

  useEffect(() => {
    getTableByPoints()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      if (authManager.getMeSync()) {
        setMyLeague(authManager.getMeSync().league)
        setMe(authManager.getMeSync())
      }
      if (!adLoaded && !adsManager.isLoaded()) return setBlockForAd(false)

      setBlockForAd(dataManager.getSettings()?.blockForAd)

      return () => {

      };
    }, [])
  );

  useEffect(() => {
    if (!dataManager.getSettings()) return
    if (!dataManager.getSettings().enableAds || !dataManager.getSettings().blockForAd) return

    if (adsManager.isLoaded()) {
      setAdLoaded(true)
    } else {
      adsManager.loadAd()
      const unsub = adsManager.addLoadedListener(() => {
        unsub()
        setAdLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    if (selectedTable == ETABLE_GENERAL) {
      getTableByPoints()
    } else if (selectedTable == ETABLE_SCORE) {
      getTableByScore()
    } else {
      getTableByWinner()
    }
    setTableLoading(true)
  }, [selectedTable, selectedLeague])

  useEffect(() => {
    getTableByPoints()
    setTableLoading(true)
  }, [league])

  function getTableByPoints() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/beat_bet_table?page=${page}&league=${league}&season=${season}`, requestOptions)
      .then(response => {
        if (response.status == 200)
          return response.json()

        setTableLoading(false)
        return null
      })
      .then(data => {
        setTableLoading(false)
        setTable(data)
      });
  }

  function getRate(u) {
    if (selectedTable == ETABLE_GENERAL) return u.predictions
    if (isNaN(Number.parseInt(u.rate))) return 0
    return `${u.predictions}(${Number.parseInt(u.rate)}%)`
  }



  function onNavUser(u) {
    u.points = u.predictions
    // return
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
    if (selectedTable == ETABLE_GENERAL) i = index + 20 * (page - 1)
    if (i == 0) {
      return <View style={{
        width: 40,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {league == 1 ? <FirstIcon width={26} height={26} style={{
          // marginLeft: 6
        }}></FirstIcon> : <FirstIcon2 width={24} height={24} style={{
          marginLeft: 6
        }}></FirstIcon2>}
        {/* <Icon name="trophy" color={'#FFCC00'} size={20}></Icon> */}
      </View>
    }

    // if (i == 1 && selectedTable == ETABLE_GENERAL) {
    //   return <View style={{
    //     width: 50,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    //   }}>
    //     <View style={{
    //       width: 20,
    //       height: 20,
    //       borderRadius: 11,
    //       backgroundColor: 'silver'
    //     }}></View>
    //   </View> 
    // }
    // if (i == 2 && selectedTable == ETABLE_GENERAL) {
    //   return <View style={{
    //     width: 50,
    //     alignItems: 'center',
    //     justifyContent: 'center'
    //   }}>
    //     <View style={{
    //       width: 20,
    //       height: 20,
    //       borderRadius: 11,
    //       backgroundColor: '#cd7f32'
    //     }}></View>
    //   </View> 
    // }

    return <Text style={{
      width: 40,
      color: Colors.titleColor,
      fontWeight: 'bold',
      textAlign: 'center'
    }}>{i + 1}</Text>
  }

  function onSignIn() {
    gsingin.signin(null, () => {
      navigation.navigate('Calendar')
    })
  }

  function onPredict() {
    navigation.navigate('Calendar')
  }

  function getBalanceColor(u) {
    if (u.balance == 0) return Colors.titleColor
    if (u.balance < 0) return Colors.fail
    return Colors.success
  } 

  function renderTable() {
    // if (!table?.length && page == 1 && !tableLoading) {
    //   return (
    //     <View style={{
    //       width: '100%',
    //       alignItems: 'center',
    //       marginTop: 20,
    //       justifyContent: 'center'
    //     }}>
    //       <Text style={{
    //         color: '#8E8E93',
    //         fontWeight: 'bold'
    //       }}>{strings.no_players}</Text>

    //       {!me ? <TouchableOpacity activeOpacity={.8} onPress={onSignIn} style={{
    //         height: 30,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         borderRadius: 15,
    //         marginTop: 10,
    //         flexDirection: 'row',
    //         alignSelf: 'center',
    //         paddingHorizontal: 20,
    //         paddingRight: 5,
    //         marginBottom: 30,
    //         backgroundColor: '#FF2882'
    //       }}>
    //         <Text style={{
    //           fontSize: 16,
    //           lineHeight: 22,
    //           fontWeight: 'bold',
    //           // fontFamily: 'Poppins-Bold',
    //           color: 'white'
    //         }}>{strings.sign_in_to_predict}</Text>
    //         <View style={{
    //           width: 20,
    //           height: 20,
    //           marginLeft: 5,
    //           backgroundColor: 'white',
    //           borderRadius: 10,
    //           alignItems: 'center',
    //           justifyContent: 'center'
    //         }}>
    //           <GoogleIcon style={{
    //             width: 18,
    //             height: 18
    //           }} />
    //         </View>
    //       </TouchableOpacity> : null}
    //       {me?.league == league ? <TouchableOpacity activeOpacity={.8} onPress={onPredict} style={{
    //         height: 30,
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         borderRadius: 15,
    //         flexDirection: 'row',
    //         alignSelf: 'center',
    //         paddingHorizontal: 20,
    //         // paddingRight: 5,
    //         marginTop: 10,
    //         backgroundColor: '#FF2882'
    //       }}>
    //         <Text style={{
    //           fontSize: 16,
    //           lineHeight: 22,
    //           fontWeight: 'bold',
    //           // fontFamily: 'Poppins-Bold',
    //           color: 'white'
    //         }}>{strings.predict}</Text>

    //       </TouchableOpacity> : null}
    //     </View>
    //   )
    // }

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
            color: getBalanceColor(u),
            fontWeight: 'bold',
            textAlign: 'center',
          }}>{u.balance.toFixed(1)}$</Text>
        </TouchableOpacity>
      )
    })
  }

  function onUnlock() {
    adsManager.showAd()

    const successUnsub = adsManager.addSuccessListener(() => {
      successUnsub()
      adsManager.setIsLoaded(false)
      setBlockForAd(false)
      AsyncStorage.setItem("lastAdTime", (new Date()).getTime().toString())
      dataManager.getSettings().blockForAd = false
    })

    const closeUnsub = adsManager.addCloseListener(() => {
      closeUnsub()
      adsManager.setIsLoaded(false)
      adsManager.loadAd()

      setAdLoaded(false)
      const unsub = adsManager.addLoadedListener(() => {
        unsub()
        setAdLoaded(true)
      })
    })
  }

  function onPrev() {
    navigation.navigate({ name: 'BeatBetTables', params: { page: page - 1, league: league, season: season }, key: `${page - 1}_${league}_${season}` })
  }

  function onNext() {
    navigation.navigate({ name: 'BeatBetTables', params: { page: page + 1, league: league, season: season }, key: `${page + 1}_${league}_${season}` })
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

  const onRefresh = () => {
    setRefreshing(false);
    if (blockForAd) return
    getTableByPoints()
    setTableLoading(true)
  };

  function onNavAwardsInfo() {
    navigation.navigate({
      name: 'BeatBetInfo',
      params: {
        league: league
      },
      key: `beat_bet_info_${league}`
    })

    // navigation.navigate('AwardsInfo')
  }

  function setSeason(s) {
    navigation.navigate({ name: 'Tables', params: { page: 1, league: myLeague, season: s }, key: `${1}_${league}_${s}` })
  }

  function onMoveToLeague() {
    navigation.navigate("MoveToLeague")
  }
  const insets = useSafeAreaInsets();

  const showPrev = page != 1
  const showNext = table?.length >= 20
  const settings = dataManager.getSettings()
  return (
    <GestureHandlerRootView style={{
      flex: 1, backgroundColor: Colors.bgColor,
 
    }}>

      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
        <View style={{
          height: insets.top,
          backgroundColor: Colors.gray800,
        }} />
        <StatusBar
          barStyle={Colors.statusBar}

          backgroundColor={backgroundStyle.backgroundColor}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              // minHeight: '100%'
            }}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>

            <View style={{
              width: '100%',
              // paddingBottom: 10,
              backgroundColor: Colors.gray800
            }}>
              <AppBar navigation={navigation} title={'Beat Bet'} showLogo={false}/>

              {/* <ScrollView
                horizontal={true}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                  paddingLeft: 10,
                  // minHeight: '100%',
                  height: 40,
                  // backgroundColor: 'red',
                }}
                showsHorizontalScrollIndicator={false}
                style={{
                  // flex: 1,
                  // maxHeight: 120,
                  // backgroundColor: 'blue'
                }}>
                <TableCheap selected={selectedTable == ETABLE_GENERAL} onPress={() => { setSelectedTable(ETABLE_GENERAL), setTableLoading(true) }} title={strings.main_table} />
                <TableCheap selected={selectedTable == ETABLE_SCORE} onPress={() => { setSelectedTable(ETABLE_SCORE), setTableLoading(true) }} title={strings.score_predicted} />
                <TableCheap selected={selectedTable == ETABLE_WINNER} onPress={() => { setSelectedTable(ETABLE_WINNER), setTableLoading(true) }} title={strings.winner_or_draw_predicted} />
              </ScrollView>

              {selectedTable != ETABLE_GENERAL ? <ScrollView
                horizontal={true}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                  // minHeight: '100%',
                  height: 80,
                  alignItems: 'center',
                  // backgroundColor: 'red',
                }}
                showsHorizontalScrollIndicator={false}
                style={{
                  // flex: 1,
                  // maxHeight: 120,
                  // backgroundColor: 'blue'
                }}
              >
                <LeagueChip compact={false} league={null} selected={null == selectedLeague} onPress={() => { onLeaguePress(null) }} />
                {dataManager.getLeagues().map((l) => {
                  return (<LeagueChip compact={false} league={l} key={l.name} selected={l == selectedLeague} onPress={() => { onLeaguePress(l) }} />)
                })}
              </ScrollView> : null} */}
            </View>

            <View style={{
              height: selectedTable == ETABLE_GENERAL ? 10 : 20
            }}></View>


            {selectedTable == ETABLE_GENERAL ?
              <View style={{
                padding: 20,
                paddingVertical: 10,
                // marginTop: 10,
                marginBottom: 10,
                // backgroundColor: Colors.gray800
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
                    {!settings?.season || settings?.season == season ? <AwardsPanelBeatBet onReadMore={onNavAwardsInfo} league={league} season={season} />
                      : <WinnerPanel winner={table ? table[0] : null} season={season} league={league}></WinnerPanel>}
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              : null}

            {dataManager.getSettings().enableAds ? <View style={{
              width: '100%',
              paddingHorizontal: 20
            }}>
              <NativeAdComp forceNativeAd={true} />
            </View> : null}

            <ScrollView style={{
              marginBottom: 15,
              // width: '100%',
              // backgroundColor: 'red',
            }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                // width: '100%',
                flexDirection: 'row',

                // justifyContent: 'flex-start',
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

              {settings.numLevels >= 2 || settings?.season != season ? <TouchableOpacity activeOpacity={.6} onPress={() => { onLeague2() }} style={{
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
              </TouchableOpacity> : null}

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
              // backgroundColor: 'red',
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
                }}>Tb</Text>
                <Text style={{
                  width: 60,
                  // backgroundColor: 'red',
                  color: Colors.titleColor,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{selectedTable == ETABLE_GENERAL ? "Bal" : "Rate"}</Text>
              </View>

              {tableLoading ? <ActivityIndicator size={'large'} color={'#FF2882'} style={{ marginTop: 20 }} />
                :
                <View style={{
                  width: '100%',
                }}>
                  {renderTable()}


                  {selectedTable == ETABLE_GENERAL && settings?.season == season ? <View style={{
                    height: 50,

                    // backgroundColor: 'red',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {showPrev ? <TouchableOpacity onPress={onPrev} activeOpacity={.6} style={{
                      flex: 1,
                      // height: 50,
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
                      // width: 50,
                      flex: 1,
                      marginLeft: 10,
                      alignItems: showPrev ? 'flex-start' : 'center',
                      // height: 50,
                      // backgroundColor: 'red'
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


                  {/* <View style={{
                    padding: 20,
                    // backgroundColor: '#ffffffcc',
                    borderRadius: 20,
                    // paddingBottom: 10,
                  }}>
                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        width: 60,
                        color: Colors.titleColor,
                        fontWeight: 'bold'
                      }}>Pos</Text>
                      <Text style={{
                        color: '#8E8E93'
                      }}>{strings.pos}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        width: 60,
                        color: Colors.titleColor,
                        fontWeight: 'bold'
                      }}>Tp</Text>
                      <Text style={{
                        color: '#8E8E93'
                      }}>{strings.total_short}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        width: 60,
                        color: Colors.titleColor,
                        fontWeight: 'bold'
                      }}>Pts</Text>
                      <Text style={{
                        color: '#8E8E93'
                      }}>{strings.pts}</Text>
                    </View>
                    <View style={{
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        width: 60,
                        color: Colors.titleColor,
                        fontWeight: 'bold'
                      }}>Rate</Text>
                      <Text style={{
                        color: '#8E8E93'
                      }}>{strings.rate}</Text>
                    </View>
                  </View> */}

                </View>}

            </View>
              : <View style={{
                height: 40,
                alignItems: 'center',
                justifyContent: 'flex-start',
                // backgroundColor: 'red'
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

          </ScrollView>
          <BottomNavBar page={EPAGE_TABLES} navigation={navigation} />
        </View>
        <View style={{
          height: insets.bottom,
          backgroundColor: Colors.gray800,
        }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default BeatBetTablesPage;
