import { Image, Text, TouchableOpacity, View } from "react-native";
import authManager from "./AuthManager";
import ProfileIcon from './assets/Profile2.svg'
import SERVER_BASE_URL from "./AppConfig";
import dataManager from "./DataManager";
import strings from "./Strings";
import { ESTAT_TOTAL, ETAB_PREDICTS } from "./ProfilePage";
import Colors from "./Colors";
import NativeAdComp from "./NativeAdComp";
import FirstIcon from "./assets/first.svg"
import AwardWhiteIcon from './assets/award_white.svg'
import AwardBlackIcon from './assets/award_black.svg'
import AwardGoldIcon from './assets/award_gold.svg'
import FirstIcon2 from './assets/first2.svg';
import GoalsIcon from './assets/goals.svg';

export default function MatchTop20FireballPanel({ top20Predicts, match, isMatchEnded, navigation }) {
    function onNavUser(u) {
        authManager.setActiveUser(u)

        navigation.navigate({
            name: 'Profile',
            params: {
                id: u.id,
                globalPage: 1,
                selectedStat: ESTAT_TOTAL,
                tab: ETAB_PREDICTS
            },
            key: `user_${u.id}`
        })
    }

    function getLeagueText(user) {
        let txt = strings.place_in_fireball
        return txt;
        if (user.league == 1) txt += " " + strings.legend
        else if (user.league == 2) txt += " " + strings.pro
        else if (user.league == 3) txt += " " + strings.amateur
        else if (user.league == 4) txt += " " + strings.beginner

        return txt
    }

    function getAwardLeagueText(league) {
        let txt = strings.place_in_el_torneo //strings.place_in_league
        if (league == 1) txt += " (" + strings.legend
        else if (league == 2) txt += " (" + strings.pro
        else if (league == 3) txt += " (" + strings.amateur
        else if (league == 4) txt += " (" + strings.beginner

        return txt
    }

    function getAwardText(user, award, league) {

        if (award.place > 1 || award.league != 1) return getAwardLeagueText(award.league)

        return strings.winner_of_eltorneo
    }

    function getAwardIcon(user) {
        const award = user.awards[0]
        if (award.place == 1) {
            if (award.league == 1)
                return <FirstIcon style={{ marginLeft: 0 }} width={22} height={22}></FirstIcon>
            else
                return <FirstIcon2 style={{ marginLeft: 0 }} width={22} height={22}></FirstIcon2>
        }
        if (award.league == 1) return <AwardGoldIcon width={26} height={26} style={{
            // marginTop: 6,
            // marginLeft: -2
            // top: 1,
            position: 'absolute'
        }}></AwardGoldIcon>
        if (Colors.mode == 2) return <AwardWhiteIcon width={26} height={26} style={{
            // marginTop: 6,
            position: 'absolute',
            // top: 1,
            // marginLeft: -2
        }}></AwardWhiteIcon>
        else return <AwardBlackIcon width={26} height={26} style={{
            // marginTop: 6,
            // top: 1,
            position: 'absolute'
            // marginLeft: -2
        }}></AwardBlackIcon>
    }

    function getStatusView(predict) {
        if (predict.status == 0) return null;
        if (predict.status == -1) {
            return <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 4,
                color: Colors.fail
            }}>({strings.not_played})</Text>
        }
        if (predict.status == 4) {
            return <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 4,
                color: Colors.fail
            }}>({strings.not_scored})</Text>
        }
        if (predict.status == 1) {
            return <View style={{
                marginLeft: 4
            }}>
                <GoalsIcon width={12} height={12} />
            </View>
        }
        if (predict.status == 2) {
            return <View style={{
                flexDirection: 'row'
            }}><GoalsIcon width={12} height={12} style={{
                marginLeft: 4
            }} />
                <GoalsIcon width={12} height={12} style={{
                    marginLeft: 4
                }} />
            </View>
        }
        if (predict.status == 3) {
            const numGoals = predict.goals;
            return <View style={{ flexDirection: 'row' }}>
                {Array.from({ length: numGoals }).map((_, idx) => (
                    <GoalsIcon
                        key={idx}
                        width={12}
                        height={12}
                        style={{ marginLeft: 4 }}
                    />
                ))}
            </View>
        }
    }

    return (
        <View style={{
            paddingBottom: 20
        }}>
            {dataManager.getSettings().enableAds ? <View style={{
                marginTop: 10,
            }}>
                <NativeAdComp forceNativeAd={true} />
            </View> : null}
            <Text style={{
                color: '#8E8E93',
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 4,
            }}>{strings.top_20_predicts}</Text>
            {top20Predicts?.predicts.map((predict, i) => {
                return (<TouchableOpacity key={`match_predict_${i}`} onPress={() => { onNavUser(predict.user) }} activeOpacity={.8} style={{
                    backgroundColor: Colors.gray800,
                    borderRadius: 12,
                    marginBottom: 10,
                }}>
                    <View style={{
                        width: '100%',
                        height: 64,
                        paddingTop: 0,
                        paddingLeft: 10,
                        paddingRight: 5,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            overflow: 'hidden',
                            borderRadius: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: Colors.borderColor,
                            backgroundColor: Colors.bgColor
                        }}>
                            {predict.user.avatar.length ? <Image src={`${SERVER_BASE_URL}/${predict.user.avatar}`} style={{
                                width: 50,
                                height: 50,
                            }} /> : <ProfileIcon width={40} height={40} style={{ marginTop: 10 }} />}
                        </View>
                        <View style={{
                            flex: 1,
                            height: '100%',
                            // paddingTop: 10,
                            justifyContent: 'center',
                            // alignItems: 'center',
                            flexDirection: 'column',
                            marginLeft: 10,
                            // backgroundColor: 'red'
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <Text lineBreakMode='clip' numberOfLines={1} style={{
                                    color: Colors.titleColor,
                                    fontSize: 14,

                                    marginBottom: 0,
                                    fontFamily: 'NotoSansArmenian-ExtraBold'
                                }}>{predict.user.name}</Text>
                            </View>

                            <View style={{
                                marginTop: 2
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#8E8E93',
                                        fontWeight: 'bold'
                                    }}>
                                        {predict.player_name}
                                    </Text>
                                    {getStatusView(predict)}
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{
                                        fontSize: 12,
                                        color: '#8E8E93',
                                        fontWeight: 'bold'
                                    }}>
                                        {getLeagueText(predict.user)}: {predict.user.fireballPosition},
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        marginLeft: 4,
                                        color: '#8E8E93',
                                        fontFamily: 'NotoSansArmenian-Bold'
                                    }}>{strings.points}: {predict.user.fireballPoints}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            height: '100%',
                            // paddingTop: 8,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'flex-end'
                        }}>
                            <View style={{
                                // borderWidth: 1,
                                backgroundColor: dataManager.getFireballPointsBgColor(predict),
                                borderColor: '#00000033',
                                padding: 1,
                                paddingLeft: 4,
                                paddingRight: 4,
                                borderRadius: 6,
                                marginBottom: 4
                            }}>
                                {predict.status != 0 ? <Text style={{
                                    color: dataManager.getFireballPredictBorderColor(predict),
                                    fontWeight: 'bold',
                                    marginBottom: 1,
                                    fontSize: predict.status == 0 ? 14 : 12,
                                    // fontFamily: 'NotoSansArmenian-Bold'
                                }}>{strings.points}: {`${dataManager.getFireballPoints(predict, match.is_special)}`}</Text> : null}
                            </View>
                            <View style={{
                                // borderWidth: 1,
                                backgroundColor: '#00000005',
                                borderColor: '#00000033',
                                height: 30,
                            }}>
                            </View>
                        </View>
                    </View>
                    {predict.user.awards?.length ? <View style={{
                        width: '100%',
                        // height: 20,
                        paddingLeft: 10,
                        marginBottom: 4,
                        alignItems: 'center',
                        flexDirection: 'row',
                        // backgroundColor: 'red'
                    }}>
                        {/* {predict.user.awards[0].place > 1 ?  */}
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 26,
                            height: 26,
                            // backgroundColor: 'red'
                        }}>
                            {getAwardIcon(predict.user)}
                            {predict.user.awards[0].place > 1 ? <Text style={{
                                fontWeight: 900,
                                // lineHeight: 18,
                                // fontFamily: 'Poppins-Bold',
                                // right: predict./user.awards[0].place < 10 ? 8 : 6,
                                // top: predict.user.awards[0].place < 10 ? 2 : 4,
                                fontSize: predict.user.awards[0].place < 10 ? 14 : 12,
                                color: predict.user.awards[0].league == 1 ? '#FF9100' : Colors.titleColor,
                                // position: 'absolute'
                            }}>{predict.user.awards[0].place}</Text> : null}
                        </View>
                        {/* : null} */}
                        {/* {predict.user.awards[0].place == 1 && predict.user.league == 1 ? <FirstIcon width={16} height={16}></FirstIcon> : null} */}

                        <Text style={{
                            fontSize: 13,
                            color: '#8E8E93',
                            marginLeft: 6,
                            fontWeight: 'bold'
                        }}>{getAwardText(predict.user, predict.user.awards[0], predict.user.league)} 2024/25)</Text>
                    </View> : null}
                </TouchableOpacity>)
            })}

            {dataManager.getSettings().enableAds && dataManager.getSettings().bannerType == 2 ? <View style={{
                marginTop: 10
            }}>
                <NativeAdComp />
            </View> : null}

            {/* {dataManager.getSettings().enableAds ? <View style={{
              marginTop: 10
            }}>
              <NativeAdComp />
            </View> : null } */}
        </View>
    )
}