//封装storage的文件  模块化的文件

const Menukey = 'menus'

export function getMenus() {
  return JSON.parse(window.localStorage.getItem(Menukey))
}

export function setMenus(menus) {
  window.localStorage.setItem(Menukey,JSON.stringify(menus));
}

export function removeMenus() {
  return window.localStorage.removeItem(Menukey)
}
