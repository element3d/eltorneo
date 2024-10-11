import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import SERVER_BASE_URL from './AppConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authManager from './AuthManager';
import dataManager from './DataManager';
import { ESTAT_TOTAL } from './ProfilePage';

class GSignin {
  constructor() {
    this.configureGoogleSignIn();

  }

  async configureGoogleSignIn() {
    await GoogleSignin.configure({
      androidClientId: '854989049861-11rinp95m6a1ku9skhj1fl3v6bkr78tc.apps.googleusercontent.com',
      // iosClientId: '242881349597-p4nqfq299hpb2iddlc9kp39k9e2tefp8.apps.googleusercontent.com',
      scopes: ['email'],
    });
  };

  internalSignIn(email, name, navigation, callback) {
    this.signinGoogle(email, name)
      .then((token) => {
        AsyncStorage.setItem(
          'token',
          token,
        ).then((d) => {
          authManager.getMe(token)
            ?.then((me) => {
              authManager.setMe(me)
              authManager.setToken(token)
              if (navigation) {
                if (dataManager.getPendingPredict()) {
                  navigation.goBack();
                } else {
                  navigation.replace('Profile', {
                    globalPage: 1,
                    routeSelectedLeague: -1,
                    selectedStat: ESTAT_TOTAL
                  });
                }
              } else if (callback) {
                callback(me)
              }
            })

        })
          .catch((err) => {
            console.log(err)
          });
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async signin(navigation, callback) {
    // this.internalSignIn("narekhovhannisyanim6@gmail.com", 'Narek5', navigation)
    // return

    try {
      await GoogleSignin.hasPlayServices();

      let userInfo = null
      try {
        userInfo = await GoogleSignin.signIn();
      } catch (error) {
        // this.internalSignIn("narekhovhannisyanim6@gmail.com", 'Narek5', navigation, callback)

        console.error('Google sign-in error:', error);
        return
      }
      this.internalSignIn(userInfo.user.email, userInfo.user.name, navigation, callback)
    } catch (error) {
      console.log('Google login error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  signinGoogle(email, name) {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        name: name
      })
    };
    return fetch(`${SERVER_BASE_URL}/api/v1/signin/googlemail`, requestOptions)
      .then(response => {
        if (response.status == 200)
          return response.text()

        // setError(t('incorrect_login'))
        return null
      })
  }
}

const gsingin = new GSignin()
export default gsingin