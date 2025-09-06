import React, { useEffect, useState, useRef } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SERVER_BASE_URL from './AppConfig';
import dataManager from './DataManager';
import strings from './Strings';
import Colors from './Colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import FAIcon from 'react-native-vector-icons/Fontisto';
import { EGAME_BEATBET, EGAME_ELTORNEO, EGAME_FIREBALL } from './GamepadMenu';
import BBIcon from './assets/bbicon.svg'
import GoalsIcon from './assets/goals.svg';

export default function MatchItem({ onPress, match, showLeague, onShowMatchPreview, onShowMatchTrailer, showDate = false }) {

  function getTime(ts) {
    const date = new Date(ts);

    // return moment(ts).format('HH:mm')

    // Format the time as "23:30"
    const formattedTime = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    return formattedTime;
  }


  function getPoints(p) {
    const sp = getSpecialPoints()

    if (p.status == 0) return '0'
    if (p.status == 1) return match.is_special ? '+' + sp[1] : '+1'
    if (p.status == 2) return match.is_special ? '+' + sp[0] : '+3'
    if (p.status == 3) return match.is_special ? sp[2] : '-1'
    if (p.status == 4) return '-2'
    if (p.status == 5) return match.is_special ? '+' + sp[1] : '+2'
  }

  function isMatchEnded() {
    return match?.team1_score >= 0 && match?.team2_score >= 0
  }

  function hasPredict() {
    const ts = Date.now();
    if (!match.predict || match.predict.status == -1 /*|| (ts > match.date && match.predict.status == 0)*/) return false
    return true
  }

  function hasFireballPredict() {
    if (!match.fireballPredict || match.fireballPredict.status == -2) return false
    return true
  }

  function hasBet() {
    if (!match.bet || match.bet.status == -1 /*|| (ts > match.date && match.predict.status == 0)*/) return false
    return true
  }

  function isMatchLive() {
    if (match.status == 'PST') return false
    if (isMatchEnded()) return false
    if (match.date < new Date().getTime()) {
      return true
    }
    return false
  }

  function getStatusText(m) {
    if (m.status == 'HT' || m.status == 'FT' || m.status == "BT" || m.status == 'P') return m.status

    return '  ' + m.elapsed + " '"
  }

  function getLeagueIcon(match) {
    if (Colors.mode == 1 && !match.is_special)
      return `${SERVER_BASE_URL}/data/leagues/${match.league.name}${match.league.country}_colored.png${dataManager.getImageCacheTime()}`

    return `${SERVER_BASE_URL}/data/leagues/${match.league.name}${match.league.country}_white.png${dataManager.getImageCacheTime()}`

  }

  function getSpecialPoints() {
    return match.special_match_points.split(':')
  }

  function onShowMatchPress() {
    if (onShowMatchPreview) onShowMatchPreview(match)
  }

  function onShowMatchTrailerPress() {
    if (onShowMatchTrailer) onShowMatchTrailer(match)
  }

  function get90BGColor() {
    if (match.is_special) {
      if (dataManager.getSettings().game == EGAME_ELTORNEO) {
        if (match.predict.status == 0)
          return 'black'
      } else {
        // if (match.bet.status == 0)
        return 'black'
      }
      return 'white'
    }
    return Colors.gray800
  }

  function get90TitleColor() {
    if (match.is_special) {
      if (dataManager.getSettings().game == EGAME_ELTORNEO) {
        if (match.predict.status == 0)
          return 'white'
      } else {
        // if (match.bet.status == 0)
        return 'white'
      }
      return 'black'
    }
    return Colors.titleColor
  }

  function getTeam1Opacity() {
    if (!isMatchEnded()) return 1

    if (match.status == 'PEN') {
      if (match.team1_score_pen < match.team2_score_pen) return 0.6
      return 1
    }

    if (match.team1_score < match.team2_score) return 0.6
    return 1
  }

  function getTeam2Opacity() {
    if (!isMatchEnded()) return 1

    if (match.status == 'PEN') {
      if (match.team2_score_pen < match.team1_score_pen) return 0.6
      return 1
    }

    if (match.team2_score < match.team1_score) return 0.6
    return 1
  }

  function renderDate() {
    const currMatchDate = match.date

    return <View style={{
      position: 'absolute',
      top: 8,
      left: 2,
      width: 100,
      height: 20,
    }}>
      <Text style={{
        marginLeft: 10,
        fontSize: 11,
        fontWeight: 'bold',
        color: '#AEAEB2',
      }}>{moment(currMatchDate).format('DD')} {strings[moment(currMatchDate).format('MMM').toLowerCase()]} {moment(currMatchDate).format('YYYY')} </Text>
    </View >
  }

  function getBetString(bet) {
    if (bet == "w1") return "W1"
    if (bet == "w2") return "W2"
    if (bet == "x") return "X"
    if (bet == "x1") return "1X"
    if (bet == "x12") return "12"
    if (bet == "x2") return "2X"
    return ""
  }

  function onPressInternal() {
    if (match.bet) {
      if (!match.bet.amount) match.bet = null;
    }
    onPress()
  }

  function getFireballPredictView() {
    if (match.fireballPredict.status == -1) {
      return <Text style={{
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        color: Colors.fail
      }}>({strings.not_played})</Text>
    }
    if (match.fireballPredict.status == 4) {
      return <Text style={{
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        color: Colors.fail
      }}>({strings.not_scored})</Text>
    }
    if (match.fireballPredict.status == 1) {
      return <GoalsIcon width={12} height={12} style={{
        marginLeft: 4
      }} />
    }
    if (match.fireballPredict.status == 2) {
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
    if (match.fireballPredict.status == 3) {
      const numGoals = match.fireballPredict.goals;
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
    <TouchableOpacity onPress={match.status == 'PST' ? null : onPressInternal} activeOpacity={.8} style={{
      width: '100%',
      // backgroundColor: 'red',
      // minHeight: 64,
      marginBottom: 10
    }}>
      <View style={{
        // borderWidth: match.is_special ? 1 : 0,
        borderColor: 'gold',
        borderRadius: 12,
        backgroundColor: Colors.gray800,
        alignItems: 'center',
        justifyContent: 'center',
        // paddingTop: 10,
        // paddingBottom: 10,
        minHeight: 64,
        overflow: 'hidden'
      }}>
        {match.is_special ? <Image src={`${SERVER_BASE_URL}/data/special/${match.special_match_title}.png${dataManager.getImageCacheTime()}`} style={{
          width: '100%',
          height: '100%',
          // flex: 1,
          position: 'absolute',
          top: 0,
        }}></Image> : null}

        {hasPredict() || hasBet() || hasFireballPredict() ? <View style={{
          height: showLeague || match.is_special ? 0 : 20
        }}></View> : null}

        {showLeague ? <View style={{
          marginTop: 5,
          marginBottom: 4,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{
            alignItems: 'center',
            flexDirection: 'row'
          }}>
            <Image src={getLeagueIcon(match)} style={{
              width: 20,
              height: 20,
              objectFit: 'contain',
              marginRight: 6
            }} />
            <Text style={{
              fontSize: 14,
              color: match.is_special ? 'white' : Colors.titleColor,
              fontWeight: 'bold'
            }}>{match.league.name}</Text>
            <Text style={{
              color: '#AEAEB2',
              fontSize: 14,
              marginLeft: 5,
              // lineHeight: 10,
              fontWeight: 'bold'
            }}>{dataManager.getWeekTitleShort({ week: match.week, type: match.week_type })}</Text>
            <Text style={{
              color: '#AEAEB2',
              fontSize: 14,
              marginLeft: 5,
              // lineHeight: 10,
              fontWeight: 'bold'
            }}>{dataManager.getSettings().season == match.season ? "" : match.season}</Text>
          </View>

          {/* <Text style={{
            color: '#AEAEB2',
            fontSize: 10,
            lineHeight: 10,
            fontWeight: 'bold'
          }}>{dataManager.getWeekTitle({ week: match.week, type: match.week_type })}</Text> */}
        </View> : null}

        {match.is_special && !showLeague ? <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 2,
          // backgroundColor: 'red',
        }}>
          <Text style={{
            fontSize: 14,
            color: match.is_special ? 'white' : Colors.titleColor,
            fontWeight: 'bold',
            marginBottom: 4,
          }}>{match.special_match_tr_title}</Text>
          {/* <Text style={{
            color: '#AEAEB2',
            fontSize: 10,
            lineHeight: 10,
            marginBottom: 2,
            fontWeight: 'bold'
          }}>{strings.at} {match.special_match_stadium}</Text> */}
        </View> : null}

        <View style={{
          // flex: 1,
          width: "100%",
          maxHeight: 50,
          // backgroundColor: 'red',
          overflow: 'hidden',
          justifyContent: 'center',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: '40%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // justifyContent: 'center'
          }}>
            <Text style={{
              textAlign: 'center',
              // overflow: 'hidden',
              marginRight: 10,
              fontSize: 12,
              opacity: getTeam1Opacity(),
              // fontWeight: 'bold',
              color: match.is_special ? 'white' : Colors.titleColor,
              fontFamily: 'OpenSans-ExtraBold'
            }}>{match.team1.shortName}</Text>
            <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team1.name.replace(/ö/g, 'o')}.png`} style={{
              width: 36,
              height: 36
            }} />
          </View>
          {!isMatchEnded() ?
            <View style={{
              // width: '10%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              marginLeft: 10,
              marginRight: 10

            }}>
              {match.team1_score < 0 || match.team2_score < 0 ?
                <View>
                  {isMatchLive() ? <View style={{
                    alignItems: 'center',
                    // marginBottom: 5,
                    justifyContent: 'center'
                  }}>
                    <View style={{
                      paddingLeft: 6,
                      paddingRight: 6,
                      borderRadius: 6,
                      borderWidth: match.is_special ? 1 : 0,
                      backgroundColor: '#34C75918',
                      borderColor: '#00C566',
                    }}>
                      <Text style={{
                        fontFamily: 'OpenSans-Bold',
                        fontSize: 10,
                        color: '#00C566'
                        // color: '#ff7539'
                      }}>{getStatusText(match)}</Text>
                    </View>
                    <Text style={{
                      fontSize: 18,
                      fontFamily: 'OpenSans-Bold',
                      color: match.is_special ? 'white' : Colors.titleColor,
                    }}>{match.team1_score_live} : {match.team2_score_live}</Text>
                  </View> : null}
                  {match.status != 'PST' && !isMatchLive() ? <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#34C75918',
                    borderColor: '#34C759',
                    borderWidth: match.is_special ? 1 : 0,
                    // padding: 4,
                    paddingLeft: 8,
                    paddingRight: 8,
                    height: 24,
                    borderRadius: 12
                  }}>
                    <Text style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 12,
                      color: '#00C566'
                      // color: '#ff7539'
                    }}>{getTime(match.date)}</Text>
                  </View> : !isMatchLive() ? <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FF474719',
                    // padding: 4,
                    paddingLeft: 8,
                    paddingRight: 8,
                    height: 30,
                    borderRadius: 12
                  }}>
                    <Text style={{
                      fontFamily: 'OpenSans-Bold',
                      fontSize: 12,
                      color: '#FF4747'
                      // color: '#ff7539'
                    }}>{'PST'}</Text>
                  </View> : null}
                </View> :
                <Text style={{
                  fontSize: 20,
                  fontFamily: 'OpenSans-Bold',
                  color: Colors.titleColor
                }}>{match.team1_score} : {match.team2_score}</Text>
              }
            </View> :
            <Text style={{
              marginLeft: 12,
              marginRight: 12,
              fontSize: 20,
              fontFamily: 'OpenSans-Bold',
              color: match.is_special ? 'white' : Colors.titleColor
            }}>
              {match.team1_score} : {match.team2_score}
            </Text>
          }

          <View style={{
            width: '40%',
            flexDirection: 'row',

            alignItems: 'center',
            justifyContent: 'flex-start'
          }}>
            <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${match.team2.name.replace(/ö/g, 'o')}.png`} style={{
              width: 36,
              height: 36
            }} />
            <Text style={{
              textAlign: 'center',
              // overflow: 'hidden',
              marginLeft: 10,
              fontSize: 12,
              opacity: getTeam2Opacity(),
              color: match.is_special ? 'white' : Colors.titleColor,
              fontFamily: 'OpenSans-ExtraBold'
            }}>{match.team2.shortName}</Text>
          </View>
        </View>

        {hasBet() ? <View style={{
          width: '100%',
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'blue'
        }}>
          <View style={{
            // borderWidth: 1,
            backgroundColor: match.is_special ? 'white' : Colors.predictBGColor,
            // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
            alignItems: 'center',
            // borderWidth: match.is_special ? 1 : 0,
            justifyContent: 'center',
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: match.playOff ? 2 : 10,
            flexDirection: 'row',
            height: 20,
            // marginTop: 2
          }}>
            <Text style={{
              fontSize: 12,
              // marginBottom: 2,
              color: match.is_special ? 'black' : Colors.titleColor,
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>{strings.bet} {getBetString(match.bet.bet)}</Text>
            <Text style={{
              fontSize: 12,
              // marginBottom: 2,
              color: '#AEAEB2',
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>({match.bet.odd.toFixed(2)})</Text>
            <Text style={{
              fontSize: 12,
              marginLeft: 10,
              // marginBottom: 2,
              color: dataManager.getBetStatusColor(match.bet, match.is_special),
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>{dataManager.getBetStatusValue(match.bet)}</Text>

            {match.playOff ? <View style={{
              width: 18,
              height: 18,
              backgroundColor: get90BGColor(),
              borderRadius: 9,
              marginLeft: 6,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: 900,
                color: get90TitleColor()
              }}>90</Text>
            </View> : null}
          </View>
        </View> : null}

        {hasPredict() ? <View style={{
          width: '100%',
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'blue'
        }}>
          <View style={{
            // borderWidth: 1,
            backgroundColor: dataManager.getPredictBgColor(match.predict, match.is_special),
            // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
            alignItems: 'center',
            // borderWidth: match.is_special ? 1 : 0,
            justifyContent: 'center',
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: match.playOff ? 2 : 10,
            flexDirection: 'row',
            height: 20,
            marginTop: 2
          }}>
            <Text style={{
              fontSize: 12,
              // marginBottom: 2,
              color: dataManager.getPredictBorderColor(match.predict, match.is_special),
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>{dataManager.getPredictTitle(match.predict)}{dataManager.getPredictValue(match.predict)}</Text>

            {match.playOff ? <View style={{
              width: 18,
              height: 18,
              backgroundColor: get90BGColor(),
              borderRadius: 9,
              marginLeft: 6,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: 900,
                color: get90TitleColor()
              }}>90</Text>
            </View> : null}
          </View>
        </View> : null}

        {hasFireballPredict() ? <View style={{
          width: '100%',
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'blue'
        }}>
          <View style={{
            // borderWidth: 1,
            backgroundColor: dataManager.getFireballPredictBgColor(match.fireballPredict, match.is_special),
            // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
            alignItems: 'center',
            // borderWidth: match.is_special ? 1 : 0,
            justifyContent: 'center',
            borderRadius: 12,
            paddingLeft: 10,
            paddingRight: match.playOff ? 2 : 10,
            flexDirection: 'row',
            height: 20,
            // marginTop: 2
          }}>
            <Text style={{
              fontSize: 12,
              // marginBottom: 2,
              color: match.is_special ? 'black' : Colors.titleColor,
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>{match.fireballPredict.player_name}</Text>
            {match.fireballPredict.status != 0 ? getFireballPredictView() : null}
          </View>
        </View> : null}

        {(showLeague || hasPredict()) && (dataManager.getSettings().game != EGAME_BEATBET && dataManager.getSettings().game != EGAME_FIREBALL) ? <View style={{
          height: 5
        }}></View> : null}
        {showLeague && !match.is_special && !hasPredict() && !hasBet() && !hasFireballPredict() ? <View style={{
          height: 16
        }}></View> : null}
        {showLeague && match.is_special && !hasPredict() && !hasBet() && !hasFireballPredict() ? <View style={{
          height: 16
        }}></View> : null}

        {dataManager.getSettings().game == EGAME_FIREBALL && match.is_special && !showLeague && !hasFireballPredict() ? <View style={{
          height: 28,
          // alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingTop: 2,
        }}>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'gold'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: 'black'
            }}>+8</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#00C566',
            borderWidth: 1,
            backgroundColor: '#34C75955'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#00C566'
            }}>+5</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#00C566',
            borderWidth: 1,
            backgroundColor: '#34C75955'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#00C566'
            }}>+4</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#FF4747',
            backgroundColor: '#FF474755'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#FF4747'
            }}>0</Text>
          </View>
        </View> : null}

        {dataManager.getSettings().game == EGAME_ELTORNEO && match.is_special && !showLeague && !hasPredict() ? <View style={{
          height: 28,
          // alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingTop: 2,
        }}>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'gold'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: 'black'
            }}>+{getSpecialPoints()[0]}</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#00C566',
            borderWidth: 1,
            backgroundColor: '#34C75955'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#00C566'
            }}>+{getSpecialPoints()[1]}</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#00C566',
            borderWidth: 1,
            backgroundColor: '#34C75955'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#00C566'
            }}>+{getSpecialPoints()[1]}</Text>
          </View>
          <View style={{
            width: 20,
            height: 20,
            marginHorizontal: 5,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#FF4747',
            backgroundColor: '#FF474755'
          }}>
            <Text style={{
              fontSize: 10,
              lineHeight: 14,
              fontFamily: 'Poppins-Bold',
              color: '#FF4747'
            }}>{getSpecialPoints()[2]}</Text>
          </View>
        </View> : null}

        {dataManager.getSettings().game == EGAME_BEATBET && match.is_special && !showLeague && !hasBet() ? <View style={{
          height: 28,
          justifyContent: 'center',
          flexDirection: 'row',
          paddingTop: 4,
        }}>
          <View style={{
            backgroundColor: 'white',
            flexDirection: 'row',
            height: 18,
            paddingLeft: 16,
            paddingRight: 24,
            borderRadius: 11,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text style={{
              color: 'black',
              // height: 18,
              fontSize: 13,

              lineHeight: 16,
              // backgroundColor: 'red',
              // fontWeight: '800',
              fontFamily: "OpenSans-Bold",
              textAlign: 'center',
              // marginBottom: 2,
              marginRight: 4
            }}>Superbet</Text>
            <BBIcon width={26} height={28} style={{
              position: 'absolute',
              right: 2
            }} />
          </View>
        </View> : null}
      </View>
      {showDate ? renderDate() : null}

      {hasPredict() && match.predict.status > 0 ? <View style={{
        position: 'absolute',
        top: 6,
        right: 6,
        borderRadius: 4,
        paddingLeft: 5,
        paddingRight: 5,
        // borderWidth: match.is_special ? 1 : 0,
        // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
        backgroundColor: dataManager.getPredictBgColor(match.predict, match.is_special)
      }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 10,
          color: dataManager.getPredictBorderColor(match.predict, match.is_special)
        }}>{strings.points}: {getPoints(match.predict)}</Text>
      </View> : null}

      {hasFireballPredict() && match.fireballPredict.status != 0 ? <View style={{
        position: 'absolute',
        top: 6,
        right: 6,
        borderRadius: 4,
        paddingLeft: 5,
        paddingRight: 5,
        // borderWidth: match.is_special ? 1 : 0,
        // borderColor: match.is_special ? 'gold' : getBorderColor(match.predict),
        backgroundColor: dataManager.getFireballPointsBgColor(match.fireballPredict, match.is_special)
      }}>
        <Text style={{
          fontWeight: 'bold',
          fontSize: 10,
          color: dataManager.getFireballPredictBorderColor(match.fireballPredict, match.is_special)
        }}>{strings.points}: {dataManager.getFireballPoints(match.fireballPredict, match.is_special)}</Text>
      </View> : null}

      {match.teaser ? <TouchableOpacity onPress={onShowMatchTrailerPress} style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FACC15',// 'white',
        position: 'absolute',
        bottom: 5,
        left: match.preview ? 5 : '',
        right: !match.preview ? 5 : '',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
        <FAIcon name='film' color={'black'} size={14} />
      </TouchableOpacity> : null}

      {match.preview ? <TouchableOpacity onPress={onShowMatchPress} style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#FF2882',// 'white',
        position: 'absolute',
        bottom: 5,
        right: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      }}>
        <Icon name='video' color={'white'} size={12} />
      </TouchableOpacity> : null}
    </TouchableOpacity>
  )
}