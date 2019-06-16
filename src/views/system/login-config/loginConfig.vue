<style scoped>
  @import "_loginConfig.scss";
</style>
<template>
  <div class=".loginConfig">
    <Card :bordered="false">
      <Row>
        <Col span="12">
        <Button type="primary" icon="ios-add" @click="handleSetBg()">设置背景图片</Button>
        </Col>
      </Row>
    </Card>
    <Modal
      v-model="bgAddModal"
      title="新增路由"
      :closable="false"
      :mask-closable="false"
      :loading="true"
      width="1000px"
      @on-ok="submitUpload()"
    >
      <Upload
        multiple
        type="drag"
        action="//jsonplaceholder.typicode.com/posts/"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff" />
          <p>点击此处上传文件</p>
        </div>
      </Upload>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'LoginConfig',
  data() {
    return {
      bgAddModal: false
    }
  },
  methods: {
    handleSetBg() {
      this.bgAddModal = true
    },
    submitUpload() {
    }
  }
}
</script>

<style scoped>

</style>
