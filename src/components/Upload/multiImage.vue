<template>
  <div>
    <el-upload :action="actionUrl"
               :file-list="fileImageUrl"
               list-type="picture-card"
               :on-success="handleImageSuccess"
               :on-preview="handlePictureCardPreview"
               :on-remove="handleRemove">
      <i class="el-icon-plus"></i>
      <div slot="file"
           slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail"
             :src="file.url"
             alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="el-upload-list__item-delete"
                @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
               append-to-body>
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import Constants from '@/utils/constants'

export default {
  name: 'MultiImage',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogImageUrl: '', // 弹框预览文件地址
      uploadImageUrl: [], // 上传文件数组
      // fileImageUrl: [], // 上传文件回显使用
      dialogVisible: false

    }
  },
  computed: {
    fileImageUrl () {
      console.log(this.value)
      return this.value
    },
    actionUrl () {
      return '/api/oss/upload?access_token=' + getToken(Constants.access_token)
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImageSuccess (response) {
      this.uploadImageUrl.push(response.data)
      this.fileImageUrl.push(response.data)
      this.$emit('input', this.uploadImageUrl)
    }
  }
}
</script>
