import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import BottomNavBar from './BottomNavBar';
import SERVER_BASE_URL from './AppConfig';
import authManager from './AuthManager';
import ProfileIcon from './assets/Profile2.svg'
import AppBar from './AppBar';
import { launchImageLibrary } from 'react-native-image-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import strings from './Strings';
import ConfirmDialog from './ConfirmDialog';

function ProfileEditPage({ navigation, route }): JSX.Element {
 
    const [avatar, setAvatar] = useState(authManager.getMeSync().avatar)
    const [name, setName] = useState(authManager.getMeSync().name)
    const [showDeleteAccDialog, setShowDeleteAccDialog] = useState(false)
    const [showSignoutDialog, setShowSignoutDialog] = useState(false)

    const backgroundStyle = {
      backgroundColor: 'white',
    };

    useEffect(()=>{

      return () => {
        if (!authManager.getMeSync().name.length) {
          authManager.getMeSync().name = name
          return
        }


        const requestOptions = {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authentication': authManager.getToken()
          },
          body: JSON.stringify({ 
            name: authManager.getMeSync().name
           })
        };
  
        fetch(`${SERVER_BASE_URL}/api/v1/me/name`, requestOptions)
          .then(response => {
              if (response.status == 200) {
                  return response.text()
              }             
              return null
          })
          .then(data => {
              // if (!data) return    
              // unsub()       
          });
      }
    }, [])

    async function onUploadAvatar() {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
      });

      if (result.didCancel) {
          console.log('User cancelled image picker');
      } else if (result.errorCode) {
          console.log('ImagePicker Error: ', result.errorMessage);
      } else {
          const imageUri = result.assets[0];
          
          const data = new FormData();
          data.append('image_file', imageUri);
          const requestOptions = {
              method: 'PUT',
              headers: {
                  'Authentication': authManager.getToken(), // Adjust this to retrieve your token
              },
              body: data
          };
    
          try {
              const response = await fetch(`${SERVER_BASE_URL}/api/v1/me/avatar`, requestOptions);
              const responseData = await response.text();

              authManager.getMe(authManager.getToken())
              .then((u)=>{
                authManager.setMe(u)
                setAvatar(u.avatar)
              })

              return responseData; // Return response data if needed
          } catch (error) {
              console.error('Error updating cover:', error);
              throw error; // Throw error for handling in calling function
          } 
     }
    }

    async function onDeleteAvatar() {
      const requestOptions = {
        method: 'DELETE',
        headers: {
            'Authentication': authManager.getToken(), // Adjust this to retrieve your token
        },
      };
      try {
        const response = await fetch(`${SERVER_BASE_URL}/api/v1/me/avatar`, requestOptions);
        authManager.getMe(authManager.getToken())
        .then((u)=>{
          authManager.setMe(u)
          setAvatar('')
        })
      } catch (error) {
        console.error('Error deleting avatar:', error);
        throw error; // Throw error for handling in calling function
      } 
    }

    function onSignOutYes() {
      authManager.logout()
      .then(()=>{
        GoogleSignin.signOut()
        .then(()=>{
          navigation.navigate("Home")
        })
        .catch((err) =>{
          console.log(err)
          navigation.navigate("Home")
        })
      })
    }

    function onSignOut() {
      setShowSignoutDialog(true)
    }

    function onDeleteAccYes() {
      authManager.deleteMe()
      ?.then(()=>{
        authManager.logout()
        .then(()=>{
          navigation.navigate("Home")
        })
      })
      .catch((err) =>{
        authManager.logout()
        .then(()=>{
          navigation.navigate("Home")
        })
      })
    }

    function onDeleteAcc() {
      setShowDeleteAccDialog(true)
    }

    function onNo() {
      setShowDeleteAccDialog(false)
      setShowSignoutDialog(false)
    }

    function onChangeName(n) {
      setName(n)
      authManager.getMeSync().name = n
    }

  return (
    <GestureHandlerRootView style={{flex: 1, backgroundColor: 'white'}}>

    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar
        barStyle={'dark-content'}
        
        backgroundColor={backgroundStyle.backgroundColor}
      />
   
        <View style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            // minHeight: '100%',
            alignItems: 'center'

          }}
          style={{
            flex: 1,
          }}>
            <View style={{
              width: "100%",
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              paddingBottom: 20
            }}>
                <AppBar navigation={navigation}/>
                <View>
                    
                    <View style={{
                        width: 100,
                        height: 100,
                        borderColor: '#EAEDF1',
                        borderWidth: 2,
                        backgroundColor: '#F7F7F7',
                        borderRadius: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                      { authManager.getMeSync().avatar?.length ? <Image style={{
                          width: 100,
                          height: 100,
                      }} src={`${SERVER_BASE_URL}/${avatar}`}/> : <ProfileIcon width={90} height={90} style={{marginTop: 20}} size={50}/> }
                    </View>

                    <TouchableOpacity activeOpacity={.6} onPress={onDeleteAvatar} style={{
                        width: 30,
                        height: 30,
                        overflow: 'hidden',
                        // borderWidth: 1,
                        borderRadius: 15,
                        backgroundColor: '#FF2882',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: -8,
                        top: 10
                    }}>
                        <Icon name='delete' size={20} color={'white'}></Icon>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.6} onPress={onUploadAvatar} style={{
                        width: 30,
                        height: 30,
                        overflow: 'hidden',
                        // borderWidth: 1,
                        borderRadius: 15,
                        backgroundColor: '#FF2882',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        right: -8,
                        top: 10
                    }}>
                        <Icon name='edit' size={20} color='white'></Icon>
                    </TouchableOpacity>
                </View>

                <View style={{
                    marginTop: 40,
                    width: '100%',
                    paddingLeft: 15,
                    paddingRight: 15,
                    marginBottom: 10,
                    flexDirection: 'row',
                    flex: 1
                }}>
                  <TextInput value={name} onChangeText={onChangeName} style={{
                    height: 40,
                    flex: 1,
                    borderBottomWidth: 1,
                    // paddingLeft: 20,
                    // paddingRight: 20,
                    // borderRadius: 20,
                    color: 'black',
                    fontSize: 16,
                  }}/>
                  {/* <Text style={{
                      // marginTop: 10,
                      color: 'black',
                      fontSize: 18,
                      fontFamily: 'NotoSansArmenian-Bold'
                  }}>{authManager.getMeSync().name}</Text> */}
                </View>

                <View style={{
                    marginTop: 4,
                    width: '100%',
                    paddingLeft: 15,
                    flex: 1
                }}>
                  <Text style={{
                      // marginTop: 10,
                      color: '#8E8E93',
                      fontSize: 14,
                      fontWeight: 'bold'
                      // fontFamily: 'NotoSansArmenian-Bold'
                  }}>{authManager.getMeSync().email}</Text>
                </View>
            

              <View style={{
                width: '100%',
                paddingLeft: 15,
                paddingRight: 15,
                alignItems: 'center',
                // marginBottom: 10,
                flexDirection: 'row',
                marginTop: 30,
              }}>
                <TouchableOpacity onPress={onSignOut} activeOpacity={.6} style={{
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#FF2882',
                        fontWeight: 'bold'
                    }}>{strings.signout}</Text>
                </TouchableOpacity>
              </View>
            
              <View style={{
                width: '100%',
                paddingLeft: 15,
                paddingRight: 15,
                alignItems: 'center',
                marginBottom: 20,
                flexDirection: 'row'
              }}>
                <TouchableOpacity onPress={onDeleteAcc} activeOpacity={.6} style={{
                    marginTop: 10,
                }}>
                    <Text style={{
                        fontSize: 16,
                        color: '#FF2882',
                        fontWeight: 'bold'
                    }}>{strings.delete_acc}</Text>
                </TouchableOpacity>
              </View>
          
           </View>

        </ScrollView>
        <BottomNavBar navigation={navigation} />
        {showSignoutDialog ? <ConfirmDialog onYes={onSignOutYes} onNo={onNo} title={strings.signout} description={strings.signout_msg}/> : null}
        {showDeleteAccDialog ? <ConfirmDialog onYes={onDeleteAccYes} onNo={onNo} title={strings.delete_acc} description={strings.delete_acc_msg}/> : null}
        </View>
      </SafeAreaView>
      </GestureHandlerRootView>
  );
}

export default ProfileEditPage;
