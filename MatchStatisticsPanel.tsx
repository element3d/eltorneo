import { Text, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

function Item({title, stat, percent = false}) {

    const values = stat ? stat.split('-') : ['0', '0']
    const intValues = [Number.parseInt(values[0]), Number.parseInt(values[1])]
    const val1 = intValues[0]
    const val2 = intValues[1]
    const total = val1 + val2

    return <View style={{
        width: '100%',
        marginTop: 20
    }}>
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <Text style={{
                color: val1 > val2 ? '#FF2882' : Colors.titleColor,
                fontSize: 16,
                fontWeight: 'bold'
            }}>{intValues[0]}{percent ? '%': ''}</Text>
            <Text style={{
                fontSize: 14,
                color: '#8E8E93'
                // fontWeight: 'bold'
            }}>{title}</Text>
            <Text style={{
                fontSize: 16,
                color: val2 > val1 ? '#FF2882' : Colors.titleColor,
                fontWeight: 'bold'
            }}>{intValues[1]}{percent ? '%': ''}</Text>
        </View>
        <View style={{
            flexDirection: 'row',
            marginTop: 10
        }}>
            <View style={{
                flex: 1,
                height: 10,
                marginRight: 5,
                backgroundColor: Colors.statLine,
                borderRadius: 10,
                alignItems: 'flex-end'
            }}>
                <View style={{
                    height: '100%',
                    borderRadius: 10,
                    backgroundColor:  val1 > val2 ? '#FF2882' : Colors.titleColor,
                    width: `${val1 / total * 100}%`
                }}>

                </View>
            </View>
            <View style={{
                flex: 1,
                // width: 100,
                height: 10,
                marginLeft: 5,
                backgroundColor: Colors.statLine,
                borderRadius: 5,
                alignItems: 'flex-start'
            }}>
                <View style={{
                    height: '100%',
                    borderRadius: 10,
                    backgroundColor: val2 > val1 ? '#FF2882' : Colors.titleColor,
                    width: `${val2 / total * 100}%`
                }}>

                </View>
            </View>
        </View>
    </View>
}

export default function MatchStatisticsPanel({statistics}) {
    return <View style={{
        width: '90%',
        alignSelf: 'center',
        marginBottom: 50
    }}>
        <Item title={strings.shots_on_target} stat={statistics.shotsOnTarget} ></Item>
        <Item title={strings.shots_off_target} stat={statistics.shotsOffTarget}></Item>
        {/* <Item title={'Blocked shots'} stat={statistics.blockedShots}></Item> */}
        <Item title={strings.ball_possession} stat={statistics.possession} percent={true}></Item>
        <Item title={strings.fouls} stat={statistics.fouls}></Item>
        <Item title={strings.corners} stat={statistics.corners}></Item>
        <Item title={strings.offsides} stat={statistics.offsides}></Item>
        <Item title={strings.saves} stat={statistics.saves}></Item>

    </View>
}