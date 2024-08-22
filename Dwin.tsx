import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DwinIcon from './assets/dwin.svg'


function Dwin({  }): JSX.Element {
  return (
    <View style={ {
        marginTop: 50,
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        // height: 30
    }}>
        <DwinIcon height={40} ></DwinIcon>
        {/* <Text style={{
            color: 'white',
            fontSize: 10,
            marginTop: 4,
            fontWeight: 'bold'
        }}>POWERED BY</Text> */}
    </View>
  );
}

export default Dwin;
