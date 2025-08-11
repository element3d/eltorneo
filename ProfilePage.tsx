import React, { useEffect, useState, useRef, useMemo } from 'react';
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

export const ESTAT_TOTAL = 0
const ESTAT_SCORE = 1
const ESTAT_WINNER = 2

export const ETAB_PREDICTS = 1
export const ETAB_BETS = 2

function ProfileCheap({ title, selected, onPress, value }) {
  return (
    <TouchableOpacity activeOpacity={.8} onPress={onPress} style={{
      height: 40,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 10,
      backgroundColor: selected ? '#FF2882' : Colors.bgColor,
      borderColor: selected ? '#FF2882' : Colors.borderColor,
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{
        fontSize: 16,
        color: selected ? 'white' : '#8E8E93',
        fontWeight: 'bold'
      }}>{title}</Text>
    </TouchableOpacity>
  )
}


function ProfilePage({ navigation, route }): JSX.Element {
  const { id } = route.params ? route.params : 0;
  const { globalPage } = route.params;
  const { tab } = route.params;
  const { routeSelectedLeague } = route.params;

  const isMe = !id;
  const [page, setPage] = useState((globalPage - 1) * 5 + 1)
  const [predictsJson, setPredictsJson] = useState(null)
  const [predicts, setPredicts] = useState([])
  const [betsJson, setBetsJson] = useState(null)
  const [bets, setBets] = useState([])
  const [selectedLeague, setSelectedLeague] = useState(null)
  const [stats, setStats] = useState(null)
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasNext, setHasNext] = useState(false)

  const user = isMe ? authManager.getMeSync() : authManager.getActiveUser()
  const place = user ? dataManager.findUserPosition(user.id) : 0
  const [blockForAd, setBlockForAd] = useState(place <= 3 && place >= 1 && dataManager.getSettings()?.blockForAd && !isMe)
  const [adLoaded, setAdLoaded] = useState(false)
  const [showMatchPreview, setShowMatchPreview] = useState(false)
  const [previewMatch, setPreviewMatch] = useState(null)

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
    if (tab == ETAB_PREDICTS)
      getPredicts()
    else
      getBets()
  }, [page]);

  function onCloseMatchPreview() {
    setShowMatchPreview(false)
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

  const renderTopPart = useMemo(() => (

    <ProfileHeader navigation={navigation}
      user={user}
      isMe={isMe}
      betsJson={betsJson}
      predictsJson={predictsJson}
      tab={tab} />

  ), [navigation, user, isMe, predictsJson, betsJson, tab]);

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

          {((!predicts.length || !predictsJson) && (!bets.length || !betsJson)) || blockForAd ?
            <View style={{
              width: '100%',
              flex: 1,
            }}>
              {<ProfileHeader navigation={navigation}
                user={user}
                isMe={isMe}
                betsJson={betsJson}
                predictsJson={predictsJson}
                tab={tab} />}
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
                }}>{tab == ETAB_BETS ? strings.no_bets : strings.no_predicts}</Text>}
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
            <UserMatchesList navigation={navigation} tab={tab} loading={loading} globalPage={globalPage} hasNext={hasNext} hasMore={hasMore} page={page} setPage={setPage} renderTopPart={renderTopPart} user={user} id={id} predicts={tab == ETAB_PREDICTS ? predicts : bets} totalPredicts={tab == ETAB_PREDICTS ? predictsJson.allPredicts : betsJson.allBets} selectedLeague={selectedLeague} onShowMatchPreview={onShowMatchPreview} onShowMatchTrailer={onShowMatchTrailer} />
          }

          <BottomNavBar page={isMe ? EPAGE_PROFILE : null} navigation={navigation} />
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
