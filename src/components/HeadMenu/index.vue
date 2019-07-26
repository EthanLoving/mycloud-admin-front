<template>
  <div>
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <menu-item name="1">
        <Icon type="ios-paper"/>
        内容管理
      </menu-item>
      <menu-item name="2">
        <Icon type="ios-people"/>
        用户管理
      </menu-item>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-stats"/>
          统计分析
        </template>
        <MenuGroup title="使用">
          <menu-item name="3-1">新增和启动</menu-item>
          <menu-item name="3-2">活跃分析</menu-item>
          <menu-item name="3-3">时段分析</menu-item>
        </MenuGroup>
        <MenuGroup title="留存">
          <menu-item name="3-4">用户留存</menu-item>
          <menu-item name="3-5">流失用户</menu-item>
        </MenuGroup>
      </Submenu>
      <menu-item name="4">
        <Icon type="ios-construct"/>
        综合设置
      </menu-item>
    </Menu>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        theme1: 'light'
      }
    }
  }
</script>
