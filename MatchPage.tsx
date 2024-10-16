import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
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
import MatchStatisticsPanel from './MatchStatisticsPanel';
import MatchEventsPanel from './MatchEventsPanel';
import MatchLineupsPanel from './MatchLineupsPanel';
import MatchH2HPanel from './MatchH2HPanel';
import MatchTablePanel from './MatchTablePanel';
import Colors from './Colors';
import MatchPredictsSummaryPanel2 from './MatchPredictsSummaryPanel2';
import GoogleIcon from './assets/google.svg';
import gsingin from './GSignin';
import SpecialAwardPanel from './SpecialAwardPanel';

const EMODE_DEFAULT = 0
const EMODE_EDIT = 1

function MatchAppBar({ match, navigation }) {
  return (
    <View style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      height: 70
    }}>
      <TouchableOpacity activeOpacity={.6} onPress={() => { navigation.goBack() }} style={{
        width: 45,
        height: 45,
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
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'Poppins-Bold',
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


function MatchDatePanel({ match, isShowTopMatchTime }) {
  function getDate() {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    const matchDate = moment(match.date); // Ensure it's in milliseconds

    if (matchDate.isSame(today, 'day')) {
        return strings.today;
    } else if (matchDate.isSame(tomorrow, 'day')) {
        return strings.tomorrow;
    } else {
        return `${matchDate.format('DD')} ${strings[matchDate.format('MMM').toLowerCase()]} ${matchDate.format('YYYY').toLowerCase()}`;
    }
}

  return (
    <View style={{
      alignItems: 'center',
      // marginBottom:- 10,
      justifyContent: 'center'
    }}>
      <Text style={{
        color: Colors.titleColor,
        fontSize: 18,
        fontWeight: 'bold'
        // fontFamily: 'NotoSansArmenian-Bold',
        // color: 'black'
      }}>{getDate()}</Text>
      {isShowTopMatchTime ? <View style={{
        marginTop: 4,
        backgroundColor: '#00C56619',
        borderWidth: 1,
        borderColor: '#00C566',
        paddingLeft: 8,
        paddingRight: 8,
        height: 26,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15
      }}>
        <Text style={{
          fontWeight: 'bold',
          // fontFamily: 'Poppins-Bold',
          fontSize: 14,
          lineHeight: 20,
          color: '#00C566'
        }}>{moment(match.date).format('HH:mm')}</Text>
      </View> :

        <Text style={{
          marginTop: 1,
          fontSize: 12,
          lineHeight: 12,
          color: '#AEAEB2',
          fontWeight: 'bold',
          height: 20,
          // backgroundColor: 'red'
        }}>{dataManager.getWeekTitle({ week: match.week, type: match.weekType })}</Text>}

    </View>
  )
}

function ViewChip({ title, selected, onClick }) {
  return <TouchableOpacity onPress={onClick} activeOpacity={.8} style={{
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: selected ? 0 : 1,
    borderColor: Colors.borderColor,
    backgroundColor: selected ? '#FF2882' : Colors.gray800,
    paddingLeft: 20,
    paddingRight: 20,
    marginRight: 10,
  }}>
    <Text style={{
      fontWeight: 'bold',
      color: selected ? 'white' : '#8E8E93'
    }}>
      {title}
    </Text>
  </TouchableOpacity>
}


function MatchPage({ navigation, route }): JSX.Element {
  const { id } = route.params;

  const dmMatch = dataManager.getMatch()
  const dmPredict = dmMatch.predict
  let dmTeam1Score = ''
  let dmTeam2Score = ''
  if (dmPredict) {
    dmTeam1Score = dmPredict.team1_score.toString()
    dmTeam2Score = dmPredict.team2_score.toString()
  }

  const [match, setMatch] = useState(dmMatch)
  const [predict, setPredict] = useState(dmMatch.predict)
  const [predicts, setPredicts] = useState(null)
  const [top20Predicts, setTop20Predicts] = useState(null)
  const [team1Score, setTeam1Score] = useState(dmTeam1Score)
  const [team2Score, setTeam2Score] = useState(dmTeam2Score)
  const [predictReqFinished, setPredictReqFinished] = useState(false)
  const [predictsReqFinished, setPredictsReqFinished] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [adClosed, setAdClosed] = useState(false)
  const [me, setMe] = useState(authManager.getMeSync())
  const [processing, setProcessing] = useState(false)
  const [blockForAd, setBlockForAd] = useState(dataManager.getSettings().blockForAd)
  const [showAd, setShowAd] = useState(false)
  const [statistics, setStatistics] = useState(null)
  const [events, setEvents] = useState(null)
  const [lineups, setLineups] = useState(null)
  const [table, setTable] = useState(null)
  const [mode, setMode] = useState(EMODE_DEFAULT)
  const [header, setHeader] = useState(null)

  const scrollViewRef = useRef(null);

  const EVIEW_PREDICTIONS = 1
  const EVIEW_STATISTICS = 2
  const EVIEW_EVENTS = 3
  const EVIEW_LINEUPS = 4
  const EVIEW_H2H = 5
  const EVIEW_TABLE = 6

  const [view, setView] = useState(EVIEW_PREDICTIONS)

  const backgroundStyle = {
    backgroundColor: '#37003C',
  };

  useFocusEffect(
    useCallback(() => {
      setBlockForAd(dataManager.getSettings()?.blockForAd && adsManager.isLoaded())
      setLoaded(adsManager.isLoaded())

      if (dataManager.getPendingPredict()) {
        setMe(authManager.getMeSync());
        const pp = dataManager.getPendingPredict();

        if (pp.match !== id) {
          dataManager.setPendingPredict(null);
          return;
        }
        if (isNaN(pp.team1_score) || isNaN(pp.team2_score)) {
          dataManager.setPendingPredict(null);
          return;
        }
        setTeam1Score(pp.team1_score.toString());
        setTeam2Score(pp.team2_score.toString());
      }

      // Fetch live data at intervals
      const interval = setInterval(() => {
        if (match && !isMatchLive()) {
          clearInterval(interval)
          return
        }
        getLive();
      }, 30000);

      // Cleanup interval on focus loss or unmount
      return () => clearInterval(interval);

    }, [id])
  );

  useEffect(() => {
    if (view == EVIEW_STATISTICS) {
      fetch(`${SERVER_BASE_URL}/api/v1/match/statistics?match_id=${match.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          setStatistics(data)
        })
        .catch(error => {
          setStatistics(null)
        });
    } else if (view == EVIEW_EVENTS) {
      fetch(`${SERVER_BASE_URL}/api/v1/match/events?match_id=${match.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          setEvents(data)
        })
        .catch(error => {
          setEvents(null)
        });
    } else if (view == EVIEW_LINEUPS) {
      fetch(`${SERVER_BASE_URL}/api/v1/match/lineups?match_id=${match.id}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          setLineups(data)
        })
        .catch(error => {
          // setEvents(null)
        });
    } else if (view == EVIEW_TABLE) {
      getTable()
    }

  }, [view])

  useEffect(() => {

    if (!dataManager.getSettings().enableAds) return
    if (!authManager.getMeSync() && !blockForAd) return

    if (adsManager.isLoaded()) {
      setLoaded(true)
    } else {
      setBlockForAd(false)
      setLoaded(false)
      adsManager.loadAd()

      adsManager.addErrorListener((e) => {
      })
    }
    adsManager.onLoad = () => {
      // setLoaded(true)
      adsManager.setIsLoaded(true)
    }

    const errorUnsubscribe = adsManager.addErrorListener((err) => {
      errorUnsubscribe()
      adsManager.setIsLoaded(false)
      setShowAd(false)
    });

    // const closeUnsubscribe = adsManager.addCloseListener((err) => {
    //   closeUnsubscribe()
    //   adsManager.setIsLoaded(false)
    //   setShowAd(false)
    // });
  }, [])

  useEffect(() => {
    if (!dataManager.getSettings().enableAds) return

    AsyncStorage.getItem('numActions')
      .then((d) => {

        let numActions = Number.parseInt(d)
        if (!numActions) {
          numActions = 0;
          AsyncStorage.setItem('numActions', numActions.toString());
        }

        if (numActions >= dataManager.getSettings().numMinAdActions || match.is_special) {
          setShowAd(true)
          setLoaded(adsManager.isLoaded())

          if (!adsManager.isLoaded()) {
            adsManager.loadAd()
            adsManager.addLoadedListener(() => {
              setLoaded(true)
              adsManager.setIsLoaded(true)
            })

            adsManager.addErrorListener(()=>{
             
            })
          }
        }
      });

    // Unsubscribe from events on unmount
    return () => {
      //  unsubscribe();
      //  errorUnsubscribe()
      //  successUnsub()
      adsManager.onLoad = null
    }
  }, []);

  function getHeader(id) {
    fetch(`${SERVER_BASE_URL}/api/v1/match/header?match_id=${id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setPredictsReqFinished(true)

        if (data.statistics || data.events || data.lineups) {
          setHeader(data)
        }

      })
      .catch(error => {

      });
  }

  useEffect(() => {
    getMatch()
    // getPredict()
  }, []);

  useFocusEffect(
    useCallback(()=>{
      getPredict()
    }, [])
  )

  useEffect(() => {
    // getPredicts(match)
  }, [match])

  function getTable() {
    const leagueIndex = 0

    fetch(`${SERVER_BASE_URL}/api/v1/league/table?league_id=${match.league}&league_index=${match.team1.league_index}`, {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        setTable(data)
      })
      .catch(error => {
        console.error('Error fetching leagues:', error)
      });
  }

  function getPredicts(m) {

    if (!m) return

    setPredictsReqFinished(false)
    fetch(`${SERVER_BASE_URL}/api/v1/match/predicts?match_id=${m.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setPredicts(data)
        getTop3(m);
      })
      .catch(error => {
        setPredictsReqFinished(true)
        console.error('Error fetching predicts:', error)
      });

  }

  function getTop3(match) {
    if (!match) return
    fetch(`${SERVER_BASE_URL}/api/v1/match/predicts/top3?match_id=${match.id}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTop20Predicts(data)
        getHeader(match.id)
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
        setPredictReqFinished(true)
      })
      .catch(error => {
        setPredictReqFinished(true)
        console.error('Error fetching predict:', error)
      });
  }

  function getMatch() {
    getPredicts(match)

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

  function getLive() {
    fetch(`${SERVER_BASE_URL}/api/v1/match/live?match_id=${id}`, {
      method: 'GET',
      // headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        setMatch(prevMatch => ({ ...prevMatch, ...data }));
        if (data?.status == "FT") {
          getPredicts(match)
        }
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
        return response.json()
      })
      .then(data => {
        dmMatch.predict = {
          id: data.predict_id,
          team1_score: Number.parseInt(team1Score),
          team2_score: Number.parseInt(team2Score),
          match_id: match.id,
          status: 0
        }

        setPredict(dmMatch.predict)
        setProcessing(false)

        return null
      })
      .catch((e) => {
        setProcessing(false)
      });
  }

  function reloadAdOnClose(toastMsg) {
    if (!adsManager.getRewarded()) {
      showToast(toastMsg)
      adsManager.setIsLoaded(false)
      setAdClosed(true)
      adsManager.loadAd()

      adsManager.onLoad = () => {
        setAdClosed(false)
        setLoaded(true)
        adsManager.setIsLoaded(true)
      }
    } else {
      setAdClosed(false)
    }

    setLoaded(false)
    adsManager.setIsLoaded(false)
  }

  function onSaveAdSuccess() {
    setMode(EMODE_DEFAULT)
    setProcessing(true)

    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken()
      },
      body: JSON.stringify({
        predict: predict.id,
        team1_score: Number.parseInt(team1Score),
        team2_score: Number.parseInt(team2Score)
      })
    };

    fetch(`${SERVER_BASE_URL}/api/v1/predicts`, requestOptions)
      .then(response => {
        setPredict({
          id: predict.id,
          user_id: predict.user_id,
          team1_score: team1Score,
          team2_score: team2Score,
          match_id: predict.match_id,
          status: predict.status
        })
        dmPredict.team1_score = team1Score
        dmPredict.team2_score = team2Score

        setProcessing(false)
        return null
      })
      .then(data => {
        setProcessing(false)
      })
      .catch(() => {
        setProcessing(false)
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

      if (showAd) {
        if (adsManager.isLoaded()) {
          setLoaded(true)
        } else {
          setTimeout(() => {
            adsManager.loadAd()
            adsManager.onLoad = () => {
              setLoaded(true)
            }
          }, 200)
        }

        const errorUnsubscribe = adsManager.addErrorListener((err) => {
          errorUnsubscribe()
          adsManager.setIsLoaded(false)
          setShowAd(false)
        });
      }
    })

    const closeUnsub = adsManager.addCloseListener(() => {
      closeUnsub()
      reloadAdOnClose(strings.unlock_ad_msg)
    })
  }

  function showToast(msg) {
    ToastAndroid.show(msg, ToastAndroid.LONG);
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
      gsingin.signin(null, (me) => {
        setMe(me)
        getPredict()
      })

      // navigation.navigate('Login')
      return
    }

    if (showAd) {
      if (loaded || adsManager.isLoaded()) {
        adsManager.showAd()

        const successUnsub = adsManager.addSuccessListener(() => {
          successUnsub()
          adsManager.setIsLoaded(false)
          setShowAd(false)
          onAddSuccess()
          AsyncStorage.setItem('numActions', '0');
          setBlockForAd(false)
          dataManager.getSettings().blockForAd = false

          setLoaded(false)
          setTimeout(() => {
            adsManager.loadAd()
            adsManager.addLoadedListener(() => {
              setLoaded(true)
              adsManager.setIsLoaded(true)
            })
          }, 300)
        })

        const closeUnsub = adsManager.addCloseListener(() => {
          reloadAdOnClose(strings.predict_ad_msg)
          closeUnsub()
        })

        return
      } else {
        onAddSuccess()
        setShowAd(false)
      }

    } else {
      onAddSuccess()
      setShowAd(false)
      AsyncStorage.getItem('numActions')
        .then((d) => {
          let numActions = Number.parseInt(d)
          if (!numActions) numActions = 0;

          ++numActions;
          AsyncStorage.setItem('numActions', numActions.toString());
        });
    }

  }

  function onSavePredict() {
    if (showAd) {
      if (loaded || adsManager.isLoaded()) {
        adsManager.showAd()

        const successUnsub = adsManager.addSuccessListener(() => {
          successUnsub()
          adsManager.setIsLoaded(false)
          setShowAd(false)
          onSaveAdSuccess()
          AsyncStorage.setItem('numActions', '0');
          setBlockForAd(false)
          dataManager.getSettings().blockForAd = false
        })

        const closeUnsub = adsManager.addCloseListener(() => {
          reloadAdOnClose(strings.predict_edit_ad_msg)
          closeUnsub()
        })
        return
      }
      else {
        onSaveAdSuccess()
        setShowAd(false)
        AsyncStorage.getItem('numActions')
          .then((d) => {
            let numActions = Number.parseInt(d)
            if (!numActions) numActions = 0;

            ++numActions;
            AsyncStorage.setItem('numActions', numActions.toString());
          });
      }

    } else {
      onSaveAdSuccess()
      setShowAd(false)
      AsyncStorage.getItem('numActions')
        .then((d) => {
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
    return team1Score.length > 0 && team2Score.length > 0 && Number.parseInt(team1Score) >= 0 && Number.parseInt(team2Score) >= 0
  }

  function getBorderColor(p) {
    if (p.status == 0) return "black"//'#8E8E93'
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
    if (!match) return false


    if (isMatchEnded()) return false
    if (isMatchLive()) return false

    if (match.week < match.currentWeek && match.team1_score != -1 && match.team2_score != -1) return false

    if (predict) {
      if (mode == EMODE_EDIT)
        return true

      return false
    }

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
    // if (showAd && !loaded) return true

    if (adClosed) return true

    return false
  }

  function isSaveDisabled() {

    if (processing) return true
    if (!isScoreReady() && !!authManager.getMeSync()) {
      return true
    }
    // if (showAd && !loaded) return true

    if (adClosed) return true

    return false
  }

  function getStatusText() {
    if (match.status == 'HT' || match.status == 'FT') return match.status

    return '  ' + match.elapsed + " '"
  }

  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const scrollToStart = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  function onSetEditMode() {
    if (dataManager.getSettings().enableAds) setShowAd(true)
    setMode(EMODE_EDIT)
  }

  // function getSummaryPanel() {
  //   if (true) return 
  //   return <MatchPredictsSummaryPanel  match={match} onUnlock={onUnlock} adLoaded={loaded} blockForAd={blockForAd} predicts={predicts}/>
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bgColor }}>

      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
        <StatusBar
          barStyle={'light-content'}

          backgroundColor={backgroundStyle.backgroundColor}
        />

        <View style={{ flex: 1 }}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{
              // minHeight: '100%',
              alignItems: 'center'

            }}
            style={{
              flex: 1,
            }}>
            <Image resizeMode="cover" src={`${SERVER_BASE_URL}/data/leagues/${match?.leagueName}_banner.png${dataManager.getImageCacheTime()}`} style={{
              position: 'absolute',
              width: '100%',

              height: 210,
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
              
              backgroundColor: Colors.gray800,
              paddingTop: 10,
              paddingBottom: 10
            }}>
              <MatchDatePanel match={match} isShowTopMatchTime={isShowTopMatchTime()} predictReqFinished={predictReqFinished} />
              <View style={{
                width: '100%',
                paddingBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>

                <TeamItem team={match.team1} isHome={true} />
                <TeamItem team={match.team2} isHome={false} />

                <View style={{
                  position: 'absolute',
                  flexDirection: 'row',
                  // backgroundColor: 'blue',
                  // width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bottom: isMatchLive() || isMatchEnded() ? 30 : 55
                }}>
                  {isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' inputMode='numeric' value={team1Score} onChangeText={onTeam1Change} style={{
                    width: 45,
                    marginRight: 4,
                    height: 50,
                    fontSize: 20,
                    textAlign: 'center',
                    color: Colors.titleColor,
                    backgroundColor: Colors.mode == 1 ? '#00000011' : '#ffffff11',
                    borderRadius: 10,
                    fontFamily: 'OpenSans-Bold'
                  }}></TextInput> : null}
                  {isShowScoreText() ? <Text style={{
                    width: 30,
                    // marginRight: 4,
                    height: 50,
                    fontSize: 30,
                    color: Colors.titleColor,
                    textAlign: 'center',
                    // backgroundColor: '#00000011',
                    // borderRadius: 10,
                    fontFamily: 'OpenSans-Bold'
                  }}>{match?.team1_score}</Text> : null}

                  {isMatchLive() ?

                    <View style={{
                      marginTop: 20
                    }}>
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop: 20,
                        marginBottom: 5
                      }}>
                        <Text style={{
                          color: Colors.titleColor,
                          fontSize: 24,
                          fontWeight: 'bold',
                          marginRight: 10
                        }}>{match.team1_score_live}</Text>
                        <Text style={{
                          color: Colors.titleColor,
                          fontSize: 20,
                          fontWeight: 'bold'
                        }}>:</Text>
                        <Text style={{
                          color: Colors.titleColor,
                          fontSize: 24,
                          fontWeight: 'bold',
                          marginLeft: 10
                        }}>{match.team2_score_live}</Text>
                      </View>
                      <View style={{
                        // marginTop: 4,
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
                          width: 40,
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'NotoSansArmenian-Bold',
                          fontSize: 14,
                          color: '#00C566',
                          textAlign: 'center'
                        }}>{getStatusText()}</Text>
                      </View>
                    </View> : null}
                  {(!isMatchLive() && isMatchEnded()) || isShowScoreInput() ? <Text style={{
                    fontSize: 30,
                    height: 50,
                    // backgroundColor: 'red',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    textAlignVertical: isShowScoreInput() ? 'center' : 'top',
                    paddingBottom: 6,
                    color: Colors.titleColor
                  }}>:</Text> : null}
                  {!isMatchLive() && !isMatchEnded() && !isShowScoreInput() ? <View style={{
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
                  </View> : null}

                  {isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' value={team2Score} onChangeText={onTeam2Change} style={{
                    width: 45,
                    height: 50,
                    marginLeft: 4,
                    fontSize: 20,
                    backgroundColor: Colors.mode == 1 ? '#00000011' : '#ffffff11',
                    borderRadius: 10,
                    color: Colors.titleColor,
                    textAlign: 'center',
                    // borderBottomColor: 'red',
                    // borderBottomWidth: 2,
                    fontFamily: 'OpenSans-Bold'
                  }}></TextInput> : null}
                  {isShowScoreText() ? <Text style={{
                    width: 30,
                    // marginRight: 4,
                    height: 50,
                    fontSize: 30,
                    color: Colors.titleColor,
                    textAlign: 'center',
                    // backgroundColor: '#00000011',
                    // borderRadius: 10,
                    fontFamily: 'OpenSans-Bold'
                  }}>{match?.team2_score}</Text> : null}


                </View>

              </View>
              {(!isMatchEnded() && !isMatchLive()) || predict ? <View style={{
                width: '100%',
                // minHeight: 40,
                // marginTop: 10,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red'
              }}>

                { match.is_special ? <SpecialAwardPanel /> : null }

                {mode == EMODE_DEFAULT && isShowScoreInput() ? <TouchableOpacity onPress={onPredict} disabled={isPredictDisabled()} activeOpacity={.8} style={{
                  opacity: !isPredictDisabled() ? 1 : .8
                }}>
                  <View style={{
                    height: 30,
                    width: 'auto',
                    paddingLeft: authManager.getMeSync() ? 20 : 10,
                    paddingRight: 20,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fb2781',
                    flexDirection: 'row'
                  }}>
                    {!authManager.getMeSync() ? 
                      <View style={{
                        width: 20, 
                        height: 20,
                        marginRight: 6,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <GoogleIcon width={16} height={18} /> 
                      </View>
                      : null }
                    <Text style={{
                      color: 'white',
                      marginTop: 2,
                      // fontWeight: 'bold',
                      fontFamily: 'Poppins-Bold'
                    }}>{authManager.getMeSync() ? strings.predict : strings.sign_in_to_predict}</Text>
                    
                    {showAd && loaded && authManager.getMeSync() ? <Icon name='play-circle-filled' size={20} color='white' style={{
                      marginLeft: 4
                    }} /> : null}
                    {showAd && !loaded && adClosed ? <ActivityIndicator color={'white'} style={{
                      marginLeft: 10
                    }} size={'small'} /> : null}
                  </View>
                </TouchableOpacity> : null}
                {predict ? <View style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red'
                }}>
                  {mode == EMODE_DEFAULT ? <View style={{
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
                      marginBottom: 2,
                      color: getBorderColor(predict),
                      fontFamily: 'NotoSansArmenian-Bold'
                    }}>{dataManager.getPredictTitle(predict)} {predict.team1_score} : {predict.team2_score}</Text>
                  </View> : <TouchableOpacity onPress={onSavePredict} disabled={isSaveDisabled()} activeOpacity={.8} style={{
                    opacity: !isSaveDisabled() ? 1 : .8
                  }}>
                    <View style={{
                      height: 30,
                      width: 'auto',
                      paddingLeft: 20,
                      paddingRight: 20,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fb2781',
                      flexDirection: 'row'
                    }}>
                      <Text style={{
                        color: 'white',
                        fontFamily: 'NotoSansArmenian-Bold'
                      }}>{strings.save}</Text>
                      {showAd && loaded ? <Icon name='play-circle-filled' size={20} color='white' style={{
                        marginLeft: 4
                      }} /> : null}
                      {showAd && !loaded && adClosed ? <ActivityIndicator color={'white'} style={{
                        marginLeft: 4
                      }} size={'small'} /> : null}
                    </View>
                  </TouchableOpacity>}
                  {!isMatchEnded() && !isMatchLive() && predict && mode == EMODE_DEFAULT ? <TouchableOpacity onPress={onSetEditMode} activeOpacity={.8} style={{
                    width: 30,
                    height: 30,
                    marginLeft: 10,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FF2882'
                  }}>
                    <Icon size={20} name={'edit'} color='white'></Icon>
                  </TouchableOpacity> : null}
                </View> : null}
              </View> : null}
            </View>

            {predictsReqFinished ? <ScrollView
              ref={scrollViewRef}
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                height: 50,
                marginTop: 20,
                paddingLeft: 20,
                paddingRight: 10,
                // backgroundColor: 'green',
                alignItems: 'center',
              }}
              showsHorizontalScrollIndicator={false}>

              <ViewChip title={strings.predictions2} selected={view == EVIEW_PREDICTIONS} onClick={() => { setView(EVIEW_PREDICTIONS), scrollToStart() }} />
              <ViewChip title={'H2H'} selected={view == EVIEW_H2H} onClick={() => { setView(EVIEW_H2H), scrollToStart() }} />
              <ViewChip title={strings.table} selected={view == EVIEW_TABLE} onClick={() => { setView(EVIEW_TABLE), scrollToStart() }} />

              {header?.statistics ? <ViewChip title={strings.statistics} selected={view == EVIEW_STATISTICS} onClick={() => { setView(EVIEW_STATISTICS), scrollToEnd() }} /> : null}
              {header?.events ? <ViewChip title={strings.events} selected={view == EVIEW_EVENTS} onClick={() => { setView(EVIEW_EVENTS), scrollToEnd() }} /> : null}
              {header?.lineups ? <ViewChip title={strings.lineups} selected={view == EVIEW_LINEUPS} onClick={() => { setView(EVIEW_LINEUPS), scrollToEnd() }} /> : null}

            </ScrollView> : null}

            <View style={{
              width: '100%',
              paddingHorizontal: 20,
              // backgroundColor: 'red'
              // marginTop: 30
            }}>

              {view == EVIEW_PREDICTIONS ? <View style={{
                marginTop: 20,
              }}>
                {predictsReqFinished && predicts && predicts.numPredicts ? <MatchPredictsSummaryPanel2 match={match} onUnlock={onUnlock} adLoaded={loaded} blockForAd={blockForAd} predicts={predicts}></MatchPredictsSummaryPanel2> : null}
                {predictsReqFinished && top20Predicts && top20Predicts.predicts.length ? <MatchTop20PredictsPanel onUnlock={onUnlock} adLoaded={loaded} match={match} blockForAd={blockForAd} isMatchEnded={isMatchEnded()} navigation={navigation} top20Predicts={top20Predicts} /> : null}
                {predictsReqFinished && !predicts?.numPredicts ? <Text style={{
                  color: '#8E8E93',
                  fontSize: 14,
                  fontWeight: 'bold',
                  alignSelf: 'center'
                }}>{strings.no_pred_for_match}</Text> : null}
                {!predictsReqFinished ? <ActivityIndicator size={'large'} color={'#FF2882'}></ActivityIndicator> : null}
              </View> : null}
              {view == EVIEW_H2H && match ? <MatchH2HPanel navigation={navigation} match={match} /> : null}
              {view == EVIEW_STATISTICS && statistics ? <MatchStatisticsPanel statistics={statistics} /> : view == EVIEW_STATISTICS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
              {view == EVIEW_EVENTS && events ? <MatchEventsPanel events={events} /> : view == EVIEW_EVENTS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
              {view == EVIEW_LINEUPS && lineups ? <MatchLineupsPanel match={match} lineups={lineups} /> : view == EVIEW_LINEUPS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
              {view == EVIEW_TABLE && table ? <MatchTablePanel match={match} table={table} /> : view == EVIEW_TABLE ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}

            </View>


          </ScrollView>
          <BottomNavBar navigation={navigation} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default MatchPage;
