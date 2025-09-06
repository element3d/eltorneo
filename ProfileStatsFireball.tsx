import { Text, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

export default function ProfileStatsFireball({ predictsJson }) {
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
        }}>{strings.statistics}</Text>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.total_short}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {/* {stats.total_predictions} */}
                {predictsJson.totalPredicts}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.prediction_was_succ}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {predictsJson.totalWinPredicts} {predictsJson.totalPredicts > 0 ? `(${Number.parseInt(predictsJson.totalWinPredicts / predictsJson.totalPredicts * 100)}%)` : null}
            </Text>
        </View>

        <View style={{
            flexDirection: 'row'
        }}>
            <Text style={{
                color: '#8E8E93'
            }}>{strings.prediction_was_failed}: </Text><Text style={{
                color: Colors.titleColor,
                fontWeight: 'bold'
            }}>
                {predictsJson.totalLoosePredicts} {predictsJson.totalPredicts > 0 ? `(${Number.parseInt(predictsJson.totalLoosePredicts / predictsJson.totalPredicts * 100)}%)` : null}
            </Text>
        </View>
    </View>
}