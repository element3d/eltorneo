import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import strings from "./Strings";

import GamesIcon from './assets/games.svg';
import GoalsIcon from './assets/goals.svg';
import AssistIcon from './assets/assist.svg';
import BadIcon from './assets/semibad.svg';
import GoodIcon from './assets/good.svg';
import StarIcon from './assets/semiup.svg';
import UpIcon from './assets/up.svg';
import BottomIcon from './assets/bottom.svg';
import PlayerImage from "./PlayerImage";
import SERVER_BASE_URL from "./AppConfig";
import authManager from "./AuthManager";

export default function MatchPlayersPanel({ navigation, match, fireballPredict, onFireballPredict }) {
    const [teamIndex, setTeamIndex] = useState(1)
    const [loading, setLoading] = useState(true)
    const [players, setPlayers] = useState(null)
    const team = teamIndex == 1 ? match.team1 : match.team2;

    useEffect(() => {
        setLoading(true)
        getPlayers()
    }, [])

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            if (players)
                setLoading(false)
        }, .2)
    }, [teamIndex])

    function getPlayers() {
        fetch(`${SERVER_BASE_URL}/api/v1/match/players?team1_id=${match.team1.id}&team2_id=${match.team2.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': authManager.getToken() || ""
            },
        })
            .then(response => response.json())
            .then(data => {
                setPlayers(data);
                setLoading(false)
            })
            .catch(error => {

            });
    }

    function onPredict(player) {
        if (fireballPredict) return;
        const me = authManager.getMeSync();
        if (!me || !authManager.getToken()) {
            navigation.navigate("Login")
            return;
        }

        onFireballPredict({
            match_id: match.id,
            team_id: team.id,
            player_api_id: player.apiId,
            player_name: player.name,
            player_photo: player.photo
        })
    }

    function renderPlayer(player1) {
        function getIcon(rating) {
            if (rating >= 8) return <UpIcon width={16} height={20} />
            if (rating < 6) return <BottomIcon width={16} height={20} />

            if (rating < 7.0) return <BadIcon width={20} height={20} />
            if (rating >= 7.0 && rating < 7.5) return <GoodIcon width={20} height={20} />
            return <StarIcon width={16} height={20} />
        }

        function getPlayerName(player1) {
            if (player1.number > 0)
                return `${player1.number}. ${player1.name}`
            return player1.name
        }

        if (!player1) return
        const stats = player1.stats
        const stat = stats.find(s => s.leagueId === match.league) || null
        const imageSize = 60
        return <TouchableOpacity onPress={() => onPredict(player1)} activeOpacity={.8} style={{
            // flex: 1,
            width: '100%',
            backgroundColor: Colors.gray800,
            marginBottom: 10,
            borderRadius: 12,
            height: 80,
            alignItems: 'center',
            borderWidth: fireballPredict?.player_api_id == player1.apiId ? 1 : 0,
            borderColor: Colors.primary,
            // borderRightWidth: 1,
            // padding: 10,
            // borderRightColor: 'black',
            flexDirection: 'row'
        }}>
            {!team.playersReady ? <View style={{
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
            </View> : <View style={{
                width: imageSize,
                height: imageSize,
                marginLeft: 5,
            }}>
                <PlayerImage team={team} player={player1} imageSize={imageSize} />
            </View>}
            <View style={{
                // marginBottom: 20
            }}>
                <Text style={{
                    marginLeft: 10,
                    fontWeight: 'bold',
                    // fontFamily: 'Poppins-Bold',
                    color: Colors.titleColor,
                    fontSize: 16,
                }}>{getPlayerName(player1)}</Text>
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
                    {stat?.goals > 0 ? <View style={{
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
                    </View> : null}

                    {stat?.assists > 0 ? <View style={{
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
                    </View> : null}
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
        const squad = teamIndex == 1 ? players.team1Players : players.team2Players;
        // Group by position
        let attackers = [];
        let midf = [];
        let deff = [];
        let keepers = [];

        for (let i = 0; i < squad.length; ++i) {
            if (squad[i].position === 'Attacker') attackers.push(squad[i]);
            if (squad[i].position === 'Midfielder') midf.push(squad[i]);
            if (squad[i].position === 'Defender') deff.push(squad[i]);
            if (squad[i].position === 'Goalkeeper') keepers.push(squad[i]);
        }

        // Helper to sort players by games (descending)
        function sortByGames(a, b) {
            const statA = a.stats.find(s => s.leagueId === match.league);
            const statB = b.stats.find(s => s.leagueId === match.league);
            const gamesA = statA ? statA.games : 0;
            const gamesB = statB ? statB.games : 0;
            return gamesB - gamesA; // higher first
        }

        attackers.sort(sortByGames);
        midf.sort(sortByGames);
        deff.sort(sortByGames);
        keepers.sort(sortByGames);

        // Render
        function renderGroup(title, players) {
            return (
                <>
                    <Text style={{
                        fontWeight: 'bold',
                        marginBottom: 4,
                        fontSize: 16,
                        // marginTop: 10,
                        color: '#8E8E93'
                    }}>{title}</Text>
                    <View>
                        {players.map(p => (
                            <View key={p.name} style={{
                                flex: 1,
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}>
                                {renderPlayer(p)}
                            </View>
                        ))}
                    </View>
                </>
            );
        }

        return (
            <View>
                {renderGroup(strings.attackers, attackers)}
                {renderGroup(strings.midfielders, midf)}
                {renderGroup(strings.defenders, deff)}
                {renderGroup(strings.goalkeepers, keepers)}
            </View>
        );
    }

    return <View style={{
        width: '100%',
        marginTop: 20,
        paddingBottom: 20,
    }}>

        <View style={{
            width: '100%',
            marginBottom: 20,
        }}>
            <View style={{
                width: '100%',
                borderRadius: 12,
                padding: 10,
                paddingHorizontal: 10,
                backgroundColor: '#00C56619'
            }}>
                <Text style={{
                    fontSize: 16,
                    marginBottom: 4,
                    fontWeight: 'bold',
                    color: Colors.success
                }}>{'Fireball'}</Text>
                <Text style={{
                    color: Colors.titleColor
                }}>{strings.fireball_rules_info}</Text>
            </View>
        </View>

        <View style={{
            width: '100%',
            height: 46,
            padding: 4,
            marginBottom: 20,
            backgroundColor: Colors.selectBGColor,
            borderRadius: 30,
            flexDirection: 'row'
        }}>
            <TouchableOpacity activeOpacity={.6} onPress={() => { setTeamIndex(1), setLoading(true) }} style={{
                flex: 1,
                height: 38,
                backgroundColor: teamIndex == 1 ? Colors.selectColor : 'transparent',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{match.team1.shortName}</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.6} onPress={() => { setTeamIndex(2), setLoading(true) }} style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: teamIndex == 2 ? Colors.selectColor : 'transparent',
                borderRadius: 30
            }}>
                <Text style={{
                    color: Colors.titleColor,
                    fontWeight: 'bold'
                }}>{match.team2.shortName}</Text>
            </TouchableOpacity>

        </View>

        {loading ? <ActivityIndicator size={'large'} color={'#FF2882'}></ActivityIndicator> : renderSquad()}

    </View>
}