<template>
  <div class="icons-container">
    <p class="warn-content">
      <a href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/icon.html" target="_blank">svg组件参考 vue-element-admin Add and use
      </a>
    </p>
    <div class="icons-wrapper">
      <div v-for="item of iconsMap" :key="item" @click="hanleChoose(item)">
        <el-tooltip placement="top">
          <div slot="content">
            {{generateIconCode(item)}}
          </div>
          <div class="icon-item">
            <svg-icon :icon-class="item" />
            <p>{{item}}</p>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import icons from './generateIconsView'
import clipboard from '@/utils/clipboard'

export default {
  name: 'iconIndex',
  data() {
    return {
      iconsMap: []
    }
  },
  mounted() {
    const iconsMap = icons.state.iconsMap.map((i) => {
      return i.default.id.split('-')[1]
    })
    this.iconsMap = iconsMap
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    hanleChoose(v) {
      this.$emit("on-select", v);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;
  .icons-wrapper {
    margin: 0 auto;
  }
  .icon-item {
    margin: 25px;
    height: 110px;
    text-align: center;
    width: 120px;
    float: left;
    font-size: 35px;
    color: #24292e;
    cursor: pointer;
    background-color: #1098b3;
  }
  span {
    display: block;
    font-size: 25px;
    margin-top: 10px;
  }
  .disabled{
    pointer-events: none;
  }
}
</style>
