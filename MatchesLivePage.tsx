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
  TouchableOpacity,
  View,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import AppBar from './AppBar';
import TeamItem from './TeamItem';
import dataManager from './DataManager';
import authManager from './AuthManager';
import strings from './Strings';
import { useFocusEffect } from '@react-navigation/native';
import LiveMatchItem from './LiveMatchItem';
import Colors from './Colors';

function MatchesLivePage({ navigation, route }): JSX.Element {
  const [matches, setMatches] = useState([])
  const [upcoming, setUpcoming] = useState([])

  const [matchesReqFinished, setMatchesReqFinished] = useState(false)
  const [upcomingReqFinished, setUpcomingReqFinished] = useState(false)

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  useEffect(() => {
    getMatches()
  }, [])

  useFocusEffect(
    useCallback(() => {
      getMatches()
      const interval = setInterval(() => {
        getMatches()
      }, 30000);

      // Cleanup interval on focus loss or unmount
      return () => {
        clearInterval(interval)
      };

    }, [])
  );

  function getMatches() {
    const url = `${SERVER_BASE_URL}/api/v1/matches/live`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken() || ''
      },
    })
      .then(response => response.json())
      .then(data => {
        setMatches(data)
        setMatchesReqFinished(true)

        if (!data.length) {
          getUpcoming()
        }
      })
      .catch(error => {
        console.error('Error fetching leagues:', error)
        setMatches([])
        setMatchesReqFinished(true)
      });
  }

  function getUpcoming() {
    const url = `${SERVER_BASE_URL}/api/v1/matches/upcoming`
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken() || ''
      },
    })
      .then(response => response.json())
      .then(data => {
        setUpcoming(data)
        setUpcomingReqFinished(true)
      })
      .catch(error => {
        console.error('Error fetching leagues:', error)
        setUpcoming([])
        setUpcomingReqFinished(true)
      });
  }

  let currentLeague = null


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
              // minHeight: '100%'
            }}

            style={{ flex: 1 }}>

            <View style={{
              width: '100%',
              // paddingBottom: 20,
              backgroundColor: Colors.gray800
            }}>
              <AppBar navigation={navigation} />


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
              {!matchesReqFinished || (matchesReqFinished && !matches.length && !upcomingReqFinished) ? <ActivityIndicator color={'#FF2882'} size={'large'} /> : null}
              {!matches.length && matchesReqFinished && !upcoming.length && upcomingReqFinished ? <Text style={{
                fontWeight: 'bold',
                color: '#8E8E93'
              }}>
                {strings.no_live_matches}
              </Text> : null}

              {matchesReqFinished && matches.length ? <Text style={{
                width: '100%',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 10,
                textAlign: 'left',
                color: Colors.titleColor
              }}>{strings.live_matches}</Text> : null }

              {matches.map((m, i) => {
                let renderLeague = false;
                if (!currentLeague || currentLeague != m.league_name) {
                  currentLeague = m.league_name
                  renderLeague = true;
                }
                return <View key={`match_${i}`} style={{
                  width: '100%'
                }}>
                  <LiveMatchItem match={m} navigation={navigation} />
                </View>
              })}

              {upcoming.length ? <Text style={{
                width: '100%',
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 10,
                textAlign: 'left',
                color: Colors.titleColor
              }}>{strings.upcoming_matches}</Text> : null }

              {upcoming.map((m, i) => {
                let renderLeague = false;
                if (!currentLeague || currentLeague != m.league_name) {
                  currentLeague = m.league_name
                  renderLeague = true;
                }
                return <View key={`match_${i}`} style={{
                  width: '100%'
                }}>
                  <LiveMatchItem match={m} navigation={navigation} />
                </View>
              })}
            </View>


          </ScrollView>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}


export default MatchesLivePage;
