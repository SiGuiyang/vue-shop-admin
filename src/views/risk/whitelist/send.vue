<template>
  <el-dialog :visible.sync="sendFormVisible"
             title="批量添加白名单"
             width="50%">
    <el-upload :on-success="handleUploadSuccess"
               :file-list="uploadFile"
               :action="actionURL"
               accept=".xlsx"
               class="upload-demo">
      <el-button v-waves
                 size="small"
                 type="primary">点击上传<i class="el-icon-upload el-icon-right" /></el-button>
      <div slot="tip"
           class="el-upload__tip">只能上传xlsx文件，且不超过10MB</div>
    </el-upload>

    <div slot="footer"
         class="dialog-footer">
      <el-button v-waves
                 :loading="downloadLoading"
                 class="filter-item"
                 type="warning"
                 icon="el-icon-download"
                 @click="handleDownload">下载模板
      </el-button>
      <el-button @click="sendFormVisible = false">取消</el-button>
      <el-button type="primary"
                 @click="handleReissueCoupon">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth'
import Constants from '@/utils/constants'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // Waves directive

export default {
  directives: { permission, waves },
  data () {
    return {
      sendFormVisible: false,
      downloadLoading: false,
      uploadFile: [],
      downloadContent: {
        downloadFile: 'http://pk6b0a7n8.bkt.clouddn.com/coupon_send_template.xlsx',
        downloadFilename: 'coupon_send_template'
      },
      publishCoupon: {
        file: undefined,
        templateId: undefined
      },
      reissueRules: {
        file: [
          {
            validator: (rule, value, callback) => {
              if (value === null || value === undefined || value === '') {
                callback(new Error('上传文件不能为空'))
              } else {
                const suffix = value.substring(value.lastIndexOf('.') + 1, value.length)
                if (suffix !== 'xlsx') {
                  callback(new Error('上传文件格式必须是xlsx'))
                } else {
                  callback()
                }
              }
            }, trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    actionURL () {
      return process.env.BASE_API + '/risk/whitelist/upload?access_token=' + getToken(Constants.access_token)
    }
  },
  methods: {
    handleUploadSuccess (respnse) {
      this.publishCoupon.file = respnse.data.url
    },
    handleDownload () {
      window.location.href = process.env.BASE_API + '/admin/download?downloadFile=' + this.downloadContent.downloadFile + '&downloadFilename=' + this.downloadContent.downloadFilename
    }
  }
}
</script>

<style scoped>
</style>
