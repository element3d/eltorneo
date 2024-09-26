import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BallIcon from './assets/ball.svg';
import strings from './Strings';

function AppBar({navigation, title, showLang, showBack = true, showLogo = true}): JSX.Element {

  function onBack() {
    navigation.goBack()
  }

  function onLang() {
    navigation.navigate({name: "Langs", key: strings.getLanguage()})
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
        borderColor: '#EAEDF1',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>
        <Icon name={'arrow-back'} color='#1C1C1E' size={26}></Icon>
      </TouchableOpacity> : <View style={{
        width: 45,
        height: 45
      }}></View>}
      {showLogo ? <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Text style={{
          marginRight: 5,
          fontSize: 28,
          color: '#575757',
          fontFamily: 'OpenSans-Light'
        }}>el</Text>
        <Text style={{
          fontSize: 28,
          color: '#575757',
          fontFamily: 'OpenSans-Bold'
        }}>T</Text>
        <BallIcon height={16} width={16} color='#ff2882' style={{
          marginTop: 5,
          marginLeft: 1,
          marginRight: 1,
          color: '#ff2882'
        }}/>
        <Text style={{
          fontSize: 28,
          color: '#575757',
          fontFamily: 'OpenSans-Bold'
        }}>rneo</Text>
      </View> : null }
      {title ? <Text style={{
        fontWeight: 900,
        fontSize: 20,
        color: '#1C1C1E'
      }}>{title}</Text> : null }
      {showLang ? <TouchableOpacity activeOpacity={.6} onPress={onLang} style={{
        width: 45,
        height: 45,
        borderRadius: 25,
        borderColor: '#EAEDF1',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'white'
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#1C1C1E'
        }}>{strings.getLanguage().toUpperCase()}</Text>
      </TouchableOpacity> : <View style={{
         width: 45,
         height: 45,
      }}>
      </View> }
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
