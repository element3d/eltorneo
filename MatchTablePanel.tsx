import { Image, Text, View } from "react-native"
import strings from "./Strings"
import SERVER_BASE_URL from "./AppConfig"
import dataManager from "./DataManager"

export default function MatchTablePanel({ match, table }) {
    let currentGroup = 0
    let currentPos = 1

    function getLeague() {
        return dataManager.getLeagues().find(league => league.id === match.league);
    }

    function getGroupName(lindex, index) {
        let word = ''
        if (lindex == 0) word = "A"
        if (lindex == 1) word = "B"
        if (lindex == 2) word = "C"
        if (lindex == 3) word = "D"

        return `${word}${index + 1}`

    }

    return (
        <View style={{
            width: '100%',
            marginTop: 20,
            // backgroundColor: 'blue',
            alignItems: 'center'
        }}>

            {/* {selectedLeague.num_leagues > 1 ? <ScrollView
                horizontal={true}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={{
                    paddingLeft: 10,
                }}
                showsHorizontalScrollIndicator={false}
                style={{
                    flex: 1,
                    // maxHeight: 120,
                    marginBottom: 20,
                    // backgroundColor: 'red'
                }}
            >
                {
                    getMiniLeagues().map((league, i) => {
                        return renderLeagueItem(league, i)
                    })
                }
            </ScrollView> : null} */}

            <View style={{
                // paddingLeft: 15,
                // paddingRight: 15,
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
                    }}>{strings.team}</Text>
                    <Text style={{
                        width: 40,
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Mp</Text>
                    <Text style={{
                        width: 40,
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>Gd</Text>
                    <Text style={{
                        width: 40,
                        color: 'black',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}>{"Pts"}</Text>
                </View>
            </View>

            {table?.map((team, index) => {
                if (team.group_index != match.team1.group_index) return
                let renderGroupName = false

                if (getLeague().num_leagues > 1 && (index == 0 || team.group_index != currentGroup)) {
                    currentGroup = team.group_index
                    renderGroupName = true
                    currentPos = 1
                }

                return <View key={team.team.name} style={{
                    // backgroundColor: 'red',
                    // paddingLeft: 15,
                    // paddingRight: 15,
                }}>
                    {renderGroupName ? <Text style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: 'black',
                        marginLeft: 15,
                        marginTop: 20
                    }}>{strings.group} {getGroupName(team.league_index, team.group_index)}</Text> : null}
                    <View style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: team.team.id == match.team1.id || team.team.id == match.team2.id ? '#F0F0F0' : 'transparent',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <Text style={{
                            width: 50,
                            color: 'black',
                            fontSize: 16,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            // backgroundColor: 'red'
                        }}>
                            {currentPos++}
                        </Text>
                        <View style={{
                            flex: 1,
                            // paddingLeft: 5,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${team.team.name}.png`} style={{
                                width: 30,
                                height: 30,
                                // marginLeft: 5>
                            }}></Image>
                            <Text style={{
                                color: 'black',
                                fontWeight: 'bold',
                                marginLeft: 10
                            }}>
                                {team.team.short_name}
                            </Text>
                        </View>
                        <Text style={{
                            width: 40,
                            textAlign: 'center',
                            color: 'black',
                            fontWeight: 'bold'
                        }}>
                            {team.matches_played}
                        </Text>
                        <Text style={{
                            width: 40,
                            textAlign: 'center',
                            color: 'black',
                            fontWeight: 'bold'
                        }}>
                            {team.goal_difference}
                        </Text>
                        <Text style={{
                            textAlign: 'center',
                            width: 40,
                            color: 'black',
                            fontWeight: 'bold'
                        }}>
                            {team.points}
                        </Text>
                    </View>
                </View>
            })}

            <View style={{
                // backgroundColor: 'red',
                width: '100%',
                padding: 10,
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 20,
                paddingBottom: 40,
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
                    }}>Mp</Text>
                    <Text style={{
                        color: '#8E8E93'
                    }}>{strings.matches_played}</Text>
                </View>
                <View style={{
                    flexDirection: 'row'
                }}>
                    <Text style={{
                        width: 60,
                        color: 'black',
                        fontWeight: 'bold'
                    }}>Gd</Text>
                    <Text style={{
                        color: '#8E8E93'
                    }}>{strings.goal_diff}</Text>
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
            </View>

        </View>
    )
}