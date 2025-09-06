import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  SafeAreaView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_TABLES } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import dataManager from './DataManager';
import AppBar from './AppBar';
import authManager from './AuthManager';
import adsManager from './AdsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Colors from './Colors';
import GamepadMenu, { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from './GamepadMenu';
import Gamepad from './Gamepad';
import TablesElTorneoPagePanel from './TablesElTorneoPagePanel';
import TablesBeatBetPagePanel from './TablesBeatBetPagePanel';
import TablesFireballPagePanel from './TablesFireballPagePanel';


const ETABLE_GENERAL = 0
const ETABLE_SCORE = 1
const ETABLE_WINNER = 2

function TablesPage({ navigation, route }): JSX.Element {

  const { page, league, season, routeGame } = route.params;
  const [table, setTable] = useState([])
  const [blockForAd, setBlockForAd] = useState(dataManager.getSettings()?.blockForAd)
  const [adLoaded, setAdLoaded] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [me, setMe] = useState(authManager.getMeSync())
  const [myLeague, setMyLeague] = useState(me?.league || 1)
  const [showGamepadMenu, setShowGamepadMenu] = useState(false)
  // const [gameState, setGameState] = useState(dataManager.getSettings().game)
  const gameState = routeGame;
  const backgroundStyle = {
    backgroundColor: Colors.gray800,
  };

  // useEffect(() => {
  //   // getTableByPoints()
  //   setGameState(dataManager.getSettings().game)
  // }, [])

  // useEffect(() => {
  //   getTableByPoints()
  //   setTableLoading(true)
  // }, [league])

  useEffect(() => {
    if (gameState == EGAME_ELTORNEO) {
      getTableByPoints()
      setTableLoading(true)
    } else if (gameState == EGAME_BEATBET) {
      getBeatBetTableByBalance()
      setTableLoading(true)
    } else if (gameState == EGAME_FIREBALL) {
      getFireballTableByPoints();
      setTableLoading(true)
    }
  }, [gameState])

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

  function getTableByPoints() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/table/points?page=${page}&league=${league}&season=${season}`, requestOptions)
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

  function getBeatBetTableByBalance() {
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

  function getFireballTableByPoints() {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    fetch(`${SERVER_BASE_URL}/api/v1/fireball_table?page=${page}&league=${league}&season=${season}`, requestOptions)
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

  const onRefresh = () => {
    setRefreshing(false);
    if (blockForAd) return;
    if (gameState == EGAME_ELTORNEO) {
      getTableByPoints();
    } else if (gameState == EGAME_BEATBET) {
      getBeatBetTableByBalance();
    } else if (gameState == EGAME_FIREBALL) {
      getFireballTableByPoints();
    }
    setTableLoading(true);
  };

  function setSeason(s) {
    navigation.navigate({ name: 'Tables', params: { page: 1, routeGame: routeGame, league: myLeague, season: s }, key: `${1}_${league}_${s}` })
  }

  function onShowGamepadMenu() {
    setShowGamepadMenu(true)
  }

  function onChangeGame(game) {
    navigation.dispatch(state => {
      const routes = state.routes.filter(r => r.name !== 'Tables');

      return CommonActions.reset({
        ...state,
        routes: [
          ...routes,
          {
            name: 'Tables',
            params: { page: 1, routeGame: game, league: 1, season: '25/26' },
            key: `${1}_1_25/26`
          },
        ],
        index: routes.length, // point to the new Tables screen
      });
    });
  }

  useFocusEffect(useCallback(() => {
    if (gameState != dataManager.getSettings().game) {
      onChangeGame(dataManager.getSettings().game)
    }
  }, [gameState]))

  function onPrev() {
    navigation.navigate({ name: 'Tables', params: { page: page - 1, routeGame: dataManager.getSettings().game, league: league, season: season }, key: `${page - 1}_${league}_${season}` })
  }

  function onNext() {
    navigation.navigate({ name: 'Tables', params: { page: page + 1, routeGame: dataManager.getSettings().game, league: league, season: season }, key: `${page + 1}_${league}_${season}` })
  }

  const insets = useSafeAreaInsets();

  const showPrev = page != 1
  const showNext = table?.length >= 20

  function getTitle() {
    if (gameState == EGAME_ELTORNEO)
      return 'el Torneo'
    if (gameState == EGAME_BEATBET)
      return 'Beat Bet'
    if (gameState == EGAME_FIREBALL)
      return 'Fireball'
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

          backgroundColor={backgroundStyle.backgroundColor}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingBottom: 60
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
              <AppBar navigation={navigation} title={getTitle()} showLogo={false} />
            </View>

            {gameState == EGAME_ELTORNEO ? <TablesElTorneoPagePanel
              navigation={navigation}
              me={me}
              table={table}
              tableLoading={tableLoading}
              page={page}
              season={season}
              setSeason={setSeason}
              league={league}
              showPrev={showPrev}
              showNext={showNext}
              onNext={onNext}
              onPrev={onPrev}
              blockForAd={blockForAd}
              onUnlock={onUnlock}
              adLoaded={adLoaded} />
              : null}
            {gameState == EGAME_BEATBET ? <TablesBeatBetPagePanel
              navigation={navigation}
              me={me}
              table={table}
              tableLoading={tableLoading}
              page={page}
              season={season}
              setSeason={setSeason}
              league={league}
              showPrev={showPrev}
              showNext={showNext}
              onNext={onNext}
              onPrev={onPrev}
              blockForAd={blockForAd}
              onUnlock={onUnlock}
              adLoaded={adLoaded} /> : null}
            {gameState == EGAME_FIREBALL ? <TablesFireballPagePanel
              navigation={navigation}
              me={me}
              table={table}
              tableLoading={tableLoading}
              page={page}
              season={season}
              setSeason={setSeason}
              league={league}
              showPrev={showPrev}
              showNext={showNext}
              onNext={onNext}
              onPrev={onPrev}
              blockForAd={blockForAd}
              onUnlock={onUnlock}
              adLoaded={adLoaded} /> : null}

          </ScrollView>
          <Gamepad onShowMenu={onShowGamepadMenu} />
          <BottomNavBar page={EPAGE_TABLES} navigation={navigation} />
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

export default TablesPage;
