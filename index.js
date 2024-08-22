/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import PushNotification from "react-native-push-notification";
import authManager from './AuthManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SERVER_BASE_URL from './AppConfig';
import adsManager from './AdsManager';
adsManager.init()
AppRegistry.registerComponent(appName, () => App);

// PushNotification.configure({
//     // (optional) Called when Token is generated (iOS and Android)
//     onRegister: function (fcmToken) {
//       console.log("TOKEN:", fcmToken);
//       AsyncStorage.getItem('token', (err, token) => {
//         if (!token) return

//         authManager.setToken(token)
//         const json = {
//           os: fcmToken.os,
//           fcm_token: fcmToken.token
//         }
//         fetch(`${SERVER_BASE_URL}/api/v1/users/device`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authentication': token
//           },
//           body: JSON.stringify(json)
//         })
//         .then(response => {
//           // Handle the response here
//           if (response.ok) {
//             return response.text(); // or response.json() if expecting JSON
//           } else {
//             throw new Error('Post failed');
//           }
//         })
//       })
    
//     },
  
//     // (required) Called when a remote is received or opened, or local notification is opened
//     onNotification: function (notification) {
//       console.log("NOTIFICATION:", notification);
  
//       // process the notification
  
//       // (required) Called when a remote is received or opened, or local notification is opened
//       // PushNotification.localNotification({
//       //   id: 15,//notification.data.user_id,
//       //   channelId: 'riders-messenger', // Specify the channel ID if required
//       //   title: "Title",//notification.title,
//       //   message: notification.message,
//       //   // Add any other notification properties as needed
//       // });
  
//       // (required) Called when a remote is received or opened, or local notification is opened
//       notification.finish();
//     },
  
//     // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
//     onAction: function (notification) {
//       console.log("ACTION:", notification.action);
//       console.log("NOTIFICATION:", notification);
  
//       // process the action
//     },
  
//     // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
//     onRegistrationError: function(err) {
//       console.error(err.message, err);
//     },
  
//     // IOS ONLY (optional): default: all - Permissions to register.
//     permissions: {
//       alert: true,
//       badge: true,
//       sound: true,
//     },
  
//     // Should the initial notification be popped automatically
//     // default: true
//     popInitialNotification: true,
  
//     /**
//      * (optional) default: true
//      * - Specified if permissions (ios) and token (android and ios) will requested or not,
//      * - if not, you must call PushNotificationsHandler.requestPermissions() later
//      * - if you are not using remote notification or do not have Firebase installed, use this:
//      *     requestPermissions: Platform.OS === 'ios'
//      */
//     requestPermissions: true,
//   });