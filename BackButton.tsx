import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function BackButton({ navigation, style = {} }): JSX.Element {

    function onBack() {
        navigation.goBack()
      }
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={{
      zIndex: 1
    }}>
     <View style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  zIndex: 10,
                  justifyContent: 'center'
                }}>
                  <Icon name="chevron-left" size={25} color="black" />
                </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 320,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Open Sans'
  }
});

export default BackButton;
