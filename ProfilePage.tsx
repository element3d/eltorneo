import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_PROFILE } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import authManager from './AuthManager';
import AppBar from './AppBar';
import ProfileIcon from './assets/Profile2.svg';
import dataManager from './DataManager';
import LeagueChip from './LeagueChip';
import UserMatchesList from './UserMatchesList';
import strings from './Strings';
import adsManager from './AdsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';
import MatchPreviewDialog from './MatchPreviewDialog';
import NativeAdComp from './NativeAdComp';
import ProfileStats from './ProfileStat';
import ProfileHeader from './ProfileHeader';
import Gamepad from './Gamepad';
import GamepadMenu, { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from './GamepadMenu';
import { CommonActions, useFocusEffect } from '@react-navigation/native';

export const ESTAT_TOTAL = 0

function ProfilePage({ navigation, route }): JSX.Element {
  const { id, routeGame } = route.params;
  const { globalPage } = route.params;

  const { routeSelectedLeague } = route.params;

  const isMe = !id;
  const [page, setPage] = useState((globalPage - 1) * 5 + 1)
  const [predictsJson, setPredictsJson] = useState(null)

  const [predicts, setPredicts] = useState([])
  const [betsJson, setBetsJson] = useState(null)
  const [fireballPredictsJson, setFireballPredictsJson] = useState()

  const [bets, setBets] = useState([])
  const [fireballPredicts, setFireballPredicts] = useState([])

  const [selectedLeague, setSelectedLeague] = useState(null)
  const [stats, setStats] = useState(null)
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false)
  const [showGamepadMenu, setShowGamepadMenu] = useState(false)

  const user = isMe ? authManager.getMeSync() : authManager.getActiveUser()
  const place = user ? dataManager.findUserPosition(user.id) : 0
  const [blockForAd, setBlockForAd] = useState(place <= 3 && place >= 1 && dataManager.getSettings()?.blockForAd && !isMe)
  const [adLoaded, setAdLoaded] = useState(false)
  const [showMatchPreview, setShowMatchPreview] = useState(false)
  const [previewMatch, setPreviewMatch] = useState(null)

  // const [game, setGame] = useState(dataManager.getSettings().game)
  const gameState = dataManager.getSettings().game;//routeGame;

  useEffect(() => {
    if (!dataManager.getSettings()) return
    if (!dataManager.getSettings().enableAds || !dataManager.getSettings().blockForAd) return

    if (adsManager.isLoaded()) {
      setAdLoaded(true)
    } else {
      setBlockForAd(false)
      adsManager.loadAd()
      const unsub = adsManager.addLoadedListener(() => {
        unsub()
        setAdLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    if (dataManager.getSettings().game == EGAME_ELTORNEO)
      getPredicts();
    else if (dataManager.getSettings().game == EGAME_BEATBET)
      getBets();
    else if (dataManager.getSettings().game == EGAME_FIREBALL)
      getFireballPredicts();
  }, [page]);

  function onCloseMatchPreview() {
    setShowMatchPreview(false)
  }

  function onShowGamepadMenu() {
    setShowGamepadMenu(true)
  }

  function onShowMatchPreview(match) {
    match.isTeaser = false
    setShowMatchPreview(true)
    setPreviewMatch(match)
  }

  function onShowMatchTrailer(match) {
    match.isTeaser = true
    setShowMatchPreview(true)
    setPreviewMatch(match)
  }

  useFocusEffect(useCallback(() => {
    if (gameState != dataManager.getSettings().game) {
      onChangeGame(dataManager.getSettings().game)
    }
  }, [gameState]))

  function onChangeGame(game) {
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'Profile');

      return CommonActions.reset({
        ...state,
        routes: [
          ...routes,
          {
            name: 'Profile',
            params: {
              id: isMe ? null : user.id,
              globalPage: 1,
              routeSelectedLeague: -1,
              selectedStat: ESTAT_TOTAL,
            },
            key: `profile_${user.id}_${game}`
          },
        ],
        index: routes.length, // point to the new Tables screen
      });
    });
  }


  function getBets() {
    if (!user) return

    setLoading(true)
    fetch(`${SERVER_BASE_URL}/api/v1/user/bets?page=${page}&user_id=${user.id}&league_id=${routeSelectedLeague ? routeSelectedLeague : -1}`, {
      method: 'GET',
      headers: {
        // 'Authentication': authManager.getToken()
      },
    })
      .then(response => response.json())
      .then(data => {

        if (data.bets.length <= 0) {
          setBetsJson(data)

          setLoading(false)
          // setHasMore(false)
          // setHasNext(false)

          return
        } else if (data.bets.length < 20) {
          // setHasMore(false)
          // setHasNext(false)
          setLoading(false)
        }

        // setLoading(false)
        setBets((prevBets) => [...prevBets, ...data.bets])
        setBetsJson(data)
        if (page % 5 == 0 && data.bets.length >= 20) {
          // setHasNext(true)
          setLoading(false)
        }
      })
      .catch(error => {
        setLoading(false)
        // setHasMore(false)
        // setHasNext(false)
        console.error('Error fetching leagues:', error)
      });
  }

  function getPredicts() {
    if (!user) return

    setLoading(true)
    fetch(`${SERVER_BASE_URL}/api/v1/user/predicts?page=${page}&user_id=${user.id}&league_id=${routeSelectedLeague ? routeSelectedLeague : -1}`, {
      method: 'GET',
      headers: {
        // 'Authentication': authManager.getToken()
      },
    })
      .then(response => response.json())
      .then(data => {

        if (data.predicts.length <= 0) {
          setPredictsJson(data)

          setLoading(false)
          // setHasMore(false)
          // setHasNext(false)

          return
        } else if (data.predicts.length < 20) {
          // setHasMore(false)
          // setHasNext(false)
          setLoading(false)
        }

        // setLoading(false)
        setPredicts((prevPredicts) => [...prevPredicts, ...data.predicts])
        setPredictsJson(data)
        if (page % 5 == 0 && data.predicts.length >= 20) {
          // setHasNext(true)
          setLoading(false)
        }
      })
      .catch(error => {
        setLoading(false)
        // setHasMore(false)
        // setHasNext(false)
        console.error('Error fetching leagues:', error)
      });
  }

  function getFireballPredicts() {
    if (!user) return

    setLoading(true)
    fetch(`${SERVER_BASE_URL}/api/v1/user/fireball?page=${page}&user_id=${user.id}&league_id=${routeSelectedLeague ? routeSelectedLeague : -1}`, {
      method: 'GET',
      headers: {
        // 'Authentication': authManager.getToken()
      },
    })
      .then(response => response.json())
      .then(data => {

        if (data.predicts.length <= 0) {
          setFireballPredictsJson(data)

          setLoading(false)
          // setHasMore(false)
          // setHasNext(false)

          return
        } else if (data.predicts.length < 20) {
          // setHasMore(false)
          // setHasNext(false)
          setLoading(false)
        }

        // setLoading(false)
        setFireballPredicts((prevBets) => [...prevBets, ...data.predicts])
        setFireballPredictsJson(data)
        if (page % 5 == 0 && data.predicts.length >= 20) {
          // setHasNext(true)
          setLoading(false)
        }
      })
      .catch(error => {
        setLoading(false)
        // setHasMore(false)
        // setHasNext(false)
        console.error('Error fetching leagues:', error)
      });
  }

  const renderTopPart = useMemo(() => (

    <ProfileHeader navigation={navigation}
      user={user}
      isMe={isMe}
      betsJson={betsJson}
      fireballPredictsJson={fireballPredictsJson}
      predictsJson={predictsJson}
    />

  ), [navigation, user, isMe, predictsJson, betsJson, fireballPredictsJson]);

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

  const insets = useSafeAreaInsets();

  function showList() {
    const game = dataManager.getSettings().game;
    if (game == EGAME_BEATBET) {
      if (bets.length && betsJson) return true
    }
    if (game == EGAME_ELTORNEO) {
      if (predicts.length && predictsJson) return true;
    }
    if (game == EGAME_FIREBALL) {
      if (fireballPredicts.length && fireballPredictsJson) return true;
    }

    return false;
  }

  function getListPredicts() {
    if (gameState == EGAME_ELTORNEO) return predicts;
    if (gameState == EGAME_BEATBET) return bets;
    if (gameState == EGAME_FIREBALL) return fireballPredicts;
  }

  function getListTotalPredicts() {
    if (gameState == EGAME_ELTORNEO) return predictsJson.allPredicts;
    if (gameState == EGAME_BEATBET) return betsJson.allBets;
    if (gameState == EGAME_FIREBALL) return fireballPredictsJson.allPredicts;
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

        <View style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          {!showList() ?
            <View style={{
              width: '100%',
              flex: 1,
            }}>
              <ProfileHeader navigation={navigation}
                user={user}
                isMe={isMe}
                betsJson={betsJson}
                fireballPredictsJson={fireballPredictsJson}
                predictsJson={predictsJson}
              />
              {!blockForAd ? <View style={{
                flex: 1,
                height: 200,
                // backgroundColor: 'red',
                paddingTop: 0
              }}>
                {loading ? <ActivityIndicator color={'#FF2882'} size="large" /> : <Text style={{
                  color: '#8E8E93',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}>{gameState == EGAME_BEATBET ? strings.no_bets : strings.no_predicts}</Text>}
              </View> : <View style={{
                height: 80,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red'
              }}>
                <TouchableOpacity onPress={onUnlock} activeOpacity={.8} style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  height: 24,
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
                  }}>{strings.see_predictions}</Text>
                  {adLoaded ? <Icon name='play-circle-filled' size={18} color='white' style={{
                    marginLeft: 4
                  }} /> : <ActivityIndicator size={'small'} color={'white'} style={{
                    marginLeft: 6
                  }} />}
                </TouchableOpacity>
              </View>}
            </View> :
            <UserMatchesList navigation={navigation} loading={loading} globalPage={globalPage} hasNext={hasNext} hasMore={hasMore} page={page} setPage={setPage} renderTopPart={renderTopPart} user={user} id={id} predicts={getListPredicts()} totalPredicts={getListTotalPredicts()} selectedLeague={selectedLeague} onShowMatchPreview={onShowMatchPreview} onShowMatchTrailer={onShowMatchTrailer} />
          }

          <Gamepad onShowMenu={onShowGamepadMenu} />
          <BottomNavBar page={isMe ? EPAGE_PROFILE : null} navigation={navigation} />
          {showGamepadMenu ? <GamepadMenu onClose={() => setShowGamepadMenu(false)} onChangeGame={onChangeGame} /> : null}
        </View>
        {showMatchPreview ? <MatchPreviewDialog onClose={onCloseMatchPreview} match={previewMatch} /> : null}
        <View style={{
          height: insets.bottom,
          backgroundColor: Colors.gray800,
        }} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default ProfilePage;
