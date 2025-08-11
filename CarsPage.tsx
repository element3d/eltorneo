import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  requireNativeComponent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventCard from './EventCard';
import { AdManager } from "react-native-admob-native-ads";
import AdMobIcon from './assets/admob.svg'
import NativeAdComp from './NativeAdComp';

import MatchPreviewDialog from './MatchPreviewDialog';
import { useFocusEffect } from '@react-navigation/native';
import Drawer from './Drawer';
import TrailerItem from './TrailerItem';
import TrailerVideoDialog from './TrailerVideoDialog';

AdManager.setRequestConfiguration({
  testDeviceIds: ["DC5FB0E024817B77B466572E6959C152"]
});

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
  const [showMatchPreview, setShowMatchPreview] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [trailer, setTrailer] = useState(null)
  const [previewMatch, setPreviewMatch] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const weeksScrollRef = useRef(null)
  const currentWeekRef = useRef(null)
  const [loaded, setLoaded] = useState(false);

  const isDarkMode = useColorScheme() === 'light';

  const insets = useSafeAreaInsets();

  const backgroundStyle = {
    backgroundColor: Colors.gray800,
  };

  useEffect(() => {
    // changeNavigationBarColor('#ff5733', true); // Set color and optional light/dark mode

    getLeagues()
    AsyncStorage.getItem('specialMatchLastDate')
      .then((storedDate) => {
        const currentDate = moment();
        const fiveHours = 2 * 60 * 60 * 1000; // 5 hours in milliseconds

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
      .catch(() => { });

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
      // changeNavigationBarColor(Colors.bottomNavBarColor, true);  // Change to your desired color
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
        console.error('Error fetching table:', error)
      });
  }

  function getLeagues() {
    fetch(`${SERVER_BASE_URL}/api/v1/leagues`, {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        AsyncStorage.multiGet(['mode', 'installDate'])
          .then((obj) => {
            const mode = obj[0][1]
            // let installDate = obj[1][1]
            // if (!installDate) {
            //   installDate = new Date().getTime().toString()
            //   AsyncStorage.setItem('installDate', new Date().getTime().toString())
            // }
            // if (new Date().getTime() - new Date(Number.parseInt(installDate)).getTime() < 7 * 24 * 60 * 60 * 1000) {
            //   if (dataManager.getSettings()) {
            //     dataManager.getSettings().newUser = true
            //     dataManager.getSettings().enableAds = false
            //     dataManager.getSettings().enableNativeAds = false
            //     dataManager.getSettings().blockForAd = false
            //   }
            // }

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
          if (league.id == 1) {
            if (weeks.length > 8)
              weeks[8].type = 1
            if (weeks.length > 9)
              weeks[9].type = 5
            if (weeks.length > 10)
              weeks[10].type = 2
            if (weeks.length > 11)
              weeks[11].type = 3
            if (weeks.length > 12)
              weeks[12].type = 4

          } else if (league.id == 7) {
            if (weeks.length > 6)
              weeks[6].type = 2
            if (weeks.length > 7)
              weeks[7].type = 3
            if (weeks.length > 8)
              weeks[8].type = 4
          }
          setWeeks(weeks)
        } else {
          weeks = league.weeks.slice(0, league.week);
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
      <TouchableOpacity onPress={() => { }} activeOpacity={.9} style={{
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
            {topScorers.firstname.length ? <Text style={{
              fontSize: 14,
              lineHeight: 18,
              // fontWeight: 900,
              fontFamily: 'Poppins-Bold',
              color: 'white'
            }}>{topScorers.firstname.toUpperCase()}</Text> : null}
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
              <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${topScorers.team_name.replace(/ö/g, 'o')}.png`} style={{
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
    const currentSeason = `20${league.season}`

    if (week == -1) return

    if (showPreload) {
      setMatchesReqFinished(false)
      setLoading(true)
    }

    const url = `${SERVER_BASE_URL}/api/v1/matches?league_id=${league.id}&week=${week}&season=${currentSeason}&lang=${strings.getLanguage()}`
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

          if (dataManager.getTrailers()) {
            const rn = Math.floor(Math.random() * dataManager.getTrailers().length);
            if (dataManager.getTrailers()) setTrailer(dataManager.getTrailers()[rn])
          }

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
        offset += 110 + 12; // Adding margin size
      }
      let selectedWidth = 110;
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
      if (l.id == 1) {
        if (weeks.length > 8)
          weeks[8].type = 1
        if (weeks.length > 9)
          weeks[9].type = 5
        if (weeks.length > 10)
          weeks[10].type = 2
        if (weeks.length > 11)
          weeks[11].type = 3
        if (weeks.length > 12)
          weeks[12].type = 4
      } else if (l.id == 7) {
        if (weeks.length > 6)
          weeks[6].type = 2
        if (weeks.length > 7)
          weeks[7].type = 3
        if (weeks.length > 8)
          weeks[8].type = 4
      }
      setWeeks(weeks)
    } else {
      const league = l
      const currentWeekIndex = league.weeks.findIndex(w => w.week === league.week);
      weeks = league.weeks.slice(0, currentWeekIndex + 1);
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

  function onShowPreviewMatch(match) {
    match.isTeaser = false
    setShowMatchPreview(true)
    setPreviewMatch(match)
  }

  function onShowMatchTeaser(match) {
    match.isTeaser = true
    setShowMatchPreview(true)
    setPreviewMatch(match)
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

  function onTrailerPress() {
    if (specialMatch.match.teaser?.length) {
      setSpecialMatch(null)
      setShowMatchPreview(true)
      specialMatch.match.isTeaser = true
      setPreviewMatch(specialMatch.match)
      return
    }
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

  function onClosePreview() {
    setShowMatchPreview(false)
  }

  const renderLeagueItem = (item, index) => (
    <TouchableOpacity
      key={`league_${index}`}
      // onLayout={event => handleLayout(event.nativeEvent.layout.width, index)}
      activeOpacity={0.7}
      onPress={() => onMiniLeaguePress(item)}
      style={{
        height: 30,
        paddingLeft: 15,
        width: 100,
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
      <Text style={{ color: item.index === selectedMiniLeague ? 'white' : '#8E8E93', fontFamily: 'NotoSansArmenian-Bold', fontSize: 12 }}>
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

  function getWorldClubCupGroupName(index) {
    if (index == 0) return "A"
    if (index == 1) return "B"
    if (index == 2) return "C"
    if (index == 3) return "D"
    if (index == 4) return "E"
    if (index == 5) return "F"
    if (index == 6) return "G"
    if (index == 7) return "H"
  }

  function getGroupName(lindex, index) {
    let word = ''
    if (lindex == 0) word = "A"
    if (lindex == 1) word = "B"
    if (lindex == 2) word = "C"
    if (lindex == 3) word = "D"

    return `${word}${index + 1}`

  }

  function onNavTeam(team) {
    team.leagueName = selectedLeague.name
    team.leagueCountry = selectedLeague.country
    team.leagueId = selectedLeague.id
    team.name = team.team.name
    team.venue = team.team.venue
    team.id = team.team.id
    dataManager.setTeam(team)
     navigation.navigate({
      name: 'Team',
      params: {
        id: team.id,
      },
      key: `${team.id}_${team.name}`
    })
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

        if ((selectedLeague.num_leagues > 1 || selectedLeague.id == 16) && (index == 0 || team.group_index != currentGroup)) {
          currentGroup = team.group_index
          renderGroupName = true
          currentPos = 1
        }

        return <TouchableOpacity key={team.team.name} activeOpacity={.6} onPress={() => { onNavTeam(team) }} style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}>
          {renderGroupName ? <Text style={{
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 4,
            color: Colors.titleColor,
            marginLeft: 15,
            marginTop: 20
          }}>{strings.group} {selectedLeague.id == 16 ? getWorldClubCupGroupName(team.group_index) : getGroupName(team.league_index, team.group_index)}</Text> : null}
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
              <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${encodeURIComponent(team.team.name.replace(/ö/g, 'o'))}.png`} style={{
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
        </TouchableOpacity>
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

  useEffect(() => {
    this.effect = true
  }, [])

  useFocusEffect(
    useCallback(() => {
      return () => {
        this.effect = false
      }
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
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
    // if (!trailer) return <TopScorerItem />
    if (trailer && randomItem != 1 && randomItem != 3 && randomItem != 5) return <TrailerItem navigation={navigation} onViewPress={onShowTrailer} trailer={trailer} />
    // return <TopScorerItem />
    // return <TrailerItem onViewPress={onShowTrailer} trailer={trailer}/>
    if (!matches.length) return <TrailerItem navigation={navigation} onViewPress={onShowTrailer} trailer={trailer} />
    if (!dataManager.getTopScorers()) {
      return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />
    } else if (!dataManager.getTopScorers()[selectedLeague.id.toString()]) {
      return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />
    }
    // return <TopScorerItem />

    if (randomItem != 1 && randomItem != 3) return <LiveMatchItem match={mathOfDay} leagueName={selectedLeague.name} navigation={navigation} />

    return <TopScorerItem />
  }

  function onShowTrailer() {
    setShowTrailer(true)
  }

  return (
    <GestureHandlerRootView style={{
      flex: 1,
      backgroundColor: Colors.bgColor,
    }}>

      <SafeAreaView style={{
        flex: 1, backgroundColor: Colors.bgColor,
      }}>
        <View style={{
          height: insets.top,
          backgroundColor: Colors.gray800,
        }} />
        <View style={{
          flex: 1,
        }}>
          <StatusBar
            barStyle={Colors.statusBar}
            backgroundColor={Colors.gray800}
          />

          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              // backgroundColor: 'red',
              // minHeight: '100%'
            }}
            style={{
              flex: 1,

            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>


            <View style={{
              width: '100%',
              paddingBottom: 10,
              backgroundColor: Colors.gray800,
              marginBottom: 20
            }}>
              <AppBar showDrawer={() => { setShowDrawer(true) }} setMode={setMode} title={selectedLeague?.name} showMode={true} showLang={true} showLogo={false} showBack={false} navigation={navigation} />

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
                    if (!l.is_main) return
                    return (<LeagueChip compact={true} key={`league_${i}`} league={l} selected={l == selectedLeague} onPress={() => { onLeaguePress(l) }} />)
                  })}
                </ScrollView>

                {/* {dataManager.getSeasons().length > 1 ? <ScrollView
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
                </ScrollView> : null} */}

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

            {/* {!loading && dataManager.getSettings().enableAds && leagues.length ? <View style={{
              width: '100%',
              // marginTop: 20,
              paddingHorizontal: 20
            }}>
              <NativeAdComp forceNativeAd={true} />
            </View> : null} */}

            {loading ? <ActivityIndicator style={{
              // marginTop: 30,
            }} color={'#FF2882'} size={'large'}></ActivityIndicator> : null}

            {leagues.length ? <View style={{
              width: '100%',
              // backgroundColor: 'red',
              // paddingTop: 15,
              paddingBottom: 15,
              // marginTop: 10,
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
                {selectedLeague.id != 1 && selectedLeague.id != 8 && selectedLeague.id != 9 ? <View style={{
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
                </View> : null}
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
                    <MatchItem onPress={() => { onNavMatch(m) }} match={m} onShowMatchPreview={onShowPreviewMatch} onShowMatchTrailer={onShowMatchTeaser} />
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

            {!loading && dataManager.getSettings().enableAds ? <View style={{
              paddingHorizontal: 20,
              marginTop: 10
            }}>
              {/* <View style={{
                marginBottom: 20,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.gray800
              }}>
              <BannerAd unitId='ca-app-pub-7041403371220271/5297891922' size={BannerAdSize.MEDIUM_RECTANGLE} />
              </View> */}
              <NativeAdComp />
            </View> : null}

          </ScrollView>
          {!loading && !leagues.length ? null : <BottomNavBar page={EPAGE_HOME} navigation={navigation} />}

          {specialMatch ? <EventCard onPress={onNavSpecialMatch} onTrailerPress={onTrailerPress} onClose={onEventClose} match={specialMatch} /> : null}
          {showMatchPreview ? <MatchPreviewDialog onClose={onClosePreview} match={previewMatch} /> : null}
          {showTrailer ? <TrailerVideoDialog trailer={trailer} onClose={() => { setShowTrailer(false) }} /> : null}
          {showDrawer ? <Drawer setMode={setMode} navigation={navigation} onClose={() => { setShowDrawer(false) }} /> : null}

        </View>
        <View style={{
          height: insets.bottom,
          backgroundColor: Colors.gray800,
        }} />
      </SafeAreaView>

    </GestureHandlerRootView>
  );
}

export default CarsPage;
