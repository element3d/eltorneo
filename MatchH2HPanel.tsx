import { useEffect, useState } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import authManager from "./AuthManager"
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';

import moment from 'moment';
import MatchItem from "./MatchItem";
import strings from "./Strings";
import dataManager from "./DataManager";
import Colors from "./Colors";


export default function MatchH2HPanel({navigation, match}) {
    const [team, setTeam] = useState(match.team1.id)
    const [loading, setLoading] = useState(true)
    const [matchesReqFinished, setMatchesReqFinished] = useState(false)
    const [matches, setMatches] = useState([])
    const [team1Matches, setTeam1Matches] = useState(null)
    const [team2Matches, setTeam2Matches] = useState(null)

    useEffect(()=>{
        getMatches()
    }, [team])

    function getMatches() {
        if (team == match.team1.id && team1Matches) {
            setMatches(team1Matches)
            return
        }

        if (team == match.team2.id && team2Matches) {
            setMatches(team2Matches)
            return
        }

        setMatchesReqFinished(false)
        setLoading(true)
  
        const url = `${SERVER_BASE_URL}/api/v1/team/matches?team_id=${team}`
        fetch(url, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authentication': authManager.getToken() ? authManager.getToken() : ''
          },
        })
          .then(response => response.json())
          .then(data => {
            setMatches(data)
            if (team == match.team1.id) setTeam1Matches(data)
            else if (team == match.team2.id) setTeam2Matches(data)
            // weeksScrollRef.current.scrollTo({x: (selectedWeek - 1) * 80});
            setMatchesReqFinished(true)
            setLoading(false)
          })
          .catch(error => {
             console.error('Error fetching matches:', error)
            setMatches([])
            setMatchesReqFinished(true)
            setLoading(false)
          });
      }

      function onNavMatch(match) {
        match.leagueName = match.league.name
        dataManager.setMatch(match)

        navigation.navigate({ 
          name: 'Match', 
          params: {
            id: match.id, 
          }, 
          key: match.id
        })
      }

    let currMatchDate = null;

    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    return <View style={{
        width: '100%',
        // height: 200,
        // backgroundColor: 'red'
    }}> 
        <View style={{
            width: '100%',
            height: 46,
            padding: 4,
            marginTop: 20,
            backgroundColor: Colors.selectColor,
            borderRadius: 30,
            flexDirection: 'row'
        }}>
            <TouchableOpacity activeOpacity={.6} onPress={()=>{setTeam(match.team1.id)}} style={{
                flex: 1,
                height: 38,
                backgroundColor: team == match.team1.id ? Colors.gray800 : 'transparent',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{match.team1.shortName}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.6} onPress={()=>{setTeam(match.team2.id)}} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: team == match.team2.id ? Colors.gray800  : 'transparent',
                borderRadius: 30
            }}>
                    <Text style={{
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{match.team2.shortName}</Text>
            </TouchableOpacity>
           
        </View>
        <View style={{
                width: '100%',
                // backgroundColor: 'red'
            }}>
                {loading ? <ActivityIndicator style={{
                    marginTop: 30
                }} size={'large'} color={'#FF2882'}/> : null}

                { !loading ? matches.map((item, index)=>{
                    let renderTime = false;

                    if (currMatchDate == null || !isSameDay(new Date(currMatchDate), new Date(item.date))) {
                        renderTime = true;
                        currMatchDate = item.date;
                    }
                    item.week_type = item.weekType

                    return <View key={`item_${match.id}_${index}`} style={{
                        width: '100%',
                        alignSelf: 'center'
                      }}>
                        {renderTime || index == 0 ? (
                          <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                            marginTop: 20,
                          }}>
                            { Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} /> }
                            <Text style={{
                                 marginLeft: 10,
                                 fontWeight: 'bold',
                                 color: Colors.titleColor,
                            }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')}</Text>
                          </View>
                        ): null}
                        <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} />
                      </View>
                }) : null} 
            </View>
    
    </View>
}