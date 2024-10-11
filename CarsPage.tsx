import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import CalendarWhiteIcon from './assets/calendar_white.svg';

import DeviceInfo from 'react-native-device-info';

import MatchItem from './MatchItem';
import moment from 'moment';
import authManager from './AuthManager';
import dataManager from './DataManager';
import LeagueChip from './LeagueChip';
import AppBar from './AppBar';
import strings from './Strings';
import adsManager from './AdsManager';
import Colors from './Colors';
import LiveMatchItem from './LiveMatchItem';
import { useFocusEffect } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from './EventCard';


const NUM_NEXT_WEEKS = 3

const windowWidth = Dimensions.get('window').width;  // Get the window width

const ETAB_MATCHES = 1
const ETAB_TABLE = 2

const EMODE_LIGHT = 1
const EMODE_DARK = 2

function CarsPage({ navigation, route }): JSX.Element {
  const [leagues, setLeagues] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [matches, setMatches] = useState([])
  const [weeks, setWeeks] = useState([])
  const [selectedWeek, setSelectedWeek] = useState({ week: -1 })
  const [selectedMiniLeague, setSelectedMiniLeague] = useState(0)

  const [selectedSeason, setSelectedSeason] = useState(dataManager.getSeasons()[dataManager.getSeasons().length - 1])
  const [matchesReqFinished, setMatchesReqFinished] = useState(false)
  const [isFirstScroll, setIsFirstScroll] = useState(true)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(ETAB_MATCHES)
  const [table, setTable] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [mathOfDay, setMatchOfDay] = useState(null)
  const [mode, setMode] = useState(EMODE_LIGHT)
  const [randomItem, setRandomItem] = useState(5)
  const [specialMatch, setSpecialMatch] = useState(null)

  const weeksScrollRef = useRef(null)
  const currentWeekRef = useRef(null)
  const [loaded, setLoaded] = useState(false);

  const isDarkMode = useColorScheme() === 'light';

  const backgroundStyle = {
    backgroundColor: Colors.gray800,
  };

  useEffect(() => {
    // changeNavigationBarColor('#ff5733', true); // Set color and optional light/dark mode

    getLeagues()
    AsyncStorage.getItem('specialMatchLastDate')
    .then((storedDate) => {
      const currentDate = moment();
      const fiveHours = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

      // If no date is stored, treat as if more than 5 minutes elapsed
      if (!storedDate || currentDate.diff(moment(parseInt(storedDate)), 'milliseconds') > fiveHours) {
        // Fetch the special match
        dataManager.fetchSpecialMatch(strings.getLanguage(), authManager.getToken())
          .then((m) => {
            setSpecialMatch(m);
  
            // Store the current date after fetching
            AsyncStorage.setItem('specialMatchLastDate', currentDate.valueOf().toString());
          })
          .catch((err) => {
            console.log(err)
          });
      }
    })
    .catch(() => {});
  
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

  useFocusEffect(
    useCallback(() => {
      changeNavigationBarColor(Colors.bottomNavBarColor, true);  // Change to your desired color
    }, [mode])
  );

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
        AsyncStorage.getItem('mode')
          .then((mode) => {
            if (!mode) {
              SplashScreen.hide();
              return
            }

            if (Number.parseInt(mode) == 2) {
              Colors.setNewMode(2)
              setMode(2)
            } else {
              Colors.setNewMode(1)
              setMode(1)
            }
            SplashScreen.hide();
          })
          .catch(() => {
            SplashScreen.hide();
          })


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

  function TopScorerItem() {
    const topScorers = dataManager.getTopScorers()[selectedLeague.id.toString()]
    if (!topScorers) {
      return <View style={{
        width: '100%',
        height: 180,
        // paddingBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,

        alignItems: 'flex-end',
        backgroundColor: '#37003C'
      }}>

      </View>
    }
    return (
      <TouchableOpacity onPress={() => {}} activeOpacity={.9} style={{
        width: '100%',
        height: 180,
        // paddingBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,

        alignItems: 'flex-end',
        backgroundColor: '#37003C'
      }}>
        <Image src={`${SERVER_BASE_URL}/data/players/${topScorers.player_name}_banner.png${dataManager.getImageCacheTime()}`} style={{
          width: '100%',
          height: '100%',
          // height: 250,
          // backgroundColor: 'red',
          top: 0,
          position: 'absolute'
        }} />
        <View style={{
          width: 230,
          // backgroundColor: 'red',
          alignSelf: 'flex-end',
          flexDirection: 'row',
          paddingTop: 12,
          paddingRight: 20,
          // height: 80,
          alignItems: 'flex-start',
          justifyContent: 'flex-end'
          // backgroundColor: 'red',
        }}>
          <Text style={{
            fontSize: Number.parseInt(topScorers.number / 10) > 0 ? 50 : 70,
            lineHeight: Number.parseInt(topScorers.number / 10) > 0 ? 55 : 75,
            // paddingBottom:,20,
            // width: 100,
            fontFamily: "Ranchers-Regular",
            // fontWeight: 900,
            // marginBottom: 20,
            // textAlign: 'center ',
            // backgroundColor: 'blue',
            // textAlign: 'center',
            color: '#FACC15',
            marginRight: 10,
          }}>{topScorers.number}</Text>

          <View style={{
            marginTop: 2
          }}>
            <Text style={{
              fontSize: 14,
              lineHeight: 18,
              // fontWeight: 900,
              fontFamily: 'Poppins-Bold',
              color: 'white'
            }}>{topScorers.firstname.toUpperCase()}</Text>
            <Text style={{
              fontSize: 18,
              lineHeight: 20,
              // fontWeight: 900,
              fontFamily: 'Poppins-Bold',
              color: 'white'
            }}>{topScorers.lastname.toUpperCase()}</Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${topScorers.team_name}.png`} style={{
                width: 20,
                height: 20
              }}>

              </Image>
              <Text style={{
                fontSize: 14,
                lineHeight: 20,
                marginLeft: 4,
                // lineHeight: 2,
                fontFamily: 'Poppins-Bold',
                color: '#AEAEB2'
              }}>{topScorers.team_short_name}</Text>
            </View>

            <Text style={{
              marginTop: 10,
              color: 'white',
              fontWeight: 900
            }}>{strings.top_goal_scorer}</Text>
            <View style={{
              marginTop: 4,
              height: 14,
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{
                // marginTop: 10,
                color: '#AEAEB2',
                fontSize: 12,
                lineHeight: 12,
                // textAlign: 'center',
                fontWeight: 900
              }}>{strings.matches_played}:</Text>
              <Text style={{
                //  marginTop: 10,
                 marginLeft: 5,
                //  marginBottom: 3,
                  fontSize: 14,
                  lineHeight: 14,
                 color: '#00C566',
                 fontWeight: 900
              }}>{topScorers.games}</Text>
            </View>
            <View style={{
              marginTop: 1,
              alignItems: 'center',
              flexDirection: 'row'
            }}>
              <Text style={{
                // marginTop: 10,
                color: '#AEAEB2',
                fontSize: 12,
                lineHeight: 12,
                fontWeight: 900,
                // marginBottom: 4,
              }}>{strings.goals}:</Text>
              <Text style={{
                //  marginTop: 10,
                  fontSize: 14,
                  marginLeft: 5,
                  lineHeight: 14,
                 color: '#FACC15',
                 fontWeight: 900,
                //  marginBottom: 4,
              }}>{topScorers.goals}</Text>
            </View>
          </View>
        </View>


      </TouchableOpacity>
    )
  }

  function getMatches(league, week, season, showPreload = true) {
    if (week == -1) return

    if (showPreload) {
      setMatchesReqFinished(false)
      setLoading(true)
    }

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
        if (showPreload) {
          setMatchOfDay(getRandomMatch(data))
          const randomNumber = Math.floor(Math.random() * 6);
          setRandomItem(randomNumber)
        }
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
    this.effect = true
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
    if (this.effect) {
      getMatches(l, week, selectedSeason)
    }
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

  function onEventClose() {
    setSpecialMatch(null)
  }

  function onNavSpecialMatch() {
    dataManager.setMatch(specialMatch.match)
    setSpecialMatch(null)
    AsyncStorage.setItem('specialMatchLastDate', (new Date().getTime().toString()))
    navigation.navigate({
      name: 'Match',
      params: {
        id: specialMatch.match.id,
      },
      key: specialMatch.match.id
    })
}

  function onWeekPress(week) {
    this.effect = true
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
        backgroundColor: item.index === selectedMiniLeague ? '#ff2882' : Colors.gray800,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: item.index === selectedMiniLeague || (selectedMiniLeague === 0 && item === 1) ? '#ff2882' : Colors.borderColor,
      }}
    >
      <Text style={{ color: item.index === selectedMiniLeague ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold' }}>
        {`${strings.league} ${item.name}`}
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
        height: 32,
        // paddingLeft: 15,
        width: 110,
        // paddingRight: 15,
        margin: 5,
        backgroundColor: item.week === selectedWeek.week ? '#ff2882' : Colors.bgColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: item.week === selectedWeek.week || item.week === selectedLeague.week || (selectedLeague.week === 0 && item.week === 1) ? '#ff2882' : Colors.borderColor,
      }}
    >
      <Text style={{ fontSize: 12, color: item.week === selectedWeek.week ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold' }}>
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
      // paddingHorizontal: 10,
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
        paddingLeft: 20,
        paddingRight: 20,
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
          }}>{strings.team}</Text>
          <Text style={{
            width: 40,
            color: Colors.titleColor,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Mp</Text>
          <Text style={{
            width: 40,
            color: Colors.titleColor,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>Gd</Text>
          <Text style={{
            width: 40,
            color: Colors.titleColor,
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
          paddingLeft: 20,
          paddingRight: 20,
        }}>
          {renderGroupName ? <Text style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: Colors.titleColor,
            marginLeft: 15,
            marginTop: 20
          }}>{strings.group} {getGroupName(team.league_index, team.group_index)}</Text> : null}
          <View style={{
            width: '100%',
            height: 52,
            // backgroundColor: 'red',
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Text style={{
              width: 50,
              color: Colors.titleColor,
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
                color: Colors.titleColor,
                fontWeight: 'bold',
                marginLeft: 10
              }}>
                {team.team.short_name}
              </Text>
            </View>
            <Text style={{
              width: 40,
              textAlign: 'center',
              color: Colors.titleColor,
              fontWeight: 'bold'
            }}>
              {team.matches_played}
            </Text>
            <Text style={{
              width: 40,
              textAlign: 'center',
              color: Colors.titleColor,
              fontWeight: 'bold'
            }}>
              {team.goal_difference}
            </Text>
            <Text style={{
              textAlign: 'center',
              width: 40,
              color: Colors.titleColor,
              fontWeight: 'bold'
            }}>
              {team.points}
            </Text>
          </View>
        </View>
      })}

      {/* <View style={{
        // backgroundColor: 'red',
        width: '100%',
        padding: 10,
        paddingLeft: 36,
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
      </View> */}

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

  useEffect(()=>{
    this.effect = true
  }, [])

  useFocusEffect(
    useCallback(()=>{
      return () =>{
        this.effect = false
      } 
    }, [])
  )

  useFocusEffect(
    useCallback(()=>{
      if (!this.effect) {
        if (tab != ETAB_MATCHES) return

        getMatches(selectedLeague, selectedWeek.week, selectedSeason, false)
      }


      
    }, [selectedLeague, selectedWeek])
  )

  function getRandomMatch(matches) {
    const randomIndex = Math.floor(Math.random() * matches.length);  // Generate a random index
    return matches[randomIndex];  // Return the match at that index
  }

  function renderCard() {
    

    if (!mathOfDay) return <TopScorerItem />

    if (!dataManager.getTopScorers()) {
      return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />
    } else if (!dataManager.getTopScorers()[selectedLeague.id.toString()]) {
      return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />
    }
    // return <TopScorerItem />

    if (randomItem != 1 && randomItem != 3) return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />

    return <TopScorerItem />
  }


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
              backgroundColor: Colors.gray800
            }}>
              <AppBar setMode={setMode} title={selectedLeague?.name} showMode={true} showLang={true} showLogo={false} showBack={false} navigation={navigation} />

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
                    marginBottom: 5,
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
                borderWidth: 1,
                borderColor: Colors.borderColor
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
                width: '100%',
                paddingLeft: 20,
                paddingRight: 20,
              }}>
                {renderCard()}
                {/* <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} /> */}
                {/* {topScorers ? <TopScorerItem /> : null} */}
                <View style={{
                  width: '100%',
                  height: 46,
                  padding: 4,
                  marginBottom: 20,
                  backgroundColor: Colors.selectColor,
                  borderRadius: 23,
                  flexDirection: 'row'
                }}>
                  <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_MATCHES) }} style={{
                    flex: 1,
                    height: 38,
                    backgroundColor: tab == ETAB_MATCHES ? Colors.gray800 : 'transparent',
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{
                      color: tab == ETAB_MATCHES ? Colors.titleColor : "#8E8E93",
                      fontWeight: 'bold'
                    }}>{strings.matches}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_TABLE) }} style={{
                    flex: 1,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: tab == ETAB_TABLE ? Colors.gray800 : 'transparent',
                    borderRadius: 30
                  }}>
                    <Text style={{
                      color: tab == ETAB_TABLE ? Colors.titleColor : "#8E8E93",
                      fontWeight: 'bold'
                    }}>{strings.table}</Text>
                  </TouchableOpacity>
                </View>
              </View> : null}

              {tab == ETAB_MATCHES ? <View style={{
                paddingLeft: 20,
                paddingRight: 20,
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
                      {Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} />}
                      <Text style={{
                        marginLeft: 10,
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: Colors.titleColor
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
        { specialMatch ? <EventCard onPress={onNavSpecialMatch} onClose={onEventClose} match={specialMatch}/> : null }
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default CarsPage;
