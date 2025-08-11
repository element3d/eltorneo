import { Text, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

export default function ProfileStatsBet({predictsJson}) {
    return <View style={{
        // marginTop: 20,
        width: '90%',
        alignSelf: 'center',
        // height: 200,
        borderRadius: 12,
        padding: 20,
        backgroundColor: Colors.gray800
    }}>
        <Text style={{
            color: Colors.titleColor,
            fontWeight: 'bold',
            fontSize: 16,
            marginBottom: 10
        }}>{strings.in_all_leagues}</Text>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.total_bets}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {/* {stats.total_predictions} */}
                {predictsJson.totalBets}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.winning_bets}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {predictsJson.totalWinBets} {predictsJson.totalBets > 0 ? `(${Number.parseInt(predictsJson.totalWinBets / predictsJson.totalBets * 100)}%)` : null}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.losing_bets}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {predictsJson.totalLooseBets} {predictsJson.totalBets > 0 ? `(${Number.parseInt(predictsJson.totalLooseBets / predictsJson.totalBets * 100)}%)` : null}
            </Text>
        </View>
    </View>
}