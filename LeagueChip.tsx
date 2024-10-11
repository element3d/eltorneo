import { Image, Text, TouchableOpacity, View } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import strings from "./Strings"
import Colors from "./Colors"
import dataManager from "./DataManager"

export default function LeagueChip({ league, selected, onPress, compact = true }) {
  const l = league

  function getColor() {
    return '#FF2882'

    if (!league.is_special) return '#FF2882'
    if (league.id == 1) return '#0b57d0'
    return '#38425B'
  }

  function getIcon() {
    if (league.id == 7 && compact == true) return <View style={{
      alignItems: 'center'
    }}>
      <Text style={{
        color: selected ? 'white' : Colors.chipText,
        fontWeight: 800,
        fontSize: 8
      }}>UEFA</Text>
      <Text style={{
        color: selected ? 'white' : Colors.chipText,
        fontWeight: 900,
        fontSize: 12
      }}>NATIONS</Text>
      <Text style={{
        color: selected ? 'white' : Colors.chipText,
        fontWeight: 800,
        fontSize: 8
      }}>LEAGUE</Text>
    </View>
    
    return <Image key={(new Date()).getTime()} source={{
      uri: `${SERVER_BASE_URL}/data/leagues/${selected ? l.name + '_white' : l.name + (Colors.mode == 1 ? '_colored' : "") }.png${dataManager.getImageCacheTime()}`,
      cache: 'reload'
    }} style={{
      width: compact ? 34 : 28,
      height: compact ? 34 : 28,
      objectFit: 'contain',
      marginRight: compact ? 0 : 10
    }}></Image>
  }

  return <TouchableOpacity key={league ? l.name : 'all'} onPress={onPress} activeOpacity={.5}>

    <View style={{
      paddingLeft: compact ? 0 : 15,
      paddingRight: compact ? 0 : 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: compact ? 70 : 50,
      margin: 10,
      marginRight: compact ? 5 : 0,
      width: compact ? 70 : 'auto',
      borderRadius: compact ? 35 : 24,
      flexDirection: 'row',
      borderWidth: 1,
      backgroundColor: selected ? getColor() : Colors.bgColor,
      borderColor: selected ? getColor() : Colors.borderColor,
      // backgroundColor: l == selectedLeague ? "#ff2882" : 'white'
    }}>
      {league ? getIcon() : null}
      {!compact || !league ? <Text style={{
        color: selected ? "white" : '#8E8E93',
        fontFamily: 'NotoSansArmenian-ExtraBold'
      }}>{league ? l.name : strings.all}</Text> : null}
    </View>
  </TouchableOpacity>
}