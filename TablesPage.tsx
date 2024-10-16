import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  RefreshControl,
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
import BottomNavBar, { EPAGE_TABLES } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import LeagueChip from './LeagueChip';
import dataManager from './DataManager';
import strings from './Strings';
import AppBar from './AppBar';
import authManager from './AuthManager';
import { ESTAT_TOTAL } from './ProfilePage';
import CupIcon from './assets/Trophy.svg';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import adsManager from './AdsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwardsPanel from './AwardsPanel';
import { useFocusEffect } from '@react-navigation/native';
import Colors from './Colors';


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

function TablesPage({ navigation, route }): JSX.Element {
  const { page } = route.params;
  const [table, setTable] = useState([])
  const [selectedTable, setSelectedTable] = useState(ETABLE_GENERAL)
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [blockForAd, setBlockForAd] = useState(dataManager.getSettings()?.blockForAd)
  const [adLoaded, setAdLoaded] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const backgroundStyle = {
    backgroundColor: Colors.gray800,
  };

  useEffect(() => {
    getTableByPoints()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
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

  function getTableByPoints() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/table/points?page=${page}`, requestOptions)
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

  function getTableByScore() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/table/score?league_id=${selectedLeague && selectedLeague.id >= 1 ? selectedLeague.id : -1}`, requestOptions)
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

  function getTableByWinner() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/table/winner?league_id=${selectedLeague && selectedLeague.id >= 1 ? selectedLeague.id : -1}`, requestOptions)
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

  function onLeaguePress(l) {
    setSelectedLeague(l ? l : null)
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
        selectedStat: ESTAT_TOTAL
      },
      key: `user_${u.id}`
    })
  }

  function getIcon(index) {
    let i = index
    if (selectedTable == ETABLE_GENERAL) i = index + 20 * (page - 1)
    if (i == 0 && selectedTable == ETABLE_GENERAL) {
      return <View style={{
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon name="trophy" color={'#FFCC00'} size={20}></Icon>
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
      width: 50,
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
          <Text style={{
            // width: '90%',
            flex: 1,
            color: Colors.titleColor,
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
          }}>{getRate(u)}</Text>
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
    navigation.navigate({ name: 'Tables', params: { page: page - 1 }, key: page - 1 })
  }

  function onNext() {
    navigation.navigate({ name: 'Tables', params: { page: page + 1 }, key: page + 1 })
  }

  const onRefresh = () => {
    setRefreshing(false);
    if (blockForAd) return
    if (selectedTable == ETABLE_GENERAL) {
      getTableByPoints()
    } else if (selectedTable == ETABLE_SCORE) {
      getTableByScore()
    } else {
      getTableByWinner()
    }
    setTableLoading(true)
  };

  function onNavAwardsInfo() {
    navigation.navigate('AwardsInfo')
  }


  const showPrev = page != 1
  const showNext = table.length >= 20

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bgColor }}>

      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
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
              <AppBar navigation={navigation} />

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
              height: selectedTable == ETABLE_GENERAL ? 0 : 20
            }}></View>

            {selectedTable == ETABLE_GENERAL ?
              <View style={{
                padding: 20,
                paddingVertical: 10,
                marginTop: 10,
                marginBottom: 10,
                // backgroundColor: Colors.gray800
              }}>
                <TouchableOpacity activeOpacity={.9} onPress={onNavAwardsInfo} style={{
                  borderRadius: 20,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 250,
                  overflow: 'hidden'
                }}>
                <ImageBackground width={200} height={200} source={require('./assets/throphy.png')} style={{

                    width: '100%',
                    height: 250,
                    borderRadius: 20,
                    // marginBottom: 20
                  }}>
                    <AwardsPanel onReadMore={onNavAwardsInfo}/>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
              : null}

            {!blockForAd ? <View style={{
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
                  width: 50,
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
                  // backgroundColor: 'red',
                  color: Colors.titleColor,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{selectedTable == ETABLE_GENERAL ? "Pts" : "Rate"}</Text>
              </View>

              {tableLoading ? <ActivityIndicator size={'large'} color={'#FF2882'} style={{ marginTop: 20 }} />
                :
                <View style={{
                  width: '100%',
                }}>
                  {renderTable()}
                  {selectedTable == ETABLE_GENERAL ? <View style={{
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default TablesPage;
