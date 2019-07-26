<style scoped>
  @import "_loginbg-manage.scss";
</style>
<!--登录背景管理-->
<template>
  <div class="loginbg-manage">
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
        :show-upload-list="true"
        :headers='{"Authorization": session}'
        :action=uploadFileAction
        :on-success="uploadSeccess"
      >
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"/>
          <p>点击此处上传文件</p>
        </div>
      </Upload>
    </Modal>
  </div>
</template>

<script>
  import { uploadFileAction } from '@/api/index'
  export default {
    props: {},
    data() {
      return {
        bgAddModal: false,
        uploadFileAction:''
      }
    },
    methods: {
      handleSetBg() {
        this.bgAddModal = true
      },

      submitUpload(){

      },

      uploadSeccess(res,file,fileList){
        console.log("res==>",res)
        console.log("file==>",file)
        console.log("fileList==>",fileList)
      }
    },
    mounted() {
      this.uploadFileAction = uploadFileAction
    }
  }
</script>
