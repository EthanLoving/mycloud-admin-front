import { deleteRequest, getRequest, postRequest } from '../../utils/request'
import { userApi } from '../../config/env'

// 分页列表查询
export function getAllBgList(param) {
  return getRequest(userApi + `/sysLoginConfig/all/`, param)
}

// 新增
export function saveBg(param) {
  return postRequest(userApi + `/sysLoginConfig/add`, param)
}

