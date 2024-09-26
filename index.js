/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";
import authManager from './AuthManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SERVER_BASE_URL from './AppConfig';
import adsManager from './AdsManager';
import strings from './Strings';
adsManager.init()
AppRegistry.registerComponent(appName, () => App);

PushNotification.createChannel(
  {
    channelId: "default-channel", // The ID of the channel
    channelName: "Default Channel", // The name of the channel
    channelDescription: "A channel to categorize your notifications", // The description of the channel
    soundName: "default", // Sound for the notifications
    importance: 4, // Importance level
    vibrate: true, // Vibration on notification
  },
  (created) => console.log(`CreateChannel returned '${created}'`)
);

function saveFcmToken(fcmToken, authToken) {
  AsyncStorage.getItem('lang', (lang) => {
    if (!lang) lang = strings.getLanguage()

    if (authToken) authManager.setToken(authToken)
    const json = {
      os: fcmToken.os,
      fcm_token: fcmToken.token,
      lang: lang
    }
    fetch(`${SERVER_BASE_URL}/api/v1/me/fcm_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authentication': authToken ? authToken : ''
      },
      body: JSON.stringify(json)
    })
    .then(response => {
      // Handle the response here
      if (response.ok) {
        return response.text(); // or response.json() if expecting JSON
      } else {
        throw new Error('Post failed');
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  })
}

PushNotification.configure({
    onRegister: function (fcmToken) {
      AsyncStorage.getItem('token', (err, token) => {
        // if (!token) return
        saveFcmToken(fcmToken, token)
       
      })
    },
  
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
    //   console.log("NOTIFICATION RECEIVED:", notification);
    // console.log("Notification Data:", notification.data);
    // console.log("Notification Title:", notification.title);
    // console.log("Notification Message:", notification.message);
      // console.log("NOTIFICATION:", notification);
  
      // PushNotification.localNotification({
      //   channelId: "default-channel", // Ensure this matches your channel ID
      //   title: "new title",
      //   message: "new message",
      //   // Other options
      // });
  
      // Must call this for the notification to be removed from the tray
      notification.finish();
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log("ACTION:", notification.action);
      console.log("NOTIFICATION:", notification);
  
      // process the action
    },
  
    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
  
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
  
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,
  
    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
  });