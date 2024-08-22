import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';


import GoogleIcon from './assets/google.svg';

import AppBar from './AppBar';
import BottomNavBar from './BottomNavBar';
import strings from './Strings';
import { useFocusEffect } from '@react-navigation/native';
import gsingin from './GSignin';
import BallIcon from './assets/ball.svg';

function LoginPage({ navigation }): JSX.Element {
    const [lang, setLang] = useState('ru')

    const backgroundStyle = {
      backgroundColor: '#f7f7f7'
    };
  
    const handleSignIn = async () => {
      gsingin.signin(navigation)
    };

    useFocusEffect(
      React.useCallback(() => {
    
        if (strings.getLanguage() != lang) {
          setLang(strings.getLanguage())
        }
        return () => {
        
        };
      }, [])
    );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor:  '#f7f7f7'}}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <ScrollView
          // onContentSizeChange={(w, h) => { setScrollWidth(w), setScrollHeight(h) }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#f7f7f7',
            // minHeight: '100%',
            paddingBottom: 50
          }}
          style={{
            flex: 1,
          }}>
          
            <AppBar showLogo={false} navigation={navigation}/>
            
            <View style={{
              width: '100%',
              // height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              // marginTop: 20,
            }}>
               
               <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10
              }}>
                <Text style={{
                  marginRight: 5,
                  fontSize:34,
                  color: '#575757',
                  fontFamily: 'OpenSans-Light'
                }}>el</Text>
                <Text style={{
                  fontSize: 34,
                  color: '#575757',
                  fontFamily: 'OpenSans-Bold'
                }}>T</Text>
                <BallIcon height={22} width={22} color='#ff2882' style={{
                  marginTop: 8,
                  color: '#ff2882'
                }}/>
                <Text style={{
                  fontSize: 34,
                  color: '#575757',
                  // fontWeight: 'bold'
                  fontFamily: 'OpenSans-Bold'
                }}>rneo</Text>
              </View>

              <Image width={200} height={200} source={require('./assets/playstore.png')} style={{
                width: 220, 
                height: 220,
                borderRadius: 20,
                marginBottom: 20
              }}></Image>

              <Text style={{
                color: '#8E8E93',
                fontSize: 16,
                // fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 0,
                width: '80%',
                minWidth: 320,
                marginBottom: 30
              }}>
                {strings.app_desc}
              </Text>
        
              <TouchableOpacity onPress={handleSignIn} activeOpacity={.8} style={{
                width: 320,
                height: 50,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#FF2882',
              }}>
                <Text style={{
                  fontSize: 20,
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {strings.join_now}
                </Text>
                <View  style={{
                  width: 40,
                  height: 40,
                  position: 'absolute',
                  right: 5,
                  backgroundColor: 'white',
                  borderRadius: 30,
                  // marginTop: 20,
                  // borderWidth: 3,
                  borderColor: 'black',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GoogleIcon width={32} height={32}/>
                </View>
              </TouchableOpacity>
            </View>
        </ScrollView>
        <BottomNavBar navigation={navigation} />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "94%",
    height: 50,
    backgroundColor: 'black',
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

export default LoginPage;
