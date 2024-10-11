import { Image, Text, TouchableOpacity, View } from "react-native"
import dataManager from "./DataManager"
import TeamItem from "./TeamItem"
import strings from "./Strings"
import SERVER_BASE_URL from "./AppConfig"
import moment from "moment"
import Colors from "./Colors"

export default function LiveMatchItem({ match, leagueName, navigation }) {

    const m = match
    if (!m.league_name) {
        m.league_name = leagueName
    }
    if (m.week_type !== 0) {
        if (!m.week_type) {
            m.week_type = m.weekType
        }
    }

    const matchDate = m.date;
    const now = Date.now();
    let isLive = false;
    if (matchDate < now) {
        isLive = true;
    }

    function getStatusText(m) {
        if (m.team1_score != -1 && m.team2_score != -1) {
            m.status = 'FT'
        }

        if (m.status == 'HT' || m.status == 'FT') return m.status

        if (!isLive) {
            return moment(m.date).format('HH:mm')
        }
        return m.elapsed + " '"
    }

    function onNavMatch(match) {
        match.leagueName = match.league_name
        match.weekType = match.week_type
        dataManager.setMatch(match)

        navigation.navigate({
            name: 'Match',
            params: {
                id: match.id,
            },
            key: match.id
        })
    }

    function getDate() {
        const today = moment().startOf('day');
        const tomorrow = moment().add(1, 'day').startOf('day');
    
        if (moment(matchDate).isSame(today, 'day')) {
            return strings.today;
        } else if (moment(matchDate).isSame(tomorrow, 'day')) {
            return strings.tomorrow;
        } else {
            return `${moment(matchDate).format('DD')} ${strings[moment(matchDate).format('MMM').toLowerCase()]}`;
        }
    }


    return (
        <TouchableOpacity onPress={() => onNavMatch(m)} activeOpacity={.9} style={{
            width: '100%',
            // height: 250,
            // paddingBottom: 20,
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 20,
            alignItems: 'center',
            backgroundColor: '#37003C'
        }}>
            <Image src={`${SERVER_BASE_URL}/data/leagues/${m.league_name}_banner2.png${dataManager.getImageCacheTime()}`} style={{
                width: '100%',
                height: '100%',
                top: 0,
                position: 'absolute'
            }} />

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
                }}>{dataManager.getWeekTitle({ week: m.week, type: m.week_type })}</Text>
            </View>

            <View style={{
                width: '100%',
                marginTop: 0,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
            }}>
                <TeamItem team={m.team1} isHome={true} compact={true} />
                <View>
                    {isLive ? <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 20,
                        marginBottom: 5
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginRight: 10
                        }}>{ m.team1_score > -1 ? m.team1_score : m.team1_score_live}</Text>
                        <Text style={{
                            color: 'white',
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}>:</Text>
                        <Text style={{
                            color: 'white',
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginLeft: 10
                        }}>{ m.team2_score > -1 ? m.team2_score : m.team2_score_live}</Text>
                    </View> : <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        marginBottom: 4,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>{getDate()} </Text>
                    }
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
                            fontWeight: 'bold',
                            // marginLeft: isLive ? 5 : 0,
                        }}>{getStatusText(m)}</Text>
                    </View>
                </View>
                <TeamItem team={m.team2} compact={true} />

            </View>
            <View style={{
                padding: 10,
                // backgroundColor: 'red'
            }}>
                { m.predict && m.predict?.team1_score > -1 && m.predict?.team2_score > -1 ? <View style={{
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
                </View> : null}
            </View>
        </TouchableOpacity>
    )
}