import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';

import MatchItem from './MatchItem';
import Calendar from './Calendar';
import moment from 'moment';
import AppBar from './AppBar';
import strings from './Strings';
import authManager from './AuthManager';
import { useFocusEffect } from '@react-navigation/native';
import dataManager from './DataManager';
import Colors from './Colors';

function CalendarPage({ navigation, route }): JSX.Element {
  const today = moment();
  const [date, setDate] = useState(today.format('YYYY-MM-DD'))
  const [matches, setMatches] = useState([])
  const [matchesReqFinished, setMatchesReqFinished] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  useEffect(()=> {
    this.effect = true
  
    // getMatches()
  }, [date])

  useFocusEffect(
    useCallback(() => {
      getMatches()
      this.effect = false

    }, [date])
  );


  function getMatches() {
    if (!date) return;

    if (this.effect) {
      setMatches([])
      setMatchesReqFinished(false)
    }
    fetch(`${SERVER_BASE_URL}/api/v1/matches/day?timestamp=${new Date(date).getTime()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken() ? authManager.getToken() : ''
      },
    })
      .then(response => response.json())
      .then(data => {
        setMatchesReqFinished(true)
        setMatches(data)
      })
      .catch(error => {
        setMatchesReqFinished(true)
        console.error('Error fetching leagues:', error)
        setMatches([])
      });
  }

  let currentLeague = null

  function onNavMatch(match) {
    const now = Date.now(); // Get current timestamp in milliseconds
    const twoDaysInMillis = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds    
    const allow = (match.date - now) < twoDaysInMillis;

    if (!allow) {
      if (match.week > match.currentWeek && match.team1_score == -1 && match.team2_score == -1) return;
    }

    match.leagueName = match.league_name
    dataManager.setMatch(match)
    navigation.navigate({
      name: 'Match',
      params: {
        id: match.id,
      },
      key: match.id
    })
  }

  const onRefresh = () => {
    setRefreshing(false);
    getMatches()
  };

  function getLeagueImageUrl(m) {
    if (Colors.mode == 1) return `${SERVER_BASE_URL}/data/leagues/${m.league_name}_colored.png${dataManager.getImageCacheTime()}`

    return `${SERVER_BASE_URL}/data/leagues/${m.league_name}_white.png${dataManager.getImageCacheTime()}`
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bgColor }}>

      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
        <StatusBar
          barStyle={Colors.statusBar}

          backgroundColor={Colors.gray800}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              minHeight: '100%'
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
              <AppBar navigation={navigation} />

              <View style={{
                paddingLeft: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}>
                {Colors.mode == 1 ? <CalendarIcon height={28} width={28} /> : <CalendarWhiteIcon height={28} width={28} /> }
                <Text style={{
                  marginLeft: 10,
                  fontWeight: 'bold',
                  color: Colors.titleColor,
                  // fontWeight: 'semi-bold'
                }}>{strings[moment(date).format('MMM').toLowerCase()]} {moment(date).format('D')}, {moment(date).format('yy')}</Text>
              </View>
              <Calendar setDate={setDate} />

            </View>


            <View style={{
              width: '100%',
              // backgroundColor: 'red',
              padding: 15,
              paddingHorizontal: 20,
              marginTop: 10,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {matchesReqFinished && !matches.length ? <Text style={{
                fontWeight: 'bold',
                color: "#8E8E93",
              }}>
                {strings.no_matches_found}
              </Text> : null}
              {!matchesReqFinished ? <ActivityIndicator color={'#FF2882'} size={'large'}></ActivityIndicator> : null}
              {matches.map((m, i) => {
                let renderLeague = false;
                if (!currentLeague || currentLeague != m.league_name) {
                  currentLeague = m.league_name
                  renderLeague = true;
                }
                return <View key={`match_${i}`}>
                  {renderLeague ? <View style={{
                    flexDirection: 'row',
                    marginBottom: 10,
                    marginTop: i == 0 ? 0 : 12,
                    alignItems: 'center'
                  }}>
                    <Image resizeMode='contain' src={getLeagueImageUrl(m)} style={{
                      width: 30,
                      height: 30
                    }}></Image>
                    <View style={{
                      marginLeft: 10,
                    }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: Colors.titleColor
                      }}>{m.league_name}</Text>
                      <Text style={{
                        fontSize: 12,
                        color: '#AEAEB2',
                        fontWeight: 'bold'
                      }}>{strings.matchday} {m.week}</Text>
                    </View>
                  </View> : null}
                  <MatchItem onPress={() => { onNavMatch(m) }} match={m} />
                </View>
              })}
            </View>
          </ScrollView>
          <BottomNavBar page={EPAGE_CALENDAR} navigation={navigation} />
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

export default CalendarPage;
