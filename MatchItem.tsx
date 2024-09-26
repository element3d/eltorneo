import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SERVER_BASE_URL from './AppConfig';
import dataManager from './DataManager';
import strings from './Strings';

export default function MatchItem({onPress, match, showLeague}) {
  
    function getTime(ts) {
        const date = new Date(ts);

        // return moment(ts).format('HH:mm')

        // Format the time as "23:30"
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return formattedTime;
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

    function getPoints(p) {
      if (p.status == 0) return '0'
      if (p.status == 1) return '+1'
      if (p.status == 2) return '+3'
      if (p.status == 3) return '-1'
    }

    function isMatchEnded() {
      return match?.team1_score >= 0 && match?.team2_score >= 0
    }

    function hasPredict() {
      const ts = Date.now();
      if (!match.predict || match.predict.status == -1 /*|| (ts > match.date && match.predict.status == 0)*/) return false
      return true
    }

    function isMatchLive() {
      if (match.status == 'PST') return false
      if (isMatchEnded()) return false
      if (match.date < new Date().getTime()) {
         return true
      }
      return false
    }

    function getStatusText(m) {
      if (m.status == 'HT' || m.status == 'FT') return m.status
      
      return '  ' + m.elapsed + " '"
    }

    return (
          <TouchableOpacity onPress={ match.status == 'PST' ? null : onPress} activeOpacity={.8} style={{
            width: '100%',
            shadowColor: "#00000011",
            shadowOffset: {
            width: 0,
            height: 10,
            },
            shadowOpacity: .01,
            shadowRadius: 8,
            marginBottom: 15
          }}>
            <View style={{
              borderRadius: 20,
              backgroundColor: '#ffffffcc',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              minHeight: 80,
            }}>
              {hasPredict() ? <View style={{
                height: showLeague ? 0 : 10
              }}></View> : null}
              {showLeague ? <View style={{
                marginBottom: 5,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <View style={{
                  alignItems: 'center',
                  flexDirection: 'row'
                }}>
                  <Image src={`${SERVER_BASE_URL}/data/leagues/${match.league.name}_colored.png`} style={{
                    width: 30,
                    height: 22,
                    objectFit: 'contain',
                    marginRight: 6
                  }}/>
                  <Text style={{
                    fontSize: 16,
                    color: 'black',
                    fontWeight: 'bold'
                  }}>{match.league.name}</Text>
                </View>

                 <Text style={{
                  color: '#AEAEB2',
                  fontSize: 10,
                  fontWeight: 'bold'
                }}>{dataManager.getWeekTitle({week: match.week, type: match.week_type})}</Text>
              </View> : null }
              <View style={{
                // flex: 1,
                width: "100%",
                maxHeight: 80,
                // backgroundColor: 'red',
                overflow: 'hidden',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: '40%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  // justifyContent: 'center'
                }}>
                  <Text style={{
                    textAlign: 'center',
                    // overflow: 'hidden',
                    marginRight: 10,
                    fontSize: 12,
                    // fontWeight: 'bold',
                    color: '#2b2d41',
                    fontFamily: 'OpenSans-ExtraBold'
                  }}>{match.team1.shortName}</Text>
                  <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name}.png`} style={{
                    width: 36,
                    height: 36
                  }}/>
                </View>
                {!isMatchEnded() ? 
                    <View style={{
                      // width: '10%',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      marginLeft: 10,
                      marginRight: 10
                      
                    }}>
                      { match.team1_score < 0 || match.team2_score < 0 ? 
                      <View>
                        { isMatchLive() ? <View style={{
                          alignItems: 'center',
                          // marginBottom: 5,
                          justifyContent: 'center'
                        }}>
                            <View style={{
                              paddingLeft: 6,
                              paddingRight: 6,
                              borderRadius: 6,
                              backgroundColor: '#34C75918',
                            }}>
                              <Text style={{
                                fontFamily: 'OpenSans-Bold',
                                fontSize: 10,
                                color: '#00C566'
                                // color: '#ff7539'
                              }}>{ getStatusText(match)}</Text> 
                            </View>
                            <Text style={{
                            fontSize: 18,
                            fontFamily: 'OpenSans-Bold',
                            color: 'black',
                            }}>{match.team1_score_live} : {match.team2_score_live}</Text> 
                          </View> : null }
                          { match.status != 'PST' && !isMatchLive() ? <View style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#34C75918',
                          // padding: 4,
                          paddingLeft: 8, 
                          paddingRight: 8,
                          height: 30,
                          borderRadius: 12
                        }}>
                          <Text style={{
                            fontFamily: 'OpenSans-Bold',
                            fontSize: 12,
                            color: '#00C566'
                            // color: '#ff7539'
                          }}>{ getTime(match.date)}</Text> 
                        </View> : !isMatchLive() ? <View style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#FF474719',
                          // padding: 4,
                          paddingLeft: 8, 
                          paddingRight: 8,
                          height: 30,
                          borderRadius: 12
                        }}>
                          <Text style={{
                            fontFamily: 'OpenSans-Bold',
                            fontSize: 12,
                            color: '#FF4747'
                            // color: '#ff7539'
                          }}>{'PST'}</Text> 
                        </View> : null }
                      </View>: 
                        <Text style={{
                          fontSize: 20,
                          fontFamily: 'OpenSans-Bold',
                          color: 'black'
                          }}>{match.team1_score} : {match.team2_score}</Text> 
                      }
                    </View> : 
                    <Text style={{
                      marginLeft: 12,
                      marginRight: 12,
                      fontSize: 20,
                      fontFamily: 'OpenSans-Bold',
                      color: 'black'
                    }}>
                      {match.team1_score} : {match.team2_score}
                    </Text>
                }

                <View style={{
                  width: '40%',
                  flexDirection: 'row',

                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name}.png`} style={{
                    width: 36,
                    height: 36
                  }}/>
                  <Text style={{
                    textAlign: 'center',
                    // overflow: 'hidden',
                    marginLeft: 10,
                    fontSize: 12,
                    color: '#2b2d41',
                    fontFamily: 'OpenSans-ExtraBold'
                  }}>{match.team2.shortName}</Text>
                </View>
              </View>

              {hasPredict() ? <View style={{
                width: '100%',
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'blue'
              }}>
                <View style={{
                  // borderWidth: 1,
                  backgroundColor: getBgColor(match.predict),
                  borderColor: getBorderColor(match.predict),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  paddingLeft: 10,
                  paddingRight: 10,
                  height: 22,
                  marginTop: 6
                }}>
                <Text style={{
                  fontSize: 12,
                  color: getBorderColor(match.predict),
                  fontFamily: 'NotoSansArmenian-Bold'
                }}>{dataManager.getPredictTitle(match.predict)} {match.predict.team1_score} : {match.predict.team2_score}</Text></View>
              </View> : null }
              {showLeague ? <View style={{
                height: 5
              }}></View>: null}
            </View>
           { hasPredict() && match.predict.status > 0 ? <View style={{
              position: 'absolute',
              top: 10,
              right: 10,
              borderRadius: 4,
              paddingLeft: 5,
              paddingRight: 5,
              backgroundColor: getBgColor(match.predict)
            }}>
              <Text style={{
                fontWeight: 'bold',
                fontSize: 10,
                color: getBorderColor(match.predict)
              }}>{strings.points}: {getPoints(match.predict)}</Text>
            </View> : null}
          </TouchableOpacity>
    )
}