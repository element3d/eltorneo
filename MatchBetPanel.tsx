import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import { TextInput } from "react-native-gesture-handler";
import BBIcon from './assets/bbicon.svg'
import { useEffect, useState } from "react";
import authManager from "./AuthManager";
import SERVER_BASE_URL from "./AppConfig";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function MatchBetPanel({ navigation, me, match, remoteBet, odds, setBet }) {
    const [odd, setOdd] = useState('')
    const [amount, setAmount] = useState(match.is_special ? '20' : '')
    const [userBet, setUserBet] = useState(remoteBet ? remoteBet : odds?.bet)

    useEffect(() => {
        if (odds?.bet) {
            setUserBet(odds.bet)
            setOdd(odds.bet.bet)
        }
    }, [odds])

    if (!odds) return <ActivityIndicator style={{ marginTop: 30 }} size={'large'} color={'#FF2882'}></ActivityIndicator>

    function onChangeAmount(v) {
        if (Number.parseInt(v) > 0) {
            setAmount(v)
        } else {
            setAmount('')
        }
    }

    function isEnabled() {
        return !(odd == ''
            || Number.parseInt(amount) < 10
            || Number.parseInt(amount) > 20
            || isNaN(Number.parseInt(amount)))
    }

    function onBet() {
        if (!isEnabled()) return

        if (!authManager.getToken()) {
            navigation.navigate("Login")
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': authManager.getToken() || ""
            },
            body: JSON.stringify({
                match: match.id,
                bet: odd,
                amount: Number.parseInt(amount)
            })
        };

        fetch(`${SERVER_BASE_URL}/api/v1/bet`, requestOptions)
            .then(response => {
                return response.json()
            })
            .then(data => {
                setUserBet({
                    id: data.bet_id,
                    bet: odd,
                    odd: odds[odd],
                    amount: amount,
                    status: 0
                })
                if (setBet) setBet({
                    id: data.bet_id,
                    bet: odd,
                    odd: odds[odd],
                    status: 0,
                    amount: Number.parseInt(amount)
                })
                return null
            })
            .catch((e) => {

            });
    }

    async function onDeleteBet() {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Authentication': authManager.getToken(), // Adjust this to retrieve your token
            },
        };
        try {
            const response = await fetch(`${SERVER_BASE_URL}/api/v1/bet?bet_id=${userBet.id}`, requestOptions);
            if (response.status == 200) {
                setUserBet(null)
                if (setBet)
                    setBet(null)
            }
        } catch (error) {

        }
    }

    function getBetText(bet) {
        if (bet == 'w1') return "W1"
        if (bet == 'x') return "X"
        if (bet == 'w2') return "W2"
        if (bet == 'x1') return "1X"
        if (bet == 'x12') return "12"
        if (bet == 'x2') return "2X"

        return ''
    }

    function renderUserBet() {
        return <View style={{
            flex: 1,
            marginTop: 30,
            marginBottom: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <View style={{
                backgroundColor: Colors.gray800,
                height: 40,
                paddingLeft: 10,
                paddingRight: 15,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 20
                }}>
                    <BBIcon width={20} height={20} />
                    <Text style={{
                        marginLeft: 4,
                        fontSize: 16,
                        color: Colors.titleColor,
                        fontWeight: 'bold'
                    }}>{getBetText(userBet.bet)}</Text>
                    <Text style={{
                        marginLeft: 4,
                        fontSize: 16,
                        color: '#8E8E93',
                        fontWeight: 'bold'
                    }}>({userBet.odd.toFixed(2)})</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Text style={{
                        color: getColor(),
                        fontWeight: 'bold',
                        fontSize: 16,
                    }}>{getSign()}{getAmount()}$</Text>
                    {/* <View style={{
                        width: 26,
                        height: 26,
                        marginLeft: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'black',
                        borderRadius: 20
                    }}>
                        <Text style={{
                            fontSize: 15,
                            color: 'white'
                        }}>$</Text>
                    </View> */}
                </View>
            </View>

            {matchNotStarted() ? <TouchableOpacity activeOpacity={.8} onPress={onDeleteBet} style={{
                width: 40,
                height: 40,
                marginLeft: 10,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF4747'
            }}>
                <Icon name="close" size={20} color={'white'} />
            </TouchableOpacity> : null}
        </View>
    }

    function getSign() {
        if (userBet.status == 0) return ''
        if (userBet.status == 1) return '+'
        if (userBet.status == 2) return '-'

        return ''
    }

    function getColor() {
        if (userBet.status == 0) return Colors.titleColor
        if (userBet.status == 1) return '#00C566'
        if (userBet.status == 2) return '#FF4747'

        return Colors.titleColor
    }

    function getAmount() {
        if (userBet.status == 1) return (userBet.amount * userBet.odd).toFixed(2)

        return userBet.amount
    }

    function matchNotStarted() {
        const now = Date.now();
        return match.date > now;
    }

    function areOddsDisabled() {
        return !matchNotStarted() || !!userBet
    }

    return <View style={{
        marginTop: 20
    }}>
        {match.is_special ? <View style={{
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
                }}>{'Superbet'}</Text>
                <Text style={{
                    color: Colors.titleColor
                }}>{strings.superbet_msg}</Text>
            </View>
        </View> : null}

        <Text style={{
            color: '#8E8E93',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 10
        }}>{strings.match_winner}</Text>
        <View style={{
            flexDirection: 'row'
        }}>
            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('w1') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginRight: 5,
                borderColor: odd == 'w1' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>W1</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.w1.toFixed(2)}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('x') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginRight: 5,
                marginLeft: 5,
                borderColor: odd == 'x' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>X</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.x.toFixed(2)}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('w2') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginLeft: 5,
                borderColor: odd == 'w2' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>W2</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.w2.toFixed(2)}</Text>
            </TouchableOpacity>
        </View>


        <Text style={{
            color: '#8E8E93',
            fontSize: 14,
            fontWeight: 'bold',
            marginTop: 20,
            marginBottom: 10
        }}>{strings.double_chance}</Text>
        <View style={{
            flexDirection: 'row'
        }}>
            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('x1') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginRight: 5,
                borderColor: odd == 'x1' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>1X</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.x1.toFixed(2)}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('x12') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginRight: 5,
                marginLeft: 5,
                borderColor: odd == 'x12' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>12</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.x12.toFixed(2)}</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={areOddsDisabled()} onPress={() => { setOdd('x2') }} style={{
                flex: 1,
                height: 40,
                paddingLeft: 10,
                paddingRight: 10,
                backgroundColor: Colors.gray800,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 10,
                marginLeft: 5,
                borderColor: odd == 'x2' ? Colors.primary : Colors.gray800,
                borderWidth: 1,
                flexDirection: 'row'
            }}>
                <Text style={{
                    color: '#8E8E93',
                }}>2X</Text>
                <Text style={{
                    fontWeight: 'bold',
                    color: Colors.titleColor
                }}>{odds.x2.toFixed(2)}</Text>
            </TouchableOpacity>
        </View>

        {matchNotStarted() || userBet ? <View>
            {!userBet ?
                <View style={{
                    flex: 1,
                    marginTop: 30,
                    marginBottom: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <View style={{
                        height: 40,
                        width: 100,
                        flexDirection: 'row',
                        backgroundColor: Colors.mode == 1 ? '#00000011' : '#ffffff11',
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: 10,
                        paddingRight: 5
                    }}>
                        {!match.is_special ? <TextInput maxLength={2} value={amount} onChangeText={onChangeAmount} keyboardType="numeric" style={{
                            flex: 1,
                            fontSize: 16,
                            color: Colors.titleColor,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}></TextInput> : <Text style={{
                            flex: 1,
                            fontSize: 16,
                            color: Colors.titleColor,
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {amount}
                        </Text>}
                        <View style={{
                            width: 30,
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'black',
                            borderRadius: 15
                        }}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 16,
                                color: 'white'
                            }}>$</Text>
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={.8} onPress={onBet} style={{
                        width: 40,
                        height: 40,
                        marginLeft: 10,
                        opacity: !isEnabled() ? .6 : 1,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#37003C'
                    }}>
                        <BBIcon width={25} height={25} />
                    </TouchableOpacity>
                </View> : renderUserBet()}

            <View style={{
                flex: 1,
                // marginBottom: 30,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {!userBet && !match.is_special ? <Text style={{
                    color: '#8E8E93',
                    fontWeight: 'bold',
                    fontSize: 10,
                }}>Min - 10$,  Max - 20$</Text> : null}
                {userBet && userBet.status == 0 ? <Text style={{
                    color: '#8E8E93',
                    fontWeight: 'bold',
                    fontSize: 10,
                }}>{strings.possible_win} {(userBet.amount * userBet.odd).toFixed(2)}$</Text> : null}
            </View>
        </View> : null}

        <View style={{
            width: '100%',
            // paddingHorizontal: 20,
            marginBottom: 30,
            marginTop: 30,
        }}>
            <View style={{
                width: '100%',
                borderRadius: 12,
                padding: 10,
                // borderWidth: 1,
                // borderColor: '#FF4747',
                // marginBottom: 5,
                paddingHorizontal: 10,
                backgroundColor: '#FF474719'
            }}>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#FF4747',
                    marginBottom: 4
                }}>{strings.attention_quest}</Text>
                <Text style={{
                    color: Colors.titleColor
                }}>{strings.bet_msg}</Text>
            </View>
        </View>
    </View>
}