import { Text, View } from "react-native";
import strings from "./Strings";
import Colors from "./Colors";

export default function FireballGreenPanel() {
    return <View style={{
        width: '100%',
        marginBottom: 20,
    }}>
        <View style={{
            width: '100%',
            borderRadius: 12,
            padding: 10,
            paddingHorizontal: 10,
            backgroundColor: '#00C56619'
        }}>
            <Text style={{
                fontSize: 16,
                marginBottom: 4,
                fontWeight: 'bold',
                color: Colors.success
            }}>{'Fireball'}</Text>
            <Text style={{
                color: Colors.titleColor
            }}>{strings.fireball_rules_info}</Text>
        </View>
    </View>
}