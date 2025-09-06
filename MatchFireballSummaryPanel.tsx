import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";
import KitImage from "./KitImage";
import PlayerImage from "./PlayerImage";

export default function MatchFireballSummaryPanel({ match, predicts }) {
    function getPlayer1Percent(player) {
        const persent = player.count / predicts.total_predicts * 100;
        return ` (${persent.toFixed(0)}%)`
    }

    function getPlayerPercent2(player) {
        if (!player) return '';
        const percent = (player.count / predicts.total_predicts * 100).toString();
        return `${Number.parseInt(percent)}%`
    }

    function getOthersPercent() {
        let diff = predicts.player1.count;
        if (predicts.player2) {
            diff += predicts.player2.count;
        }
        diff = predicts.total_predicts - diff;
        const percent = (diff / predicts.total_predicts * 100).toString();
        return `${Number.parseInt(percent)}%`
    }

    function getPlayer1Value() {
        return predicts?.player1.count + getPlayer1Percent(predicts?.player1)
    }

    function getPlayer2Value() {
        if (!predicts?.player2) return `0 (0%)`;

        return predicts?.player2.count + getPlayer1Percent(predicts?.player2)
    }

    function getPlayer2Name() {
        if (!predicts.player2) return strings.others;
        return predicts.player2.player_name;
    }

    function getPlayerTeam(player) {
        if (player.team_id == match.team1.id) return match.team1;
        else return match.team2;
    }

    function getPlayerTeamImage(player) {
        let url = `${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name}.png`;
        if (player.team_id == match.team2.id) {
            url = `${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name}.png`;
        }
        return <Image src={url} style={{
            width: 50,
            height: 50
        }} />
    }

    function getPlayer2Image(player) {
        if (!player) return <KitImage width={50} height={60} isBlank />
        if (match.league == 20) {
            return getPlayerTeamImage(predicts.player2)
        }
        return <PlayerImage team={getPlayerTeam(predicts.player2)} player={{ apiId: predicts.player2.player_api_id }} imageSize={50} />
    }

    return (
        <View>
            <Text style={{
                color: '#8E8E93',
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4
            }}>{strings.summary} ({predicts?.total_predicts} {strings.predictions})</Text>
            <View style={{
                width: '100%',
                backgroundColor: Colors.gray800,
                borderRadius: 12,
                // paddingLeft: 10,
                // paddingRight: 10,
                marginBottom: 20,
            }}>
                <View style={{
                    marginTop: 0,
                    height: 80,
                    flexDirection: 'row'
                }}>
                    <View style={{
                        //   flex: 1,
                        marginHorizontal: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {match.league == 20 ? getPlayerTeamImage(predicts.player1) :
                            <PlayerImage team={getPlayerTeam(predicts.player1)} player={{ apiId: predicts.player1.player_api_id }} imageSize={50} />}
                    </View>

                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}>
                            <Text style={{
                                marginBottom: 4,
                                fontSize: 13,
                                color: '#8E8E93',
                                fontWeight: 'bold'
                            }}>{predicts.player1.player_name}</Text>
                            <Text style={{
                                textAlign: 'right',
                                width: 60,
                                fontSize: 12,
                                color: Colors.titleColor,
                                fontWeight: 'bold'
                            }}>
                                {getPlayer2Value()}
                            </Text>
                        </View>
                        <View style={{
                            width: '100%',
                            marginTop: 0,
                            // backgroundColor: 'red',
                            height: 10,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                width: `${getPlayerPercent2(predicts?.player1)}`,
                                height: 10,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5,
                                minWidth: 10,
                                // flex: 1,
                                marginRight: 2,
                                flexShrink: 1,
                                backgroundColor: Colors.mode == 1 ? '#37003C' : 'white'
                            }}></View>
                            <View style={{
                                width: `${getOthersPercent()}`,
                                height: 10,
                                minWidth: 10,
                                flexShrink: 1,
                                borderTopRightRadius: predicts.player2 ? 0 : 5,
                                borderBottomRightRadius: predicts.player2 ? 0 : 5,
                                // borderRadius: 5,
                                marginRight: 2,
                                // flex: 1,
                                backgroundColor: '#8E8E93'
                            }}></View>
                            {predicts.player2 ? <View style={{
                                width: `${getPlayerPercent2(predicts?.player2)}`,
                                height: 10,
                                minWidth: 10,
                                borderTopRightRadius: 5,
                                borderBottomRightRadius: 5,
                                flexShrink: 1,
                                backgroundColor: '#FF2882'
                            }}></View> : null}
                        </View>
                        <View style={{
                            width: '100%',
                            marginTop: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>

                            <Text style={{
                                fontSize: 12,
                                // flex: 1,
                                width: 60,
                                color: Colors.titleColor,
                                fontWeight: 'bold'
                            }}>
                                {getPlayer1Value()}
                            </Text>

                            <Text style={{
                                marginBottom: 4,
                                fontSize: 13,
                                color: '#8E8E93',
                                fontWeight: 'bold'
                            }}>{getPlayer2Name()}</Text>
                        </View>
                    </View>


                    <View style={{
                        //   flex: 1,
                        marginLeft: 10,
                        marginRight: 10,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {getPlayer2Image(predicts.player2)}
                    </View>
                </View>
            </View>
        </View>
    )
}