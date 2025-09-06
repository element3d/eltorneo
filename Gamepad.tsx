import { TouchableOpacity } from "react-native";
import Colors from "./Colors";
import GamepadIcon from './assets/gamepad_black.svg'
import GamepadWhiteIcon from './assets/gamepad_white.svg'

export default function Gamepad({onShowMenu}) {
    return <TouchableOpacity onPress={onShowMenu} activeOpacity={.8} style={{
        width: 50,
        height: 50,
        bottom: 90,
        right: 20,
        position: 'absolute',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.borderColor,
        borderWidth: 2,
        backgroundColor: Colors.gray800
    }}>
        {Colors.mode == 1 ? <GamepadIcon width={30} height={30} /> : <GamepadWhiteIcon width={30} height={30} />}
    </TouchableOpacity>
}