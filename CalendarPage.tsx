import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import CalendarIcon from './assets/calendar_black.svg';

import MatchItem from './MatchItem';
import Calendar from './Calendar';
import moment from 'moment';
import AppBar from './AppBar';
import strings from './Strings';
import authManager from './AuthManager';

function CalendarPage({ navigation, route }): JSX.Element {
    const [date, setDate] = useState(null)
    const [matches, setMatches] = useState([])
    const [matchesReqFinished, setMatchesReqFinished] = useState(false)

    const backgroundStyle = {
      backgroundColor: 'white',
    };

    useEffect(()=> {
      getMatches()
    }, [date])

    function getMatches() {
      if (!date) return;
      setMatches([])
      setMatchesReqFinished(false)
      fetch(`${SERVER_BASE_URL}/api/v1/matches/day?timestamp=${new Date(date).getTime()}`, {
        method: 'GET',
        headers: {
           'Content-Type': 'application/json',
           'Authentication': authManager.getToken() ? authManager.getToken() : ''
        },
      })
        .then(response => response.json())
        .then(data => {
          setMatchesReqFinished(true)
          setMatches(data)
        })
        .catch(error => {
          setMatchesReqFinished(true)
           console.error('Error fetching leagues:', error)
          setMatches([])
        });
    }

    let currentLeague = null

    function onNavMatch(match) {
      if (match.week > match.currentWeek) return;

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
            paddingBottom: 20,
            backgroundColor: 'white'
          }}>
            <AppBar navigation={navigation}/>
       
            <View style={{
              paddingLeft: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}>
              <CalendarIcon height={28} width={28}/>
              <Text style={{
                   marginLeft: 10,
                   fontWeight: 'bold',
                   color: 'black',
                // fontWeight: 'semi-bold'
              }}>{strings[moment(date).format('MMM').toLowerCase()]} {moment(date).format('D')}, {moment(date).format('yy')}</Text>
            </View>
            <Calendar setDate={setDate} />
           
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
            {matchesReqFinished && !matches.length ? <Text style={{
              fontWeight: 'bold',
              color: "#8E8E93",

            }}>
              {strings.no_matches_found}
            </Text>: null}
            {!matchesReqFinished ? <ActivityIndicator color={'#FF2882'} size={'large'}></ActivityIndicator> : null}
            {matches.map((m, i)=>{
              let renderLeague = false;
              if (!currentLeague || currentLeague != m.league_name) {
                currentLeague = m.league_name
                renderLeague = true;
              }
              return <View key={`match_${i}`}>
                {renderLeague ? <View style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  marginTop: i == 0 ? 0 : 20,
                  alignItems: 'center'
                }}>
                    <Image resizeMode='contain'  src={`${SERVER_BASE_URL}/data/leagues/${m.league_name}_colored.png`} style={{
                      width: 40,
                      height: 45
                    }}></Image>
                    <View style={{
                      marginLeft: 10,
                    }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black'
                      }}>{m.league_name}</Text>
                      <Text style={{
                        fontSize: 12,
                        color: '#AEAEB2',
                        fontWeight: 'bold'
                      }}>{strings.matchday} {m.week}</Text>
                    </View>
                  </View> : null}
                <MatchItem onPress={()=>{onNavMatch(m)}} match={m}/>
              </View>
            })}
          </View>
        </ScrollView>
          <BottomNavBar page={EPAGE_CALENDAR} navigation={navigation} />
        </View>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "94%",
    height: 50,
    backgroundColor: 'white',
    borderLeftWidth: 3,
    marginTop: 20,
    borderLeftColor: '#ff004a',
    justifyContent: 'center',
    paddingLeft: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Open Sans'
  }
});

export default CalendarPage;
