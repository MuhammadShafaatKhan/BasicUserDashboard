import { AUTH_TOKEN } from "../constants.js";

export const getToken = () => {
  console.log('get token in get token: ',localStorage.getItem(AUTH_TOKEN))
  return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }
  console.log('get token after set token: ',localStorage.getItem(AUTH_TOKEN))
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN);
};
