<!--https://coverr.co/-->
<template>
  <div class="homepage-hero-module">
    <loginWidget></loginWidget>
    <div class="video-container">
      <div :style="fixStyle" class="filter"></div>
      <video :style="fixStyle" autoplay loop class="fillWidth" v-on:canplay="canplay">
        <source :src="PATH_TO_MP4" type="video/mp4"/>
        浏览器不支持 video 标签，建议升级浏览器。
        <source src="PATH_TO_WEBM" type="video/webm"/>
        浏览器不支持 video 标签，建议升级浏览器。
      </video>
      <div class="poster hidden" v-if="!vedioCanPlay">
        <img :style="fixStyle" src="./bgvideo/Stop-Sign.jpg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import loginWidget from './loginWidget'

  export default {
    name: 'mylogin',
    components: { loginWidget },
    data() {
      return {
        vedioCanPlay: false,
        fixStyle: '',
        PATH_TO_MP4: 'https://hswe.oss-cn-beijing.aliyuncs.com/mycloud-admin/201907261626-5c6089341e5241f8b73b4caa81e9a40f.mp4?Expires=4717729597&OSSAccessKeyId=LTAIG3y86uEF0V8Q&Signature=ih%2Fk5SLQcX5%2BjgaQvEQ132wO9YQ%3D',
        PATH_TO_WEBM: '',
        PATH_TO_JPEG: ''
      }
    },
    methods: {
      canplay() {
        this.vedioCanPlay = true
      }
    },
    mounted: function() {
      window.onresize = () => {
        const windowWidth = document.body.clientWidth
        const windowHeight = document.body.clientHeight
        const windowAspectRatio = windowHeight / windowWidth
        let videoWidth
        let videoHeight
        if (windowAspectRatio < 0.5625) {
          videoWidth = windowWidth
          videoHeight = videoWidth * 0.5625
          this.fixStyle = {
            height: windowWidth * 0.5625 + 'px',
            width: windowWidth + 'px',
            'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
            'margin-left': 'initial'
          }
        } else {
          videoHeight = windowHeight
          videoWidth = videoHeight / 0.5625
          this.fixStyle = {
            height: windowHeight + 'px',
            width: windowHeight / 0.5625 + 'px',
            'margin-left': (windowWidth - videoWidth) / 2 + 'px',
            'margin-bottom': 'initial'
          }
        }
      }
      window.onresize()
    }
  }
</script>

<style scoped>
  .homepage-hero-module,
  .video-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .video-container .poster img,
  .video-container video {
    z-index: 0;
    position: absolute;
  }

  .video-container .filter {
    z-index: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
  }
</style>
