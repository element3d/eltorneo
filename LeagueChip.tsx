import { Image, Text, TouchableOpacity, View } from "react-native"
import SERVER_BASE_URL from "./AppConfig"
import strings from "./Strings"

export default function LeagueChip({league, selected, onPress}) {
    const l = league

    return <TouchableOpacity key={league ? l.name : 'all'}  onPress={onPress} activeOpacity={.5}>
                  
    <View style={{
    paddingLeft: 15,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    margin: 10,
    borderRadius: 24,
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: selected ? '#FF2882' : '#F7F7F7',
    borderColor: selected ? '#FF2882' : '#EAEDF1',
    // backgroundColor: l == selectedLeague ? "#ff2882" : 'white'
  }}>
    { league ? <Image src={`${SERVER_BASE_URL}/data/leagues/${selected ? l.name + '_white' : l.name}.png`} style={{
      width: 28,
      height: 28,
      objectFit: 'contain',
      marginRight: 10
      // backgroundColor: 'red'
    }}></Image> : null }
    <Text style={{
      color: selected ? "white" : '#8E8E93',
      fontFamily: 'NotoSansArmenian-ExtraBold'
    }}>{ league ? l.name : strings.all}</Text>
  </View>
  </TouchableOpacity>
}