import { getRequest, postRequest } from '../utils/request'
const base = ''


export function serverAttach() {
  return getRequest('route/test')
}
export const addRouter = (param) => {
  return postRequest('route/add',param)
}

