import { Image, Text, TouchableOpacity, View } from "react-native";
import authManager from "./AuthManager";
import ProfileIcon from './assets/Profile2.svg'
import SERVER_BASE_URL from "./AppConfig";
import dataManager from "./DataManager";
import strings from "./Strings";
import { ESTAT_TOTAL } from "./ProfilePage";

export default function MatchTop20PredictsPanel({top20Predicts, match, isMatchEnded, navigation}) {
    function getBorderColor(p) {
        if (p.status == 0) return '#8E8E93'
        if (p.status == 1) return '#00C566'
        if (p.status == 2) return '#ff7539'
        if (p.status == 3) return '#FF4747'
    } 
  
    function getBgColor(p) {
        if (p.status == 0) return '#F7F7F7'
        if (p.status == 1) return '#00C56619'
        if (p.status == 2) return '#FACC1519'
        if (p.status == 3) return '#FF474719'
    } 

    function onNavUser(u) {
        authManager.setActiveUser(u)
  
        navigation.navigate({ 
          name: 'Profile', 
          params: {
            id: u.id, 
            globalPage: 1,
            selectedStat: ESTAT_TOTAL
          }, 
          key: `user_${u.id}`
        })  
    }

    return (
        <View>
            <Text style={{
              color: '#8E8E93',
              fontSize: 14,
              fontWeight: 'bold',
              marginBottom: 4,
            }}>{strings.top_20_predicts}</Text>
            {top20Predicts?.predicts.map((predict, i)=> {
              return (<TouchableOpacity key={`match_predict_${i}`} onPress={()=>{onNavUser(predict.user)}} activeOpacity={.8}>
                <View style={{
                  width: '100%',
                  height: 80,
                  backgroundColor: 'white',
                  borderRadius: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginBottom: 12,
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
                    borderColor: '#EAEDF1',
                    backgroundColor: '#F7F7F7'
                  }}>
                    { predict.user.avatar.length ? <Image src={`${SERVER_BASE_URL}/${predict.user.avatar}`} style={{
                     width: 50,
                     height: 50,
                    }}/> : <ProfileIcon width={40} height={40} style={{marginTop: 10}}/> }
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
                    <Text lineBreakMode='clip' numberOfLines={1} style={{
                      color: 'black',
                      fontSize: 14,
                      
                      marginBottom: 0,
                      fontFamily: 'NotoSansArmenian-ExtraBold'
                    }}>{predict.user.name}</Text>
                    <Text style={{
                      fontSize: 12,
                      // marginBottom: 10,
                      fontFamily: 'NotoSansArmenian-Bold'
                    }}>{strings.place_in_el_torneo}: { /*dataManager.findUserPosition(predict.user.id)}*/predict.user.position}, {strings.points}: {predict.user.points}</Text>
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
                        backgroundColor: getBgColor(predict),
                        borderColor: '#00000033',
                        padding: 2,
                        paddingLeft: 8,
                        paddingRight: 8,
                        borderRadius: 8,
                        marginBottom: 4
                    }}>
                        <Text style={{
                          color: getBorderColor(predict),
                          fontFamily: 'NotoSansArmenian-Bold'
                        }}>{predict.team1_score} : {predict.team2_score}</Text>
                    </View>
                    <View style={{
                        // borderWidth: 1,
                        backgroundColor: '#00000005',
                        borderColor: '#00000033',
                        height: 30,
                        // padding: 2,
                        // paddingLeft: 8,
                        // paddingRight: 8,
                        // borderRadius: 8
                    }}>
                       {/* { isMatchEnded  ?  <Text style={{
                          fontFamily: 'NotoSansArmenian-Bold'
                        }}>Actual {match?.team1_score}:{match?.team2_score}</Text> : null } */}
                    </View> 
                </View>
                </View>
              </TouchableOpacity>)
            })}
        </View>
    )
}