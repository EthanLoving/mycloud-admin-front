<style scoped>
  @import "_loginbg-manage.scss";
</style>
<!--登录背景管理-->
<template>
  <div class="loginbg-manage">
    <Card :bordered="false">
      <Row>
        <Col span="12">
          <Button type="primary" icon="ios-add" @click="handleSetBg()">新增背景</Button>
        </Col>
      </Row>
    </Card>
    <Modal
      v-model="bgAddModal"
      title="新增背景"
      :closable="false"
      :mask-closable="false"
      :loading="true"
      width="1000px"
      @on-ok="submitUpload()"
    >
      <Form :model="bgForm" style="text-align: center;">
        <Row>
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;">
              <div style="text-align:center">
                <video autoplay loop :v-show=this.videoShow class="video">
                  <source :src="this.bgForm.bgVideo" type="video/mp4"/>
                  您的浏览器不支持 video 视屏播放。
                </video>
              </div>
            </Card>
            <Upload :action=this.uploadFileAction
                    :on-success="videoSeccess"
                    :max-size="2048000"
                    :format="['mp4']"
                    :on-format-error="handleVideoFormatError"
                    :on-exceeded-size="handleMaxSize">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传MP4</Button>
            </Upload>
          </Col>
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;">
              <div style="text-align:center">
                <img :src=this.bgForm.bgWebm :v-show=this.webmShow width="320px" height="320px">
              </div>
            </Card>
            <Upload :action=this.uploadFileAction :on-success="webmSeccess">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传webm</Button>
            </Upload>
          </Col>
          <Col span="8">
            <Card :padding="0" style="width:320px;height:320px;">
              <div style="text-align:center">
                <img :src=this.bgForm.bgImg>
              </div>
            </Card>
            <Upload :action=this.uploadFileAction :on-success="imgSeccess">
              <br/>
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </Col>
        </Row>
      </Form>


      <!--<Upload
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
      </Upload>-->
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
        uploadFileAction: '',
        videoShow: false,
        webmShow: false,
        bgForm: {
          bgVideo: '',
          bgWebm: '',
          bgImg: ''
        },

        formItem: {
          input: '',
          select: '',
          radio: 'male',
          checkbox: [],
          switch: true,
          date: '',
          time: '',
          slider: [20, 50],
          textarea: ''
        }
      }
    },
    methods: {
      handleSetBg() {
        this.bgAddModal = true
      },

      submitUpload() {
        console.log(this.bgForm)
      },
      async videoSeccess(res, file, fileList) {
        console.log('video成功==>', res)
        this.bgForm.bgVideo = res.data
        this.videoShow = true
      },
      async webmSeccess(res, file, fileList) {
        console.log('webm成功==>', res)
        this.bgForm.bgWebm = res.data
      },
      async imgSeccess(res, file, fileList) {
        console.log('img成功==>', res)
        this.bgForm.bgImg = res.data
      },
      handleVideoFormatError (file) {
        this.$Notice.error({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传mp4格式的视频。'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },

    },
    mounted() {
      this.uploadFileAction = uploadFileAction
    }
  }
</script>
