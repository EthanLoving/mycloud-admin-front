// eslint-disable-next-line no-unused-vars
import { postRequest, getRequest, loginRequest } from '../utils/request'

export function login(username, password) {
  const data = {
    username,
    password
  }
  return loginRequest('auth/login', data)
}

export function getInfo(data) {
  return loginRequest('auth/info', data)
}

export function logout() {
  return loginRequest('auth/logout')
}
