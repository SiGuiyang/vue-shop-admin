<template>
  <div class="singleImageUpload2 upload-container">
    <el-upload :multiple="false"
               :show-file-list="false"
               :on-success="handleImageSuccess"
               class="image-uploader"
               drag
               :action="actionUrl">
      <i class="el-icon-upload" />
      <div class="el-upload__text">Drag或<em>点击上传</em></div>
    </el-upload>
    <div v-show="imageUrl.length>0"
         class="image-preview">
      <div v-show="imageUrl.length>1"
           class="image-preview-wrapper">
        <img :src="imageUrl"
             alt="">
        <div class="image-preview-action">
          <i class="el-icon-delete"
             @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Constants from '@/utils/constants'

export default {
  name: 'SingleImageUpload2',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tempUrl: ''
    }
  },
  computed: {
    imageUrl () {
      return this.value
    },
    actionUrl () {
      return '/api/oss/upload?access_token=' + getToken(Constants.access_token)
    }
  },
  methods: {
    rmImage () {
      this.emitInput('')
    },
    emitInput (val) {
      this.$emit('input', val)
    },
    handleImageSuccess () {
      this.emitInput(this.tempUrl)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.upload-container {
  width: 100%;
  height: 100%;
  position: relative;

  .image-uploader {
    height: 100%;
  }

  .image-preview {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    border: 1px dashed #d9d9d9;

    .image-preview-wrapper {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .image-preview-action {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      cursor: pointer;
      text-align: center;
      line-height: 200px;

      .el-icon-delete {
        font-size: 36px;
      }
    }

    &:hover {
      .image-preview-action {
        opacity: 1;
      }
    }
  }
}
</style>
