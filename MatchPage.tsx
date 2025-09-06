import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import FAIcon2 from 'react-native-vector-icons/Fontisto';
import BBIcon from './assets/bbicon.svg'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import InAppReview from 'react-native-in-app-review';


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
import NativeAdComp from './NativeAdComp';
import MatchPreviewDialog from './MatchPreviewDialog';
import MatchBeatBetPanel from './MatchBeatBetPanel';
import MatchBetPanel from './MatchBetPanel';
import FairPlayDialog from './FairPlayDialogs';
import MatchLineupsPanel2 from './MatchLineupsPanel2';
import GamepadMenu, { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from './GamepadMenu';
import MatchDateView from './MatchDateView';
import MatchTop20BetsPanel from './MatchTop20BetsPanel';
import Gamepad from './Gamepad';
import { getApp } from '@react-native-firebase/app';
import { getAnalytics, logEvent, setAnalyticsCollectionEnabled } from '@react-native-firebase/analytics';
import MatchPlayersPanel from './MatchPlayersPanel';
import MatchFireballSummaryPanel from './MatchFireballSummaryPanel';
import MatchTop20FireballPanel from './MatchTop20FireballPanel';
import GoalsIcon from './assets/goals.svg';
import FireballIcon from './assets/Fireball.svg';


const analyticsInstance = getAnalytics(getApp());
setAnalyticsCollectionEnabled(analyticsInstance, true);

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
      <View style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          fontSize: 20,
          // lineHeight: 22,
          fontFamily: 'Poppins-Bold',
          color: 'white'
        }}>{match?.leagueName}</Text>
        <Text style={{
          fontSize: 12,
          lineHeight: 12,
          opacity: .6,
          marginTop: -6,
          marginBottom: 8,
          fontWeight: 'bold',
          color: 'white'
        }}>{'www.eltorneo.app'}</Text>
      </View>
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
          marginTop: 2,
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

function ViewChip({ title, selected, onClick, isBet = false }) {
  return <TouchableOpacity onPress={onClick} activeOpacity={.8} style={{
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: selected ? '#FF2882' : (isBet ? '#37003C' : Colors.borderColor),
    backgroundColor: selected ? '#FF2882' : (isBet ? '#37003C' : Colors.gray800),
    paddingLeft: isBet ? 10 : 20,
    paddingRight: 20,
    marginRight: 10,
    flexDirection: 'row'
  }}>
    {isBet ? <BBIcon width={20} height={20} style={{
      marginRight: 5
    }} /> : null}
    <Text style={{
      fontWeight: 'bold',
      color: selected || isBet ? 'white' : '#8E8E93'
    }}>
      {title}
    </Text>
  </TouchableOpacity>
}


function MatchPage({ navigation, route }): JSX.Element {
  const { id } = route.params;
  let game = dataManager.getSettings().game;
  const [gameState, setGameState] = useState(game)

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
  const [fireballPredict, setFireballPredict] = useState(dmMatch.fireballPredict?.player_api_id > 0 ? dmMatch.fireballPredict : null)
  const [bet, setBet] = useState(dmMatch.bet)

  const [predicts, setPredicts] = useState(null)
  const [betsSummary, setBetsSummary] = useState(null)
  const [fireballSummary, setFireballSummary] = useState(null)

  const [top20Predicts, setTop20Predicts] = useState(null)
  const [top20Bets, setTop20Bets] = useState(null)
  const [top20FireballPredicts, setTop20FireballPredicts] = useState(null)

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
  const [odds, setOdds] = useState(null)
  const [table, setTable] = useState(null)
  const [matchPlayers, setMatchPlayers] = useState(null)
  const [mode, setMode] = useState(EMODE_DEFAULT)
  const [header, setHeader] = useState(null)
  const [showMatchPreview, setShowMatchPreview] = useState(false)
  const [showFailPlayDialog, setShowFailPlayDialog] = useState(false)
  const [previewMatch, setPreviewMatch] = useState(null)
  const [showGamepadMenu, setShowGamepadMenu] = useState(false)

  const scrollViewRef = useRef(null);

  const EVIEW_PREDICTIONS = 1
  const EVIEW_STATISTICS = 2
  const EVIEW_EVENTS = 3
  const EVIEW_LINEUPS = 4
  const EVIEW_H2H = 5
  const EVIEW_TABLE = 6
  const EVIEW_BET = 7
  const EVIEW_TOP_BETS = 8
  const EVIEW_FIREBALL = 9
  const EVIEW_FIREBALL_PREDICTS = 10


  const [view, setView] = useState(game == EGAME_ELTORNEO ? EVIEW_PREDICTIONS : EVIEW_TOP_BETS)

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
    } else if (view == EVIEW_BET) {
      if (odds) return
      fetch(`${SERVER_BASE_URL}/api/v1/match/odds?match_id=${match.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': authManager.getToken() || ""
        },
      })
        .then(response => response.json())
        .then(data => {
          setOdds(data)
        })
        .catch(error => {
          // setEvents(null)
        });
    } else if (view == EVIEW_FIREBALL) {
     
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

            adsManager.addErrorListener(() => {

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

        if (data.odds || data.statistics || data.events || data.lineups) {
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

  useEffect(() => {
    if (gameState == EGAME_ELTORNEO) {
      getPredicts(match)
      setView(EVIEW_PREDICTIONS)
      getPredict()
    } else if (gameState == EGAME_BEATBET) {
      getBetsSummary(match)
      setView(EVIEW_TOP_BETS)
      getBet()
    } else if (gameState == EGAME_FIREBALL) {
      getFireballSummary(match)
      setView(EVIEW_FIREBALL_PREDICTS)
      getFireballPredict()
    }
  }, [gameState])

  useFocusEffect(
    useCallback(() => {
      game = dataManager.getSettings().game;
      setGameState(game)
    }, [])
  )

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

  function getFireballSummary(m) {
    if (!m) return

    setPredictsReqFinished(false)
    fetch(`${SERVER_BASE_URL}/api/v1/match/fireball/summary?match_id=${m.id}&season=${match.season}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setFireballSummary(data)
        getTop20FireballPredicts(m);
      })
      .catch(error => {
        setPredictsReqFinished(true)
        console.error('Error fetching fireball predicts:', error)
      });
  }

  function getBetsSummary(m) {
    if (!m) return

    setPredictsReqFinished(false)
    fetch(`${SERVER_BASE_URL}/api/v1/match/bets/summary?match_id=${m.id}&season=${match.season}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setBetsSummary(data)
        getTop20Bets(m);
      })
      .catch(error => {
        setPredictsReqFinished(true)
        console.error('Error fetching predicts:', error)
      });
  }

  function getPredicts(m) {
    if (!m) return

    setPredictsReqFinished(false)
    fetch(`${SERVER_BASE_URL}/api/v1/match/predicts?match_id=${m.id}&season=${match.season}`, {
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
    fetch(`${SERVER_BASE_URL}/api/v1/match/predicts/top3?match_id=${match.id}&season=${match.season}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTop20Predicts(data)
        getHeader(match.id)
      })
      .catch(error => console.error('Error fetching top3:', error));
  }

  function getTop20Bets(match) {
    if (!match) return
    fetch(`${SERVER_BASE_URL}/api/v1/match/bets/top20?match_id=${match.id}&season=${match.season}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTop20Bets(data)
        getHeader(match.id)
      })
      .catch(error => console.error('Error fetching top3:', error));
  }

  function getTop20FireballPredicts(match) {
    if (!match) return
    fetch(`${SERVER_BASE_URL}/api/v1/match/fireball/top20?match_id=${match.id}&season=${match.season}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        setTop20FireballPredicts(data)
        getHeader(match.id)
      })
      .catch(error => console.error('Error fetching top3:', error));
  }

  function getFireballPredict() {
    if (!authManager.getToken()) {
      setPredictReqFinished(true)
      return
    }

    fetch(`${SERVER_BASE_URL}/api/v1/user/fireball_predict?match_id=${id}&season=${match.season}`, {
      method: 'GET',
      headers: {
        'Authentication': authManager.getToken()
      },
    })
      .then(response => response.json())
      .then(data => {
        if (!data || !Object.keys(data).length) {
          setFireballPredict(null)
          setPredictReqFinished(true)
          return
        }

        setFireballPredict(data)
        setPredictReqFinished(true)
      })
      .catch(error => {
        setPredictReqFinished(true)
        console.error('Error fetching predict:', error)
      });
  }

  function getPredict() {
    if (!authManager.getToken()) {
      setPredictReqFinished(true)
      return
    }

    fetch(`${SERVER_BASE_URL}/api/v1/user/predict?match_id=${id}&season=${match.season}`, {
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

  function getBet() {
    if (!authManager.getToken()) {
      setPredictReqFinished(true)
      return
    }

    fetch(`${SERVER_BASE_URL}/api/v1/user/bet?match_id=${id}&season=${match.season}`, {
      method: 'GET',
      headers: {
        'Authentication': authManager.getToken()
      },
    })
      .then(response => response.json())
      .then(data => {
        if (!data || !Object.keys(data).length) {
          setBet(null)
          setPredictReqFinished(true)
          return
        }

        setBet(data)
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
        if (response.status == 403) {
          setShowFailPlayDialog(true)
          setProcessing(false)
          return
        }
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
        if (response.status == 403) {
          setShowFailPlayDialog(true)
          setProcessing(false)
          return
        }

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

  const askForRating = () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          console.log('In-app review flow finished?', hasFlowFinishedSuccessfully);
        })
        .catch((error) => {
          console.log('In-app review error:', error);
        });
    } else {
      console.log('In-app review not available');
    }
  };

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

      if (dataManager.getSettings().showInAppReview) {
        logEvent(analyticsInstance, 'button_click', {
          'button_name': 'AskForReviewClick',
        })
        askForRating();
        dataManager.getSettings().showInAppReview = false;
      }
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
    if (gameState == EGAME_FIREBALL) return false;

    if (isMatchLive()) return false;
    if (isMatchEnded()) return false;
    if (predict) return false
    if (bet) return false
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
    if (match.status == 'HT' || match.status == 'FT' || match.status == 'BT' || match.status == "P") return match.status

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

  function onShowMatchPress(match) {
    match.isTeaser = false
    setShowMatchPreview(true)
    setPreviewMatch(match)
  }

  function onShowMatchTrailerPress(match) {
    match.isTeaser = true
    setShowMatchPreview(true)
    setPreviewMatch(match)
  }

  function onCloseMatchPreview() {
    setShowMatchPreview(false)
  }

  function getScoreBottonMargin() {
    if (isMatchLive()) return 37

    if (match.playOff && isMatchEnded() && match.team1_score_90 > -1 && match.team2_score_90 > -1 && match.team1_score_pen > -1 && match.team2_score_pen > -1) return 10
    if (match.playOff && isMatchEnded() && match.team1_score_90 > -1 && match.team2_score_90 > -1) return 35

    if (isMatchLive() || isMatchEnded()) return 55

    return 55
  }

  function scrollOnTableClick() {
    if (!header) return

    if (!header.odds) {
      return scrollToStart()
    }

    if (header.statistics && header.events && header.lineups) return

    return scrollToEnd()
  }

  function onChangeGame(g) {
    setGameState(dataManager.getSettings().game);
  }

  function onShowGamepadMenu() {
    setShowGamepadMenu(true)
  }

  function renderBetPanel() {
    return <View>
      {match.is_special ? <View style={{
        height: 28,
        marginBottom: bet ? 6 : 0,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 4,
      }}>
        <View style={{
          // backgroundColor: 'white',
          flexDirection: 'row',
          height: 22,
          // paddingLeft: 16,
          // paddingRight: 26,
          borderRadius: 11,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Text style={{
            color: Colors.titleColor,
            fontWeight: 'bold',
            fontSize: 16,
            // marginBottom: 2,
            marginRight: 4
          }}>Superbet</Text>
          <BBIcon width={26} height={28} style={{
            // position: 'absolute',
            // zIndex: 1,
            // right: 2
          }} />
        </View>
      </View> : null}
      {bet ? <View style={{
        width: '100%',
        height: 30,
        // paddingBottom: 10,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <View style={{
          // borderWidth: 1,
          backgroundColor: Colors.mode == 1 ? "#F7F7F7" : Colors.selectColor,
          // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
          alignItems: 'center',
          // borderWidth: match.is_special ? 1 : 0,
          justifyContent: 'center',
          borderRadius: 15,
          paddingLeft: 15,
          paddingRight: match.playOff ? 2 : 15,
          flexDirection: 'row',
          height: 30,
          // marginTop: 2
        }}>
          <Text style={{
            fontSize: 14,
            // marginBottom: 2,
            color: Colors.titleColor,
            fontWeight: 'bold'
            // fontFamily: 'NotoSansArmenian-Bold'
          }}>{strings.bet} {dataManager.getBetString(bet.bet)}</Text>
          <Text style={{
            fontSize: 14,
            // marginBottom: 2,
            color: '#AEAEB2',
            fontWeight: 'bold'
            // fontFamily: 'NotoSansArmenian-Bold'
          }}>({bet.odd.toFixed(2)})</Text>
          <Text style={{
            fontSize: 14,
            marginLeft: 10,
            // marginBottom: 2,
            color: dataManager.getBetStatusColor(bet),
            fontWeight: 'bold'
            // fontFamily: 'NotoSansArmenian-Bold'
          }}>{dataManager.getBetStatusValue(bet)}</Text>

          {/* {match.playOff ? <View style={{
            width: 18,
            height: 18,
            // backgroundColor: dataManager.get90BGColor(),
            borderRadius: 9,
            marginLeft: 6,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: 900,
              // color: dataManager.get90TitleColor()
            }}>90</Text>
          </View> : null} */}
        </View>
      </View> : null}
    </View>
  }

  function renderPredictPanel() {
    return (!isMatchEnded() && !isMatchLive()) || predict ? <View style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}>

      {match.is_special ? <SpecialAwardPanel match={match} /> : null}

      {mode == EMODE_DEFAULT && isShowScoreInput() ? <TouchableOpacity onPress={onPredict} disabled={isPredictDisabled()} activeOpacity={.8} style={{
        opacity: !isPredictDisabled() ? 1 : .8
      }}>
        <View style={{
          height: 30,
          width: 'auto',
          paddingLeft: authManager.getMeSync() ? 20 : 10,
          paddingRight: authManager.getMeSync() && match.playOff ? 4 : 20,
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
            : null}
          <Text style={{
            color: 'white',
            marginTop: 2,
            // fontWeight: 'bold',
            fontFamily: 'Poppins-Bold'
          }}>{authManager.getMeSync() ? strings.predict : strings.sign_in_to_predict}</Text>
          {authManager.getMeSync() && match.playOff ?
            <View style={{
              width: 22,
              height: 22,
              backgroundColor: 'white',
              borderRadius: 11,
              marginLeft: 6,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                color: 'black',
                fontWeight: 900,
                fontSize: 12
              }}>90</Text>
            </View>
            : null}
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
          paddingRight: match.playOff ? 4 : 20,
          // borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          overflow: 'hidden',
          flexDirection: 'row',
          backgroundColor: dataManager.getPredictBgColor(predict),
          borderColor: dataManager.getPredictBorderColor(predict)
        }}>
          <Text style={{
            marginBottom: 2,
            color: dataManager.getPredictBorderColor(predict),
            fontFamily: 'NotoSansArmenian-Bold'
          }}>{dataManager.getPredictTitle(predict)}{dataManager.getPredictValue(predict)}</Text>

          {match.playOff ? <View style={{
            width: 22,
            height: 22,
            backgroundColor: Colors.gray800,
            borderRadius: 11,
            marginLeft: 8,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: Colors.titleColor,
              fontWeight: 900,
              fontSize: 12
            }}>90</Text>
          </View> : null}

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

    </View> : null
  }

  function getFireballStatusText() {
    if (fireballPredict == 0) return;
    const iconSize = 18
    if (fireballPredict.status == -1) {
      return `${strings.not_played} ${match.is_special ? '(0)' : '(-1)'}`
    } else if (fireballPredict.status == 4) {
      return `${strings.not_scored} ${match.is_special ? '(0)' : '(-1)'}`
    } else if (fireballPredict.status == 1) {
      return <View style={{
        // marginBottom: 4
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <GoalsIcon width={iconSize} height={iconSize} />
        <View style={{
          width: iconSize + 1,
          height: iconSize + 1,
          marginLeft: 4,
          borderRadius: iconSize / 2 + 1,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: Colors.success,
          backgroundColor: '#00C56619'
        }}>
          <Text style={{
            fontWeight: '900',
            fontSize: 12,
            color: Colors.success
          }}>{match.is_special ? '+4' : '+2'}</Text>
        </View>
      </View>
    } else if (fireballPredict.status == 2) {
      return <View style={{
        // marginBottom: 4
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <GoalsIcon width={iconSize} height={iconSize} />
        <GoalsIcon style={{
          marginLeft: 4
        }} width={iconSize} height={iconSize} />
        <View style={{
          width: iconSize + 1,
          height: iconSize + 1,
          marginLeft: 4,
          borderRadius: iconSize / 2 + 2,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: Colors.success,
          backgroundColor: '#00C56619'
        }}>
          <Text style={{
            fontWeight: '900',
            fontSize: 12,
            color: Colors.success
          }}>{match.is_special ? '+5' : '+3'}</Text>
        </View>
      </View>
    } else if (fireballPredict.status == 3) {
      const numGoals = fireballPredict.goals;
      return <View style={{
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        {Array.from({ length: numGoals }).map((_, idx) => (
          <GoalsIcon
            key={idx}
            width={iconSize}
            height={iconSize}
            style={{ marginLeft: 4 }}
          />
        ))}
        <View style={{
          width: iconSize + 1,
          height: iconSize + 1,
          marginLeft: 4,
          borderRadius: iconSize / 2 + 1,
          // borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // borderColor: 'gold',
          backgroundColor: 'gold'
        }}>
          <Text style={{
            fontWeight: '900',
            fontSize: 12,
            color: 'black'
          }}>{match.is_special ? '+8' : '+5'}</Text>
        </View>
      </View>
    }
  }

  function renderFireballPredictPanel() {
    if (!fireballPredict) return;

    const team = fireballPredict.team_id == match.team1.id ? match.team1 : match.team2;

    function onDelete() {
      setFireballPredict(null)

      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authentication': authManager.getToken()
        }
      };

      fetch(`${SERVER_BASE_URL}/api/v1/fireball?id=${fireballPredict.id}`, requestOptions)
        .then(response => {
          if (response.status == 403) {

            return
          }
          return response.json()
        })
        .then(data => {
          return null
        })
        .catch((e) => {
        });
    }

    return (!isMatchEnded() && !isMatchLive()) || fireballPredict ? <View style={{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {fireballPredict ? <View style={{
        flexDirection: 'row',
        // backgroundColor: 'red'
      }}>
        <View style={{
          // height: 30,
          // paddingLeft: 20,
          // paddingRight: match.playOff ? 4 : 20,
          // borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 15,
          flexDirection: 'row',
        }}>
          {/* <View style={{
            width: 40,
            height: 40,
            left: 0,
            position: 'absolute'
          }}>
            <PlayerImage team={team} player={{ apiId: fireballPredict.player_api_id }} imageSize={40} />
          </View> */}
          <View style={{
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isMatchEnded() && fireballPredict.status != 0 ? <View>
              <Text style={{
                color: Colors.fail,
                fontWeight: 'bold',
                fontSize: 12
              }}>{getFireballStatusText()}</Text>
            </View> : null}
            <Text style={{
              fontSize: 16,
              // marginBottom: 2,
              color: Colors.titleColor,
              fontFamily: 'NotoSansArmenian-Bold'
            }}>{fireballPredict.player_name}</Text>
            <Text style={{
              marginBottom: 2,
              fontSize: 12,
              color: '#8E8E93',
              fontFamily: 'NotoSansArmenian-Bold'
            }}>{team.name}</Text>
          </View>
          {!isMatchEnded() && !isMatchLive() ? <TouchableOpacity activeOpacity={.8} onPress={onDelete} style={{
            width: 35,
            height: 35,
            marginLeft: 10,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FF4747'
          }}>
            <Icon name="close" size={20} color={'white'} />
          </TouchableOpacity> : null}
        </View>

      </View> : null}

    </View> : null
  }

  function renderMatchDateView() {
    if (game == EGAME_FIREBALL) {
      if (!isMatchLive() && !isMatchEnded()) return <MatchDateView match={match} />
      return null;
    }

    if (game == EGAME_BEATBET) {
      if (!isMatchLive() && !isMatchEnded() && bet) return <MatchDateView match={match} />

      return null
    }

    return !isMatchLive() && !isMatchEnded() && !isShowScoreInput() ? <MatchDateView match={match} /> : null
  }

  function maybeRenderBetButton() {
    if (game != EGAME_BEATBET) return;
    if (isMatchEnded() || isMatchLive() || bet) return;

    return <TouchableOpacity disabled={!header?.odds} activeOpacity={.8} onPress={() => { setView(EVIEW_BET) }} style={{
      width: 50,
      height: 50,
      borderRadius: 70,
      opacity: header?.odds ? 1 : .5,
      top: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#37003C'
    }}>
      <BBIcon width={30} height={30} />
    </TouchableOpacity>
  }

  function maybeRenderInputDots() {
    if (game == EGAME_FIREBALL) {
      if (isMatchLive() || !isMatchEnded()) return null;
      return <Text style={{
        fontSize: 30,
        height: 30,
        lineHeight: 30,
        marginBottom: isShowScoreInput() ? -4 : 3,
        // backgroundColor: 'red',
        // alignItems: 'center',
        // justifyContent: 'center',
        textAlignVertical: isShowScoreInput() ? 'center' : 'top',
        paddingBottom: 6,
        color: Colors.titleColor
      }}>:</Text>
    }

    if (game == EGAME_BEATBET) {
      if (isMatchLive() || !isMatchEnded()) return null;
      if (!bet && !isMatchEnded()) return null

      return <Text style={{
        fontSize: 30,
        height: 30,
        lineHeight: 30,
        marginBottom: isShowScoreInput() ? -4 : 3,
        // backgroundColor: 'red',
        // alignItems: 'center',
        // justifyContent: 'center',
        textAlignVertical: isShowScoreInput() ? 'center' : 'top',
        paddingBottom: 6,
        color: Colors.titleColor
      }}>:</Text>
    }

    return (!isMatchLive() && isMatchEnded()) || isShowScoreInput() ? <Text style={{
      fontSize: 30,
      height: 30,
      lineHeight: 30,
      marginBottom: isShowScoreInput() ? -4 : 3,
      // backgroundColor: 'red',
      // alignItems: 'center',
      // justifyContent: 'center',
      textAlignVertical: isShowScoreInput() ? 'center' : 'top',
      paddingBottom: 6,
      color: Colors.titleColor
    }}>:</Text> : null
  }

  function onFireballPredict(fp) {
    if (fireballPredict) return;
    if (isMatchEnded() || isMatchLive()) return;

    setFireballPredict(fp)

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authManager.getToken()
      },
      body: JSON.stringify({
        matchId: fp.match_id,
        teamId: fp.team_id,
        playerApiId: fp.player_api_id,
        playerName: fp.player_name,
        playerPhoto: fp.player_photo
      })
    };

    fetch(`${SERVER_BASE_URL}/api/v1/fireball/predict`, requestOptions)
      .then(response => {
        if (response.status == 403) {
          return
        }
        return response.json()
      })
      .then(data => {
        return null
      })
      .catch((e) => {
        // setProcessing(false)
      });
  }

  function onPlayerClick(player, team) {
    if (game != EGAME_FIREBALL) return;

    const fp = {
      match_id: match.id,
      team_id: team.id,
      player_api_id: player.apiId,
      player_name: player.name,
      player_photo: player.photo ? player.photo : ""
    }
    onFireballPredict(fp)
  }

  function onFireballClick() {
    if (header?.lineups) {
      setView(EVIEW_LINEUPS)
    } else {
      setView(EVIEW_FIREBALL)
    }
  }

  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{
      flex: 1, backgroundColor: Colors.bgColor,
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'android' ? -insets.bottom : 0}
        >
          <View style={{
            height: insets.top,
            backgroundColor: '#37003C'
          }} />
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />

          <View style={{ flex: 1 }}>
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                // minHeight: '100%',
                alignItems: 'center',
                paddingBottom: 60
              }}
              style={{
                flex: 1,
              }}>
              <Image resizeMode="cover" src={`${SERVER_BASE_URL}/data/leagues/${match?.leagueName}${match?.league_country}_banner.png${dataManager.getImageCacheTime()}`} style={{
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

                {match?.teaser ? <TouchableOpacity onPress={() => onShowMatchTrailerPress(match)} style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#FACC15',// 'white',
                  position: 'absolute',
                  top: 8,
                  left: match.preview ? 8 : '',
                  right: !match.preview ? 8 : '',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                  <FAIcon2 name='film' color={'black'} size={20} />
                </TouchableOpacity> : null}

                {match.preview ? <TouchableOpacity onPress={() => onShowMatchPress(match)} style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#FF2882',// 'white',
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                  <FAIcon name='video' color={'white'} size={16} />
                </TouchableOpacity> : null}

                <MatchDatePanel match={match} isShowTopMatchTime={isShowTopMatchTime()} predictReqFinished={predictReqFinished} />
                <View style={{
                  width: '100%',
                  paddingBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>

                  <TeamItem navigation={navigation} team={match.team1} league={match.league} leagueName={match.leagueName} isHome={true} />
                  <TeamItem navigation={navigation} team={match.team2} league={match.league} leagueName={match.leagueName} isHome={false} />

                  <View style={{
                    position: 'absolute',
                    flexDirection: 'column',
                    // backgroundColor: 'blue',
                    // height: '100%',
                    // width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: getScoreBottonMargin()
                  }}>

                    <View style={{
                      flexDirection: 'row',
                      // backgroundColor: 'blue',
                      // width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>

                      {game == EGAME_ELTORNEO && isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' inputMode='numeric' value={team1Score} onChangeText={onTeam1Change} style={{
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
                        width: 40,
                        height: 30,
                        fontSize: 30,
                        lineHeight: 30,
                        color: Colors.titleColor,
                        textAlign: 'right',
                        paddingRight: 5,
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

                      {maybeRenderInputDots()}
                      {renderMatchDateView()}
                      {maybeRenderBetButton()}

                      {game == EGAME_ELTORNEO && isShowScoreInput() ? <TextInput maxLength={1} keyboardType='numeric' value={team2Score} onChangeText={onTeam2Change} style={{
                        width: 45,
                        height: 50,
                        marginLeft: 4,
                        fontSize: 20,
                        backgroundColor: Colors.mode == 1 ? '#00000011' : '#ffffff11',
                        borderRadius: 10,
                        color: Colors.titleColor,
                        textAlign: 'center',
                        fontFamily: 'OpenSans-Bold'
                      }}></TextInput> : null}

                      {isShowScoreText() ? <Text style={{
                        width: 40,
                        // marginRight: 4,
                        lineHeight: 30,
                        height: 30,
                        fontSize: 30,
                        color: Colors.titleColor,
                        textAlign: 'left',
                        paddingLeft: 5,
                        // backgroundColor: '#00000011',
                        // borderRadius: 10,
                        fontFamily: 'OpenSans-Bold'
                      }}>{match?.team2_score}</Text> : null}
                    </View>

                    {match.status == 'AET' || match.status == 'PEN' ? <View style={{
                      // width: '100%',
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      paddingLeft: 15,
                      paddingRight: 2,
                      borderRadius: 11,
                      borderWidth: 1,

                      borderColor: Colors.titleColor,
                    }}>
                      <View>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.titleColor
                          // color: Colors.gray800,
                        }}>{match.team1_score_90} : {match.team2_score_90}</Text>
                      </View>
                      <View style={{
                        width: 18,
                        height: 18,
                        marginLeft: 6,
                        backgroundColor: Colors.titleColor,
                        // backgroundColor: Colors.gray800,
                        borderRadius: 9,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{
                          color: Colors.gray800,
                          // color: Colors.titleColor,
                          fontWeight: 900,
                          fontSize: 11
                        }}>90</Text>
                      </View>
                    </View> : null}

                    {match.status == 'PEN' ? <View style={{
                      marginTop: 6,
                      height: 24,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      paddingLeft: 15,
                      paddingRight: 2,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor: Colors.titleColor,
                      // backgroundColor: Colors.titleColor
                    }}>
                      <View>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: Colors.titleColor
                          // color: Colors.gray800
                        }}>{match.team1_score_pen} : {match.team2_score_pen}</Text>
                      </View>
                      <View style={{
                        // marginTop:
                        paddingLeft: 4,
                        paddingRight: 4,
                        height: 18,
                        marginLeft: 6,
                        backgroundColor: Colors.titleColor,
                        // backgroundColor: Colors.gray800,
                        borderRadius: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Text style={{
                          // color: Colors.titleColor,
                          color: Colors.gray800,
                          fontWeight: 900,
                          fontSize: 11
                        }}>PEN</Text>
                      </View>
                    </View> : null}

                  </View>
                </View>

                {game == EGAME_ELTORNEO ? renderPredictPanel() : null}
                {game == EGAME_BEATBET ? renderBetPanel() : null}
                {game == EGAME_FIREBALL ? renderFireballPredictPanel() : null}

              </View>

              {match.is_special && match.special_match_title == 'quest' ? <View style={{
                width: '100%',
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
                <View style={{
                  width: '100%',
                  borderRadius: 12,
                  padding: 10,
                  // borderWidth: 1,
                  // borderColor: '#FF4747',
                  // marginBottom: 5,
                  paddingHorizontal: 10,
                  backgroundColor: '#FF474719'
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#FF4747'
                  }}>{strings.attention_quest}</Text>
                  <Text style={{
                    color: Colors.titleColor
                  }}>{strings.quest_match_msg}</Text>
                </View>
              </View> : null}

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

                {game == EGAME_BEATBET ? <ViewChip title={strings.bets} selected={view == EVIEW_TOP_BETS} onClick={() => { setView(EVIEW_TOP_BETS) }} /> : null}
                {game == EGAME_ELTORNEO ? <ViewChip title={strings.predictions2} selected={view == EVIEW_PREDICTIONS} onClick={() => { setView(EVIEW_PREDICTIONS) }} /> : null}
                {game == EGAME_FIREBALL ? <ViewChip title={strings.predictions2} selected={view == EVIEW_FIREBALL_PREDICTS} onClick={() => { setView(EVIEW_FIREBALL_PREDICTS) }} /> : null}
                {game == EGAME_FIREBALL && !isMatchLive() && !isMatchEnded() ?
                  <TouchableOpacity onPress={() => { onFireballClick() }} style={{
                    marginRight: 10
                  }}>
                    <FireballIcon width={40} height={40} />
                  </TouchableOpacity>
                  : null}
                {game != EGAME_FIREBALL && header?.odds ? <ViewChip isBet title={strings.bet} selected={view == EVIEW_BET} onClick={() => { setView(EVIEW_BET) }} /> : null}
                {header?.lineups ? <ViewChip title={strings.lineups} selected={view == EVIEW_LINEUPS} onClick={() => { setView(EVIEW_LINEUPS) }} /> : null}
                {header?.events ? <ViewChip title={strings.events} selected={view == EVIEW_EVENTS} onClick={() => { setView(EVIEW_EVENTS) }} /> : null}
                {header?.statistics ? <ViewChip title={strings.statistics} selected={view == EVIEW_STATISTICS} onClick={() => { setView(EVIEW_STATISTICS) }} /> : null}
                <ViewChip title={'H2H'} selected={view == EVIEW_H2H} onClick={() => { setView(EVIEW_H2H) }} />
                {(match.league < 8 && match.league != 1) || match.league == 16 || match.league == 20 ? <ViewChip title={strings.table} selected={view == EVIEW_TABLE} onClick={() => { setView(EVIEW_TABLE) }} /> : null}

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
                  {predictsReqFinished && predicts && predicts.beatBet ? <MatchBeatBetPanel predict={predict} match={match} beatBet={predicts.beatBet} /> : null}
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

                {view == EVIEW_TOP_BETS ? <View style={{
                  marginTop: 20,
                }}>
                  {predictsReqFinished && betsSummary && betsSummary.numPredicts ? <MatchPredictsSummaryPanel2 match={match} onUnlock={onUnlock} adLoaded={loaded} blockForAd={blockForAd} predicts={betsSummary}></MatchPredictsSummaryPanel2> : null}
                  {predictsReqFinished && top20Bets && top20Bets.predicts.length ? <MatchTop20BetsPanel onUnlock={onUnlock} adLoaded={loaded} match={match} blockForAd={blockForAd} isMatchEnded={isMatchEnded()} navigation={navigation} top20Bets={top20Bets} /> : null}
                  {predictsReqFinished && !betsSummary?.numPredicts ? <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}>{strings.no_bets_for_match}</Text> : null}
                  {!predictsReqFinished ? <ActivityIndicator size={'large'} color={'#FF2882'}></ActivityIndicator> : null}
                </View> : null}
                {view == EVIEW_FIREBALL_PREDICTS ? <View style={{
                  marginTop: 20,
                }}>
                  {predictsReqFinished && fireballSummary && fireballSummary.total_predicts ? <MatchFireballSummaryPanel match={match} predicts={fireballSummary}></MatchFireballSummaryPanel> : null}
                  {predictsReqFinished && top20FireballPredicts && top20FireballPredicts.predicts.length ? <MatchTop20FireballPanel match={match} isMatchEnded={isMatchEnded()} navigation={navigation} top20Predicts={top20FireballPredicts} /> : null}
                  {predictsReqFinished && !fireballSummary?.total_predicts ? <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    fontWeight: 'bold',
                    alignSelf: 'center'
                  }}>{strings.no_pred_for_match}</Text> : null}
                  {!predictsReqFinished ? <ActivityIndicator size={'large'} color={'#FF2882'}></ActivityIndicator> : null}
                </View> : null}
                {view == EVIEW_FIREBALL ? <MatchPlayersPanel navigation={navigation} match={match} fireballPredict={fireballPredict} players={matchPlayers} onFireballPredict={onFireballPredict} /> : null}
                {view == EVIEW_BET ? <MatchBetPanel me={me} setBet={setBet} navigation={navigation} match={match} odds={odds} remoteBet={bet} /> : null}
                {view == EVIEW_H2H && match ? <MatchH2HPanel navigation={navigation} match={match} onShowMatchPreview={onShowMatchPress} onShowMatchTrailer={onShowMatchTrailerPress} /> : null}
                {view == EVIEW_STATISTICS && statistics ? <MatchStatisticsPanel statistics={statistics} /> : view == EVIEW_STATISTICS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
                {view == EVIEW_EVENTS && events ? <MatchEventsPanel events={events} /> : view == EVIEW_EVENTS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
                {view == EVIEW_LINEUPS && lineups ? <MatchLineupsPanel2 match={match} lineups={lineups} fireballPredict={fireballPredict} onPlayerClick={onPlayerClick} /> : view == EVIEW_LINEUPS ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}
                {view == EVIEW_TABLE && table ? <MatchTablePanel navigation={navigation} match={match} table={table} /> : view == EVIEW_TABLE ? <ActivityIndicator style={{ marginTop: 20 }} color={'#FF2882'} size={'large'} /> : null}

              </View>
            </ScrollView>
            <Gamepad onShowMenu={onShowGamepadMenu} />
            <BottomNavBar navigation={navigation} />
            {showGamepadMenu ? <GamepadMenu onClose={() => setShowGamepadMenu(false)} onChangeGame={onChangeGame} /> : null}
          </View>
          {showMatchPreview ? <MatchPreviewDialog match={previewMatch} onClose={onCloseMatchPreview} /> : null}
          {showFailPlayDialog ? <FairPlayDialog onClose={() => { setShowFailPlayDialog(false) }} /> : null}
          <View style={{
            height: insets.bottom,
            backgroundColor: Colors.gray800,
          }} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default MatchPage;
