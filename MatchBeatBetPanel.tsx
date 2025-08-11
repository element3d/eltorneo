import { Image, Text, View } from "react-native";
import BBIcon from './assets/bbicon.svg';
import LSIcon from './assets/livescore.svg';
import Colors from "./Colors";

export const EBEAT_BET_TYPE_WIN = 0
export const EBEAT_BET_TYPE_NOT_BEATEN = 1
export const BEAT_BET_STATUS_DRAW = 2
export const BEAT_BET_STATUS_NOT_DRAW = 3
import Icon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import strings from "./Strings";
import authManager from "./AuthManager";
import SERVER_BASE_URL from "./AppConfig";

export default function MatchBeatBetPanel({ predict, match, beatBet }) {

    function getAiTeamName() {
        if (beatBet.ai_type == 3) {
            return strings.ai_predict_not_draw
        }

        if (beatBet.ai_type == 2) {
            return strings.ai_predict_draw
        }

        if (beatBet.ai_team == 1) {
            return match.team1.shortName + " - "
        } else if (beatBet.ai_team == 2) {
            return match.team2.shortName + " - "
        } else {
            return strings.ai_predict_draw
        }
    }

    function getLSTeamName() {
        if (beatBet.ls_type == 3) {
            return strings.ai_predict_not_draw
        }

        if (beatBet.ls_type == 2) {
            return strings.ai_predict_draw
        }

        if (beatBet.ls_team == 1) {
            return match.team1.shortName + " - "
        } else if (beatBet.ls_team == 2) {
            return match.team2.shortName + " - "
        } else {
            return "Draw"
        }
    }

    function getScore180TeamName() {
        if (beatBet.score180_type == 3) {
            return strings.ai_predict_not_draw
        }

        if (beatBet.score180_type == 2) {
            return strings.ai_predict_draw
        }

        if (beatBet.score180_team == 1) {
            return match.team1.shortName + " - "
        } else if (beatBet.score180_team == 2) {
            return match.team2.shortName + " - "
        } else {
            return strings.ai_predict_draw
        }
    }

    function getAiType() {
        if (beatBet.ai_type == EBEAT_BET_TYPE_WIN) {
            return strings.ai_predict_win
        }

        if (beatBet.ai_type == EBEAT_BET_TYPE_NOT_BEATEN) {
            return strings.ai_predict_not_loose
        }

        return ""
    }

    function getLSType() {
        if (beatBet.ls_type == EBEAT_BET_TYPE_WIN) {
            return strings.ai_predict_win + ` (${beatBet.ls_percent}%)`
        }

        if (beatBet.ls_type == EBEAT_BET_TYPE_NOT_BEATEN) {
            return strings.ai_predict_not_loose + ` (${beatBet.ls_percent}%)`
        }

        return `(${beatBet.ls_percent}%)`
    }

    function getScore180Type() {
        if (beatBet.score180_type == EBEAT_BET_TYPE_WIN) {
            return strings.ai_predict_win + ` (${beatBet.score180_percent}%)`
        }

        if (beatBet.score180_type == EBEAT_BET_TYPE_NOT_BEATEN) {
            return strings.ai_predict_not_loose + ` (${beatBet.score180_percent}%)`
        }

        return `(${beatBet.score180_percent}%)`
    }

    function showPredict() {
        if (isMatchEnded())
            return true

        if (isMatchLive())
            return true

        // if (!authManager.getMeSync() || !predict) return false

        return false;
    }

    function getError() {
        if (!authManager.getMeSync()) return strings.ai_predict_msg1
        if (!predict) return strings.ai_predict_msg2

        if (!isMatchLive()) return strings.ai_predict_msg3
        return ""
    }

    function isMatchEnded() {
        return match.status == 'FT' || match.status == "AET" || (match?.team1_score >= 0 && match?.team2_score >= 0)
    }

    function isMatchLive() {

        if (match?.date < new Date().getTime() && (match?.team1_score < 0 || match?.team2_score < 0)) return true

        return false
    }

    return <View style={{
        width: '100%',
        marginBottom: 20,
    }}>
        <View style={{
            // marginBottom: 8,
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93',
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4
            }}>{strings.beat_bet}</Text>
        </View>

        <View style={{
            width: '100%',
        }}>
            <View style={{
                width: '100%',
                borderRadius: 12,
                minHeight: 60,

                flexDirection: 'row',

                overflow: 'hidden',
                // backgroundColor: Colors.gray800,
                backgroundColor: '#37003C',
                alignItems: 'center'
            }}>
                <Image src={`${SERVER_BASE_URL}/data/icons/beat_bet.png`} style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute'
                }}></Image>
                <View style={{
                    flexDirection: 'row',
                    paddingRight: 10,
                    height: '100%',
                    width: '100%',
                    paddingTop: 10,
                    paddingBottom: 10,
                    alignItems: 'center'
                }}>

                    <BBIcon width={32} height={32} style={{
                        marginLeft: 10
                    }} />

                    <View style={{
                        marginLeft: 10,
                        flex: 1,
                        justifyContent: 'center',
                        // paddingRight: 10
                    }}>
                        <Text style={{
                            color: 'white',
                            fontSize: 14,
                            lineHeight: 16,
                            fontFamily: 'Poppins-Bold',
                            // fontWeight: 'bold'
                        }}>el Torneo AI</Text>
                        {showPredict() ? <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                color: '#AEAEB2',
                                fontSize: 15,
                                lineHeight: 20,
                                fontWeight: 'bold'
                            }}>{getAiTeamName()} {getAiType()}</Text>
                        </View> : <View style={{
                            flexDirection: 'row'
                        }}>
                            <Text style={{
                                color: '#AEAEB2',
                                fontSize: 13,
                                lineHeight: 20,
                                fontWeight: 'bold'
                            }}>{getError()}</Text>
                        </View>}
                    </View>

                    {beatBet.ai_status > -1 || !showPredict() ? <View style={{
                        position: 'absolute',
                        right: 10,
                        top: 5
                    }}>
                        {showPredict() ? <FAIcon name={beatBet.ai_status == 0 ? "times" : 'check'} size={20} color={beatBet.ai_status == 0 ? '#FF4747' : '#00C566'} />
                            : <FAIcon name={'lock'} color={'white'} size={14} />}
                    </View> : null}
                </View>
            </View>

            <View style={{
                width: '100%',
                borderRadius: 12,
                marginTop: 10,
                paddingRight: 10,
                minHeight: 60,
                paddingVertical: 10,
                flexDirection: 'row',
                backgroundColor: Colors.gray800,
                alignItems: 'center'
            }}>
                <LSIcon width={32} height={32} style={{
                    marginLeft: 10
                }} />

                <View style={{
                    marginLeft: 10,
                    flex: 1,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: Colors.titleColor,
                        fontSize: 14,
                        lineHeight: 16,
                        fontFamily: 'Poppins-Bold',
                    }}>LiveScore</Text>
                    {showPredict() ? <View style={{
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            color: '#AEAEB2',
                            fontSize: 15,
                            lineHeight: 20,
                            fontWeight: 'bold'
                        }}>{getLSTeamName()} {getLSType()}</Text>
                    </View> : <View style={{
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            color: '#AEAEB2',
                            fontSize: 13,
                            lineHeight: 20,
                            fontWeight: 'bold'
                        }}>{getError()}</Text>
                    </View>}


                </View>

                {beatBet.ls_status > -1 || !showPredict() ? <View style={{
                    position: 'absolute',
                    right: 10,
                    top: 5
                }}>
                    {showPredict() ? <FAIcon name={beatBet.ls_status == 0 ? "times" : 'check'} size={20} color={beatBet.ls_status == 0 ? '#FF4747' : '#00C566'} />
                        : <FAIcon name={'lock'} color={Colors.titleColor} size={14} />}
                </View> : null}
            </View>

            <View style={{
                width: '100%',
                borderRadius: 12,
                marginTop: 10,
                paddingRight: 10,
                minHeight: 60,
                paddingVertical: 10,
                flexDirection: 'row',
                backgroundColor: Colors.gray800,
                alignItems: 'center'
            }}>
                <Image source={require('./assets/180score.webp')}
                    style={{
                        width: 32,
                        height: 32,
                        marginLeft: 10,
                        borderRadius: 6,
                    }} />

                <View style={{
                    marginLeft: 10,
                    flex: 1,
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: Colors.titleColor,
                        fontSize: 14,
                        lineHeight: 16,
                        fontFamily: 'Poppins-Bold',
                    }}>180 Score AI</Text>

                    {showPredict() ? <View style={{
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            color: '#AEAEB2',
                            fontSize: 15,
                            lineHeight: 20,
                            fontWeight: 'bold'
                        }}>{getScore180TeamName()} {getScore180Type()}</Text>
                    </View> : <View style={{
                        flexDirection: 'row',
                    }}>
                        <Text style={{
                            color: '#AEAEB2',
                            fontSize: 13,
                            lineHeight: 20,
                            fontWeight: 'bold'
                        }}>{getError()}</Text>
                    </View>}
                </View>

                {beatBet.score180_status > -1 || !showPredict() ? <View style={{
                    position: 'absolute',
                    right: 10,
                    top: 5
                }}>
                    {showPredict() ? <FAIcon name={beatBet.score180_status == 0 ? "times" : 'check'} size={20} color={beatBet.score180_status == 0 ? '#FF4747' : '#00C566'} />
                        : <FAIcon name={'lock'} color={Colors.titleColor} size={14} />}
                </View> : null}

            </View>
        </View>
    </View>
}