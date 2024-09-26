import { View, Text } from "react-native";
import strings from "./Strings";
import Icon from 'react-native-vector-icons/FontAwesome5';

function AwardsPanel() {
    return (
        <View style={{
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Text style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 18,
                marginBottom: 4,
            }}>{strings.awards}</Text>
            <Text style={{
                textAlign: 'center',
                fontSize: 16,
                color: "#8E8E93",
                paddingHorizontal: 20,
            }}>{strings.award_msg}</Text>
            <View style={{
                borderWidth: 2,
                borderRadius: 40,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginBottom: 20,
                marginTop: 6,
                borderColor: '#EAEDF1'
            }}>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: 'black'
                }}>
                    1 pt = 0.5 $
                </Text>
            </View>
       
            <Text style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 18
            }}>{strings.rules}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    marginRight: 6,
                }}>
                    {strings.score_predicted}:
                </Text>
                <Text style={{
                    color: '#FFCC00',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    +3
                </Text>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    // fontWeight: 'bold'
                }}>
                    {strings.points2}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    marginRight: 6,
                }}>
                    {strings.winner_or_draw_predicted}:
                </Text>
                <Text style={{
                    color: '#00C566',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    +1
                </Text>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    // fontWeight: 'bold'
                }}>
                    {strings.point}
                </Text>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
            }}>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    marginRight: 6,
                }}>
                    {strings.prediction_was_failed}:
                </Text>
                <Text style={{
                    color: '#FF4747',
                    fontSize: 16,
                    marginRight: 4,
                    fontWeight: 'bold'
                }}>
                    -1
                </Text>
                <Text style={{
                    color: '#8E8E93',
                    fontSize: 14,
                    // fontWeight: 'bold'
                }}>
                    {strings.point}
                </Text>
            </View>
        </View>
    )
}

export default AwardsPanel