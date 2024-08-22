import React, { useEffect, useState, useRef } from 'react';
import {
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_TABLES } from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import LeagueChip from './LeagueChip';
import dataManager from './DataManager';
import strings from './Strings';
import AppBar from './AppBar';
import authManager from './AuthManager';
import { ESTAT_TOTAL } from './ProfilePage';
import CupIcon from './assets/Trophy.svg';
 

const ETABLE_GENERAL = 0
const ETABLE_SCORE = 1
const ETABLE_WINNER = 2

function TableCheap({title, selected, onPress}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={.8} style={{
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
      }}>{title}</Text>
    </TouchableOpacity>
  )
}

function TablesPage({ navigation, route }): JSX.Element {
    const [table, setTable] = useState([])
    const [selectedTable, setSelectedTable] = useState(ETABLE_GENERAL)
    const [selectedLeague, setSelectedLeague] = useState(null)

    const backgroundStyle = {
      backgroundColor: 'white',
    };

    useEffect(()=>{
      getTableByPoints()
    }, [])

    useEffect(()=>{
      if (selectedTable == ETABLE_GENERAL) {
        getTableByPoints()
      } else if (selectedTable == ETABLE_SCORE) {
        getTableByScore()
      } else {
        getTableByWinner()
      }
    }, [selectedTable, selectedLeague])

    function getTableByPoints() {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      };

      fetch(`${SERVER_BASE_URL}/api/v1/table/points`, requestOptions)
        .then(response => {
            if (response.status == 200)
                return response.json()
            return null
        })
        .then(data => {
            setTable(data)         
        });
    }

    function getTableByScore() {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      };

      fetch(`${SERVER_BASE_URL}/api/v1/table/score?league_id=${selectedLeague && selectedLeague.id >= 1 ? selectedLeague.id : -1}`, requestOptions)
        .then(response => {
            if (response.status == 200)
                return response.json()
            return null
        })
        .then(data => {
            setTable(data)         
        });
    }

    function getTableByWinner() {
      const requestOptions = {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
        },
      };

      fetch(`${SERVER_BASE_URL}/api/v1/table/winner?league_id=${selectedLeague && selectedLeague.id >= 1 ? selectedLeague.id : -1}`, requestOptions)
        .then(response => {
            if (response.status == 200)
                return response.json()
            return null
        })
        .then(data => {
            setTable(data)         
        });
    }

    function getRate(u) {
      if (selectedTable == ETABLE_GENERAL) return u.predictions
      return `${u.predictions}(${Number.parseInt(u.rate)}%)`
    }

    function onLeaguePress(l) {
      setSelectedLeague(l ? l: null)
    }

    function onNavUser(u) {
      u.points = u.predictions
      // return
      authManager.setActiveUser(u)

      navigation.navigate({ 
        name: 'Profile', 
        params: {
          id: u.id, 
          globalPage: 1,
          selectedStat: ESTAT_TOTAL
        }, 
        key: `user_${u.id}`
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
            <AppBar navigation={navigation} />
           
            <ScrollView 
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                paddingLeft: 10,
                // minHeight: '100%',
                 height: 40,
                // backgroundColor: 'red',
              }}
              showsHorizontalScrollIndicator={ false}
              style={{
                // flex: 1,
                // maxHeight: 120,
                // backgroundColor: 'blue'
              }}>
                <TableCheap selected={selectedTable == ETABLE_GENERAL} onPress={()=>{setSelectedTable(ETABLE_GENERAL)}} title={strings.main_table}/>
                <TableCheap selected={selectedTable == ETABLE_SCORE} onPress={()=>{setSelectedTable(ETABLE_SCORE)}} title={strings.score_predicted}/>
                <TableCheap selected={selectedTable == ETABLE_WINNER} onPress={()=>{setSelectedTable(ETABLE_WINNER)}} title={strings.winner_or_draw_predicted}/>
            </ScrollView>

           { selectedTable != ETABLE_GENERAL ? <ScrollView
              horizontal={true}
              contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                // minHeight: '100%',
                height: 80,
                // backgroundColor: 'red',
              }}
              showsHorizontalScrollIndicator={ false}
              style={{flex: 1,
                maxHeight: 120,
                // backgroundColor: 'blue'
              }}
              >
                <LeagueChip league={null} selected={null == selectedLeague} onPress={()=> {onLeaguePress(null)}}/>
              {dataManager.getLeagues().map((l)=>{
                return (<LeagueChip league={l} key={l.name} selected={l == selectedLeague} onPress={()=> {onLeaguePress(l)}}/>)
              })}
            </ScrollView> : null }
          </View>

          <View style={{
            padding: 20
          }}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={{
                  width: 60,
                  color: 'black',
                  fontWeight: 'bold'
                }}>Pos</Text>
                <Text style={{
                  color: '#8E8E93'
                }}>{strings.pos}</Text>
              </View>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={{
                  width: 60,
                  color: 'black',
                  fontWeight: 'bold'
                }}>TP</Text>
                <Text style={{
                  color: '#8E8E93'
                }}>{strings.total_short}</Text>
              </View>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={{
                  width: 60,
                  color: 'black',
                  fontWeight: 'bold'
                }}>Pts</Text>
                <Text style={{
                  color: '#8E8E93'
                }}>{strings.pts}</Text>
              </View>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={{
                  width: 60,
                  color: 'black',
                  fontWeight: 'bold'
                }}>Rate</Text>
                <Text style={{
                  color: '#8E8E93'
                }}>{strings.rate}</Text>
              </View>
          </View>

          <View style={{
            width: '100%',
            // backgroundColor: 'red',
            padding: 15,
            // marginTop: 20,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <View style={{
              width: '100%',
              height: 60,
              backgroundColor: '#F0F0F0',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                width: 50,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>Pos</Text>
              <Text style={{
                // width: '90%',
                flex: 1,
                color: 'black',
                fontWeight: 'bold',
                paddingLeft: 10
              }}>{strings.player}</Text>
              <Text style={{
                width: 50,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>TP</Text>
              <Text style={{
                width: 50,
                color: 'black',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>{ selectedTable == ETABLE_GENERAL ? "Pts" : "Rate"}</Text>
            </View>

            {table?.map((u, i)=>{
              return (
                <TouchableOpacity activeOpacity={.8} onPress={()=>{onNavUser(u)}} key={`player_${i}`} style={{
                  width: '100%',
                  height: 60,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  { i == 0 && selectedTable == ETABLE_GENERAL? <CupIcon width={50} height={26}/> : <Text style={{
                    width: 50,
                    color: 'black',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>{i + 1}</Text> }
                  <Text style={{
                    // width: '90%',
                    flex: 1,
                    color: 'black',
                    fontWeight: 'bold',
                    // textAlign: 'flex-start',
                    paddingLeft: 10
                  }}>{u.name}</Text>
                  <Text style={{
                    width: 50,
                    color: 'black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>{u.totalPredictions}</Text>
                  <Text style={{
                    width: 50,
                    color: 'black',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>{getRate(u)}</Text>
                </TouchableOpacity>
              )
            })}
          
          </View>
        

        </ScrollView>
          <BottomNavBar page={EPAGE_TABLES} navigation={navigation} />
        </View>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
}

export default TablesPage;
