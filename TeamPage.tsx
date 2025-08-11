import React, { useEffect, useState, useRef } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    View,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CalendarIcon from './assets/calendar_black.svg';
import CalendarWhiteIcon from './assets/calendar_white.svg';
import GamesIcon from './assets/games.svg';
import GoalsIcon from './assets/goals.svg';
import AssistIcon from './assets/assist.svg';
import BadIcon from './assets/bad.svg';
import GoodIcon from './assets/good.svg';
import StarIcon from './assets/star.svg';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomNavBar, { EPAGE_CALENDAR } from './BottomNavBar';
import AppBar from './AppBar';
import dataManager from './DataManager';
import strings from './Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from './Colors';
import TrailerItem from './TrailerItem';
import TrailerVideoDialog from './TrailerVideoDialog';
import SERVER_BASE_URL from './AppConfig';
import authManager from './AuthManager';
import MatchItem from './MatchItem';
import moment from 'moment';
import MatchPreviewDialog from './MatchPreviewDialog';

const ETAB_MATCHES = 0
const ETAB_SQUAD = 1

function TeamAppBar({ leagueName, navigation }) {

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
                    // lineHeight: 26,
                    fontFamily: 'Poppins-Bold',
                    color: 'white'
                }}>{leagueName}</Text>
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

function TeamPage({ navigation, route }): JSX.Element {
    const [team, setTeam] = useState(dataManager.getTeam())
    const insets = useSafeAreaInsets();
    const [tab, setTab] = useState(ETAB_MATCHES)
    const [matches, setMatches] = useState([])
    const [squad, setSquad] = useState([])
    const [loading, setLoading] = useState(true)
    const [showMatchPreview, setShowMatchPreview] = useState(false)
    const [previewMatch, setPreviewMatch] = useState(null)

    useEffect(() => {
        const url = `${SERVER_BASE_URL}/api/v1/team?team_id=${team.id}`
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': authManager.getToken() ? authManager.getToken() : ''
            },
        })
            .then(response => response.json())
            .then(data => {
                setMatches(data.matches)
                setSquad(data.squad)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
            });
    }, [])

    function onShowMatchPreview(match) {
        match.isTeaser = false
        setShowMatchPreview(match)
        setPreviewMatch(match)
    }

    function onShowMatchTrailer(match) {
        match.isTeaser = true
        setShowMatchPreview(match)
        setPreviewMatch(match)
    }

    function renderPlayer(player1) {
        function getIcon(rating) {
            if (rating < 7.0) return <BadIcon width={20} height={20} />
            if (rating >= 7.0 && rating < 7.5) return <GoodIcon width={20} height={20} />
            return <StarIcon width={20} height={20} />
        }

        if (!player1) return
        const stats = player1.stats
        let stat = null
        for (let i = 0; i < stats.length; ++i) {
            if (stats[i].leagueId == team.leagueId) stat = stats[i]
        }
        const imageSize = 60
        return <TouchableOpacity activeOpacity={.8} style={{
            // flex: 1,
            width: '100%',
            backgroundColor: Colors.gray800,
            marginBottom: 10,
            borderRadius: 12,
            height: 80,
            alignItems: 'center',
            // borderRightWidth: 1,
            // padding: 10,
            // borderRightColor: 'black',
            flexDirection: 'row'
        }}>
            <View style={{
                width: imageSize,
                height: imageSize,
                borderRadius: 35,
                overflow: 'hidden',
                borderWidth: 2,
                marginLeft: 5,
                borderColor: Colors.borderColor
            }}>
                <Image style={{
                    width: imageSize,
                    height: imageSize,
                }} src={player1.photo}></Image>
            </View>
            <View style={{
                // marginBottom: 20
            }}>
                <Text style={{
                    marginLeft: 10,
                    fontWeight: 'bold',
                    // fontFamily: 'Poppins-Bold',
                    color: Colors.titleColor,
                    fontSize: 16,
                }}>{player1.number} - {player1.name}</Text>
                <Text style={{
                    marginLeft: 10,
                    fontWeight: 'bold',

                    color: '#8E8E93',
                    fontSize: 14,
                }}>{strings.age}: {player1.age}</Text>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 10
                    }}>
                        <GamesIcon width={20} height={20} />
                        <Text style={{
                            marginLeft: 4,
                            fontWeight: 'bold',
                            // fontFamily: 'Poppins-Bold',
                            color: Colors.titleColor,
                            fontSize: 16,

                        }}>{stat ? stat.games : 0}</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20
                    }}>
                        <GoalsIcon width={20} height={17} />
                        <Text style={{
                            marginLeft: 4,
                            fontWeight: 'bold',
                            // fontFamily: 'Poppins-Bold',
                            color: Colors.titleColor,
                            fontSize: 16,
                        }}>{stat ? stat.goals : 0}</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 20
                    }}>
                        <AssistIcon width={26} height={28} />
                        <Text style={{
                            marginLeft: 4,
                            fontWeight: 'bold',
                            // fontFamily: 'Poppins-Bold',
                            color: Colors.titleColor,
                            fontSize: 16,
                        }}>{stat ? stat.assists : 0}</Text>
                    </View>
                </View>
            </View>

            {stat && stat.rating ? <View style={{
                position: 'absolute',
                top: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                right: 10
            }}>
                <Text style={{
                    marginRight: 4,
                    color: '#8E8E93',
                    fontWeight: 'bold'
                }}>{Number.parseFloat(stat.rating).toFixed(1)}</Text>
                {getIcon(Number.parseFloat(stat.rating).toFixed(1))}

            </View> : null}
        </TouchableOpacity>
    }

    function renderSquad() {
        if (loading) return
        let attackers = []
        let midf = []
        let deff = []
        let keepers = []
        for (let i = 0; i < squad.length; ++i) {
            if (squad[i].position == 'Attacker') attackers.push(squad[i])
            if (squad[i].position == 'Midfielder') midf.push(squad[i])
            if (squad[i].position == 'Defender') deff.push(squad[i])
            if (squad[i].position == 'Goalkeeper') keepers.push(squad[i])
        }

        let attackViews = []
        for (let i = 0; i < attackers.length; i++) {
            const player1 = attackers[i]
            // const player2 = attackers[i + 1]

            attackViews.push(<View key={player1.name} style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {renderPlayer(player1)}
            </View>)
        }

        let midfViews = []
        for (let i = 0; i < midf.length; i += 1) {
            const player1 = midf[i]

            midfViews.push(<View key={player1.name} style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {renderPlayer(player1)}

            </View>)
        }

        let deffViews = []
        for (let i = 0; i < deff.length; i += 1) {
            const player1 = deff[i]

            deffViews.push(<View key={player1.name} style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {renderPlayer(player1)}
            </View>)
        }

        let keepersViews = []
        for (let i = 0; i < keepers.length; i += 1) {
            const player1 = keepers[i]

            keepersViews.push(<View key={player1.name} style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row'
            }}>
                {renderPlayer(player1)}
            </View>)
        }

        return <View>
            <Text style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontSize: 16,
                color: '#8E8E93'
            }}>{strings.attackers}</Text>
            <View style={{
                // backgroundColor: Colors.gray800,
                // borderRadius: 16,
                // padding: 10,
                // paddingBottom: 0
            }}>
                {attackViews}
            </View>

            <Text style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontSize: 16,
                marginTop: 10,
                color: '#8E8E93'
            }}>{strings.midfielders}</Text>
            <View style={{
                // marginTop: 20,
                // backgroundColor: Colors.gray800,
                // borderRadius: 16,
                // padding: 10,
                // paddingBottom: 0
            }}>
                {midfViews}
            </View>

            <Text style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontSize: 16,
                marginTop: 10,
                color: '#8E8E93'
            }}>{strings.defenders}</Text>
            <View style={{

            }}>
                {deffViews}
            </View>

            <Text style={{
                fontWeight: 'bold',
                marginBottom: 4,
                fontSize: 16,
                marginTop: 10,
                color: '#8E8E93'
            }}>{strings.goalkeepers}</Text>
            <View style={{

            }}>
                {keepersViews}
            </View>

        </View>
    }

    function renderMatches() {
        if (loading) return
        let currMatchDate = null;

        const isSameDay = (date1, date2) => {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        };

        return <View style={{
            marginTop: -10
        }}>{!loading ? matches.map((item, index) => {
            let renderTime = false;

            if (currMatchDate == null || !isSameDay(new Date(currMatchDate), new Date(item.date))) {
                renderTime = true;
                currMatchDate = item.date;
            }
            item.week_type = item.weekType

            return <View key={`item_${item.id}_${index}`} style={{
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
                        {Colors.mode == 1 ? <CalendarIcon width={26} height={26} /> : <CalendarWhiteIcon width={26} height={26} />}
                        <Text style={{
                            marginLeft: 10,
                            fontWeight: 'bold',
                            color: Colors.titleColor,
                        }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')}</Text>
                    </View>
                ) : null}
                <MatchItem showLeague={true} onPress={() => onNavMatch(item)} match={item} onShowMatchPreview={onShowMatchPreview} onShowMatchTrailer={onShowMatchTrailer} />
            </View>
        }) : null}
        </View>
    }

    function onNavMatch(match) {
        dataManager.setMatch(match)

        navigation.navigate({
            name: 'Match',
            params: {
                id: match.id,
            },
            key: match.id
        })
    }

    function getTeamNameFontSize() {
        if (team.name.length > 20) return 16
        return team.name.length > 10 ? 20 : 22
    }

    function onClosePreview() {
        setShowMatchPreview(false)
    }

    return (
        <GestureHandlerRootView style={{
            flex: 1, backgroundColor: Colors.gray800,
        }}>

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
                <View style={{
                    height: insets.top,
                    backgroundColor: '#37003C'
                }} />
                <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={'#37003C'}
                />

                <View style={{ flex: 1 }}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        contentContainerStyle={{
                            // minHeight: '100%'
                        }}
                        style={{ flex: 1 }}>
                        <View style={{
                            // position: 'absolute',
                            width: '100%',
                            overflow: 'hidden',
                            height: 180,
                            backgroundColor: '#37003C',
                            borderRadius: 20,
                            top: 0,
                            borderTopRightRadius: 0,
                            borderTopLeftRadius: 0,
                        }}>
                            <Image resizeMode="cover" src={`${SERVER_BASE_URL}/data/leagues/${team.leagueName}${team.leagueCountry}_banner2.png${dataManager.getImageCacheTime()}`} style={{
                                position: 'absolute',
                                width: '100%',
                                left: 40,
                                height: 210,
                                // margin: 20,
                                // backgroundColor: 'red',
                                borderRadius: 20,
                                borderTopRightRadius: 0,
                                borderTopLeftRadius: 0,
                            }}></Image>
                            <TeamAppBar leagueName={team.leagueName} navigation={navigation} />

                            <View style={{
                                // height: 800,
                                width: '100%',
                                paddingLeft: 20,
                                paddingTop: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                // justifyContent: 'center'
                            }}>
                                <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${encodeURIComponent(team.name.replace(/ö/g, 'o'))}.png`} style={{
                                    width: 80,
                                    height: 80,
                                    // marginLeft: 5>
                                }}></Image>
                                <View style={{
                                    // backgroundColor: 'red',
                                    height: '100%',
                                    flex: 1,
                                    marginLeft: 10,
                                    paddingTop: 10,
                                    // backgroundColor: 'red'
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: getTeamNameFontSize(),
                                        // lineHeight: 24,
                                        // fontWeight: 'bold',
                                        fontFamily: 'Poppins-Bold'
                                    }}>{team.name}</Text>
                                    <Text style={{
                                        color: '#AEAEB2',
                                        fontSize: team.venue?.length > 20 ? 13 : 16,
                                        marginTop: -5,
                                        // opacity: .6,
                                        // fontWeight: 'bold',
                                        fontFamily: 'Poppins-Bold'
                                    }}>{team.venue}</Text>
                                </View>
                                <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${encodeURIComponent(team.name.replace(/ö/g, 'o'))}_kit.png`} style={{
                                    width: 80,
                                    height: 80,
                                    marginRight: 10,
                                    // marginLeft: 5>
                                }}></Image>
                            </View>
                        </View>
                        <View style={{
                            width: '100%',
                            paddingTop: 25,
                            paddingHorizontal: 20
                            // height: 400,
                            // backgroundColor: 'red'
                        }}>
                            <View style={{
                                width: '100%',
                                height: 46,
                                padding: 4,
                                marginBottom: 20,
                                backgroundColor: Colors.selectColor,
                                borderRadius: 23,
                                flexDirection: 'row'
                            }}>
                                <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_MATCHES) }} style={{
                                    flex: 1,
                                    height: 38,
                                    backgroundColor: tab == ETAB_MATCHES ? Colors.gray800 : 'transparent',
                                    borderRadius: 30,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{
                                        color: tab == ETAB_MATCHES ? Colors.titleColor : "#8E8E93",
                                        fontWeight: 'bold'
                                    }}>{strings.matches}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={.6} onPress={() => { setTab(ETAB_SQUAD) }} style={{
                                    flex: 1,
                                    height: 38,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: tab == ETAB_SQUAD ? Colors.gray800 : 'transparent',
                                    borderRadius: 30
                                }}>
                                    <Text style={{
                                        color: tab == ETAB_SQUAD ? Colors.titleColor : "#8E8E93",
                                        fontWeight: 'bold'
                                    }}>{strings.squad}</Text>
                                </TouchableOpacity>
                            </View>
                            {loading ? <ActivityIndicator color={'#FF2882'} size={'large'}></ActivityIndicator> : null}
                            {tab == ETAB_MATCHES ? renderMatches() : renderSquad()}
                        </View>
                    </ScrollView>
                    <BottomNavBar navigation={navigation} />
                </View>
                {showMatchPreview ? <MatchPreviewDialog onClose={onClosePreview} match={previewMatch} /> : null}

                <View style={{
                    height: insets.bottom,
                    backgroundColor: Colors.gray800,
                }} />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default TeamPage;
