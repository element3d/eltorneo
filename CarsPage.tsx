import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
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
import DropShadow from 'react-native-drop-shadow';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import BottomNavBar, { EPAGE_HOME } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import ChampionsLeagueIcon from './assets/Champions League.svg';
import BallIcon from './assets/ball.svg';
import CalendarIcon from './assets/calendar_black.svg';
import DeviceInfo from 'react-native-device-info';

import MatchItem from './MatchItem';
import moment from 'moment';
import authManager from './AuthManager';
import dataManager from './DataManager';
import LeagueChip from './LeagueChip';
import AppBar from './AppBar';
import strings from './Strings';
import adsManager from './AdsManager';
// import changeNavigationBarColor from 'react-native-navigation-bar-color';


const NUM_NEXT_WEEKS = 3

const windowWidth = Dimensions.get('window').width;  // Get the window width

function LeagueTitleItem({ league, loading, week }) {
  return (
    <View style={{
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <View style={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {loading ? <ActivityIndicator style={{
          // marginTop: 30,
        }} color={'#FF2882'} size={'large'}></ActivityIndicator> : <Image src={`${SERVER_BASE_URL}/data/leagues/${league.name}_colored.png`} style={{
          width: 36,
          height: 36,
          objectFit: 'contain',
          // marginRight: 10
        }} />}

        <Text style={{
          color: 'black',
          fontSize: 16,
          fontWeight: 'bold'
        }}>{league.name}</Text>
      </View>
      <Text style={{
        fontSize: 10,
        fontWeight: 'bold',
        color: '#AEAEB2'
      }}>{dataManager.getWeekTitle(week)}</Text>
    </View>
  )
}

const ETAB_MATCHES = 1
const ETAB_TABLE = 2

function CarsPage({ navigation, route }): JSX.Element {
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [matches, setMatches] = useState([])
  const [weeks, setWeeks] = useState([])
  const [selectedWeek, setSelectedWeek] = useState({ week: 1 })
  const [selectedMiniLeague, setSelectedMiniLeague] = useState(0)

  const [selectedSeason, setSelectedSeason] = useState(dataManager.getSeasons()[dataManager.getSeasons().length - 1])
  const [matchesReqFinished, setMatchesReqFinished] = useState(false)
  const [isFirstScroll, setIsFirstScroll] = useState(true)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(ETAB_MATCHES)
  const [table, setTable] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const weeksScrollRef = useRef(null)
  const currentWeekRef = useRef(null)
  const [loaded, setLoaded] = useState(false);

  const isDarkMode = useColorScheme() === 'light';

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  useEffect(() => {
    // changeNavigationBarColor('#ff5733', true); // Set color and optional light/dark mode

    getLeagues()
  }, []);

  function onRefreshPage() {
    authManager.refresh()

    setLoading(true)
    setTimeout(() => {
      if (!adsManager.isInitialized) {
        adsManager.init()
          .then(() => {
            dataManager.getTableByPoints()
            getLeagues()
          })
          .catch(() => {
            setLoading(false)
          })
      }
    }, 500)
  }

  useEffect(() => {
    if (!selectedLeague) return
    getTable(selectedLeague)
  }, [selectedMiniLeague])

  function getTable(league) {
    fetch(`${SERVER_BASE_URL}/api/v1/league/table?league_id=${league.id}&league_index=${league.num_leagues > 1 ? selectedMiniLeague : 0}`, {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        setTable(data)
      })
      .catch(error => {
        console.error('Error fetching leagues:', error)
      });
  }

  function getLeagues() {
    fetch(`${SERVER_BASE_URL}/api/v1/leagues`, {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        SplashScreen.hide();

        setLeagues(data)
        dataManager.setLeagues(data)
        const league = data[0]
        setSelectedLeague(league)

        if (league.num_weeks == 0) {
          setWeeks([])
          return
        }

        let weeks = []
        if (league.type == 0) {
          weeks = Array.from({ length: Math.min(league.week + NUM_NEXT_WEEKS, league.num_weeks) }, (_, index) => { return { week: index + 1, type: 0 } });
          setWeeks(weeks)
        } else {
          weeks = league.weeks.slice(0, league.week + NUM_NEXT_WEEKS);
          setWeeks(weeks);
        }

        setSelectedWeek(weeks[league.week - 1])
        getMatches(league, league.week, selectedSeason)
        getTable(league)
      })
      .catch(error => {
        SplashScreen.hide();
        setLoading(false)
        console.error('Error fetching leagues:', error)
      });
  }

  // useEffect(()=>{
  //   if (!selectedLeague) return
  //   getMatches(selectedLeague, selectedWeek)
  // }, [selectedWeek])

  function getMatches(league, week, season) {
    setMatchesReqFinished(false)
    setLoading(true)

    const url = `${SERVER_BASE_URL}/api/v1/matches?league_id=${league.id}&week=${week}&season=${season}`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken() ? authManager.getToken() : ''
      },
    })
      .then(response => response.json())
      .then(data => {
        setMatches(data)
        // weeksScrollRef.current.scrollTo({x: (selectedWeek - 1) * 80});
        setMatchesReqFinished(true)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching matches:', error)
        setMatches([])
        setMatchesReqFinished(true)
        setLoading(false)
      });
  }

  //   useEffect(() => {
  //     if (selectedWeek !== null  && weeks.includes(selectedWeek)) {
  //         let offset = 0;
  //         let selectedIndex = weeks.indexOf(selectedWeek);
  //         for (let i = 0; i < selectedIndex; i++) {
  //             offset += 150 + 10; // Adding margin size
  //         }
  //         let selectedWidth = 150;
  //         let scrollPosition = offset + (selectedWidth / 2) - (windowWidth / 2);
  //         // flatListRef.current.scrollToOffset({ offset: scrollPosition, animated: false });
  //     }
  // }, [selectedLeague]);

  useEffect(() => {
    if (selectedWeek !== null && weeks.includes(selectedWeek)) {
      let offset = 0;
      let selectedIndex = weeks.indexOf(selectedWeek);
      for (let i = 0; i < selectedIndex; i++) {
        offset += 100 + 10; // Adding margin size
      }
      let selectedWidth = 100;
      let scrollPosition = offset + (selectedWidth / 2) - (windowWidth / 2);

      weeksScrollRef.current.scrollTo({ x: scrollPosition, animated: isFirstScroll ? false : true })
      setIsFirstScroll(false)
      // flatListRef.current.scrollToOffset({ offset: scrollPosition, animated: true });
    }
  }, [selectedWeek]);

  function isCurrentSeason(s) {
    return s === dataManager.getSeasons()[dataManager.getSeasons().length - 1]
  }

  function onLeaguePress(l) {
    setSelectedLeague(l)
    setIsFirstScroll(true)
    const week = isCurrentSeason(selectedSeason) ? l.week : l.num_weeks
    let weeks = []
    if (l.type == 0) {
      weeks = Array.from({ length: Math.min(week + NUM_NEXT_WEEKS, l.num_weeks) }, (_, index) => { return { week: index + 1, type: 0 } });
      setWeeks(weeks)
    } else {
      const league = l
      const currentWeekIndex = league.weeks.findIndex(w => w.week === league.week);
      weeks = league.weeks.slice(0, currentWeekIndex + NUM_NEXT_WEEKS);
      setWeeks(weeks);
      // return
    }
    setSelectedWeek(weeks[week - 1])
    getMatches(l, week, selectedSeason)
    setTab(ETAB_MATCHES)
    getTable(l)

  }

  function onSeasonPress(s) {
    setSelectedSeason(s)
    const l = selectedLeague
    const week = isCurrentSeason(s) ? l.week : l.num_weeks
    const indices = Array.from({ length: Math.min(week + NUM_NEXT_WEEKS, l.num_weeks) }, (_, index) => index + 1);
    setWeeks(indices)
    setSelectedWeek(week)
    getMatches(l, week, s)
  }

  function onNavMatch(match) {
    const now = Date.now(); // Get current timestamp in milliseconds
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds    
    const allow = (match.date - now) < twoDaysInMillis;

    if (!allow) {
      if (selectedWeek.week > selectedLeague.week && selectedWeek.week != 1 && match.team1_score == -1 && match.team2_score == -1) return;
    }

    match.leagueName = selectedLeague.name
    dataManager.setMatch(match)

    navigation.navigate({
      name: 'Match',
      params: {
        id: match.id,
      },
      key: match.id
    })
  }

  function onWeekPress(week) {
    setSelectedWeek(week)
    getMatches(selectedLeague, week.week, selectedSeason)
  }

  function onMiniLeaguePress(ml) {
    setSelectedMiniLeague(ml.index)
  }

  const onNavPlayStore = () => {
    const appPackageName = 'com.eltorneo'; // Replace with your app's package name
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${appPackageName}`;

    Linking.canOpenURL(playStoreUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(playStoreUrl);
        } else {
          console.log("Don't know how to open URI: " + playStoreUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  let currMatchDate = null
  const flatListRef = useRef();

  const renderLeagueItem = (item, index) => (
    <TouchableOpacity
      key={`league_${index}`}
      // onLayout={event => handleLayout(event.nativeEvent.layout.width, index)}
      activeOpacity={0.7}
      onPress={() => onMiniLeaguePress(item)}
      style={{
        height: 40,
        paddingLeft: 15,
        width: 150,
        paddingRight: 15,
        margin: 5,
        backgroundColor: item.index === selectedMiniLeague ? '#ff2882' : '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: item.index === selectedMiniLeague || (selectedMiniLeague === 0 && item === 1) ? '#ff2882' : '#EAEDF1',
      }}
    >
      <Text style={{ color: item.index === selectedMiniLeague ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold' }}>
        {`${strings.group} ${item.name}`}
        {/* Quarter finals */}
      </Text>
    </TouchableOpacity>
  );


  const renderItem = (item, index) => (
    <TouchableOpacity
      key={`matchday_${index}`}
      // onLayout={event => handleLayout(event.nativeEvent.layout.width, index)}
      activeOpacity={0.7}
      onPress={() => onWeekPress(item)}
      style={{
        height: 30,
        // paddingLeft: 15,
        width: 100,
        // paddingRight: 15,
        margin: 5,
        backgroundColor: item.week === selectedWeek.week ? '#ff2882' : '#f7f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: item.week === selectedWeek.week || item.week === selectedLeague.week || (selectedLeague.week === 0 && item.week === 1) ? '#ff2882' : '#EAEDF1',
      }}
    >
      <Text style={{ color: item.week === selectedWeek.week ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold' }}>
        {dataManager.getWeekTitle(item)}
        {/* Quarter finals */}
      </Text>
    </TouchableOpacity>
  );

  function getMiniLeagues() {
    const numLeagues = selectedLeague.num_leagues;
    const leagues = [];
    const startCharCode = 'A'.charCodeAt(0); // Get the char code for 'A'

    for (let i = 0; i < numLeagues; i++) {
      leagues.push({ index: i, name: String.fromCharCode(startCharCode + i) }); // Convert to letter
    }

    return leagues;
  }

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  let currentGroup = 0
  let currentPos = 1

  function getGroupName(lindex, index) {
    let word = ''
    if (lindex == 0) word = "A"
    if (lindex == 1) word = "B"
    if (lindex == 2) word = "C"
    if (lindex == 3) word = "D"

    return `${word}${index + 1}`

  }

  function renderTable() {
    return <View style={{
      width: '100%',
      // backgroundColor: 'blue',
      alignItems: 'center'
    }}>

      {selectedLeague.num_leagues > 1 ? <ScrollView
        horizontal={true}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingLeft: 10,
        }}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          // maxHeight: 120,
          marginBottom: 20,
          // backgroundColor: 'red'
        }}
      >
        {
          getMiniLeagues().map((league, i) => {
            return renderLeagueItem(league, i)
          })
        }
      </ScrollView> : null}

      <View style={{
        paddingLeft: 15,
        paddingRight: 15,
      }}>
        <View style={{
          width: '100%',
          height: 60,
          backgroundColor: '#F0F0F0',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            width: 50,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>Pos</Text>
          <Text style={{
            // width: '90%',
            flex: 1,
            color: 'black',
            fontWeight: 'bold',
            paddingLeft: 10
          }}>{strings.team}</Text>
          <Text style={{
            width: 40,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Mp</Text>
          <Text style={{
            width: 40,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Gd</Text>
          <Text style={{
            width: 40,
            color: 'black',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>{"Pts"}</Text>
        </View>
      </View>

      {table?.map((team, index) => {
        let renderGroupName = false

        if (selectedLeague.num_leagues > 1 && (index == 0 || team.group_index != currentGroup)) {
          currentGroup = team.group_index
          renderGroupName = true
          currentPos = 1
        }

        return <View key={team.team.name} style={{
          paddingLeft: 15,
          paddingRight: 15,
        }}>
          {renderGroupName ? <Text style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: 'black',
            marginLeft: 15,
            marginTop: 20
          }}>{strings.group} {getGroupName(team.league_index, team.group_index)}</Text> : null}
          <View style={{
            width: '100%',
            height: 60,
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              width: 50,
              color: 'black',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              // backgroundColor: 'red'
            }}>
              {currentPos++}
            </Text>
            <View style={{
              flex: 1,
              // paddingLeft: 5,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${team.team.name}.png`} style={{
                width: 30,
                height: 30,
                // marginLeft: 5>
              }}></Image>
              <Text style={{
                color: 'black',
                fontWeight: 'bold',
                marginLeft: 10
              }}>
                {team.team.short_name}
              </Text>
            </View>
            <Text style={{
              width: 40,
              textAlign: 'center',
              color: 'black',
              fontWeight: 'bold'
            }}>
              {team.matches_played}
            </Text>
            <Text style={{
              width: 40,
              textAlign: 'center',
              color: 'black',
              fontWeight: 'bold'
            }}>
              {team.goal_difference}
            </Text>
            <Text style={{
              textAlign: 'center',
              width: 40,
              color: 'black',
              fontWeight: 'bold'
            }}>
              {team.points}
            </Text>
          </View>
        </View>
      })}

      <View style={{
        // backgroundColor: 'red',
        width: '100%',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
        paddingBottom: 40,
      }}>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text style={{
            width: 60,
            color: 'black',
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
            color: 'black',
            fontWeight: 'bold'
          }}>Mp</Text>
          <Text style={{
            color: '#8E8E93'
          }}>{strings.matches_played}</Text>
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text style={{
            width: 60,
            color: 'black',
            fontWeight: 'bold'
          }}>Gd</Text>
          <Text style={{
            color: '#8E8E93'
          }}>{strings.goal_diff}</Text>
        </View>
        <View style={{
          flexDirection: 'row'
        }}>
          <Text style={{
            width: 60,
            color: 'black',
            fontWeight: 'bold'
          }}>Pts</Text>
          <Text style={{
            color: '#8E8E93'
          }}>{strings.pts}</Text>
        </View>
      </View>

    </View>
  }

  function compareVersions(serverVersion, currentVersion) {
    if (!serverVersion || !currentVersion || !serverVersion.length || !currentVersion.length) return false

    const serverParts = serverVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(serverParts.length, currentParts.length); i++) {
      const serverPart = serverParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (serverPart > currentPart) {
        return true; // Server version is newer
      } else if (serverPart < currentPart) {
        return false; // Current version is up-to-date
      }
    }

    return false; // Versions are identical
  }

  const onRefresh = () => {
    setRefreshing(false);
    if (tab != ETAB_MATCHES) return
    getMatches(selectedLeague, selectedWeek.week, selectedSeason)
  };

  const [scrollWidth, setScrollWidth] = useState(1500)
  const [scrollHeight, setScrollHeight] = useState(6300)
  const bg = require('./assets/gradient.jpg')

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>

      <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
        <StatusBar
          barStyle={'dark-content'}

          backgroundColor={backgroundStyle.backgroundColor}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            onContentSizeChange={(w, h) => { setScrollWidth(w), setScrollHeight(h) }}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              // backgroundColor: 'red',
              // minHeight: '100%'
            }}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>


            <View style={{
              width: '100%',
              paddingBottom: 10,
              backgroundColor: '#ffffffcc'
            }}>
              <AppBar title={selectedLeague?.name} showLang={true} showLogo={false} showBack={false} navigation={navigation} />

              {compareVersions(dataManager.getSettings()?.version, DeviceInfo.getVersion()) ? <View style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Image width={100} height={100} source={require('./assets/playstore.png')} style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  marginBottom: 8
                }}></Image>
                <Text style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: '#8E8E93'
                }}>{strings.new_version_msg}</Text>
                <TouchableOpacity activeOpacity={.8} onPress={onNavPlayStore} style={{
                  backgroundColor: '#FF2882',
                  height: 30,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 20,
                  marginTop: 10,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 'bold'
                  }}>{strings.update}</Text>
                </TouchableOpacity>
              </View> : null}

              {leagues.length ? <View>
                {/* <ScrollView
                  horizontal={true}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    height: 60,
                    // width: '100%',
                    paddingLeft: 5,
                    // backgroundColor: 'blue',
                    alignItems: 'center',
                  }}
                  showsHorizontalScrollIndicator={false}
                >

                  {leagues.map((l, i) => {
                    if (!l.is_special) return
                    return (<LeagueChip compact={false} key={`league_${i}`} league={l} selected={l == selectedLeague} onPress={() => { onLeaguePress(l) }} />)
                  })}
                </ScrollView> */}

                <ScrollView
                  horizontal={true}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    // width: '100%',
                    height: 70,
                    paddingLeft: 5,
                    paddingRight: 8,
                    // backgroundColor: 'green',
                    alignItems: 'center',
                  }}
                  showsHorizontalScrollIndicator={false}
                >

                  {leagues.map((l, i) => {
                    // if (l.is_special) return
                    return (<LeagueChip compact={true} key={`league_${i}`} league={l} selected={l == selectedLeague} onPress={() => { onLeaguePress(l) }} />)
                  })}
                </ScrollView>

                {dataManager.getSeasons().length > 1 ? <ScrollView
                  horizontal={true}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    height: 50,
                    alignItems: 'center',
                    // backgroundColor: 'black',
                    paddingLeft: 10,
                  }}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    flex: 1,
                    // maxHeight: 120,
                  }}
                >

                  {dataManager.getSeasons().map((s, i) => {
                    return (<TouchableOpacity
                      key={s}
                      activeOpacity={0.7}
                      onPress={() => onSeasonPress(s)}
                      style={{
                        height: 40,
                        paddingLeft: 20,
                        // width: 150,
                        paddingRight: 20,
                        margin: 5,
                        backgroundColor: s === selectedSeason ? '#ff2882' : 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: s === selectedSeason || s === '20' + selectedLeague?.season ? '#ff2882' : '#EAEDF1',
                      }}
                    >
                      <Text style={{ color: s === selectedSeason ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold' }}>
                        {s}
                      </Text>
                    </TouchableOpacity>)
                  })}
                </ScrollView> : null}

                <ScrollView
                  ref={weeksScrollRef}
                  horizontal={true}
                  contentInsetAdjustmentBehavior="automatic"
                  contentContainerStyle={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    // width: '100%',
                    alignItems: 'center',
                    // backgroundColor: 'red',
                    height: 50
                  }}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    flex: 1,
                    // maxHeight: 120,
                  }}
                >
                  {
                    weeks.map((week, i) => {
                      return renderItem(week, i)
                    })
                  }
                </ScrollView>
              </View> : null}
            </View>
            {/* {loading && !leagues.length ? <ActivityIndicator style={{
              marginTop: 30,
            }} color={'#FF2882'} size={'large'}></ActivityIndicator> : null} */}

            {!loading && !leagues.length ? <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
              paddingHorizontal: 10
            }}>
              <Text style={{
                fontWeight: 'bold',
                color: "#8E8E93",
                textAlign: 'center'
              }}>{strings.conn_error}</Text>
              <TouchableOpacity onPress={onRefreshPage} style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderColor: '#EAEDF1'
                // backgroundColor: '#FF2882'
              }}>
                <Icon name='refresh' color='#8E8E93' size={36}></Icon>
              </TouchableOpacity>
            </View> : null}
            
            {loading ? <ActivityIndicator style={{
              marginTop: 30,
            }} color={'#FF2882'} size={'large'}></ActivityIndicator> : null}

            {leagues.length ? <View style={{
              width: '100%',
              // backgroundColor: 'red',
              paddingTop: 15,
              paddingBottom: 15,
              marginTop: 10,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

              {/* {selectedLeague ? <LeagueTitleItem loading={loading} league={selectedLeague} week={selectedWeek} /> : null} */}


              {!loading ? <View style={{
                paddingLeft: 15,
                paddingRight: 15,
              }}>
                <View style={{
                  width: '100%',
                  height: 50,
                  padding: 4,
                  marginBottom: 20,
                  backgroundColor: '#F0F0F0',
                  borderRadius: 30,
                  flexDirection: 'row'
                }}>
                  <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_MATCHES) }} style={{
                    flex: 1,
                    backgroundColor: tab == ETAB_MATCHES ? '#ffffffcc' : 'transparent',
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      color: 'black',
                      fontWeight: 'bold'
                    }}>{strings.matches}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_TABLE) }} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tab == ETAB_TABLE ? '#ffffffcc' : 'transparent',
                    borderRadius: 30
                  }}>
                    <Text style={{
                      color: 'black',
                      fontWeight: 'bold'
                    }}>{strings.table}</Text>
                  </TouchableOpacity>
                </View>
              </View> : null }

              {tab == ETAB_MATCHES ? <View style={{
                paddingLeft: 15,
                paddingRight: 15,
              }}>
                {/* {!loading && matches.length && selectedLeague ? <LeagueTitleItem league={selectedLeague} week={selectedWeek} /> : null } */}

                {!loading ? matches.map((m, i) => {

                  let renderTime = false;
                  if (currMatchDate == null) {
                    renderTime = true;
                    currMatchDate = new Date(m.date);
                  } else if (!isSameDay(new Date(currMatchDate), new Date(m.date))) {
                    renderTime = true;
                    currMatchDate = new Date(m.date);
                  }

                  return <View key={`match_${i}`}>
                    {renderTime ? <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                      marginTop: i == 0 ? 0 : 20
                    }}>
                      <CalendarIcon width={26} height={26} />
                      <Text style={{
                        marginLeft: 10,
                        fontWeight: 'bold',
                        color: 'black'
                      }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')} </Text>
                    </View> : null}
                    <MatchItem onPress={() => { onNavMatch(m) }} match={m} />
                  </View>
                }) : null}

                {!matches.length && matchesReqFinished ? <Text style={{
                  fontWeight: 'bold',
                  color: "#8E8E93",
                }}>
                  {strings.no_matches_found}
                </Text> : null}
              </View> : !loading ? renderTable() : null}
            </View> : null}


          </ScrollView>
          {!loading && !leagues.length ? null : <BottomNavBar page={EPAGE_HOME} navigation={navigation} />}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "94%",
    height: 50,
    backgroundColor: 'white',
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

export default CarsPage;
