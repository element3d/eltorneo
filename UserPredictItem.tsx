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
import DropShadow from 'react-native-drop-shadow';
import SERVER_BASE_URL from './AppConfig';

export default function UserPredictItem({onPress, predict}) {

    function getDate(ts) {
        const date = new Date(ts);

        // Format the date as "27 Nov"
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
        });

        return formattedDate;
    }
  
    function getTime(ts) {
        const date = new Date(ts);


        // Format the time as "23:30"
        const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        return formattedTime;
    }
  
    function getBorderColor(p) {
        if (p.status == 0) return 'black'
        if (p.status == 1) return 'green'
        if (p.status == 2) return 'gold'
        if (p.status == 3) return 'red'
    } 

    return (
        <DropShadow style={{
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
          <TouchableOpacity onPress={()=>{onPress}} style={{
            width: '100%'
          }}>
            <View style={{
              borderRadius: 15,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 10,
              paddingBottom: 10,
              minHeight: 80,
            }}>
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
                    fontSize: 11,
                    color: '#2b2d41',
                    fontFamily: 'OpenSans-ExtraBold'
                  }}>{predict.team1.shortName.toUpperCase()}</Text>
                  <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${predict.team1.name}.png`} style={{
                    width: 36,
                    height: 36
                  }}/>
                </View>
                {predict.status == 0 ? <View style={{
                  // width: '10%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  marginLeft: 12,
                  marginRight: 12
                  
                }}>
                  <Text style={{
                    color: '#8e8e8e',
                    fontSize: 10,
                    fontFamily: 'NotoSansArmenian-Bold'
                  }}>{getDate(predict.match_date)}</Text>
                  <Text style={{
                    fontFamily: 'OpenSans-Bold',
                    fontSize: 15,
                    color: '#ff7539'
                  }}>{getTime(predict.match_date)}</Text>
                </View> : <Text style={{
                     marginLeft: 12,
                     marginRight: 12,
                     fontSize: 20,
                     fontFamily: 'OpenSans-Bold',
                     color: 'black'
                }}>
                {predict.team1_score} : {predict.team2_score}
                </Text>}

                <View style={{
                  width: '40%',
                  flexDirection: 'row',

                  alignItems: 'center',
                  justifyContent: 'flex-start'
                }}>
                  <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${predict.team2.name}.png`} style={{
                    width: 36,
                    height: 36
                  }}/>
                  <Text style={{
                    textAlign: 'center',
                    // overflow: 'hidden',
                    marginLeft: 10,
                    fontSize: 11,
                    color: '#2b2d41',
                    fontFamily: 'OpenSans-ExtraBold'
                  }}>{predict.team2.shortName.toUpperCase()}</Text>
                </View>
              </View>

              {predict ? <View style={{
                width: '100%',
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'blue'
              }}>
                <View style={{
                  borderWidth: 1,
                  borderColor: getBorderColor(predict),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  paddingLeft: 10,
                  paddingRight: 10,
                  height: 20,
                  marginTop: 6
                }}>
                <Text style={{
                  fontSize: 12,
                  fontFamily: 'NotoSansArmenian-Bold'
                }}>Predicted {predict.team1_score} : {predict.team2_score}</Text></View>
              </View> : null }
            </View>
          </TouchableOpacity></DropShadow>
    )
}