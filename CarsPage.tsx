import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
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

// const SERVER_BASE_URL = 'http://192.168.18.234:1234';

const NUM_NEXT_WEEKS = 3

const windowWidth = Dimensions.get('window').width;  // Get the window width

function LeagueTitleItem({league, week}) {
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
        <Image  src={`${SERVER_BASE_URL}/data/leagues/${league.name}_colored.png`} style={{
          width: 30,
          height: 30,
          objectFit: 'contain',
          // marginRight: 10
        }}/>
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

function CarsPage({ navigation, route }): JSX.Element {
    const [leagues, setLeagues] = useState([])
    const [selectedLeague, setSelectedLeague] = useState(null)
    const [matches, setMatches] = useState([])
    const [weeks, setWeeks] = useState([])
    const [selectedWeek, setSelectedWeek] = useState({week: 1 })
    const [selectedSeason, setSelectedSeason] = useState(dataManager.getSeasons()[dataManager.getSeasons().length - 1])
    const [matchesReqFinished, setMatchesReqFinished] = useState(false)
    const [isFirstScroll, setIsFirstScroll] = useState(true)
    const [loading, setLoading] = useState(true)



    const weeksScrollRef = useRef(null)
    const currentWeekRef = useRef(null)
    const [loaded, setLoaded] = useState(false);

    const isDarkMode = useColorScheme() === 'light';

    const backgroundStyle = {
      backgroundColor: 'white',
    };

    useEffect(() => {
      // strings.setLanguage('en')
      getLeagues()
    }, []);

    function getLeagues() {
      console.log()
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
          // const indices = Array.from({ length: Math.min(week + 5, l.num_weeks) }, (_, index) => index + 1);

          let weeks = []
          if (league.type == 0) {
            weeks = Array.from({ length: Math.min(league.week + NUM_NEXT_WEEKS, league.num_weeks) }, (_, index) => {return {week: index + 1, type: 0}});
            setWeeks(weeks)
          } else {
            // For other types, show the next 5 weeks starting from league.week
            // const currentWeekIndex = league.weeks.findIndex(w => w.week === league.week);
            // console.log(currentWeekIndex)
            // weeks = league.weeks.slice(currentWeekIndex, currentWeekIndex + 6);

            weeks = league.weeks.slice(0, league.week + NUM_NEXT_WEEKS);

            setWeeks(weeks);
          }

          setSelectedWeek(weeks[league.week - 1])
          getMatches(league, league.week, selectedSeason)
        })
        .catch(error => { 
          SplashScreen.hide();
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
      console.log(url)
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
      if (selectedWeek !== null  && weeks.includes(selectedWeek)) {
          let offset = 0;
          let selectedIndex = weeks.indexOf(selectedWeek);
          for (let i = 0; i < selectedIndex; i++) {
              offset += 150 + 10; // Adding margin size
          }
          let selectedWidth = 150;
          let scrollPosition = offset + (selectedWidth / 2) - (windowWidth / 2);

          weeksScrollRef.current.scrollTo({x: scrollPosition, animated: isFirstScroll ? false : true})
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
        weeks = Array.from({ length: Math.min(week + NUM_NEXT_WEEKS, l.num_weeks) }, (_, index) => { return { week: index + 1, type: 0}});
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
      if (selectedWeek.week > selectedLeague.week && selectedWeek.week != 1) return;

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

    const renderItem = ( item, index ) => (
      <TouchableOpacity
          key={`matchday_${index}`}
          // onLayout={event => handleLayout(event.nativeEvent.layout.width, index)}
          activeOpacity={0.7}
          onPress={() => onWeekPress(item)}
          style={{
              height: 40,
              paddingLeft: 15,
              width: 150,
              paddingRight: 15,
              margin: 5,
              backgroundColor: item.week === selectedWeek.week ? '#ff2882' : '#F7F7F7',
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

  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#f7f7f7'}}>

    <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <StatusBar
        barStyle={'dark-content'}
        
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <View style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            // minHeight: '100%'
          }}
          style={{flex: 1}}>

          <View style={{
            width: '100%',
            paddingBottom: 20,
            backgroundColor: 'white'
          }}>
            <AppBar showLang={true} showBack={false} navigation={navigation}/>

            { dataManager.getSettings()?.version.length && DeviceInfo.getVersion() != dataManager.getSettings().version ? <View style={{
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
            </View> : null }
           
            <ScrollView
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                height: 60,
                paddingLeft: 5,
                // backgroundColor: 'green',
                alignItems: 'center',
              }}
              showsHorizontalScrollIndicator={ false}
             
              >
            
              {leagues.map((l, i)=>{
                return (<LeagueChip key={`league_${i}`} league={l} selected={l == selectedLeague} onPress={()=>{onLeaguePress(l)}}/>)
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
              showsHorizontalScrollIndicator={ false}
              style={{flex: 1,
                // maxHeight: 120,
              }}
              >
            
              {dataManager.getSeasons().map((s, i)=>{
                return ( <TouchableOpacity
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
            </ScrollView> : null }

            {/* {weeks.length ? <FlatList
              ref={flatListRef}
              data={weeks}
              renderItem={renderItem}
              keyExtractor={item => `${selectedLeague.name}_week_${item}`}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ 
                paddingLeft: 10 ,
                height: 50,
                alignItems: 'center',
                // backgroundColor: 'blue'
              }}
            /> : null } */}
            <ScrollView 
              ref={weeksScrollRef}
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                paddingLeft: 10,
              }}
              showsHorizontalScrollIndicator={ false}
              style={{flex: 1,
                maxHeight: 120,
              }}
            >
              {
                weeks.map((week, i) => {
                  return renderItem(week, i)
                  // return (<TouchableOpacity        
                  //   onLayout={(event) => handleLayout(event, i)}
                  //   key={`${selectedLeague.name}_week_${week}`} activeOpacity={.7} onPress={()=>{setSelectedWeek(week)}} style={{
                  //   height: 40,
                  //   paddingLeft: 15,
                  //   paddingRight: 15,
                  //   margin: 5,
                  //   backgroundColor: week == selectedWeek ? '#ff2882' : 'white',
                  //   alignItems: 'center',
                  //   justifyContent: 'center',
                  //   borderRadius: 20,
                  //   // borderWidth: week == selectedLeague.week || (selectedLeague.week == 0 && week == 1)? 1 : 0,
                  //   borderWidth: 1,
                  //   borderColor: week == selectedWeek || week ==  selectedLeague.week || (selectedLeague.week == 0 && week == 1)? '#ff2882' : '#EAEDF1'
                  // }}>
                  //   <Text style={{
                  //     color: week == selectedWeek ? 'white' : '#8E8E93',
                  //     fontFamily: 'NotoSansArmenian-Bold'
                  //   }}>Matchday {week}</Text>
                  // </TouchableOpacity>)
                })
              }
            </ScrollView>
          </View>

          <View style={{
            width: '100%',
            // backgroundColor: 'red',
            padding: 15,
            marginTop: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>

            {loading ? <ActivityIndicator color={'#FF2882'} size={'large'}></ActivityIndicator> : null }
            
            {!loading && matches.length && selectedLeague ? <LeagueTitleItem league={selectedLeague} week={selectedWeek} /> : null }

            { !loading ? matches.map((m, i)=>{

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
                  <CalendarIcon width={26} height={26}/>
                  <Text style={{
                    marginLeft: 10,
                    fontWeight: 'bold',
                    color: 'black'
                  }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')} </Text>
                </View> : null }
                <MatchItem onPress={()=>{onNavMatch(m)}} match={m}/>
              </View>
            }) : null}

            {!matches.length && matchesReqFinished ? <Text style={{
              fontWeight: 'bold',
              color: "#8E8E93",
            }}>
              {strings.no_matches_found}
            </Text>: null}

          </View>
        

        </ScrollView>
          <BottomNavBar page={EPAGE_HOME} navigation={navigation} />
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
