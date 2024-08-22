import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Button,
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
import BottomNavBar from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import authManager from './AuthManager';
import moment from 'moment';
import TeamItem from './TeamItem';
import MatchPredictsSummaryPanel from './MatchPredictsSummaryPanel';
import MatchTop20PredictsPanel from './MatchTop20PredictsPanel';
import dataManager from './DataManager';
import strings from './Strings';
import adsManager from './AdsManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

function TeamItemEmpty() {
  return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      width: '50%',
      // marginTop: 20,
      marginRight: 10,
      marginLeft: 10
    }}>
        <View style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            backgroundColor: '#F7F7F7'
        }}/>
        <Text style={{
            color: 'black',
            marginTop: 10,
            fontSize: 16,
            color: 'transparent',
            borderRadius: 10,
            backgroundColor: '#F7F7F7',
            fontFamily: 'OpenSans-Bold'
        }}>EMPTY TEAM</Text>
        <Text style={{
          marginTop: 4,
          color: '#AEAEB2',
          fontWeight: 'bold'
        }}>Home</Text>
    </View>
  )
}

function MatchAppBar({match, navigation}) {
  return (
    <View style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 80
    }}>
      <TouchableOpacity activeOpacity={.6} onPress={()=>{navigation.goBack()}} style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        borderColor: '#EAEDF1',
        // borderWidth: 2,
        marginLeft: 20,
        justifyContent: 'center',
        backgroundColor: '#ffffff22'
      }}>
        <Icon name={'arrow-back'} color='white' size={30}></Icon>
      </TouchableOpacity>
      <Text style={{
        fontSize: 20,
        fontFamily: 'OpenSans-ExtraBold',
        color: 'white'
      }}>{match?.leagueName}</Text>
      <View style={{
        width: 50,
        height: 50,
        marginRight: 20,
      }}>
      </View>
    </View>
  )
}

function MatchDatePanel({match, isShowTopMatchTime, predictReqFinished}) {
  if (!match || !predictReqFinished) {
    return (
      <View style={{
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center'
      }}>
        <Text style={{
          color: 'transparent',
          fontSize: 18,
          fontWeight: 'bold',
          backgroundColor: '#F7F7F7',
          borderRadius: 10
          // fontFamily: 'NotoSansArmenian-Bold',
          // color: 'black'
        }}>{moment(match?.date).format('DD')} {strings[moment(match?.date).format('MMM').toLowerCase()]} {moment(match?.date).format('YYYY')}</Text>

        <View style={{
          marginTop: 4,
          backgroundColor: '#F7F7F7',
          paddingLeft: 8,
          paddingRight: 8,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15
        }}>
          <Text style={{
            fontFamily: 'NotoSansArmenian-Bold',
            fontSize: 14,
            color: 'transparent'
          }}>{moment(match?.date).format('HH:mm')}</Text>
        </View> 
      
      </View>
    )
  } else {
    return (
      <View style={{
        alignItems: 'center',
        marginBottom: 10,
        justifyContent: 'center'
      }}>
        <Text style={{
          color: 'black',
          fontSize: 18,
          fontWeight: 'bold'
          // fontFamily: 'NotoSansArmenian-Bold',
          // color: 'black'
        }}>{moment(match?.date).format('DD')} {strings[moment(match?.date).format('MMM').toLowerCase()]} {moment(match?.date).format('YYYY')}</Text>
        { isShowTopMatchTime ? <View style={{
          marginTop: 4,
          backgroundColor: '#00C56619',
          borderWidth: 1,
          borderColor: '#00C566',
          paddingLeft: 8,
          paddingRight: 8,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15
        }}>
          <Text style={{
            fontFamily: 'NotoSansArmenian-Bold',
            fontSize: 14,
            color: '#00C566'
          }}>{moment(match.date).format('HH:mm')}</Text>
        </View> : 
       
       <Text style={{
          marginTop: 4,
          fontSize: 12,
          color: '#AEAEB2',
          height: 30,
        }}>{dataManager.getWeekTitle({week: match.week, type: match.weekType})}</Text> }
      
      </View>
    )
  }
}


function MatchPage({ navigation, route }): JSX.Element {
    const { id } = route.params;

    const [match, setMatch] = useState(null)
    const [predict, setPredict] = useState(null)
    const [predicts, setPredicts] = useState(null)
    const [top20Predicts, setTop20Predicts] = useState(null)
    const [team1Score, setTeam1Score] = useState('')
    const [team2Score, setTeam2Score] = useState('')
    const [predictReqFinished, setPredictReqFinished] = useState(false)
    const [predictsReqFinished, setPredictsReqFinished] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [adClosed, setAdClosed] = useState(false)
    const [me, setMe] = useState(authManager.getMeSync())
    const [processing, setProcessing] = useState(false)

    const [showAd, setShowAd] = useState(false)

    const backgroundStyle = {
      backgroundColor: '#37003C',
    };

    useFocusEffect(()=>{

      if (dataManager.getPendingPredict()) {
        setMe(authManager.getMeSync())
        pp = dataManager.getPendingPredict()

        if (pp.match != id) {
          dataManager.setPendingPredict(null)
          return
        }
        if (isNaN(pp.team1_score) || isNaN(pp.team2_score)) {
          dataManager.setPendingPredict(null)
          return
        }
        setTeam1Score(pp.team1_score.toString())
        setTeam2Score(pp.team2_score.toString())
      }
    })

    useEffect(() => {
      if (!dataManager.getSettings().enableAds) return

      AsyncStorage.getItem('numActions')
      .then((d)=>{

        let numActions = Number.parseInt(d)
        if (!numActions) { 
          numActions = 0;
          AsyncStorage.setItem('numActions', numActions.toString());
        }

        if (numActions >= dataManager.getSettings().numMinAdActions) {
          setShowAd(true)
          setLoaded(adsManager.isLoaded())

          if (!adsManager.isLoaded()) {
            adsManager.onLoad = () => {
              setLoaded(true)
            }
            adsManager.loadAd()

            const errorUnsubscribe = adsManager.addErrorListener((err) => {
              errorUnsubscribe()
              adsManager.setIsLoaded(false)
              setShowAd(false)
              // onAddSuccess()
              
              // AsyncStorage.getItem('numActions')
              // .then((d)=>{
              //   let numActions = Number.parseInt(d)
              //   if (!numActions) numActions = 0;
                
              //   ++numActions;
              //   AsyncStorage.setItem('numActions', numActions.toString());
              // });
            });
          }
        }
      });
  
     

     

      // const successUnsub = adsManager.addSuccessListener(()=>{
      //   adsManager.setIsLoaded(false)

      //   console.log("============ SUCCESS ===========")
      //   console.log(id)
      //   console.log(team1Score)
      //   const requestOptions = {
      //     method: 'POST',
      //     headers: { 
      //       'Content-Type': 'application/json',
      //       'Authentication': authManager.getToken()
      //     },
      //     body: JSON.stringify({ 
      //       match: id,
      //       team1_score: Number.parseInt(team1Score),
      //       team2_score: Number.parseInt(team2Score)
      //      })
      //   };
  
      //   fetch(`${SERVER_BASE_URL}/api/v1/predicts`, requestOptions)
      //     .then(response => {
      //         if (response.status == 200) {
      //             return response.text()
      //         }
  
      //         setPredict({
      //           team1_score: team1Score,
      //           team2_score: team2Score,
      //           march_id: match.id
      //         })
      //         // unsub()
      //         return null
      //     })
      //     .then(data => {
      //         // if (!data) return    
      //         // unsub()       
      //     });
  
      //     setPredict({
      //       team1_score: team1Score,
      //       team2_score: team2Score,
      //       march_id: match.id,
      //       status: 1
      //     })
      // })

     

      // Unsubscribe from events on unmount
      return () => {
        //  unsubscribe();
        //  errorUnsubscribe()
        //  successUnsub()
         adsManager.onLoad = null
      }
    }, []);

  
    useEffect(() => {
      getMatch()
      getPredict()
    }, []);

    useEffect(()=>{
      getPredicts()
    }, [match])

    function getPredicts() {
      if (!match) return

      setPredictsReqFinished(false)
      fetch(`${SERVER_BASE_URL}/api/v1/match/predicts?match_id=${match.id}`, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        setPredictsReqFinished(true)
        setPredicts(data)
        getTop3();
      })
      .catch(error => { 
        setPredictsReqFinished(true)
        console.error('Error fetching predicts:', error)
      });
      
    }

    function getTop3() {
      // const pp = dataManager.getTestTop20Predicts()
      // setTop20Predicts({predicts: pp})
      // return
      if (!match) return
      fetch(`${SERVER_BASE_URL}/api/v1/match/predicts/top3?match_id=${match.id}`, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
        setTop20Predicts(data)
      })
      .catch(error => console.error('Error fetching top3:', error));
    }

    function getPredict() {
      if (!authManager.getToken()) { 
        setPredictReqFinished(true)
        return
      }

      fetch(`${SERVER_BASE_URL}/api/v1/user/predict?match_id=${id}`, {
        method: 'GET',
        headers: { 
          'Authentication': authManager.getToken()
        },
      })
      .then(response => response.json())
      .then(data => {
   
        if (!data || !Object.keys(data).length) {
          setPredict(null)
          setPredictReqFinished(true)
          return
        }
  
        setPredict(data)
        setTeam1Score(data.team1_score.toString())
        setTeam2Score(data.team2_score.toString())
        setPredictReqFinished(true)
      })
      .catch(error => {
        setPredictReqFinished(true)
        console.error('Error fetching predict:', error)
      });
      
    }

    function getMatch() {
      fetch(`${SERVER_BASE_URL}/api/v1/match?match_id=${id}`, {
        method: 'GET',
        // headers: { 'Content-Type': 'application/json' },
      })
        .then(response => response.json())
        .then(data => {
          setMatch(data[0])
        })
        .catch(error => console.error('Error fetching leagues:', error));
    }

    function onAddSuccess() {
      setProcessing(true)
      
      const requestOptions = {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authentication': authManager.getToken()
        },
        body: JSON.stringify({ 
          match: id,
          team1_score: Number.parseInt(team1Score),
          team2_score: Number.parseInt(team2Score)
         })
      };

      fetch(`${SERVER_BASE_URL}/api/v1/predicts`, requestOptions)
        .then(response => {
            if (response.status == 200) {
                return response.text()
            }

            setPredict({
              team1_score: team1Score,
              team2_score: team2Score,
              march_id: match.id,
              status: 0
            })
            setProcessing(false)
            // unsub()
            return null
        })
        .then(data => {
          setProcessing(false)
            // if (!data) return    
            // unsub()       
        })
        .catch(()=>{
          setProcessing(false)
        });
    }

    function onAdClose() {
      setAdClosed(true)
      setTeam1Score('')
      setTeam2Score('')
    }

    function onPredict() {
      if (!authManager.getMeSync()) {
        if (!isNaN(Number.parseInt(team1Score)) && !isNaN(Number.parseInt(team2Score))) {
          dataManager.setPendingPredict({ 
            match: id,
            team1_score: Number.parseInt(team1Score),
            team2_score: Number.parseInt(team2Score)
          })
        }
        navigation.navigate('Login')
        return
      }
      
      if (showAd) {
        if (loaded || adsManager.isLoaded()) { 
          adsManager.showAd()

          const successUnsub = adsManager.addSuccessListener(()=>{
            successUnsub()
            adsManager.setIsLoaded(false)
            onAddSuccess()
            AsyncStorage.setItem('numActions', '0');
          })

          const closeUnsub = adsManager.addCloseListener(()=>{
            closeUnsub()
            adsManager.setIsLoaded(false)
            onAdClose()
          })

          return
        }

      } else {
        onAddSuccess()
        AsyncStorage.getItem('numActions')
        .then((d)=>{
          let numActions = Number.parseInt(d)
          if (!numActions) numActions = 0;
          
          ++numActions;
          AsyncStorage.setItem('numActions', numActions.toString());
        });
      }
      
    }

    function onTeam1Change(e) {
      const numericText = e.replace(/[^0-9]/g, '');
      setTeam1Score(numericText)
    }

    function onTeam2Change(e) {
      const numericText = e.replace(/[^0-9]/g, '');
      setTeam2Score(numericText)
    }

    function isScoreReady() {
      return team1Score.length > 0 && team2Score.length > 0 && Number.parseInt(team1Score) >=0 && Number.parseInt(team2Score) >= 0
    }

    function getBorderColor(p) {
      if (p.status == 0) return '#8E8E93'
      if (p.status == 1) return '#00C566'
      if (p.status == 2) return '#ff7539'
      if (p.status == 3) return '#FF4747'
    } 

    function getBgColor(p) {
      if (p.status == 0) return '#F7F7F7'
      if (p.status == 1) return '#00C56619'
      if (p.status == 2) return '#FACC1519'
      if (p.status == 3) return '#FF474719'
    } 

    function isShowScoreInput() {
      // if (!authManager.getMeSync()) return false
      if (isMatchEnded()) return false
      if (isMatchLive()) return false
      if (match?.week < match?.currentWeek) return false
      if (predict) return false

      return true
    }

    function isMatchLive() {
      if (match?.date < new Date().getTime() && (match?.team1_score < 0 || match?.team2_score < 0)) return true
      return false
    }

    function isMatchEnded() {
      return match?.team1_score >= 0 && match?.team2_score >= 0
    }

    function isShowScoreText() {
      if (isMatchLive()) return false
      if (isShowScoreInput()) return false
      if (!isMatchEnded()) return false

      return true
    }

    function isShowTopMatchTime() {
      if (isMatchLive()) return false;
      if (isMatchEnded()) return false;
      if (predict) return false
      return true
    }

    function isPredictDisabled() {
      if (processing) return true
      if (!isScoreReady() && !!authManager.getMeSync()) {
        return true
      }
      if (showAd && !loaded) return true
      if (adClosed) return true

      return false
    }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#F7F7F7'}}>

    <SafeAreaView style={{flex: 1, backgroundColor: '#F7F7F7'}}>
      <StatusBar
        barStyle={'light-content'}
        
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <View style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            // minHeight: '100%',
            alignItems: 'center'

          }}
          style={{
            flex: 1,
          }}>
            <Image resizeMode="cover" src={`${SERVER_BASE_URL}/data/leagues/${match?.leagueName}_banner.png`} style={{
              position: 'absolute',
              width: '100%',
              
              height: 230,
              // margin: 20,
              backgroundColor: '#37003C',
              borderRadius: 20,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}></Image>
            <MatchAppBar navigation={navigation} match={match} />
          
           
          <View style={{
            width: '88%',
            borderRadius: 20,
            backgroundColor: 'white',
            paddingTop: 20,
            paddingBottom: 10
          }}>
            <MatchDatePanel match={match} isShowTopMatchTime={isShowTopMatchTime()} predictReqFinished={predictReqFinished}  />
            <View style={{
              width: '100%',
              paddingBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>

              { match ? <TeamItem team={match.team1} isHome={true}/> : <TeamItemEmpty /> }

              { match ? <TeamItem team={match.team2}/> : <TeamItemEmpty /> }
               <View style={{
                position: 'absolute',
                flexDirection: 'row',
                // backgroundColor: 'blue',
                // width: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                bottom: 55
              }}>
                {isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' inputMode='numeric' value={team1Score} onChangeText={onTeam1Change} style={{
                  width: 45,
                  marginRight: 4,
                  height: 50,
                  fontSize: 20,
                  textAlign: 'center',
                  color: team1Score.length ? 'white' :'black',
                  backgroundColor: team1Score.length ? '#FF2882' : '#00000011',
                  borderRadius: 10,
                  fontFamily: 'OpenSans-Bold'
                }}></TextInput> : null }
                { isShowScoreText() ? <Text  style={{
                  width: 30,
                  // marginRight: 4,
                  height: 50,
                  fontSize: 30,
                  color:  'black',
                  textAlign: 'center',
                  // backgroundColor: '#00000011',
                  // borderRadius: 10,
                  fontFamily: 'OpenSans-Bold'
                }}>{match?.team1_score}</Text> : null }

                {isMatchLive() ?  <View style={{
                  marginTop: 4,
                  backgroundColor: '#00C56619',
                  borderWidth: 1,
                  borderColor: '#00C566',
                  paddingLeft: 8,
                  paddingRight: 8,
                  marginBottom: 8,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15
                }}>
                  <Text style={{
                    fontFamily: 'NotoSansArmenian-Bold',
                    fontSize: 14,
                    color: '#00C566'
                  }}>{'LIVE'}</Text>
                </View> : null }
                { (!isMatchLive() && isMatchEnded()) || isShowScoreInput() ? <Text style={{
                  fontSize: 30,
                  height: 50,
                  color: 'black'
                }}>:</Text> : null }
                { !isMatchLive() && !isMatchEnded() && !isShowScoreInput() ? <View style={{
                  marginTop: 4,
                  backgroundColor: '#00C56619',
                  borderWidth: 1,
                  borderColor: '#00C566',
                  paddingLeft: 8,
                  paddingRight: 8,
                  height: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15
                }}>
                  <Text style={{
                    fontFamily: 'NotoSansArmenian-Bold',
                    fontSize: 14,
                    color: '#00C566'
                  }}>{moment(match?.date).format('HH:mm')}</Text>
                </View> : null }
                
                {isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' value={team2Score} onChangeText={onTeam2Change} style={{
                  width: 45,
                  height: 50,
                  marginLeft: 4,
                  fontSize: 20,
                  backgroundColor: team2Score.length ? '#FF2882' : '#00000011',
                  borderRadius: 10,
                  color: team2Score.length ? 'white' : 'black',
                  textAlign: 'center',
                  // borderBottomColor: 'red',
                  // borderBottomWidth: 2,
                  fontFamily: 'OpenSans-Bold'
                }}></TextInput> : null }
                { isShowScoreText() ? <Text  style={{
                  width: 30,
                  // marginRight: 4,
                  height: 50,
                  fontSize: 30,
                  color: 'black',
                  textAlign: 'center',
                  // backgroundColor: '#00000011',
                  // borderRadius: 10,
                  fontFamily: 'OpenSans-Bold'
                }}>{match?.team2_score}</Text> : null }

              
              </View> 
            
            </View>
            {(!isMatchEnded() && !isMatchLive()) || predict ? <View style={{
                width: '100%',
                height: 50,
                // marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red'
              }}>

              {  !predictReqFinished ? <View style={{
                 height: 30,
                 width: 100,
                 borderRadius: 20,
                 alignItems: 'center',
                 justifyContent: 'center',
                 backgroundColor: '#F7F7F7'
              }}>

              </View> : null }
              
              {isShowScoreInput() && predictReqFinished ?  <TouchableOpacity onPress={onPredict} disabled={isPredictDisabled()} activeOpacity={.8} style={{
                opacity: !isPredictDisabled() ? 1 : .8
              }}>
                  <View style={{
                    height: 30,
                    width: 'auto',
                    paddingLeft: 30,
                    paddingRight: 30,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fb2781',
                    flexDirection: 'row'
                  }}>
                    <Text style={{
                      color: 'white',
                      fontFamily: 'NotoSansArmenian-Bold'
                    }}>{ authManager.getMeSync() ? strings.predict : strings.sign_in_to_predict}</Text>
                    { showAd && loaded? <Icon name='play-circle-filled' size={20} color='white' style={{
                      marginLeft: 4
                    }}/> : null }
                    { showAd && !loaded ? <ActivityIndicator color={'white'} style={{
                      marginLeft: 10
                    }} size={'small'}/> : null } 
                  </View>
                </TouchableOpacity> : null}
                {predict ? <View style={{
                  height: 30,
                  paddingLeft: 20,
                  paddingRight: 20,
                  // borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 15,
                  backgroundColor: getBgColor(predict),
                  borderColor: getBorderColor(predict)
                }}>
                  <Text style={{
                    color: getBorderColor(predict),
                    fontFamily: 'NotoSansArmenian-Bold'
                  }}>{dataManager.getPredictTitle(predict)} {predict.team1_score} : {predict.team2_score}</Text>
                </View> : null }
            </View> : null }
          </View>

          <View style={{
            width: '90%',
            marginTop: 30
          }}>
            {predicts && predicts.numPredicts? <MatchPredictsSummaryPanel predicts={predicts}/> : null }
            {top20Predicts && top20Predicts.predicts.length ? <MatchTop20PredictsPanel match={match} isMatchEnded={isMatchEnded()} navigation={navigation} top20Predicts={top20Predicts}/> : null }
            {predictsReqFinished && !predicts?.numPredicts ? <Text style={{
              color: '#8E8E93',
              fontSize: 14,
              fontWeight: 'bold',
              alignSelf: 'center'
            }}>{strings.no_pred_for_match}</Text> : null}

          </View>
        

        </ScrollView>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
}

export default MatchPage;
