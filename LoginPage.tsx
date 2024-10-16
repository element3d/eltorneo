import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';


import GoogleIcon from './assets/google.svg';

import AppBar from './AppBar';
import BottomNavBar from './BottomNavBar';
import strings from './Strings';
import { useFocusEffect } from '@react-navigation/native';
import gsingin from './GSignin';
import BallIcon from './assets/ball.svg';
import AwardsPanel from './AwardsPanel';
import Colors from './Colors';

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
  useEffect(() => {
    changeNavigationBarColor(Colors.bottomNavBarColor, false, true);  // Change to your desired color
  }, []);


  function onNavAwardsInfo() {
    navigation.navigate("AwardsInfo")
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bgColor }}>
      <StatusBar
        barStyle={Colors.statusBar}
        backgroundColor={Colors.bgColor}
      />

      <ScrollView
        // onContentSizeChange={(w, h) => { setScrollWidth(w), setScrollHeight(h) }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: Colors.bgColor,
          // minHeight: '100%',
          paddingBottom: 50
        }}
        style={{
          flex: 1,
        }}>

        <AppBar showLogo={false} navigation={navigation} />

        <View style={{
          width: '100%',
          // height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            // marginBottom: 10
          }}>
            <Text style={{
              marginRight: 5,
              fontSize: 34,
              color: Colors.titleColor,
              fontFamily: 'Poppins-Bold'
            }}>el</Text>
            <Text style={{
              fontSize: 34,
              color: Colors.titleColor,
              fontFamily: 'Poppins-Bold'
            }}>To</Text>
            {/* <BallIcon height={18} width={20} color='#ff2882' style={{
              marginTop: 8,
              marginRight: 2,
              marginLeft: 1,
              color: '#ff2882'
            }} /> */}
            <Text style={{
              fontSize: 34,
              color: Colors.titleColor,
              // fontWeight: 'bold'
              fontFamily: 'Poppins-Bold'
            }}>rneo</Text>
          </View>

          <Text style={{
            color: '#8E8E93',
            fontSize: 16,
            // fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 0,
            width: '80%',
            minWidth: 320,
            marginBottom: 20
          }}>
            {strings.login_desc}
          </Text>

          <TouchableOpacity activeOpacity={.9} onPress={onNavAwardsInfo} style={{
            borderRadius: 20,
            width: 320,
            height: 250,
            overflow: 'hidden'
          }}>
            <ImageBackground source={require('./assets/playstore.png')} style={{
              width: 320,
              height: 250,
              borderRadius: 20,
              // marginBottom: 20
            }}>
              <AwardsPanel onReadMore={onNavAwardsInfo} overlay={true}/>
            </ImageBackground>
          </TouchableOpacity>



          {/* <AwardsPanel /> */}

          <TouchableOpacity onPress={handleSignIn} activeOpacity={.8} style={{
            width: 320,
            height: 50,
            marginTop: 20,
            borderRadius: 30,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            backgroundColor: '#FF2882',
          }}>
            <Text style={{
              fontSize: 20,
              color: 'white',
              fontFamily: 'Poppins-Bold',
              lineHeight: 28,
              // fontWeight: 'bold'
            }}>
              {strings.join_now}
            </Text>
            <View style={{
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
              <GoogleIcon width={32} height={32} />
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
