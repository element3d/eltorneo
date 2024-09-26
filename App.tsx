import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import CarsPage from './CarsPage';

import 'react-native-screens';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './LoginPage';

import MatchPage from './MatchPage';
import ProfilePage from './ProfilePage';
import CalendarPage from './CalendarPage';
import TablesPage from './TablesPage';
import ProfileEditPage from './ProfileEditPage';
import MatchesLivePage from './MatchesLivePage';
import strings from './Strings';
import LangPage from './LangPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

// import { RewardedAd, TestIds, AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';

// const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-7041403371220271/3023099910';
// const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
//   requestNonPersonalizedAdsOnly: true,
// });

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [loaded, setLoaded] = useState(false);

  // strings.setLanguage('en')

  // useEffect(() => {
  //   const unsubscribe = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
  //     setLoaded(true);
  //   });

  //   // Start loading the interstitial straight away
  //   rewardedAd.load();

  //   // Unsubscribe from events on unmount
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    changeNavigationBarColor('#aaffffff', true);  // Change to your desired color
  }, []);


  useEffect(()=>{
    requestNotificationPermission();

    AsyncStorage.getItem("lang")
    .then((l)=>{
      if (!l) return
      strings.setLanguage(l)
    })
    
    // strings.setLanguage('en')
  }, [])

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
          // Proceed with setting up push notifications
        } else {
          console.log('Notification permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ "Home" } screenOptions={{
          headerShown: false, // This hides the header,
          animation: 'none',
          // animationDuration: 100
        }}>
        <Stack.Screen name="Home" component={CarsPage} />
        <Stack.Screen name="Calendar" component={CalendarPage} />
        <Stack.Screen name="Tables" component={TablesPage} />
        <Stack.Screen name="Match" component={MatchPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditPage} />
        <Stack.Screen name="MatchesLive" component={MatchesLivePage} />
        <Stack.Screen name="Langs" component={LangPage} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
