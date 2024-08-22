import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
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

function MatchesLivePage({ navigation, route }): JSX.Element {
    const [matches, setMatches] = useState([])
    const [matchesReqFinished, setMatchesReqFinished] = useState(false)

    const backgroundStyle = {
      backgroundColor: 'white',
    };

    useEffect(()=> {
      getMatches()
    }, [])

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
        })
        .catch(error => {
           console.error('Error fetching leagues:', error)
          setMatches([])
          setMatchesReqFinished(true)
        });
    }

    let currentLeague = null

    function onNavMatch(match) {
      
      navigation.navigate("Match", {
        id: match.id
      })
    }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: '#f7f7f7'}}>

    <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <StatusBar
        barStyle={'dark-content'}
        
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <View style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            minHeight: '100%'
          }}
          style={{flex: 1}}>

          <View style={{
            width: '100%',
            // paddingBottom: 20,
            backgroundColor: 'white'
          }}>
            <AppBar navigation={navigation}/>
          
           
          </View>

     
          
          <View style={{
            width: '100%',
            // backgroundColor: 'red',
            padding: 15,
            marginTop: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!matchesReqFinished ? <ActivityIndicator color={'#FF2882'} size={'large'}/> : null }
            {!matches.length && matchesReqFinished ? <Text style={{
              fontWeight: 'bold',
              color: '#8E8E93'
            }}>
              {strings.no_live_matches}
            </Text>: null}

            {matches.map((m, i)=>{
              let renderLeague = false;
              if (!currentLeague || currentLeague != m.league_name) {
                currentLeague = m.league_name
                renderLeague = true;
              }
              return <View key={`match_${i}`} style={{
                width: '100%'
              }}>
                      <TouchableOpacity onPress={()=>onNavMatch(m)} activeOpacity={.9} style={{
                        width: '100%',
                        // height: 250,
                        // paddingBottom: 20,
                        borderRadius: 20,
                        overflow: 'hidden',
                        marginBottom: 20,
                        alignItems: 'center',
                        // backgroundColor: 'red'
                      }}>
                        <Image src={`${SERVER_BASE_URL}/data/leagues/${m.league_name}_banner.png`} style={{
                            width: '100%',
                            height: '100%',
                            top: 0,
                            position: 'absolute'
                        }}/>

                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                            paddingTop: 15
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: 'white'
                            }}>{m.league_name}</Text>
                            <Text style={{
                                color: '#AEAEB2',
                                fontSize: 10
                            }}>{dataManager.getWeekTitle({week: m.week, type: m.week_type})}</Text>
                        </View>

                        <View style={{
                            width: '100%',
                            marginTop: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row'
                        }}>
                            <TeamItem team={m.team1} isHome={true} compact={true}/>
                            <View style={{
                                marginBottom: 27,
                                height: 30,
                                paddingLeft: 15,
                                paddingRight: 15,
                                borderWidth: 1.5,
                                borderColor: '#00C566',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                                backgroundColor: '#34C75944'
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#00C566',
                                    fontWeight: 'bold'
                                }}>LIVE</Text>
                            </View>
                            <TeamItem team={m.team2} compact={true}/>

                        </View>
                        <View style={{
                            padding: 10,
                            // backgroundColor: 'red'
                        }}>
                           { m.predict.team1_score > -1 && m.predict.team2_score > -1 ? <View style={{
                                height: 25,
                                borderRadius: 20,
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: 5,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white'
                            }}>
                                <Text style={{
                                    color: 'black',
                                    fontWeight: 'bold'
                                }}>{strings.prediction} {m.predict.team1_score} : {m.predict.team2_score}</Text>
                            </View> : null }
                        </View>
                      </TouchableOpacity>
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
