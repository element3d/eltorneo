import { Text, View } from "react-native";

export default function SpecialAwardPanel({match}) {

    
    function getSpecialPoints() {

        return match.special_match_points.split(':')
    }

    return (
        <View style={{
            // marginTop: 5,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 7
        }}>
            <View style={{
                width: 30,
                height: 30,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: '#FACC15'
            }}>
                <Text style={{
                    color: 'black',
                    lineHeight: 20,
                    fontFamily: 'Poppins-Bold',
                    // fontWeight: 'bold'
                }}>+{getSpecialPoints()[0]}</Text>
            </View>
            <View style={{
                width: 30,
                height: 30,
                marginRight: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                borderColor: '#00C566',
                borderWidth: 1,
                backgroundColor: '#34C75955'
            }}>
                <Text style={{
                    color: '#00C566',
                    lineHeight: 20,
                    fontFamily: 'Poppins-Bold',
                    // fontWeight: 'bold'
                }}>+{getSpecialPoints()[1]}</Text>
            </View>
            <View style={{
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                borderWidth: 1,
                borderColor: '#FF4747',
                backgroundColor: '#FF474755'
            }}>
                <Text style={{
                    color: '#FF4747',
                    lineHeight: 20,
                    fontFamily: 'Poppins-Bold',
                    // fontWeight: 'bold'
                }}>{getSpecialPoints()[2]}</Text>
            </View>
        </View>
    )
}