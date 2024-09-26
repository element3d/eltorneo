import AsyncStorage from "@react-native-async-storage/async-storage";
import SERVER_BASE_URL from "./AppConfig";

class AuthManager {
    constructor () {
        AsyncStorage.getItem('token', (err, token) => {
            if (!token) this.token = null
            this.token = token

            this.getMe(token)
            ?.then((me) =>{
                this.me = me
            })
        })
    }

    refresh() {
        AsyncStorage.getItem('token', (err, token) => {
            if (!token) this.token = null
            this.token = token

            this.getMe(token)
            ?.then((me) =>{
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
            .catch(() => {})
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
            .catch(() => {})

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
            .catch(() => {})

    }

    getMeSync() {
        return this.me
    }

    setToken(token) {
        this.token = token
        if (!this.me) {
            this.getMe(token)
            ?.then((me) =>{
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
         return AsyncStorage.removeItem('token', () =>{
        })
    }

    getUserById(id) {
        return fetch(`${SERVER_BASE_URL}/api/v1/user?user_id=${id}`)
        .then((response)=>{
            if (response.status !== 200) return null;
            return response.json()
        })
    }

    getUserByPhone(phone) {
        return fetch(`${SERVER_BASE_URL}/api/v1/user?username=${phone}`)
        .then((response)=>{
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