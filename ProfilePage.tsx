import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

export const ESTAT_TOTAL = 0
const ESTAT_SCORE = 1
const ESTAT_WINNER = 2

function ProfileCheap({title, selected, onPress, value}) {
  return (
    <TouchableOpacity activeOpacity={.8} onPress={onPress} style={{
      height: 40,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 10,
      backgroundColor: selected ? '#FF2882' : '#F7F7F7',
      borderColor: selected ? '#FF2882' : '#EAEDF1',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Text style={{
        fontSize: 16,
        color: selected ? 'white' : '#8E8E93',
        fontWeight: 'bold'
      }}>{title} {value}</Text>
    </TouchableOpacity>
  )
}

function UserPanel({navigation, place, user, isMe}) {
  function onNavEdit() {
    navigation.navigate("ProfileEdit")
  }

  if (user) {
    return (
      <View style={{
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        flexDirection: 'row'
      }}>
        <View style={{
            width: 70,
            height: 70,
            borderColor: '#EAEDF1',
            borderWidth: 2,
            backgroundColor: '#F7F7F7',
            borderRadius: 80,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
          { user.avatar?.length ? <Image style={{
                  width: 70,
                  height: 70,
                  objectFit: 'cover'
              }} src={`${SERVER_BASE_URL}/${user.avatar}`}/> : <ProfileIcon width={60} height={60} style={{marginTop: 10}}/> }
        </View>
        <View style={{
          marginLeft: 15,
          flex: 1
        }}>
          <Text style={{
              // marginTop: 10,
              color: 'black',
              fontSize: 18,
              fontFamily: 'NotoSansArmenian-Bold'
          }}>{user.name}</Text>
          <Text style={{
              marginTop: 2,
              color: '#8E8E93',
              fontSize: 12,
              fontFamily: 'NotoSansArmenian-Bold'
          }}>{place > 0 ? `${strings.place_in_el_torneo}: ${place}, ` : ''}{strings.points}: {user.points}</Text>
        </View>
        {isMe ? <TouchableOpacity activeOpacity={.6} onPress={onNavEdit} style={{
          width: 50,
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: 50,
          // backgroundColor: 'red'
        }}>
          <Icon name='chevron-right' size={30} color={'#8E8E93'}></Icon>
        </TouchableOpacity> : null }
      </View>
    )
  } else {
    return (
      <View style={{
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
        flexDirection: 'row'
      }}>
        <View style={{
            width: 70,
            height: 70,
            borderColor: '#EAEDF1',
            borderWidth: 2,
            backgroundColor: '#F7F7F7',
            borderRadius: 80,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        
        </View>
        <View style={{
          marginLeft: 15,
          flex: 1,
          alignItems: 'flex-start'
        }}>
          <Text style={{
              // marginTop: 10,
              color: 'transparent',
              fontSize: 18,
              backgroundColor: '#F7F7F7',
              borderRadius: 10,
              fontFamily: 'NotoSansArmenian-Bold'
          }}>First Name</Text>
          <Text style={{
              marginTop: 2,
              backgroundColor: '#F7F7F7',
              borderRadius: 10,
              color: 'transparent',
              fontSize: 12,
              fontFamily: 'NotoSansArmenian-Bold'
          }}>10 Points</Text>
        </View>
    
      </View>
    )
  }
}

function ProfilePage({ navigation, route }): JSX.Element {
    const { id } = route.params ? route.params : 0;
    const { globalPage } = route.params;
    const { selectedStat } = route.params;
    const { routeSelectedLeague } = route.params;

    const isMe = !id;
    const [page, setPage] = useState((globalPage - 1) * 5 + 1)
    const [predictsJson, setPredictsJson] = useState(null)
    const [predicts, setPredicts] = useState([])
    const [selectedLeague, setSelectedLeague] = useState(null)
    const [stats, setStats] = useState(ESTAT_TOTAL)
    // const [selectedStat, setSelectedStat] = useState(ESTAT_TOTAL)
    // const [user, setUser] = useState(isMe ? authManager.getMeSync() : authManager.getActiveUser())
    const [predictsReqFinished, setPredictsReqFinished] = useState(false)
    // const [place, setPlace] = useState(-1)
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [hasNext, setHasNext] = useState(false)
    const [blockForAd, setBlockForAd] = useState(dataManager.getSettings().blockForAd && !isMe)
    const [adLoaded, setAdLoaded] = useState(false)

    const user = isMe ? authManager.getMeSync() : authManager.getActiveUser()
    const backgroundStyle = {
      backgroundColor: 'white',
    };

  
    useEffect(() => {
      const leagues = dataManager.getLeagues()
      for (const l of leagues) {
        if (l.id == routeSelectedLeague) {
          setSelectedLeague(l)
          return
        }
      }

    }, []);

    useEffect(()=>{
      if (adsManager.isLoaded()) {
        setAdLoaded(true)
      } else {
        adsManager.loadAd()
        const unsub = adsManager.addLoadedListener(()=>{
          unsub()
          setAdLoaded(true)
        })
      }
    }, [])

    useEffect(() => {
      // if (page == (globalPage - 1) * 5 + 1) return

      if (selectedStat == ESTAT_TOTAL) return getPredicts()
      if (selectedStat == ESTAT_SCORE) return getPredictsByScore()
      if (selectedStat == ESTAT_WINNER) return getPredictsByWinner() 
    }, [page]);

  
      const place = dataManager.findUserPosition(user.id)

 
    function getStats() {
      if (!authManager.getToken()) return

      fetch(`${SERVER_BASE_URL}/api/v1/user/stats?user_id=${user.id}`, {
        method: 'GET',
        headers: { 
          'Authentication': authManager.getToken()
        },
      })
      .then(response => response.json())
      .then(data => {
        setStats(data)
      })
      .catch(error => console.error('Error fetching stats:', error));
    }
    
    function getPredictsByScore() {

      // if (!authManager.getToken()) return

      setLoading(true)

      fetch(`${SERVER_BASE_URL}/api/v1/user/score_predicts?page=${page}&user_id=${user.id}&league_id=${routeSelectedLeague ? routeSelectedLeague : -1}`, {
        method: 'GET',
        headers: { 
          // 'Authentication': authManager.getToken()
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.predicts.length <= 0) {
          setPredictsJson(data)
          setPredictsReqFinished(true)
          setLoading(false)
          setHasMore(false)
          setHasNext(false)
          return
        } 
        setLoading(false)
        setPredicts((prevPredicts) => [...prevPredicts, ...data.predicts])
        setPredictsJson(data)
        setPredictsReqFinished(true)
        if (page % 5 == 0) {
          setHasNext(true)
        }
      })
      .catch(error => { 
        setLoading(false)
        setHasMore(false)
        setHasNext(false)
        console.error('Error fetching leagues:', error)
        setPredictsReqFinished(true)
      });
    }

    function getPredictsByWinner() {
      // if (!authManager.getToken()) return

      fetch(`${SERVER_BASE_URL}/api/v1/user/winner_predicts?page=${page}&user_id=${user.id}&league_id=${routeSelectedLeague ? routeSelectedLeague : -1}`, {
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
          setHasMore(false)
          setHasNext(false)
          return
        } 
        setLoading(false)
        setPredicts((prevPredicts) => [...prevPredicts, ...data.predicts])
        setPredictsJson(data)
        setPredictsReqFinished(true)
        if (page % 5 == 0) {
          setHasNext(true)
        }
      })
      .catch(error => {
        setLoading(false)
        setHasMore(false)
        setHasNext(false)
        console.error('Error fetching leagues:', error)
        setPredictsReqFinished(true)
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
          setHasMore(false)
          setHasNext(false)
          return
        } 
        setLoading(false)
        setPredicts((prevPredicts) => [...prevPredicts, ...data.predicts])
        setPredictsJson(data)
        setPredictsReqFinished(true)
        if (page % 5 == 0) {
          setHasNext(true)
        }
      })
      .catch(error => { 
        setLoading(false)
        setHasMore(false)
        setHasNext(false)
        console.error('Error fetching leagues:', error)
        setPredictsReqFinished(true)
      });
    }
  
    function onLeaguePress(l) {
      let lid = -1;
      if (l) {
        lid = l.id
      } 

      const p = { 
        id: id,
        globalPage: 1,
        selectedStat: ESTAT_TOTAL,
        routeSelectedLeague: lid
      }

      navigation.navigate({name: 'Profile', params: p, key: `profile_page_${globalPage + 1}_stat_${ESTAT_TOTAL}_league_${lid}`})    
    }

    function getScorePredictsValue() {
      if (!predictsJson) return ''
      if (!predictsJson.totalScorePredicts) return '0'
      return `${predictsJson.totalScorePredicts} (${Number.parseInt(predictsJson.totalScorePredicts/predictsJson.totalPredicts * 100)}%)`
    }

    function getWinnerPredictsValue() {
      if (!predictsJson) return ''

      if (!predictsJson.totalWinnerPredicts) return '0'
      return `${predictsJson.totalWinnerPredicts} (${Number.parseInt(predictsJson.totalWinnerPredicts/predictsJson.totalPredicts * 100)}%)`
    }

    function onStatChange(stat) {
      const p = { 
        globalPage: 1,
        selectedStat: stat,
        routeSelectedLeague: routeSelectedLeague
      }

      navigation.navigate({name: 'Profile', params: { 
        id: id,
        globalPage: 1,
        selectedStat: stat,
        routeSelectedLeague: routeSelectedLeague
      }, key: `profile_page_${globalPage + 1}_stat_${stat}_league_${routeSelectedLeague}`})
    }

    function renderTopPart() {
      return (
        <View style={{
          width: "100%",
          // height: 500,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          paddingBottom: 20
        }}>
          <AppBar navigation={navigation}/>
          <UserPanel navigation={navigation} user={user} place={place} isMe={isMe}/>

          {predictsJson?.totalPredicts || routeSelectedLeague >= 1  ? <ScrollView 
            horizontal={true}
            // contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              paddingLeft: 10,
              alignItems: 'center',
              // minHeight: '100%',
               height: 60,
              // backgroundColor: 'blue',
            }}
            showsHorizontalScrollIndicator={ false}
            style={{
              // flex: 1,
              marginTop: 20,
              minHeight: 50,
            }}>
              <ProfileCheap onPress={()=>{onStatChange(ESTAT_TOTAL)}} selected={selectedStat == ESTAT_TOTAL} title={strings.total} value={predictsJson?.totalPredicts}/>
              <ProfileCheap onPress={()=>{onStatChange(ESTAT_SCORE)}} selected={selectedStat == ESTAT_SCORE} title={strings.score_predicted} value={getScorePredictsValue()}/>
              <ProfileCheap onPress={()=>{onStatChange(ESTAT_WINNER)}} selected={selectedStat == ESTAT_WINNER} title={strings.winner_or_draw_predicted} value={getWinnerPredictsValue()}/>
          </ScrollView> : null }

          {predictsJson?.totalPredicts || routeSelectedLeague >= 1 ? <ScrollView
            horizontal={true}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              // minHeight: '100%',
              height: 60,
              alignItems: 'center',
              // backgroundColor: 'green',
            }}
            showsHorizontalScrollIndicator={ false}
            style={{
              // flex: 1,
              // maxHeight: 120,
            }}
          >
            <LeagueChip league={null} selected={ routeSelectedLeague < 1} onPress={()=> {onLeaguePress(null)}}/>
            { dataManager.getLeagues().map((l)=>{
                return (<LeagueChip key={l.name} league={l} selected={l == selectedLeague} onPress={()=> {onLeaguePress(l)}}/>)
            })}
        </ScrollView> : null }

       </View>
      )
    }

    function onUnlock() {
      adsManager.showAd()
  
      const successUnsub = adsManager.addSuccessListener(()=>{  
        successUnsub()
        adsManager.setIsLoaded(false)
        setBlockForAd(false)
        AsyncStorage.setItem("lastAdTime", (new Date()).getTime().toString())
        dataManager.getSettings().blockForAd = false
      })
  
      const closeUnsub = adsManager.addCloseListener(()=>{
        closeUnsub()
        adsManager.setIsLoaded(false)
        adsManager.loadAd()
        setAdLoaded(false)
        const unsub = adsManager.addLoadedListener(()=>{
          unsub()
          setAdLoaded(true)
        })
      })
    }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#f7f7f7'}}>

    <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <StatusBar
        barStyle={'dark-content'}
        
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <View style={{
          flex: 1,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between'
          }}>
          
          {!predicts.length || blockForAd ? 
            <View style={{
              width: '100%',
              flex: 1,
            }}>
              {renderTopPart()}
              {!blockForAd ? <View style={{
                flex: 1,
                height: 200,
                // backgroundColor: 'red',
                paddingTop: 30
              }}>
               {loading ? <ActivityIndicator color={'#FF2882'} size="large"/> : <Text style={{
                  color: '#8E8E93',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}>{strings.no_predicts}</Text> }
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
                    }}>Unlock predictions</Text>
                    { adLoaded ? <Icon name='play-circle-filled' size={18} color='white' style={{
                      marginLeft: 4
                    }}/> : <ActivityIndicator size={'small'} color={'white'} style={{
                      marginLeft: 6
                    }} /> }
                  </TouchableOpacity>
              </View> }
            </View> : 
            <UserMatchesList navigation={navigation} loading={loading} selectedStat={selectedStat} globalPage={globalPage} hasNext={hasNext} hasMore={hasMore} page={page} setPage={setPage} renderTopPart={renderTopPart} user={user} predicts={predicts} selectedLeague={selectedLeague}/>
          } 
      
          <BottomNavBar page={ isMe ? EPAGE_PROFILE : null} navigation={navigation} />
        </View>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
}

export default ProfilePage;
