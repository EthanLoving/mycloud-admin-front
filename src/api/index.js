import { getRequest, postRequest } from '../utils/request'
const base = ''

import { userApi } from '@/config/env'
export function serverAttach() {
  return getRequest('route/test')
}
export const addRouter = (param) => {
  return postRequest('route/add',param)
}
export const getRouters = (param) => {
  return getRequest('api-usc/system/routers',param)
}

export function initDepts(token) {
  return getRequest(userApi + '/dept/0')
}

export function loadDepts(id) {
  return getRequest(userApi + '/dept/' + id)
}

export function searchDept(deptName) {
  return postRequest(userApi + '/dept/search', deptName)
}

export const uploadFileAction = 'http://10.1.70.71:9008/upload/file'
