import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import NativeAdComp from './NativeAdComp';
import Gamepad from './Gamepad';
import GamepadMenu from './GamepadMenu';

function MatchesLivePage({ navigation, route }): JSX.Element {
  const [matches, setMatches] = useState([])
  const [upcoming, setUpcoming] = useState([])

  const [matchesReqFinished, setMatchesReqFinished] = useState(false)
  const [upcomingReqFinished, setUpcomingReqFinished] = useState(false)
  const [showGamepadMenu, setShowGamepadMenu] = useState(false)

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

  function onShowGamepadMenu() {
    setShowGamepadMenu(true)
  }

  function getMatches() {
    const url = `${SERVER_BASE_URL}/api/v1/matches/live?game=${dataManager.getSettings().game}`
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
        } else {
          setUpcoming([])
          setUpcomingReqFinished(true)
        }
      })
      .catch(error => {
        console.error('Error fetching leagues:', error)
        setMatches([])
        setUpcomingReqFinished(true)
        setMatchesReqFinished(true)
      });
  }

  function getUpcoming() {
    const url = `${SERVER_BASE_URL}/api/v1/matches/upcoming?game=${dataManager.getSettings().game}`
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

  const insets = useSafeAreaInsets();

  function onChangeGame(game) {
    if (!authManager.getMeSync()) return

    setMatchesReqFinished(false)
    setUpcomingReqFinished(false)
    setMatches([])
    setUpcoming([])
    getMatches()
  }

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

          backgroundColor={Colors.gray800}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingBottom: 60
              // minHeight: '100%'
            }}

            style={{ flex: 1 }}>

            <View style={{
              width: '100%',
              // paddingBottom: 20,
              backgroundColor: Colors.gray800
            }}>
              <AppBar navigation={navigation} showLogo={false} title={'Live'} />
            </View>



            <View style={{
              width: '100%',
              // backgroundColor: 'red',
              padding: 15,
              paddingHorizontal: 20,
              // marginTop: 10,
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

              {matchesReqFinished && upcomingReqFinished && dataManager.getSettings().enableAds ? <View style={{
                width: '100%',
              }}>
                <NativeAdComp forceNativeAd={true} />
              </View> : null}

              {matchesReqFinished && matches.length ? <View style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                marginBottom: 15,
              }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  borderWidth: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#00C566'
                }}>
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 10,
                    backgroundColor: '#00C566'
                  }}></View>
                </View>
                <Text style={{
                  // width: '100%',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 10,
                  // marginBottom: 10,
                  textAlign: 'left',
                  color: Colors.titleColor
                }}>{strings.live_matches}</Text></View> : null}

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

              {upcoming.length ? <View style={{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                marginBottom: 15,
              }}>
                <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  borderWidth: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: '#FF4747'
                }}>
                  <View style={{
                    width: 16,
                    height: 16,
                    borderRadius: 10,
                    backgroundColor: '#FF4747'
                  }}></View>
                </View>
                <Text style={{
                  width: '100%',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginLeft: 10,
                  textAlign: 'left',
                  color: Colors.titleColor
                }}>{strings.upcoming_matches}</Text></View> : null}

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

            {matchesReqFinished && upcomingReqFinished && dataManager.getSettings().enableAds ? <View style={{
              width: '100%',
              // marginTop: 30,
              paddingHorizontal: 20,
            }}>
              <NativeAdComp />
            </View> : null}
          </ScrollView>
          <Gamepad onShowMenu={onShowGamepadMenu} />
          <BottomNavBar navigation={navigation} />
          {showGamepadMenu ? <GamepadMenu onClose={() => setShowGamepadMenu(false)} onChangeGame={onChangeGame} /> : null}
        </View>
        <View style={{
          height: insets.bottom,
          backgroundColor: Colors.gray800,
        }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}


export default MatchesLivePage;
