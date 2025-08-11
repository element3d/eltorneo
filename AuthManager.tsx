import AsyncStorage from "@react-native-async-storage/async-storage";
import SERVER_BASE_URL from "./AppConfig";

class AuthManager {
    constructor() {
        AsyncStorage.multiGet(['token', 'guest_username'], (err, result) => {
            if (!result) {
                // this.token = null
                this.createGuest();
                return;
            }

            let token = null;
            let guestUsername = null;
            result.forEach(([key, value]) => {
                if (key == 'token') token = value;
                if (key == 'guest_username') guestUsername = value
            });

            if (!token) {
                if (!guestUsername?.length) {
                    // this.token = null
                    this.createGuest();
                    return;
                }
                this.token = null;
                return;
            }
            this.token = token

            this.getMe(token)
                ?.then((me) => {
                    this.me = me
                })
        })
    }

    createGuest() {
        const requestOptions = {
            method: 'POST'
        };

        return fetch(`${SERVER_BASE_URL}/api/v1/signup/guest`, requestOptions)
            .then(response => {
                console.log(response.status)
                if (response.status == 200) {
                    return response.text();
                }

                return null;
            })
            .then((token) => {
                if (!token) return
                
                authManager.getMe(token)
                    ?.then((me) => {
                        authManager.setMe(me)
                        authManager.setToken(token)

                        const data = [
                            ['token', token],
                            ['guest_username', me.username]
                        ];

                        AsyncStorage.multiSet(
                            data
                        ).then((d) => {

                        })
                            .catch((err) => {
                                console.log(err)
                            });
                    });
            })
    }

    refresh() {
        AsyncStorage.getItem('token', (err, token) => {
            if (!token) this.token = null
            this.token = token

            this.getMe(token)
                ?.then((me) => {
                    this.me = me
                })
        })
    }

    userHandshake(id) {
        const requestOptions = {
            method: 'GET',
        };

        return fetch(`${SERVER_BASE_URL}/api/v1/user/handshake?user_id=${id}`, requestOptions)
            .then(response => {
                return response.text()
            })
            .catch(() => { })
    }

    handshake() {
        if (!this.token) return
        const requestOptions = {
            method: 'GET',
            headers: { 'Authentication': this.token }
        };

        return fetch(`${SERVER_BASE_URL}/api/v1/me/handshake`, requestOptions)
            .then(response => {

            })
            .catch(() => { })

    }

    deleteMe() {
        if (!this.token) return
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Authentication': this.token }
        };

        return fetch(`${SERVER_BASE_URL}/api/v1/me`, requestOptions)
            .then(response => {

            })
            .catch(() => { })

    }

    getMeSync() {
        return this.me
    }

    setToken(token) {
        this.token = token
        if (!this.me) {
            this.getMe(token)
                ?.then((me) => {
                    this.me = me
                })
        }
    }

    setMe(me) {
        this.me = me
    }

    getMe(token) {
        const requestOptions = {
            method: 'GET',
            headers: { 'Authentication': token }
        };


        if (token) {
            return fetch(`${SERVER_BASE_URL}/api/v1/me`, requestOptions)
                .then(response => {
                    if (response.status !== 200) {
                        return;
                    }
                    return response.json()
                })
                .then((me) => {
                    // if (me.points > 5) {
                    //     const oneYearAgo = new Date();
                    //     oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    //     AsyncStorage.setItem('installDate', oneYearAgo.getTime().toString());
                    // }
                    return me
                })
        }

        return null
    }

    setActiveUser(u) {
        this.activeUser = u
    }

    getActiveUser() {
        return this.activeUser
    }

    getToken() {
        return this.token
    }

    logout() {
        this.token = null
        this.me = null
        return AsyncStorage.removeItem('token', () => {
        })
    }

    getUserById(id) {
        return fetch(`${SERVER_BASE_URL}/api/v1/user?user_id=${id}`)
            .then((response) => {
                if (response.status !== 200) return null;
                return response.json()
            })
    }

    getUserByPhone(phone) {
        return fetch(`${SERVER_BASE_URL}/api/v1/user?username=${phone}`)
            .then((response) => {
                if (response.status !== 200) return null;
                return response.json()
            })
    }

    editUser(user) {
        const token = this.token

        fetch(`${SERVER_BASE_URL}/api/v1/user`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authentication': token
            },
            body: JSON.stringify(user)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Handle successful response here if needed
            })
            .catch(error => {
                // Handle errors here
                console.error('There was a problem with the fetch operation:', error);
            });
    }
}

const authManager = new AuthManager()
export default authManager;