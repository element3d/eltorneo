import { Dimensions, Image, ImageBackground, Text, View } from "react-native";
import SERVER_BASE_URL from "./AppConfig";
import DropShadow from "react-native-drop-shadow";
import strings from "./Strings";

const win = Dimensions.get('window');

export default function MatchLineupsPanel({ match, lineups }) {

    function getKgNumber(team) {

        let players = team == 1 ? lineups.team1.players : lineups.team2.players;

        for (let p of players) {
            const grid = p.grid.split(":");
            const r = Number.parseInt(grid[0]);
            const c = Number.parseInt(grid[1]);

            if (r === 1 && c === 1) {
                return p.number;
            }
        }
    }

    function renderLeftTeam(formation, playerColor, playerNColor) {
        const arr = formation.split('-'); // Split formation into rows

        function getPlayerNumber(row, col) {
            let players = lineups.team1.players;

            for (let p of players) {
                const grid = p.grid.split(":");
                const r = Number.parseInt(grid[0]);
                const c = Number.parseInt(grid[1]);

                if (r === row && c === col) {
                    return p.number;
                }
            }
        }

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '85%', flex: 1 }}>
                {arr.map((item, rowIndex) => (
                    <View key={rowIndex} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            height: '100%',
                            alignItems: 'center',
                        }}>
                            {Array.from({ length: parseInt(item) }).map((_, playerIndex) => (
                                <DropShadow key={playerIndex}
                                    style={{
                                        shadowColor: "black",
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 10,
                                    }}>
                                    <View
                                        style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: `white`,
                                            borderWidth: 2,
                                            borderColor: `#${playerColor}`,
                                            borderRadius: 20, // Circular shape
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            color: `black`,
                                        }}>
                                            {getPlayerNumber(rowIndex + 2, playerIndex + 1)}
                                        </Text>
                                    </View>
                                </DropShadow>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    function renderRightTeam(formation, playerColor, playerNColor) {
        const arr = formation.split('-').reverse(); // Split formation into rows

        function getPlayerNumber(row, col) {
            let players = lineups.team2.players;

            for (let p of players) {
                const grid = p.grid.split(":");
                const r = Number.parseInt(grid[0]);
                const c = Number.parseInt(grid[1]);

                if (r === row && c === col) {
                    return p.number;
                }
            }
        }

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '85%', flex: 1 }}>
                {arr.map((item, rowIndex) => (
                    <View key={rowIndex} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'space-around',
                            height: '100%',
                            alignItems: 'center',
                        }}>
                            {Array.from({ length: parseInt(item) }).map((_, playerIndex) => (
                                <DropShadow key={playerIndex}
                                    style={{
                                        shadowColor: "black",
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 10,
                                    }}>
                                    <View
                                        style={{
                                            width: 26,
                                            height: 26,
                                            backgroundColor: `white`,
                                            borderWidth: 2,
                                            borderColor: `#${playerColor}`,
                                            borderRadius: 20, // Circular shape
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: 'bold',
                                            color: `black`,
                                        }}>
                                            {getPlayerNumber(arr.length - rowIndex + 1, item - playerIndex)}
                                        </Text>
                                    </View>
                                </DropShadow>
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    function getPlayerPos(pos) {
        if (pos == "G") return strings.goalkeeper
        if (pos == "D") return strings.defender
        if (pos == "M") return strings.midfielder
        if (pos == "F") return strings.forward

        return ""
    }

    return (
        <View
            style={{
                width: '100%',
                marginTop: 20,
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 0,
                paddingBottom: 40
            }}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name}.png`} style={{
                        width: 40,
                        height: 40
                    }} />
                    <View style={{
                        marginLeft: 5
                    }}>
                        <Text style={{
                            color: '#1C1C1E',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>{match.team1.shortName}</Text>
                        <Text style={{
                            color: '#636366',
                            fontWeight: 'bold',
                            fontSize: 13
                        }}>{lineups.team1.formation}</Text>
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    <View style={{
                        marginRight: 5,
                        alignItems: 'flex-end'
                    }}>
                        <Text style={{
                            color: '#1C1C1E',
                            fontWeight: 'bold',
                            fontSize: 15
                        }}>{match.team2.shortName}</Text>
                        <Text style={{
                            color: '#636366',
                            fontWeight: 'bold',
                            fontSize: 13
                        }}>{lineups.team2.formation}</Text>
                    </View>
                    <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name}.png`} style={{
                        width: 40,
                        height: 40
                    }} />

                </View>
            </View>
            <ImageBackground
                source={require('./assets/pitch.png')}
                style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    width: '100%',
                    aspectRatio: 1.6,
                }}
                resizeMode="contain"
            >
                {/* Team 1 */}
                <View style={{
                    width: '50%',
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        marginLeft: 10,
                        height: '100%',
                        width: 30,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <DropShadow style={{
                            shadowColor: "black",
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                            shadowOpacity: .1,
                            shadowRadius: 10,
                        }}>
                            <View style={{
                                width: 26,
                                height: 26,
                                borderWidth: 2,
                                borderColor: `#${lineups.team1.gk_color}`,
                                backgroundColor: `white`,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    fontWeight: 'bold',
                                    color: `black`,
                                }}>{getKgNumber(1)}</Text>
                            </View>
                        </DropShadow>
                    </View>
                    {renderLeftTeam(lineups.team1.formation, lineups.team1.player_color, lineups.team1.player_ncolor)}
                </View>

                {/* Team 2 */}
                <View style={{
                    width: '50%',
                    height: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {renderRightTeam(lineups.team2.formation, lineups.team2.player_color, lineups.team2.player_ncolor)}
                    <View style={{
                        marginRight: 10,
                        height: '100%',
                        width: 30,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <DropShadow
                            style={{
                                shadowColor: "black",
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                                shadowOpacity: .1,
                                shadowRadius: 10,
                            }}>
                            <View style={{
                                width: 26,
                                height: 26,
                                borderWidth: 2,
                                backgroundColor: 'white',
                                borderColor: `#${lineups.team2.gk_color}`,
                                borderRadius: 20,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    fontWeight: 'bold',
                                    color: `black`,
                                }}>{getKgNumber(2)}</Text>
                            </View>
                        </DropShadow>
                    </View>
                </View>
            </ImageBackground>

            {/* Coaches */}
            <View style={{
                width: '100%',
                marginTop: 10,
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1C1C1E'
                }}>{strings.managers}</Text>
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View style={{
                    marginTop: 6,
                }}>
                    <Text style={{
                        color: '#3A3A3C',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}>{lineups.team1.coach}</Text>

                </View>
                <View style={{
                    marginTop: 6,
                }}>
                    <Text style={{
                        color: '#3A3A3C',
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}>{lineups.team2.coach}</Text>

                </View>
            </View>

            {/* Lineups */}
            <View style={{
                width: '100%',
                marginTop: 20,
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1C1C1E'
                }}>{strings.lineups}</Text>
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View>
                    {lineups.team1.players.map((p) => {
                        if (!p.start11) return
                        return <View key={p.name} style={{
                            marginTop: 12,
                        }}>
                            <Text style={{
                                color: '#3A3A3C',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}>{p.number}. {p.name}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#8E8E93',
                            }}>{getPlayerPos(p.pos)}</Text>
                        </View>
                    })}
                </View>
                <View style={{
                    alignItems: 'flex-end'
                }}>
                    {lineups.team2.players.map((p) => {
                        if (!p.start11) return
                        return <View key={p.name} style={{
                            marginTop: 12,
                            alignItems: 'flex-end'
                        }}>
                            <Text style={{
                                color: '#3A3A3C',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}>{p.number}. {p.name}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#8E8E93',
                            }}>{getPlayerPos(p.pos)}</Text>
                        </View>
                    })}
                </View>
            </View>

            {/* Subs */}
            <View style={{
                width: '100%',
                marginTop: 20,
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#1C1C1E'
                }}>{strings.substitutes}</Text>
            </View>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                // alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <View>
                    {lineups.team1.players.map((p) => {
                        if (p.start11) return
                        return <View key={p.name} style={{
                            marginTop: 12,
                        }}>
                            <Text style={{
                                color: '#3A3A3C',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}>{p.number}. {p.name}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#8E8E93',
                            }}>{getPlayerPos(p.pos)}</Text>
                        </View>
                    })}
                </View>
                <View style={{
                    alignItems: 'flex-end'
                }}>
                    {lineups.team2.players.map((p) => {
                        if (p.start11) return
                        return <View key={p.name} style={{
                            marginTop: 12,
                            alignItems: 'flex-end'
                        }}>
                            <Text style={{
                                color: '#3A3A3C',
                                fontSize: 14,
                                fontWeight: 'bold'
                            }}>{p.number}. {p.name}</Text>
                            <Text style={{
                                fontSize: 12,
                                color: '#8E8E93',
                            }}>{getPlayerPos(p.pos)}</Text>
                        </View>
                    })}
                </View>
            </View>
        </View>
    );
}
