import { Image, Text, TouchableOpacity, View } from "react-native"
import Colors from "./Colors"
import SERVER_BASE_URL from "./AppConfig"
import ProfileIcon from './assets/Profile2.svg';
import strings from "./Strings";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function UserPanel({ navigation, place, user, isMe }) {
    function onNavEdit() {
      navigation.navigate("ProfileEdit")
    }

    function getLeagueText() {
      let txt = strings.place_in_league
      if (user.league == 1) txt += " " + strings.legend
      else if (user.league == 2) txt += " " + strings.pro
      else if (user.league == 3) txt += " " + strings.amateur
      else if (user.league == 4) txt += " " + strings.beginner

      return txt
    }
  
    function getBalanceColor() {
      if (user.balance > 0) return '#00C566'
      if (user.balance < 0) return '#FF4747'

      return '#8E8E93'
    }

    if (user) {
      return (
        <View style={{
          width: '100%',
          paddingLeft: 15,
          paddingRight: 15,
          alignItems: 'center',
          // marginBottom: 20,
          // marginTop: 10,
          flexDirection: 'row'
        }}>
          <View style={{
            width: 70,
            height: 70,
            borderColor: Colors.borderColor,
            borderWidth: 2,
            backgroundColor: Colors.bgColor,
            borderRadius: 80,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {user.avatar?.length ? <Image style={{
              width: 70,
              height: 70,
              objectFit: 'cover'
            }} src={`${SERVER_BASE_URL}/${user.avatar}`} /> : <ProfileIcon width={60} height={60} style={{ marginTop: 10 }} />}
          </View>
          <View style={{
            marginLeft: 15,
            flex: 1
          }}>
            <Text style={{
              // marginTop: 10,
              color: Colors.titleColor,
              fontSize: user.name.length > 20 ? 16 : 18,
              fontFamily: 'NotoSansArmenian-Bold'
            }}>{user.name}</Text>
            {place > 0 ? <Text style={{
              // marginTop: 2,
              color: '#8E8E93',
              fontSize: 14,
              // lineHeight: 20,
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>
               {`${getLeagueText()}:  ${place}`}</Text> : null} 
            <Text style={{
              // marginTop: 2,
              color: '#8E8E93',
              fontSize: 14,
              lineHeight: 16,
              fontWeight: 'bold'
              // fontFamily: 'NotoSansArmenian-Bold'
            }}>{strings.points}:  {user.points}</Text>
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={{
                // marginTop: 2,
                color: '#8E8E93',
                fontSize: 14,
                lineHeight: 16,
                fontWeight: 'bold'
                // fontFamily: 'NotoSansArmenian-Bold'
              }}>{strings.balance}:  </Text>
                <Text style={{
                // marginTop: 2,
                color: getBalanceColor(),
                fontSize: 14,
                lineHeight: 16,
                fontWeight: 'bold'
                // fontFamily: 'NotoSansArmenian-Bold'
              }}>{user.balance.toFixed(2)}$</Text>
            </View>
          </View>
          {isMe ? <TouchableOpacity activeOpacity={.6} onPress={onNavEdit} style={{
            width: 50,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: 50,
            flexDirection: 'row'
            // backgroundColor: 'red'
          }}>
            <Icon name="settings" size={24} color={'#8E8E93'}></Icon>
            <Icon name='chevron-right' size={20} color={'#8E8E93'}></Icon>
          </TouchableOpacity> : null}
        </View>
      )
    } else {
      return (
        <View style={{
          width: '100%',
          paddingLeft: 15,
          paddingRight: 15,
          alignItems: 'center',
          marginBottom: 20,
          marginTop: 10,
          flexDirection: 'row'
        }}>
          <View style={{
            width: 70,
            height: 70,
            borderColor: '#EAEDF1',
            borderWidth: 2,
            backgroundColor: '#F7F7F7',
            borderRadius: 80,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
  
          </View>
          <View style={{
            marginLeft: 15,
            flex: 1,
            alignItems: 'flex-start'
          }}>
            <Text style={{
              // marginTop: 10,
              color: 'transparent',
              fontSize: 18,
              backgroundColor: '#F7F7F7',
              borderRadius: 10,
              fontFamily: 'NotoSansArmenian-Bold'
            }}>First Name</Text>
            <Text style={{
              marginTop: 2,
              backgroundColor: '#F7F7F7',
              borderRadius: 10,
              color: 'transparent',
              fontSize: 12,
              fontFamily: 'NotoSansArmenian-Bold'
            }}>10 Points</Text>
          </View>
  
        </View>
      )
    }
  }
  