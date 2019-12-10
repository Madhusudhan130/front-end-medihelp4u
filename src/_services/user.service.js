import config from 'config';
import { authHeader } from '../_helpers';
const axios = require('axios');

export const userService = {
    login,
    logout,
};

function login(username, password) {
    return axios.post('http://ec2-13-233-136-145.ap-south-1.compute.amazonaws.com:8080/medihelp/chemist/login', {
        username: username,
        password: password
        })
        .then((response) => {
        if(response.status==200 && response.data){
            const user = ({ username, password, "chemistId" : response.data.chemistId});
            user.authdata = window.btoa(username + ':' + password);
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
            return user;
        }}, (error) => {
            error = error.Error;
         return Promise.reject('Username or password is incorrect');
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


