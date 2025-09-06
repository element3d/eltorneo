import { Image, Text, TouchableOpacity, View } from "react-native"
import strings from "./Strings"
import GamesIcon from './assets/games.svg';
import GoalsIcon from './assets/goals.svg';
import AssistIcon from './assets/assist.svg';
import BadIcon from './assets/semibad.svg';
import GoodIcon from './assets/good.svg';
import StarIcon from './assets/semiup.svg';
import UpIcon from './assets/up.svg';
import BottomIcon from './assets/bottom.svg';

import Colors from "./Colors";
import SERVER_BASE_URL from "./AppConfig";
import dataManager from "./DataManager";

export default function PlayerRowItem({ player1, team }) {
    function positionToString(pos) {
        if (pos == "G") return strings.goalkeeper
        if (pos == "D") return strings.defender
        if (pos == "M") return strings.midfielder
        if (pos == "F") return strings.forward
        return pos
    }

    function getIcon(rating) {
        if (rating >= 8) return <UpIcon width={16} height={20} />
        if (rating < 6) return <BottomIcon width={16} height={20} />

        if (rating < 7.0) return <BadIcon width={20} height={20} />
        if (rating >= 7.0 && rating < 7.5) return <GoodIcon width={20} height={20} />
        return <StarIcon width={16} height={20} />
    }

    if (!player1) return
    const stats = player1.stats || []
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
            }} src={`https://media.api-sports.io/football/players/${player1.apiId}.png`}></Image>
        </View> :
            <View style={{
                width: imageSize,
                height: imageSize,
                marginLeft: 5,
            }}>
                <Image style={{
                    width: imageSize,
                    height: imageSize,
                }} src={`${SERVER_BASE_URL}/data/players/${team.id}/${player1.apiId}.png${dataManager.getImageCacheTime()}`}></Image>
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
            }}>{player1.number}. {player1.name}</Text>
            <Text style={{
                marginLeft: 10,
                fontWeight: 'bold',

                color: '#8E8E93',
                fontSize: 14,
            }}>{positionToString(player1.pos)}</Text>
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

                    }}>{player1.minutes} Min</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10
                }}>
                    <GoalsIcon width={20} height={17} />
                    <Text style={{
                        marginLeft: 4,
                        fontWeight: 'bold',
                        // fontFamily: 'Poppins-Bold',
                        color: Colors.titleColor,
                        fontSize: 16,
                    }}>{player1.goals}</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10
                }}>
                    <AssistIcon width={26} height={28} />
                    <Text style={{
                        marginLeft: 4,
                        fontWeight: 'bold',
                        // fontFamily: 'Poppins-Bold',
                        color: Colors.titleColor,
                        fontSize: 16,
                    }}>{player1.assists}</Text>
                </View>

                { player1.yellow > 0 ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 20
                }}>
                    <View style={{
                        width: 12,
                        borderRadius: 4,
                        height: 16,
                        backgroundColor: 'gold'
                    }}></View>
                    <Text style={{
                        marginLeft: 4,
                        fontWeight: 'bold',
                        // fontFamily: 'Poppins-Bold',
                        color: Colors.titleColor,
                        fontSize: 16,
                    }}>{player1.yellow}</Text>
                </View> : null }

                { player1.red > 0 ? <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10
                }}>
                    <View style={{
                        width: 12,
                        borderRadius: 4,
                        height: 16,
                        backgroundColor: Colors.fail
                    }}></View>
                    <Text style={{
                        marginLeft: 4,
                        fontWeight: 'bold',
                        // fontFamily: 'Poppins-Bold',
                        color: Colors.titleColor,
                        fontSize: 16,
                    }}>{player1.red}</Text>
                </View> : null }
            </View>
        </View>

        {player1.rating ? <View style={{
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
            }}>{Number.parseFloat(player1.rating).toFixed(1)}</Text>
            {getIcon(Number.parseFloat(player1.rating).toFixed(1))}

        </View> : null}
    </TouchableOpacity>
}