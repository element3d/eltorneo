import { Image, Text, View } from "react-native";
import SERVER_BASE_URL from "./AppConfig";
import strings from "./Strings";
import Colors from "./Colors";

export default function TeamItem({team, isHome, compact = false}) {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'red',
        width: '50%',
        // marginTop: 20,
        flex: compact ? 1 : 0,
        marginRight: compact ? 0 : 10,
        marginLeft: compact ? 0 : 10
      }}>
          <Image src={`${SERVER_BASE_URL}/data/teams/150x150/${team.name}.png`} style={{
              width: compact ? 70 : 60,
              height: compact ? 70 : 60
          }}/>
          <Text style={{
              color: compact ? 'white' : Colors.titleColor,
              marginTop: 5,
              fontSize: 16,
              fontFamily: 'OpenSans-Bold'
          }}>{team.shortName}</Text>
          <Text style={{
            marginTop: 0,
            fontSize: 12,
            lineHeight: 14,
            color: '#AEAEB2',
            fontWeight: 'bold'
          }}>{isHome ? strings.home : strings.away}</Text>
      </View>
    )
  }