import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

function ButtonPrimary({ title, onClick, style = {} }): JSX.Element {
  return (
    <TouchableOpacity activeOpacity={0.9}>
    <View style={[styles.button, style]} onTouchEnd={onClick}>
        <Text style={[styles.title]} >{title}</Text>
    </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 320,
    height: 50,
    backgroundColor: '#ff2882',
    borderRadius: 8,
    // borderWidth: 1,
    marginTop: 20,
    // borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    color: 'white',
    // fontWeight: 'bold',
    fontFamily: 'NotoSansArmenian-ExtraBold'
  }
});

export default ButtonPrimary;
