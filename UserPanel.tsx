import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, TextInput, Text, TouchableHighlight, Linking, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SERVER_BASE_URL from './AppConfig';
import WhatsAppIcon from './assets/whatsapp.svg';
import ViberIcon from './assets/viber.svg';
import strings from './Strings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
import authManager from './AuthManager';

const EMODE_VIEW = 0
const EMODE_EDIT = 1

function UserPanel({ lang, user, setUser, isMyGarage, navigation, onClick, style = {} }): JSX.Element {
    const [mode, setMode] = useState(EMODE_VIEW)
    const [name, setName] = useState(user?.first_name)
    const [phone, setPhone] = useState(user?.phone)
    const [whatsapp, setWhatsApp] = useState(user?.whatsapp)
    const [viber, setViber] = useState(user?.viber)

    useEffect(()=>{
        if (user) {
            setName(user.first_name)
            setPhone(user.phone)
            setWhatsApp(user.whatsapp)
            setViber(user.viber)
        }
    }, [user])

    function getAvatar() {
        if (!user) return ''
        if (!user.avatar.length) {
            return require('./assets/avatar.png')
        }

        return { uri: `${SERVER_BASE_URL}/${user.avatar}` }
    }

    function getCover() {
        
    }

    function onModeChange() {
        if (mode == EMODE_VIEW) setMode(EMODE_EDIT)
        else { 
            setMode(EMODE_VIEW)
            user.first_name = name
            user.whatsapp = whatsapp
            user.viber = viber
            user.phone = phone
            setUser(user)
            authManager.editUser(user)
        }
    }

    const openWhatsApp = () => {
        Linking.openURL(`whatsapp://send?phone=${whatsapp}`);
    };
    
      const openViber = () => {
        Linking.openURL(`viber://contact?number=374${viber}`);
      };

      const openPhone = () => {
        Linking.openURL(`tel:0${phone}`);
      };

      function openMessages() {
        if (authManager.getMeSync()) {
            navigation.navigate({ name : "Messages", params: {id: user.id} })

            // navigation.navigate({name: 'Messages', params: {id: user.id}, key: user.id})
        } else {
            navigation.navigate("Login")
        }
      }

      async function updateCover(image) {
        const data = new FormData();
        data.append('image_file', image);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': authManager.getToken(), // Adjust this to retrieve your token
                // You may need to set Content-Type to 'multipart/form-data'
                // depending on your server configuration
                // 'Content-Type': 'multipart/form-data',
            },
            body: data
        };
    
        try {
            const response = await fetch(`${SERVER_BASE_URL}/api/v1/me/cover`, requestOptions);
            const responseData = await response.text();

            return responseData; // Return response data if needed
        } catch (error) {
            console.error('Error updating cover:', error);
            throw error; // Throw error for handling in calling function
        }
    }
      async function onUploadCover() {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
        });

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.errorCode) {
            console.log('ImagePicker Error: ', result.errorMessage);
        } else {
            const imageUri = result.assets[0].uri;
            updateCover(imageUri)
            
           
        }
      }

  return (
    <View style={[styles.panel, style]}>
        <View style={{
            width: '100%',
            height: 240,
            backgroundColor: 'black',
            borderWidth: 3,
            borderRadius: 7,
            borderColor: 'white'
        }}>
            <View style={{
                flex: 1,
                borderRadius: 3,
                borderWidth: 3,
                borderColor: '#69b7ff'
            }}>
            { user ? <ImageBackground
                source={ user.cover.length ? {uri: `${SERVER_BASE_URL}/${user.cover}`} : require('./assets/riders_cover.png')}
                imageStyle={{flex: 1}}
                style={{ 
                    flex: 1, 
                }}
                resizeMode="cover"
            >
               { isMyGarage ? 
                <TouchableOpacity activeOpacity={.8} onPress={onModeChange}>
                <View  style={{
                    width: 50,
                    height: 50,
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor: '#DFFF1C',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                  <Icon name={ mode == EMODE_VIEW ? "edit" : "save"} size={28} color="black" />
                </View>
                </TouchableOpacity>
                 : null }
            </ImageBackground> : null }
            { mode == EMODE_EDIT && isMyGarage ? <TouchableWithoutFeedback onPress={onUploadCover}><View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'black',
                    position: 'absolute',
                    borderRadius: 3,
                    top: 5,
                    left: 5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FontAwesome name={"camera"} size={28} color="black" />
                </View></TouchableWithoutFeedback> : null }
            </View>
        </View>
        <View style={{
            width: '100%',
            // backgroundColor: 'blue',
            // position: 'absolute',
            alignSelf: 'center',
            alignItems: 'center',
            marginTop: -140
        }}>
            <TouchableOpacity activeOpacity={1} style={{
                 width: 200,
                 height: 200,
            }} onPress={onClick}>
                <ImageBackground
                    source={getAvatar()}
                    imageStyle={{flex: 1}}
                    style={{ 
                        flex: 1, 
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                        borderWidth: 2,
                        backgroundColor: '#07132d',
                        borderColor: 'white',
                        overflow: 'hidden'
                    }}
                    resizeMode="cover"
                />
                { mode == EMODE_EDIT && isMyGarage ? <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: 'black',
                    position: 'absolute',
                    borderRadius: 3,
                    top: 5,
                    left: 5,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <FontAwesome name={"camera"} size={28} color="black" />
                </View> : null }
            </TouchableOpacity>
            { mode == EMODE_VIEW ? <Text style={{
                color: 'white',
                fontSize: 22,
                height: 55,
                textAlign: 'center',
                textAlignVertical: 'center',
                marginTop: 20,
                fontFamily: 'OpenSans-ExtraBold'
            }}>{user ? user.first_name : ''}</Text> : 
            <View style={{
                width: '100%',
                height: 55,
                marginTop: 20,
                backgroundColor: 'transparent',
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                }}>
                    <TextInput value={name} onChangeText={setName}  style={{
                        flex: 1,
                        fontFamily: 'OpenSans-ExtraBold',
                        color: 'white',
                        textAlign: 'center',
                        fontSize: 22
                    }}/>
                </View> 
            </View> }
            { !isMyGarage ? 
            <View style={{
                marginTop: -5,
                flexDirection: 'row'
            }}>
                { phone ? 
                <TouchableOpacity onPress={openPhone} activeOpacity={.8}>
                <View style={{
                    width: 55,
                    height: 55,
                    backgroundColor: '#dfff0c',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 40,
                    marginTop: 10
                }}>
                    <Icon name="call" size={28} color="black" />
                </View> 
                </TouchableOpacity>: null }

                { whatsapp ? 
                 <TouchableOpacity onPress={openWhatsApp} activeOpacity={.8}>
                <View onTouchEnd={openWhatsApp}  style={{
                    width: 55,
                    height: 55,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 40,
                    marginTop: 10,
                    marginLeft: 10
                }}>
                    <WhatsAppIcon width={40} height={40} />
                </View>
                </TouchableOpacity> : null }

                {viber ? 
                 <TouchableOpacity onPress={openViber} activeOpacity={.8}>
                <View onTouchEnd={openViber} style={{
                    width: 55,
                    height: 55,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 40,
                    marginTop: 10,
                    marginLeft: 10
                }}>
                    <ViberIcon width={30} height={30} />
                </View>
                </TouchableOpacity> : null }

                <TouchableOpacity onPress={openMessages} activeOpacity={.8}>
                <View style={{
                    width: 55,
                    height: 55,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 40,
                    marginTop: 10,
                    marginLeft: 10
                }}>
                    <Icon name="send" size={28} color="black" />
                </View> 
                </TouchableOpacity>
            </View>
            : null }
        </View>

        { isMyGarage ? <View style={{
            width: '100%',
            // height: 400,
            marginTop: 12
            // backgroundColor: 'red'
        }}>
            <TouchableOpacity onPress={phone ? null : onModeChange} activeOpacity={phone ? 1 : .8} style={{
                width: '100%',
                height: 55,
                backgroundColor: mode == EMODE_VIEW || !user.email || !user.email.length ? 'white' : 'transparent',
                borderColor: 'white',
                borderWidth: mode == EMODE_VIEW ? 0 : 1,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10
            }}>
                <Icon width={35} height={30} name="call" size={30} color={mode == EMODE_VIEW || !user.email || !user.email.length ? "black" : 'white' } />
                { phone || mode == EMODE_EDIT ? <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                }}>
                    <Text style={{
                        color:  mode == EMODE_VIEW || !user.email || !user.email.length ? 'black' : 'white',
                        fontSize: 16,
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>+374</Text>
                    { mode == EMODE_VIEW || !user.email || !user.email.length? <Text style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>{phone}</Text>
                    : <TextInput value={phone} onChangeText={setPhone} keyboardType='numeric' style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold',
                        color: 'white'
                        // backgroundColor: 'white'
                    }}/>}
                </View> : 
                <Text style={{
                    color: 'black',
                    marginLeft: 10,
                    fontSize: 16,
                    fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                }}>{strings.set_phone}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={whatsapp ? null : onModeChange} activeOpacity={whatsapp ? 1 : .8} style={{
                width: '100%',
                height: 55,
                backgroundColor: mode == EMODE_VIEW ? 'white' : 'transparent',
                borderColor: 'white',
                borderWidth: mode == EMODE_VIEW ? 0 : 1,
                borderRadius: 4,
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10
            }}>
                <WhatsAppIcon width={35} height={35} />
                { whatsapp || mode == EMODE_EDIT? <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                }}>
                    <Text style={{
                        color:  mode == EMODE_VIEW ? 'black' : 'white',
                        fontSize: 16,
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>+374</Text>
                    { mode == EMODE_VIEW ? <Text style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>{whatsapp}</Text>
                    : <TextInput value={whatsapp} onChangeText={setWhatsApp} keyboardType='numeric' style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold',
                        color: 'white'
                        // backgroundColor: 'white'
                    }}/>}
                </View> : 
                <Text style={{
                    color: 'black',
                    marginLeft: 10,
                    fontSize: 16,
                    fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                }}>{strings.set_whatsapp}</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity onPress={viber ? null : onModeChange} activeOpacity={viber ? 1 : .8} style={{
                width: '100%',
                height: 55,
                backgroundColor: mode == EMODE_VIEW ? 'white' : 'transparent',
                borderColor: 'white',
                borderWidth: mode == EMODE_VIEW ? 0 : 1,
                borderRadius: 4,
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                paddingLeft: 10
            }}>
                <ViberIcon width={35} height={26} />
                { viber || mode == EMODE_EDIT? <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        color:  mode == EMODE_VIEW ? 'black' : 'white',
                        fontSize: 16,
                        marginLeft: 10,
                        marginRight: 10,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>+374</Text>
                    { mode == EMODE_VIEW ? <Text style={{
                        color: 'black',
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                    }}>{viber}</Text>
                    : <TextInput value={viber} onChangeText={setViber} keyboardType='numeric' style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold',
                        color: 'white'
                        // backgroundColor: 'white'
                    }}/>}
                </View> : 
                <Text style={{
                    color: 'black',
                    marginLeft: 10,
                    fontSize: 16,
                    fontFamily: lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold'
                }}>{strings.set_viber}</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={.9} onPress={onModeChange} style={{
                width: '100%',
                height: 55,
                backgroundColor: '#dfff0c',
                borderWidth: 1,
                marginTop: 12,
                borderRadius: 4,
                borderColor: 'black',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <View style={{
                     flexDirection: 'row',
                     alignItems: 'center',
                     justifyContent: 'center'
                }}>
                    <Icon width={35} height={30} name={mode == EMODE_VIEW ? "edit" : 'save' } size={30} color="black" />
                    <Text style={{
                        fontFamily:  lang == 'ru' ? 'OpenSans-ExtraBold' : 'NotoSansArmenian-ExtraBold',
                        fontSize: 18,
                        marginLeft: 3,
                        color: 'black'
                    }}>{mode == EMODE_VIEW ? strings.edit : strings.save}</Text>
                </View>
            </TouchableOpacity>
        </View> : null }
        
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: "100%",
    // height: 400,
    padding: 10,
    paddingTop: 0,
    // paddingBottom: 40,
    // backgroundColor: 'red',
    marginBottom: 30,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontFamily: 'OpenSans-ExtraBold'
  }
});

export default UserPanel;
