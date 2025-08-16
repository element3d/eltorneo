import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MoonIcon from './assets/menu.svg';
import MoonDarkIcon from './assets/menu-dark.svg';

import strings from './Strings';
import Colors, { ColorsClassDark } from './Colors';

function AppBar({ navigation, title, showDrawer, setMode, showLang, showMode = false, showBack = true, showLogo = true }): JSX.Element {

  function onBack() {
    navigation.goBack()
  }

  function onLang() {
    navigation.navigate({ name: "Langs", key: strings.getLanguage() })
  }

  function onSetMode() {
    showDrawer()
    return

    Colors.swap()
    setMode(Colors.mode)
  }

  return (
    <View style={{
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      justifyContent: 'space-between',
      height: 80
    }}>
      {showBack ? <TouchableOpacity activeOpacity={.6} onPress={onBack} style={{
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>
        <Icon name={'arrow-back'} color={Colors.titleColor} size={26}></Icon>
      </TouchableOpacity> :
        // <View style={{
        //   width: 45,
        //   height: 45
        // }}></View>
        null
      }

      {showMode ? <TouchableOpacity activeOpacity={.6} onPress={onSetMode} style={{
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>
        {Colors.mode == 1 ? <MoonIcon /> : <MoonDarkIcon />}
      </TouchableOpacity> :
        //  <View style={{
        //   width: 45,
        //   height: 45
        // }}></View>
        null
      }

      {showLogo ? <View style={{
        // flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          // marginRight: 5,
          fontSize: 20,
          // lineHeight: 28,
          // fontWeight: 'bold',
          color: Colors.titleColor,
          fontFamily: 'Poppins-Bold'
        }}>el Torneo</Text>
        <Text style={{
          fontSize: 12,
          lineHeight: 12,
          opacity: .6,
          marginTop: -6,
          marginBottom: 8,
          fontWeight: 'bold',
          color: Colors.titleColor
        }}>{'www.eltorneo.app'}</Text>

      </View> : null}
      {title ? <View style={{
        alignItems: 'center',
        justifyContent: 'center'
      }}><Text style={{
        // fontWeight: 'bold',
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        // lineHeight: 22,
        color: Colors.titleColor
      }}>{title}</Text>
        <Text style={{
          fontSize: 12,
          lineHeight: 12,
          opacity: .6,
          marginTop: -6,
          marginBottom: 8,
          fontWeight: 'bold',
          color: Colors.titleColor
        }}>{'www.eltorneo.app'}</Text>
      </View> : null}
      {showLang ? <TouchableOpacity activeOpacity={.6} onPress={onLang} style={{
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: Colors.titleColor
        }}>{strings.getLanguage().toUpperCase()}</Text>
      </TouchableOpacity> : <View style={{
        width: 45,
        height: 45,
      }}>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "94%",
    height: 50,
    backgroundColor: 'white',
    borderLeftWidth: 3,
    marginTop: 20,
    borderLeftColor: '#ff004a',
    justifyContent: 'center',
    paddingLeft: 20
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Open Sans'
  }
});

export default AppBar;
